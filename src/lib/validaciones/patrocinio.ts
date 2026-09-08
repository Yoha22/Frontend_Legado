import { z } from "zod";
import { NIVELES_INTERES } from "@/content/institucional";

/** Formulario de contacto empresarial de la página de patrocinadores. */
export const esquemaPatrocinio = z.object({
  empresa: z.string().trim().min(2, "Escribe la razón social").max(150),
  contacto: z.string().trim().min(3, "Escribe el nombre y cargo de quien contacta").max(150),
  correo: z.string().trim().min(1, "El correo es obligatorio").email("Escribe un correo válido").max(150),
  nivel: z.enum(NIVELES_INTERES, { required_error: "Selecciona un nivel de interés" }),
  mensaje: z.string().trim().min(10, "Cuéntanos brevemente qué te interesa").max(2000),
});

export type DatosPatrocinio = z.infer<typeof esquemaPatrocinio>;
