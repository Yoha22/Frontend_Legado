import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/tipos";

/**
 * Cliente anónimo para leer contenido público (programas, noticias, eventos,
 * testimonios, patrocinadores).
 *
 * No toca cookies a propósito: `cookies()` obligaría a renderizar cada página
 * de forma dinámica y perderíamos la generación estática con revalidación.
 * Como no hay sesión que respetar en la fase 1, no hace falta.
 *
 * Lo único que puede ver es lo que permiten las políticas de RLS, así que
 * `inscripciones` y `portal_interes` le están vedadas.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function hayConexionSupabase(): boolean {
  return Boolean(url && anonKey);
}

export function clientePublico() {
  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Copia .env.example a .env.local.",
    );
  }
  return createClient<Database>(url, anonKey, { auth: { persistSession: false } });
}
