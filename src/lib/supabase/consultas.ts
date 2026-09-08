import { clientePublico, hayConexionSupabase } from "@/lib/supabase/publico";
import type { Evento, Noticia, Patrocinador, Programa, Testimonio } from "@/lib/supabase/tipos";
import {
  EVENTOS_RESPALDO,
  NOTICIAS_RESPALDO,
  PATROCINADORES_RESPALDO,
  PROGRAMAS_RESPALDO,
  TESTIMONIOS_RESPALDO,
} from "@/content/respaldo";

/**
 * Lecturas de contenido público.
 *
 * Todas pasan por `conRespaldo`: si Supabase no está configurado o la consulta
 * falla, se devuelven los datos locales de `content/respaldo.ts` y se avisa por
 * consola. Así el sitio nunca aparece vacío — ni recién clonado ni durante una
 * caída de la base.
 */

// Nota: la caché se declara en cada página con `export const revalidate = 300`.
// Next.js exige un literal ahí, así que no puede importarse una constante.

/** El query builder de Supabase es "thenable" pero no una Promise, de ahí `PromiseLike`. */
type Resultado<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>;

async function conRespaldo<T>(
  nombre: string,
  consulta: () => Resultado<T>,
  respaldo: T[],
): Promise<T[]> {
  if (!hayConexionSupabase()) {
    console.warn(`[supabase] Sin credenciales; "${nombre}" usa datos de respaldo locales.`);
    return respaldo;
  }

  try {
    const { data, error } = await consulta();
    if (error) {
      console.error(`[supabase] Error consultando "${nombre}": ${error.message}. Se usa el respaldo local.`);
      return respaldo;
    }
    return data ?? [];
  } catch (e) {
    console.error(`[supabase] Fallo consultando "${nombre}":`, e, "Se usa el respaldo local.");
    return respaldo;
  }
}

export function obtenerProgramas(): Promise<Programa[]> {
  return conRespaldo(
    "programas",
    () => clientePublico().from("programas").select("*").eq("activo", true).order("orden"),
    PROGRAMAS_RESPALDO,
  );
}

export async function obtenerProgramasDestacados(): Promise<Programa[]> {
  const programas = await obtenerProgramas();
  return programas.filter((p) => p.destacado);
}

export function obtenerTestimonios(): Promise<Testimonio[]> {
  return conRespaldo(
    "testimonios",
    () => clientePublico().from("testimonios").select("*").eq("publicado", true).order("orden"),
    TESTIMONIOS_RESPALDO,
  );
}

export function obtenerNoticias(limite?: number): Promise<Noticia[]> {
  return conRespaldo(
    "noticias",
    () => {
      const q = clientePublico()
        .from("noticias")
        .select("*")
        .eq("publicado", true)
        .order("fecha", { ascending: false });
      return limite ? q.limit(limite) : q;
    },
    limite ? NOTICIAS_RESPALDO.slice(0, limite) : NOTICIAS_RESPALDO,
  );
}

export function obtenerEventos(): Promise<Evento[]> {
  return conRespaldo(
    "eventos",
    () => clientePublico().from("eventos").select("*").eq("publicado", true).order("fecha"),
    EVENTOS_RESPALDO,
  );
}

/**
 * Los tres eventos siguientes a hoy, para el inicio.
 * Si ya pasaron todos (el seed es de junio de 2026), muestra los tres últimos
 * en lugar de dejar la sección vacía.
 */
export async function obtenerProximosEventos(limite = 3): Promise<Evento[]> {
  const eventos = await obtenerEventos();
  const hoy = new Date().toISOString().slice(0, 10);
  const futuros = eventos.filter((e) => e.fecha >= hoy);
  return futuros.length > 0 ? futuros.slice(0, limite) : eventos.slice(-limite);
}

export function obtenerPatrocinadores(): Promise<Patrocinador[]> {
  return conRespaldo(
    "patrocinadores",
    () => clientePublico().from("patrocinadores").select("*").eq("activo", true).order("orden"),
    PATROCINADORES_RESPALDO,
  );
}
