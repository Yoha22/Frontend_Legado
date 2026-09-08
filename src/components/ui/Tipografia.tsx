import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Piezas tipográficas repetidas del prototipo. El antetítulo rojo sobre fondo
 * claro y rosa sobre marino aparece en casi todas las secciones, igual que el
 * h2 en Oswald mayúsculas.
 */

export function Antetitulo({
  children,
  tono = "claro",
  className,
}: {
  children: ReactNode;
  /** `claro` = sobre fondo hueso/blanco · `oscuro` = sobre fondo marino */
  tono?: "claro" | "oscuro";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs uppercase tracking-[.2em]",
        tono === "claro" ? "text-rojo" : "text-rosa",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function TituloSeccion({
  children,
  como: Como = "h2",
  className,
}: {
  children: ReactNode;
  como?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Como
      className={cn(
        "font-titulo font-semibold uppercase tracking-[.02em] text-marino",
        "text-[26px] md:text-[40px]",
        className,
      )}
    >
      {children}
    </Como>
  );
}

/** h2 de segundo nivel: 34/32/30/28px en desktop según la sección del prototipo. */
export function TituloMenor({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-titulo font-semibold uppercase tracking-[.02em] text-marino text-[22px] md:text-[32px]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/**
 * Franja marino que encabeza todas las páginas interiores.
 * Sustituye siete bloques idénticos del prototipo.
 */
export function EncabezadoPagina({
  antetitulo,
  titulo,
  descripcion,
  compacto = false,
}: {
  antetitulo: string;
  titulo: ReactNode;
  descripcion?: string;
  /** La página de inscripciones usa una franja algo más baja. */
  compacto?: boolean;
}) {
  return (
    <section className="bg-marino">
      <div className={cn("contenedor", compacto ? "py-12 md:pt-[60px] md:pb-[52px]" : "py-14 md:pt-[70px] md:pb-[62px]")}>
        <Antetitulo tono="oscuro" className="mb-3.5">
          {antetitulo}
        </Antetitulo>
        <h1
          className={cn(
            "font-titulo font-bold uppercase tracking-[.02em] leading-[1.05] text-white",
            compacto ? "text-[30px] md:text-[46px]" : "text-[32px] md:text-[52px]",
            descripcion ? "mb-4" : "",
          )}
        >
          {titulo}
        </h1>
        {descripcion ? (
          <p className="max-w-[620px] text-[17px] md:text-lg leading-relaxed text-azul-claro">{descripcion}</p>
        ) : null}
      </div>
    </section>
  );
}
