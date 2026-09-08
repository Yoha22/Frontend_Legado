"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Boton } from "@/components/ui/Boton";
import { Logo } from "@/components/layout/Logo";
import { NAVEGACION } from "@/content/institucional";
import { cn } from "@/lib/utils/cn";

/**
 * Navbar fija. En desktop replica el prototipo (nueve enlaces + CTA).
 * En móvil el prototipo no definía nada, así que se resuelve con un panel
 * desplegable a pantalla completa.
 */
export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const esActivo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Cierra el menú al navegar.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // Bloquea el scroll del fondo y devuelve el foco al cerrar.
  useEffect(() => {
    if (!abierto) return;

    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        botonMenu.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      // Atrapa el foco dentro del panel mientras esté abierto.
      const focusables = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusables.length === 0) return;

      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alPresionar);
    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowPrevio;
    };
  }, [abierto]);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-rojo bg-marino">
      <div className="contenedor flex h-16 items-center gap-8 md:h-[76px]">
        <Logo />

        <nav aria-label="Navegación principal" className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAVEGACION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={esActivo(item.href) ? "page" : undefined}
              className={cn(
                "rounded-boton px-[13px] py-2.5 text-sm tracking-[.03em] transition-colors",
                esActivo(item.href)
                  ? "bg-white/10 font-semibold text-white"
                  : "text-azul-nav hover:bg-white/[.08] hover:text-white",
              )}
            >
              {item.etiqueta}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Boton href="/inscripciones" tamano="sm" className="hidden sm:inline-flex md:text-sm">
            Inscríbete
          </Boton>

          <button
            ref={botonMenu}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            className="flex size-11 items-center justify-center rounded-boton text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
            <span aria-hidden className="relative block h-4 w-6">
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-6 bg-white transition-transform duration-200",
                  abierto ? "top-[7px] rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[7px] block h-0.5 w-6 bg-white transition-opacity duration-200",
                  abierto && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-6 bg-white transition-transform duration-200",
                  abierto ? "top-[7px] -rotate-45" : "top-3.5",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {abierto ? (
        <div
          id="menu-movil"
          ref={panel}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-marino lg:hidden"
        >
          <nav aria-label="Navegación principal" className="contenedor flex flex-col gap-1 py-6">
            {NAVEGACION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={esActivo(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-campo px-4 py-3.5 font-titulo text-lg uppercase tracking-[.04em] transition-colors",
                  esActivo(item.href) ? "bg-white/10 text-white" : "text-azul-nav hover:bg-white/[.06]",
                )}
              >
                {item.etiqueta}
              </Link>
            ))}
            <Boton href="/inscripciones" tamano="lg" anchoCompleto className="mt-4">
              Inscríbete
            </Boton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
