import type { Metadata } from "next";
import { EncabezadoPagina, TituloMenor } from "@/components/ui/Tipografia";
import { Marcador } from "@/components/ui/Marcador";
import { ENTRENADORES, HISTORIA, LINEA_TIEMPO, MISION_VISION, OBJETIVOS } from "@/content/institucional";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "La historia de Diover Ávila, la misión y visión de la escuela, sus objetivos formativos y el cuerpo técnico que acompaña a cada categoría.",
  alternates: { canonical: "/nosotros" },
};

export default function PaginaNosotros() {
  return (
    <>
      <EncabezadoPagina antetitulo="Nosotros" titulo="El legado de Diover Ávila" />

      {/* Historia y línea de tiempo */}
      <section className="contenedor grid gap-10 py-14 md:py-[76px] lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
        <Marcador className="aspect-[3/4] p-6">{HISTORIA.fotoAlt}</Marcador>

        <div>
          <TituloMenor className="mb-5">Historia</TituloMenor>
          {HISTORIA.parrafos.map((parrafo, i) => (
            <p
              key={i}
              className="mb-[18px] text-[17px] leading-[1.75] text-texto-suave last:mb-8"
            >
              {parrafo}
            </p>
          ))}

          <ol className="ml-1">
            {LINEA_TIEMPO.map((hito) => (
              <li
                key={hito.anio}
                className="relative grid gap-2 border-l-2 border-marco pb-6 pl-6 last:border-transparent last:pb-0 sm:grid-cols-[88px_1fr] sm:gap-[22px]"
              >
                <span
                  aria-hidden
                  className="absolute -left-[7px] top-1 size-3 rounded-full bg-rojo"
                />
                <span className="font-titulo text-[22px] font-bold text-marino">{hito.anio}</span>
                <span className="text-[15px] leading-relaxed text-texto-suave">{hito.texto}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Misión · Visión · Valores */}
      <section className="border-y border-marco bg-white">
        <div className="contenedor grid gap-6 py-14 md:grid-cols-3 md:py-[76px]">
          {MISION_VISION.map((bloque) => (
            <div key={bloque.titulo}>
              <span
                aria-hidden
                className="mb-[18px] flex size-[46px] items-center justify-center rounded-campo bg-rojo font-titulo text-[17px] font-bold text-white"
              >
                {bloque.icono}
              </span>
              <h2 className="mb-3 font-titulo text-2xl font-semibold uppercase tracking-[.03em]">
                {bloque.titulo}
              </h2>
              <p className="text-base leading-[1.7] text-texto-suave">{bloque.cuerpo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Objetivos */}
      <section className="contenedor py-14 md:py-[76px]">
        <TituloMenor className="mb-7">Objetivos</TituloMenor>
        <div className="grid gap-6 md:grid-cols-3">
          {OBJETIVOS.map((grupo) => (
            <div key={grupo.tipo} className="rounded-card border border-marco bg-white p-6 shadow-card">
              <h3 className="mb-3.5 text-xs uppercase tracking-[.16em] text-rojo">{grupo.tipo}</h3>
              <ul className="flex flex-col gap-3">
                {grupo.items.map((item) => (
                  <li key={item} className="grid grid-cols-[18px_1fr] gap-2.5 text-[15px] leading-relaxed text-texto">
                    <span aria-hidden className="font-bold text-rojo">
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Cuerpo técnico */}
      <section className="border-t border-marco bg-white">
        <div className="contenedor py-14 md:py-[76px]">
          <TituloMenor className="mb-7">Cuerpo técnico</TituloMenor>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ENTRENADORES.map((entrenador) => (
              <li key={entrenador.nombre}>
                <Marcador className="mb-4 aspect-square">{entrenador.fotoAlt}</Marcador>
                <h3 className="mb-[5px] font-titulo text-lg font-semibold uppercase tracking-[.03em]">
                  {entrenador.nombre}
                </h3>
                <p className="mb-2 text-sm text-rojo">{entrenador.cargo}</p>
                <p className="text-sm leading-relaxed text-texto-suave">{entrenador.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
