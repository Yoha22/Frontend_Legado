import { z } from "zod";
import { EDAD_MAXIMA, EDAD_MINIMA, calcularEdad, parsearFecha } from "@/lib/utils/categoria";

/**
 * Esquema del formulario de pre-inscripción.
 *
 * ES LA ÚNICA FUENTE DE VERDAD: lo usa el wizard en el navegador (vía
 * react-hook-form) y la Server Action antes de tocar la base de datos. Nadie
 * puede saltarse una regla desactivando JavaScript.
 */

export const MAX_ARCHIVO_BYTES = 5 * 1024 * 1024;
export const TIPOS_ARCHIVO = ["application/pdf", "image/jpeg", "image/png"] as const;

/**
 * Celular colombiano: diez dígitos que empiezan por 3, con `+57` e indicativos
 * de separación opcionales. Se exige móvil y no fijo porque el campo es el
 * WhatsApp por el que la escuela contacta a la familia.
 */
const CELULAR_COLOMBIANO = /^(?:\+?57[\s-]?)?3\d{2}[\s-]?\d{3}[\s-]?\d{4}$/;

const textoObligatorio = (campo: string, min = 3, max = 150) =>
  z
    .string({ required_error: `${campo} es obligatorio` })
    .trim()
    .min(min, `${campo} es obligatorio`)
    .max(max, `${campo} no puede superar ${max} caracteres`);

const textoOpcional = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, `No puede superar ${max} caracteres`)
    .optional()
    .or(z.literal("").transform(() => undefined));

// ── Paso 1 · datos del niño ─────────────────────────────────────────────────

export const esquemaPaso1 = z.object({
  ninoNombre: textoObligatorio("El nombre del niño"),
  ninoFechaNacimiento: z
    .string({ required_error: "La fecha de nacimiento es obligatoria" })
    .min(1, "La fecha de nacimiento es obligatoria")
    .superRefine((valor, ctx) => {
      const fecha = parsearFecha(valor);
      if (!fecha) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Fecha inválida" });
        return;
      }
      if (fecha > new Date()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La fecha no puede estar en el futuro" });
        return;
      }

      // La edad se valida aquí y no con un CHECK en Postgres: un CHECK se
      // reevaluaría en cada UPDATE y fallaría cuando el niño cumpliera 18.
      const edad = calcularEdad(fecha);
      if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `La escuela recibe niños de ${EDAD_MINIMA} a ${EDAD_MAXIMA} años (edad calculada: ${edad}).`,
        });
      }
    }),
  ninoGenero: z.enum(["Masculino", "Femenino"], { required_error: "Selecciona el género" }),
  ninoPosicion: textoOpcional(60),
  ninoExperiencia: textoOpcional(60),
  ninoEps: textoOpcional(120),
  ninoCondicionesMedicas: textoOpcional(1000),
});

// ── Paso 2 · datos del acudiente ────────────────────────────────────────────

export const esquemaPaso2 = z.object({
  acudienteNombre: textoObligatorio("El nombre del acudiente"),
  acudienteParentesco: textoObligatorio("El parentesco", 2, 40),
  acudienteCedula: z
    .string({ required_error: "La cédula es obligatoria" })
    .trim()
    .min(6, "La cédula debe tener al menos 6 dígitos")
    .max(15, "La cédula no puede superar 15 dígitos")
    .regex(/^\d+$/, "La cédula solo puede tener números"),
  acudienteWhatsapp: z
    .string({ required_error: "El WhatsApp es obligatorio" })
    .trim()
    .regex(CELULAR_COLOMBIANO, "Escribe un celular colombiano válido, por ejemplo 300 000 0000"),
  acudienteCorreo: z
    .string({ required_error: "El correo es obligatorio" })
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Escribe un correo válido")
    .max(150),
  acudienteDireccion: textoOpcional(200),
});

// ── Paso 3 · programa ───────────────────────────────────────────────────────

export const esquemaPaso3 = z.object({
  programaId: z.string({ required_error: "Selecciona un programa" }).min(1, "Selecciona un programa"),
  comoNosConocio: textoOpcional(80),
});

// ── Paso 4 · documentos (todos opcionales) ──────────────────────────────────

/**
 * Un `<input type="file">` vacío llega como un File de 0 bytes, así que se
 * trata igual que la ausencia de archivo.
 */
export const esquemaArchivo = z
  .custom<File | null | undefined>((v) => v == null || v instanceof File, "Archivo inválido")
  .refine((f) => !f || f.size === 0 || f.size <= MAX_ARCHIVO_BYTES, "El archivo supera los 5 MB")
  .refine(
    (f) => !f || f.size === 0 || (TIPOS_ARCHIVO as readonly string[]).includes(f.type),
    "Formato no admitido. Usa PDF, JPG o PNG",
  );

export const esquemaDocumentos = z.object({
  docFoto: esquemaArchivo,
  docIdentidad: esquemaArchivo,
  docEps: esquemaArchivo,
  docMedico: esquemaArchivo,
});

// ── Paso 5 · autorizaciones ─────────────────────────────────────────────────

export const esquemaPaso5 = z.object({
  // Opt-in separable: la Ley 1581 no permite condicionar el servicio a que la
  // familia autorice publicar la imagen del menor. Por eso NO es obligatoria.
  // Sin `.default()` a propósito: dejaría el campo opcional en el tipo de
  // entrada y react-hook-form perdería la inferencia del formulario.
  consentImagen: z.boolean(),
  consentDatos: z
    .boolean()
    .refine((v) => v, "Debes autorizar el tratamiento de datos para poder enviar la solicitud"),
  consentReglamento: z.boolean().refine((v) => v, "Debes aceptar el reglamento interno"),
});

// ── Formulario completo ─────────────────────────────────────────────────────

export const esquemaInscripcion = esquemaPaso1
  .merge(esquemaPaso2)
  .merge(esquemaPaso3)
  .merge(esquemaPaso5);

export type DatosInscripcion = z.infer<typeof esquemaInscripcion>;
export type DatosFormulario = z.input<typeof esquemaInscripcion>;

/** Campos de cada paso, para validar por etapas con `trigger()`. */
export const CAMPOS_POR_PASO: Record<number, (keyof DatosFormulario)[]> = {
  1: ["ninoNombre", "ninoFechaNacimiento", "ninoGenero", "ninoPosicion", "ninoExperiencia", "ninoEps", "ninoCondicionesMedicas"],
  2: [
    "acudienteNombre",
    "acudienteParentesco",
    "acudienteCedula",
    "acudienteWhatsapp",
    "acudienteCorreo",
    "acudienteDireccion",
  ],
  3: ["programaId", "comoNosConocio"],
  4: [],
  5: ["consentImagen", "consentDatos", "consentReglamento"],
};

export const NOMBRES_PASOS = [
  "Datos del niño",
  "Acudiente",
  "Programa",
  "Documentos",
  "Autorizaciones",
] as const;

export const TOTAL_PASOS = NOMBRES_PASOS.length;
