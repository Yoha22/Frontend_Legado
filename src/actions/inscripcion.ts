"use server";

import { clienteAdmin } from "@/lib/supabase/admin";
import { obtenerProgramas } from "@/lib/supabase/consultas";
import { enviarCorreo } from "@/lib/email/resend";
import { correoAviso, correoConfirmacion, type DatosCorreo } from "@/lib/email/plantillas";
import { categoriaSugerida } from "@/lib/utils/categoria";
import {
  esquemaDocumentos,
  esquemaInscripcion,
  TIPOS_ARCHIVO,
  MAX_ARCHIVO_BYTES,
} from "@/lib/validaciones/inscripcion";

const BUCKET = "inscripciones";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CAMPOS_DOCUMENTO = [
  { campo: "docFoto", columna: "doc_foto", etiqueta: "Foto del niño" },
  { campo: "docIdentidad", columna: "doc_identidad", etiqueta: "Registro civil o TI" },
  { campo: "docEps", columna: "doc_eps", etiqueta: "Carnet de EPS" },
  { campo: "docMedico", columna: "doc_medico", etiqueta: "Certificado médico" },
] as const;

export type ResultadoInscripcion =
  | { ok: true; id: string }
  | { ok: false; mensaje: string; errores?: Record<string, string> };

/**
 * Quita acentos, espacios y caracteres raros del nombre de archivo.
 * NFD separa la letra de su tilde y `\p{M}` elimina la marca combinante.
 */
