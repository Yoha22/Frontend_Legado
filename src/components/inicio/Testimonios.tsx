"use client";

import { useEffect, useState } from "react";
import type { Testimonio } from "@/lib/supabase/tipos";
import { cn } from "@/lib/utils/cn";

/**
 * Carrusel de testimonios. Rota cada 7 s como el prototipo, pero se detiene
 * cuando el usuario elige un testimonio a mano o pasa el cursor por encima:
 * un carrusel que sigue girando mientras alguien lee es un problema de
 * accesibilidad, no una animación.
 */
export function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado || testimonios.length <= 1) return;
    const id = setInterval(() => setActual((i) => (i + 1) % testimonios.length), 7000);
    return () => clearInterval(id);
  }, [pausado, testimonios.length]);

  if (testimonios.length === 0) return null;

  const testimonio = testimonios[Math.min(actual, testimonios.length - 1)];

  return (
    <section
      className="bg-marino"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <div className="mx-auto max-w-[1000px] px-5 py-16 text-center md:px-8 md:py-[82px]">
        <h2 className="mb-7 text-xs uppercase tracking-[.2em] text-rosa">Lo que dicen las familias</h2>

        <div className="flex min-h-[200px] flex-col justify-center" aria-live="polite">
          <blockquote className="mb-6 font-titulo text-[22px] leading-[1.45] text-white md:text-[29px]">
            <p className="text-pretty">“{testimonio.cita}”</p>
          </blockquote>
          <p className="text-sm uppercase tracking-[.12em] text-azul-medio">{testimonio.autor}</p>
        </div>

        {testimonios.length > 1 ? (
          <div className="mt-8 flex justify-center gap-2.5">
            {testimonios.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActual(i);
                  setPausado(true);
                }}
                aria-label={`Ver testimonio ${i + 1} de ${testimonios.length}`}
                aria-current={i === actual}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-200",
                  i === actual ? "w-[34px] bg-rojo" : "w-2.5 bg-white/30 hover:bg-white/50",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
