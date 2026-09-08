import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Botón del prototipo: Oswald 600, mayúsculas, tracking .09em, radio 6px.
 * Renderiza `<Link>` si recibe `href`, `<button>` si no.
 */

type Variante = "rojo" | "marino" | "contornoClaro" | "contornoOscuro";
type Tamano = "sm" | "md" | "lg" | "xl";

const VARIANTES: Record<Variante, string> = {
  rojo: "bg-rojo text-white hover:bg-rojo-hover",
  marino: "bg-marino text-white hover:bg-rojo",
  // Sobre fondo marino (hero, header).
  contornoClaro: "border border-white/30 text-white hover:bg-white/10",
  // Sobre fondo claro (wizard, secciones en hueso).
  contornoOscuro: "border border-borde-campo text-marino hover:bg-hueso",
};

const TAMANOS: Record<Tamano, string> = {
  sm: "text-[13px] px-5 py-3",
  md: "text-sm px-[22px] py-3",
  lg: "text-base px-[30px] py-[17px]",
  xl: "text-[17px] px-10 py-[19px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-titulo font-semibold uppercase tracking-[.09em] " +
  "rounded-boton transition-colors duration-150 cursor-pointer text-center " +
  "disabled:cursor-not-allowed disabled:opacity-50";

type PropsComunes = {
  variante?: Variante;
  tamano?: Tamano;
  anchoCompleto?: boolean;
  children: ReactNode;
  className?: string;
};

type PropsEnlace = PropsComunes & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type PropsBoton = PropsComunes & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function Boton(props: PropsEnlace | PropsBoton) {
  const {
    variante = "rojo",
    tamano = "md",
    anchoCompleto = false,
    className,
    children,
    ...resto
  } = props;

  const clases = cn(BASE, VARIANTES[variante], TAMANOS[tamano], anchoCompleto && "w-full", className);

  if (resto && "href" in resto && typeof resto.href === "string") {
    const { href, ...restoEnlace } = resto as PropsEnlace;
    return (
      <Link href={href} className={clases} {...restoEnlace}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...restoBoton } = resto as PropsBoton;
  return (
    <button type={type} className={clases} {...restoBoton}>
      {children}
    </button>
  );
}