function sanearNombre(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

function texto(form: FormData, clave: string): string {
  const v = form.get(clave);
  return typeof v === "string" ? v.trim() : "";
}

function booleano(form: FormData, clave: string): boolean {
  const v = form.get(clave);
  return v === "true" || v === "on" || v === "1";
}

function archivo(form: FormData, clave: string): File | null {
  const v = form.get(clave);
  return v instanceof File && v.size > 0 ? v : null;
}

/**
 * Guarda una pre-inscripción.
 *
 * Orden deliberado: primero se valida todo, luego se suben los archivos, luego
 * se inserta la fila y solo al final se envían los correos. Si el insert falla
 * se borran los archivos ya subidos para no dejar documentos de menores
 * huérfanos en el bucket. Si falla el correo, la solicitud igual se conserva.
 */
export async function enviarInscripcion(form: FormData): Promise<ResultadoInscripcion> {
  // 1 · Validar los campos de texto con el mismo esquema que usa el navegador.
  const analisis = esquemaInscripcion.safeParse({
    ninoNombre: texto(form, "ninoNombre"),
    ninoFechaNacimiento: texto(form, "ninoFechaNacimiento"),
    ninoGenero: texto(form, "ninoGenero"),
    ninoPosicion: texto(form, "ninoPosicion"),
    ninoExperiencia: texto(form, "ninoExperiencia"),
    ninoEps: texto(form, "ninoEps"),
    ninoCondicionesMedicas: texto(form, "ninoCondicionesMedicas"),
    acudienteNombre: texto(form, "acudienteNombre"),
    acudienteParentesco: texto(form, "acudienteParentesco"),
    acudienteCedula: texto(form, "acudienteCedula"),
    acudienteWhatsapp: texto(form, "acudienteWhatsapp"),
    acudienteCorreo: texto(form, "acudienteCorreo"),
    acudienteDireccion: texto(form, "acudienteDireccion"),
    programaId: texto(form, "programaId"),
    comoNosConocio: texto(form, "comoNosConocio"),
    consentImagen: booleano(form, "consentImagen"),
    consentDatos: booleano(form, "consentDatos"),
    consentReglamento: booleano(form, "consentReglamento"),
  });

  if (!analisis.success) {
    const errores: Record<string, string> = {};
    for (const problema of analisis.error.issues) {
      const campo = String(problema.path[0] ?? "");
      if (campo && !errores[campo]) errores[campo] = problema.message;
    }
    return { ok: false, mensaje: "Revisa los datos del formulario.", errores };
  }
  const datos = analisis.data;

  // 2 · Validar los archivos en el servidor. El `accept` del input es una
  //     sugerencia del navegador, no una defensa.
  const documentos = {
    docFoto: archivo(form, "docFoto"),
    docIdentidad: archivo(form, "docIdentidad"),
    docEps: archivo(form, "docEps"),
    docMedico: archivo(form, "docMedico"),
  };

  const analisisDocs = esquemaDocumentos.safeParse(documentos);
  if (!analisisDocs.success) {
    const errores: Record<string, string> = {};
    for (const problema of analisisDocs.error.issues) {
      const campo = String(problema.path[0] ?? "");
      if (campo && !errores[campo]) errores[campo] = problema.message;
    }
    return {
      ok: false,
      mensaje: `Algún documento no cumple los requisitos (máx. ${MAX_ARCHIVO_BYTES / 1024 / 1024} MB, ${TIPOS_ARCHIVO.join(", ")}).`,
      errores,
    };
  }

  // 3 · Resolver el programa elegido.
  const programas = await obtenerProgramas();
  const programa = programas.find((p) => p.id === datos.programaId);
  if (!programa) {
    return { ok: false, mensaje: "El programa seleccionado ya no está disponible.", errores: { programaId: "Selecciona un programa" } };
  }

  const categoria = categoriaSugerida(datos.ninoFechaNacimiento);

  let supabase;
  try {
    supabase = clienteAdmin();
  } catch (e) {
    console.error("[inscripcion] Supabase no está configurado:", e);
    return {
      ok: false,
      mensaje:
        "El formulario aún no está conectado a la base de datos. Escríbenos por WhatsApp y te inscribimos de una vez.",
    };
  }

  // 4 · Subir documentos al bucket privado.
  const carpeta = crypto.randomUUID();
  const rutas: Record<string, string | null> = {};
  const subidas: string[] = [];
  const adjuntos: string[] = [];

  for (const { campo, columna, etiqueta } of CAMPOS_DOCUMENTO) {
    const archivoSubido = documentos[campo];
    if (!archivoSubido) {
      rutas[columna] = null;
      continue;
    }

    const ruta = `${carpeta}/${campo}-${sanearNombre(archivoSubido.name)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivoSubido, {
      contentType: archivoSubido.type,
      upsert: false,
    });

    if (error) {
      console.error(`[inscripcion] Falló la subida de ${campo}:`, error.message);
      if (subidas.length > 0) await supabase.storage.from(BUCKET).remove(subidas);
      return {
        ok: false,
        mensaje: "No pudimos guardar los documentos. Intenta de nuevo o envíalos luego por WhatsApp.",
      };
    }

    rutas[columna] = ruta;
    subidas.push(ruta);
    adjuntos.push(etiqueta);
  }

  // 5 · Guardar la solicitud.
  const { data: insertada, error: errorInsert } = await supabase
    .from("inscripciones")
    .insert({
      nino_nombre: datos.ninoNombre,
      nino_fecha_nacimiento: datos.ninoFechaNacimiento,
      nino_genero: datos.ninoGenero,
      categoria_sugerida: categoria,
      nino_posicion: datos.ninoPosicion ?? null,
      nino_experiencia: datos.ninoExperiencia ?? null,
      nino_eps: datos.ninoEps ?? null,
      nino_condiciones_medicas: datos.ninoCondicionesMedicas ?? null,
      acudiente_nombre: datos.acudienteNombre,
      acudiente_parentesco: datos.acudienteParentesco,
      acudiente_cedula: datos.acudienteCedula,
      acudiente_whatsapp: datos.acudienteWhatsapp,
      acudiente_correo: datos.acudienteCorreo,
      acudiente_direccion: datos.acudienteDireccion ?? null,
      // Los datos de respaldo locales usan ids que no son UUID; en ese caso se
      // guarda null para no romper la llave foránea.
      programa_id: UUID.test(programa.id) ? programa.id : null,
      como_nos_conocio: datos.comoNosConocio ?? null,
      doc_foto: rutas.doc_foto,
      doc_identidad: rutas.doc_identidad,
      doc_eps: rutas.doc_eps,
      doc_medico: rutas.doc_medico,
      consent_imagen: datos.consentImagen,
      consent_datos: datos.consentDatos,
      consent_reglamento: datos.consentReglamento,
    })
    .select("id")
    .single();

  if (errorInsert || !insertada) {
    console.error("[inscripcion] Falló el insert:", errorInsert?.message);
    if (subidas.length > 0) await supabase.storage.from(BUCKET).remove(subidas);
    return {
      ok: false,
      mensaje: "No pudimos guardar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.",
    };
  }

  // 6 · Correos. A partir de aquí la solicitud YA está guardada: pase lo que
  //     pase con Resend, la respuesta al usuario es de éxito.
  const datosCorreo: DatosCorreo = {
    ninoNombre: datos.ninoNombre,
    ninoFechaNacimiento: datos.ninoFechaNacimiento,
    categoriaSugerida: categoria,
    programaNombre: programa.nombre,
    programaHorario: `${programa.dias} · ${programa.horario}`,
    acudienteNombre: datos.acudienteNombre,
    acudienteWhatsapp: datos.acudienteWhatsapp,
    acudienteCorreo: datos.acudienteCorreo,
    acudienteDireccion: datos.acudienteDireccion,
    comoNosConocio: datos.comoNosConocio,
    condicionesMedicas: datos.ninoCondicionesMedicas,
    documentosAdjuntos: adjuntos,
    inscripcionId: insertada.id,
  };

  const confirmacion = correoConfirmacion(datosCorreo);
  const aviso = correoAviso(datosCorreo);
  const correoAdmin = process.env.CORREO_ADMIN;

  await Promise.all([
    enviarCorreo({
      para: datos.acudienteCorreo,
      asunto: confirmacion.asunto,
      html: confirmacion.html,
      texto: confirmacion.texto,
    }),
    correoAdmin
      ? enviarCorreo({
          para: correoAdmin,
          asunto: aviso.asunto,
          html: aviso.html,
          texto: aviso.texto,
          responderA: datos.acudienteCorreo,
        })
      : Promise.resolve({ ok: false as const, error: "CORREO_ADMIN no configurado" }),
  ]);

  return { ok: true, id: insertada.id };
}
