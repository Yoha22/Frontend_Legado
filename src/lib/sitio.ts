import { soloDigitos, telefonoLegible } from "@/lib/utils/formato";

/**
 * Datos del sitio que dependen del entorno.
 *
 * Solo se leen variables `NEXT_PUBLIC_*` porque este módulo lo importan
 * componentes de cliente (botón de WhatsApp, footer). Nada secreto entra aquí.
 */

const whatsappCrudo = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "+573000000000";

export const SITIO = {
  nombre: "Escuela de Béisbol Legado Diover Ávila",
  nombreCorto: "Legado Diover Ávila",
  descripcion:
    "Escuela de béisbol infantil y juvenil en Moñitos, Córdoba, para niños de 5 a 17 años. Disciplina, técnica y valores en cada entrenamiento.",
  eslogan: "Formando peloteros, formando personas",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ciudad: "Moñitos",
  departamento: "Córdoba",
  pais: "Colombia",
  ubicacion: "Moñitos · Córdoba",
} as const;

export const WHATSAPP = {
  numero: soloDigitos(whatsappCrudo),
  legible: telefonoLegible(whatsappCrudo),
  mensaje: "Hola, quiero información sobre la escuela de béisbol Legado Diover Ávila.",
} as const;

/** Enlace `wa.me` con mensaje prellenado. */
export function enlaceWhatsApp(mensaje: string = WHATSAPP.mensaje): string {
  return `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(mensaje)}`;
}
