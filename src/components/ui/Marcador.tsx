import { cn } from "@/lib/utils/cn";

/**
 * Marcador de posición para fotos y videos que la escuela todavía no ha
 * entregado. Replica las cajas punteadas del prototipo, incluido el círculo de
 * "play" de los videos.
 *
 * El texto describe qué imagen debe ir ahí, así que cumple doble función:
 * indicación para quien monte el contenido y `alt` provisional.
 */
export function Marcador({
  children,
  tipo = "foto",
  tono = "claro",
  className,
}: {
  children: string;
  tipo?: "foto" | "video";
  /** `oscuro` para el hero, donde el fondo es marino. */
  tono?: "claro" | "oscuro";
  className?: string;
}) {
  const esVideo = tipo === "video";

  return (
    <div
      role="img"
      aria-label={children}
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 rounded-card border border-dashed p-5 text-center",
        tono === "claro"
          ? cn("border-ph-borde text-ph-texto", esVideo ? "bg-ph-fondo-video" : "bg-ph-fondo")
          : "border-white/35 bg-white/5 text-azul-medio",
        className,
      )}
    >
      {esVideo ? (
        <span
          aria-hidden
          className={cn(
            "flex size-12 items-center justify-center rounded-full border-2 text-lg",
            tono === "claro" ? "border-ph-texto-suave text-ph-texto" : "border-white/40 text-white",
          )}
        >
          ▶
        </span>
      ) : null}
      <span className="max-w-[280px] text-[11px] uppercase leading-relaxed tracking-[.1em]">{children}</span>
    </div>
  );
}
