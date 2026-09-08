import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/sitio";

/**
 * Solo rutas indexables. Quedan fuera `/portal` (todavía no tiene contenido) y
 * `/legal/*` (borradores sin revisión jurídica); ambas están marcadas noindex.
 */
const RUTAS: { ruta: string; prioridad: number; frecuencia: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { ruta: "/", prioridad: 1, frecuencia: "weekly" },
  { ruta: "/inscripciones", prioridad: 0.9, frecuencia: "monthly" },
  { ruta: "/programas", prioridad: 0.8, frecuencia: "monthly" },
  { ruta: "/nosotros", prioridad: 0.7, frecuencia: "yearly" },
  { ruta: "/noticias", prioridad: 0.7, frecuencia: "weekly" },
  { ruta: "/galeria", prioridad: 0.6, frecuencia: "monthly" },
  { ruta: "/patrocinadores", prioridad: 0.5, frecuencia: "yearly" },
  { ruta: "/contacto", prioridad: 0.5, frecuencia: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return RUTAS.map(({ ruta, prioridad, frecuencia }) => ({
    url: `${SITIO.url}${ruta}`,
    lastModified: ahora,
    changeFrequency: frecuencia,
    priority: prioridad,
  }));
}
