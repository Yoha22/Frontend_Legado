import Link from "next/link";
import { Marcador } from "@/components/ui/Marcador";
import { TituloSeccion } from "@/components/ui/Tipografia";
import { FOTOS_INICIO, VIDEO_DESTACADO_INICIO } from "@/content/institucional";

export function MosaicoGaleria() {
  return (
    <section className="contenedor py-16 md:py-[82px]">
      <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <TituloSeccion>Galería</TituloSeccion>
        <Link
          href="/galeria"
          className="font-titulo text-sm font-semibold uppercase tracking-[.09em] text-rojo hover:text-rojo-hover"
        >
          Ver galería completa →
        </Link>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[170px_170px]">
        <Marcador tipo="video" className="aspect-video sm:col-span-2 lg:row-span-2 lg:aspect-auto">
          {VIDEO_DESTACADO_INICIO}
        </Marcador>

        {FOTOS_INICIO.map((foto) => (
          <Marcador key={foto} className="min-h-[130px] rounded-media">
            {foto}
          </Marcador>
        ))}
      </div>
    </section>
  );
}
