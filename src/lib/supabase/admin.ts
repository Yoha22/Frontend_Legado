import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/tipos";

/**
 * Cliente con service role: ignora RLS.
 *
 * Es el único camino para escribir en `inscripciones` y `portal_interes` y para
 * subir documentos al bucket privado. `server-only` hace que el build falle si
 * algún componente de cliente lo importa por accidente, de modo que la clave
 * nunca puede terminar en el bundle del navegador.
 */

export function clienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Sin ellas no se pueden guardar inscripciones.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
