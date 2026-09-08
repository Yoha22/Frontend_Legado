"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Embebido de YouTube con carga diferida.
 *
 * Hasta que el usuario pulsa "reproducir" solo se descarga la miniatura, no el
 * iframe: cargar varios reproductores de YouTube de golpe añade cientos de KB y
 * decenas de peticiones a terceros por página.
 *
 * Mientras la escuela no entregue los videos, `youtubeId` viene en `null` y el
 * componente muestra el marcador punteado del prototipo.
 */
export function VideoYouTube({
  youtubeId,
  titulo,
  className,
}: {
  youtubeId: string | null | undefined;
  titulo: string;
  className?: string;
}) {
  const [reproduciendo, setReproduciendo] = useState(false);

  if (!youtubeId) {
    return (
      <div
        role="img"
        aria-label={titulo}
        className={cn(
          "flex flex-col items-center justify-center gap-2.5 rounded-card border border-dashed border-ph-borde bg-ph-fondo-video p-4 text-center",
          className,
        )}
      >
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full border-2 border-ph-texto-suave text-lg text-ph-texto"
        >
          ▶
        </span>
        <span className="text-[11px] uppercase leading-relaxed tracking-[.1em] text-ph-texto">{titulo}</span>
      </div>
    );
  }

  if (reproduciendo) {
    return (
      <div className={cn("overflow-hidden rounded-card bg-black", className)}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full min-h-[200px]"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setReproduciendo(true)}
      className={cn(
        "group relative w-full overflow-hidden rounded-card bg-marino text-left",
        className,
      )}
    >
      {/* Miniatura servida por YouTube; no requiere configurar dominios en next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="size-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-rojo text-xl text-white shadow-flotante transition-transform group-hover:scale-110"
        >
          ▶
        </span>
      </span>
      <span className="sr-only">Reproducir video: {titulo}</span>
    </button>
  );
}
