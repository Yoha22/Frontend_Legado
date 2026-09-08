"use client";

import { useMemo, useState } from "react";
import { VideoYouTube } from "@/components/media/VideoYouTube";
import { FILTROS_GALERIA, GALERIA } from "@/content/institucional";
import { cn } from "@/lib/utils/cn";

export function GaleriaFiltrable() {
  const [filtro, setFiltro] = useState<string>("Todo");

  const visibles = useMemo(
    () =>
      GALERIA.filter((item) => {
        if (filtro === "Todo") return true;
        if (filtro === "Fotos") return item.tipo === "foto";
        if (filtro === "Videos") return item.tipo === "video";
        return item.evento === filtro;
      }),
    [filtro],
  );

  return (
    <section className="contenedor pb-20 pt-10 md:pb-20 md:pt-11">
      {/* En móvil los filtros se desplazan en horizontal en vez de partirse en varias filas. */}
      <div
        role="group"
        aria-label="Filtrar galería"
        className="-mx-5 mb-8 flex gap-2.5 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        {FILTROS_GALERIA.map((opcion) => (
          <button
            key={opcion}
            type="button"
            onClick={() => setFiltro(opcion)}
            aria-pressed={filtro === opcion}
            className={cn(
              "shrink-0 rounded-full border px-[18px] py-2.5 text-[13px] font-semibold uppercase tracking-[.09em] transition-colors",
              filtro === opcion
                ? "border-rojo bg-rojo text-white"
                : "border-borde-pildora bg-white text-texto-suave hover:border-rojo hover:text-rojo",
            )}
          >
            {opcion}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {visibles.map((item) => (
          <li key={item.etiqueta}>
            {item.tipo === "video" ? (
              <VideoYouTube youtubeId={item.youtubeId} titulo={item.etiqueta} className="aspect-[4/3]" />
            ) : (
              <div
                role="img"
                aria-label={item.etiqueta}
                className="flex aspect-square flex-col items-center justify-center rounded-card border border-dashed border-ph-borde bg-ph-fondo p-4 text-center"
              >
                <span className="text-[11px] uppercase leading-relaxed tracking-[.1em] text-ph-texto">
                  {item.etiqueta}
                </span>
                <span className="mt-2 text-[11px] uppercase tracking-[.14em] text-rojo">{item.categoria}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="mt-6 text-sm text-texto-apagado">
        {visibles.length} de {GALERIA.length} elementos
      </p>
    </section>
  );
}
