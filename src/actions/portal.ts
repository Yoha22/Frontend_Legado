"use server";

import { z } from "zod";
import { clienteAdmin } from "@/lib/supabase/admin";

const esquema = z.object({
  correo: z.string().trim().min(1, "El correo es obligatorio").email("Escribe un correo válido").max(150),
});

export type ResultadoPortal = { ok: true } | { ok: false; mensaje: string };

/**
 * Registra el interés de una familia en el portal de padres (fase 2).
 *
 * Un correo repetido devuelve éxito en vez de error: al usuario no le aporta
 * nada saber que ya se había apuntado, y responder "ya estás registrado"
 * convertiría el formulario en un oráculo para averiguar qué correos existen.
 */
export async function registrarInteresPortal(form: FormData): Promise<ResultadoPortal> {
  const analisis = esquema.safeParse({ correo: String(form.get("correo") ?? "").trim() });

  if (!analisis.success) {
    return { ok: false, mensaje: analisis.error.issues[0]?.message ?? "Correo inválido." };
  }

  let supabase;
  try {
    supabase = clienteAdmin();
  } catch {
    return { ok: false, mensaje: "El registro aún no está disponible. Escríbenos por WhatsApp." };
  }

  const { error } = await supabase
    .from("portal_interes")
    .insert({ correo: analisis.data.correo.toLowerCase() });

  // 23505 = violación de unicidad.
  if (error && error.code !== "23505") {
    console.error("[portal] No se pudo registrar el interés:", error.message);
    return { ok: false, mensaje: "No pudimos registrar tu correo. Intenta de nuevo más tarde." };
  }

  return { ok: true };
}
