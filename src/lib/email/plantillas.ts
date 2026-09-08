import { SITIO, enlaceWhatsApp } from "@/lib/sitio";
import { fechaLarga } from "@/lib/utils/formato";

/**
 * Plantillas HTML de los correos transaccionales.
 *
 * Escritas a mano en vez de con react-email: son dos correos sencillos y no
 * justifican otra dependencia. Se usan tablas y estilos en línea porque es lo
 * único que renderizan bien Gmail y Outlook.
 */

export type DatosCorreo = {
  ninoNombre: string;
  ninoFechaNacimiento: string;
  categoriaSugerida: string;
  programaNombre: string;
  programaHorario: string;
  acudienteNombre: string;
  acudienteWhatsapp: string;
  acudienteCorreo: string;
  acudienteDireccion?: string;
  comoNosConocio?: string;
  condicionesMedicas?: string;
  documentosAdjuntos: string[];
  inscripcionId: string;
};

const MARINO = "#0A1F3C";
const ROJO = "#C8102E";
const TEXTO = "#3F4856";
const SUAVE = "#5A6472";
const MARCO = "#E4E2DD";

function envoltorio(titulo: string, contenido: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${titulo}</title></head>
<body style="margin:0;padding:24px 12px;background:#F5F4F1;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXTO}">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid ${MARCO};border-radius:12px;overflow:hidden">
    <tr>
      <td style="background:${MARINO};border-bottom:3px solid ${ROJO};padding:22px 28px">
        <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;background:${ROJO};color:#fff;border-radius:7px;font-weight:700;font-size:15px">LD</span>
        <span style="color:#fff;font-size:16px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-left:10px">Legado Diover Ávila</span>
      </td>
    </tr>
    <tr><td style="padding:28px">${contenido}</td></tr>
    <tr>
      <td style="background:#FAFAF8;border-top:1px solid ${MARCO};padding:18px 28px;font-size:12px;color:#8A8F99">
        ${SITIO.nombre} · ${SITIO.ciudad}, ${SITIO.departamento}, ${SITIO.pais}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function fila(etiqueta: string, valor: string): string {
  return `<tr>
    <td style="padding:7px 0;font-size:14px;color:#8A8F99;width:42%">${etiqueta}</td>
    <td style="padding:7px 0;font-size:14px;color:${MARINO};font-weight:600">${valor}</td>
  </tr>`;
}

/** Escapa HTML: los datos vienen de un formulario público. */
function esc(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Confirmación al acudiente ───────────────────────────────────────────────

export function correoConfirmacion(d: DatosCorreo) {
  const contenido = `
    <h1 style="margin:0 0 14px;font-size:22px;color:${MARINO}">¡Recibimos tu solicitud!</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:${SUAVE}">
      Hola ${esc(d.acudienteNombre)}, ya tenemos la pre-inscripción de
      <strong style="color:${MARINO}">${esc(d.ninoNombre)}</strong>.
      Te contactaremos por WhatsApp en menos de 24 horas para agendar la prueba.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F5F4F1;border:1px solid ${MARCO};border-radius:10px;padding:16px 18px;margin-bottom:20px">
      ${fila("Niño", esc(d.ninoNombre))}
      ${fila("Categoría sugerida", esc(d.categoriaSugerida))}
      ${fila("Programa", esc(d.programaNombre))}
      ${fila("Horario", esc(d.programaHorario))}
    </table>

    <p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:${SUAVE}">
      Recuerda tener a mano el registro civil o tarjeta de identidad, el carnet de EPS vigente y el
      certificado médico de aptitud deportiva. Si no alcanzaste a subirlos, puedes enviárnoslos por WhatsApp.
    </p>

    <a href="${enlaceWhatsApp(`Hola, acabo de inscribir a ${d.ninoNombre}.`)}"
       style="display:inline-block;background:${ROJO};color:#fff;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:13px 24px;border-radius:6px">
      Escribirnos por WhatsApp
    </a>

    <p style="margin:22px 0 0;font-size:12px;color:#8A8F99">
      Número de solicitud: ${esc(d.inscripcionId)}
    </p>`;

  return {
    asunto: `Recibimos la pre-inscripción de ${d.ninoNombre}`,
    html: envoltorio("Pre-inscripción recibida", contenido),
    texto: [
      `Hola ${d.acudienteNombre}, recibimos la pre-inscripción de ${d.ninoNombre}.`,
      `Te contactaremos por WhatsApp en menos de 24 horas para agendar la prueba.`,
      ``,
      `Categoría sugerida: ${d.categoriaSugerida}`,
      `Programa: ${d.programaNombre} (${d.programaHorario})`,
      ``,
      `Número de solicitud: ${d.inscripcionId}`,
      `${SITIO.nombre} · ${SITIO.ciudad}, ${SITIO.departamento}`,
    ].join("\n"),
  };
}

// ── Aviso al administrador ──────────────────────────────────────────────────

export function correoAviso(d: DatosCorreo) {
  const documentos =
    d.documentosAdjuntos.length > 0 ? d.documentosAdjuntos.join(", ") : "No subió documentos";

  const contenido = `
    <h1 style="margin:0 0 6px;font-size:20px;color:${MARINO}">Nueva pre-inscripción</h1>
    <p style="margin:0 0 20px;font-size:14px;color:${SUAVE}">Estado inicial: <strong>nuevo</strong></p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid ${MARCO};border-radius:10px;padding:16px 18px;margin-bottom:18px">
      ${fila("Niño", esc(d.ninoNombre))}
      ${fila("Nacimiento", esc(fechaLarga(d.ninoFechaNacimiento)))}
      ${fila("Categoría sugerida", esc(d.categoriaSugerida))}
      ${fila("Programa", `${esc(d.programaNombre)} · ${esc(d.programaHorario)}`)}
      ${d.condicionesMedicas ? fila("Condiciones médicas", esc(d.condicionesMedicas)) : ""}
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid ${MARCO};border-radius:10px;padding:16px 18px;margin-bottom:18px">
      ${fila("Acudiente", esc(d.acudienteNombre))}
      ${fila("WhatsApp", `<a href="${enlaceWhatsApp("Hola, te escribimos de la escuela Legado Diover Ávila.")}" style="color:${ROJO}">${esc(d.acudienteWhatsapp)}</a>`)}
      ${fila("Correo", `<a href="mailto:${esc(d.acudienteCorreo)}" style="color:${ROJO}">${esc(d.acudienteCorreo)}</a>`)}
      ${d.acudienteDireccion ? fila("Dirección", esc(d.acudienteDireccion)) : ""}
      ${d.comoNosConocio ? fila("Nos conoció por", esc(d.comoNosConocio)) : ""}
      ${fila("Documentos", esc(documentos))}
    </table>

    <p style="margin:0;font-size:12px;color:#8A8F99">ID: ${esc(d.inscripcionId)}</p>`;

  return {
    asunto: `Nueva pre-inscripción · ${d.ninoNombre} (${d.categoriaSugerida})`,
    html: envoltorio("Nueva pre-inscripción", contenido),
    texto: [
      `Nueva pre-inscripción — estado: nuevo`,
      ``,
      `Niño: ${d.ninoNombre}`,
      `Nacimiento: ${fechaLarga(d.ninoFechaNacimiento)}`,
      `Categoría sugerida: ${d.categoriaSugerida}`,
      `Programa: ${d.programaNombre} (${d.programaHorario})`,
      d.condicionesMedicas ? `Condiciones médicas: ${d.condicionesMedicas}` : "",
      ``,
      `Acudiente: ${d.acudienteNombre}`,
      `WhatsApp: ${d.acudienteWhatsapp}`,
      `Correo: ${d.acudienteCorreo}`,
      d.acudienteDireccion ? `Dirección: ${d.acudienteDireccion}` : "",
      d.comoNosConocio ? `Nos conoció por: ${d.comoNosConocio}` : "",
      `Documentos: ${documentos}`,
      ``,
      `ID: ${d.inscripcionId}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
