import Link from "next/link";
import { Antetitulo, TituloSeccion } from "@/components/ui/Tipografia";
import { obtenerProgramasDestacados } from "@/lib/supabase/consultas";

export async function ProgramasDestacados() {
  const programas = await obtenerProgramasDestacados();

  return (
    <section className="border-y border-marco bg-white">
      <div className="contenedor py-16 md:py-[82px]">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Antetitulo className="mb-3">Categorías</Antetitulo>
            <TituloSeccion>Programas destacados</TituloSeccion>
          </div>
          <Link
            href="/programas"
            className="font-titulo text-sm font-semibold uppercase tracking-[.09em] text-rojo hover:text-rojo-hover"
          >
            Ver todos →
          </Link>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programas.map((programa) => (
            <li
              key={programa.id}
              className="overflow-hidden rounded-card border border-marco bg-white transition-shadow hover:shadow-card-hover"
            >
              <div
                role="img"
                aria-label={programa.foto_alt}
                className="flex h-[132px] items-center justify-center border-b border-marco bg-ph-fondo p-3.5 text-center text-[11px] uppercase tracking-[.1em] text-ph-texto"
              >
                {programa.foto_alt}
              </div>
              <div className="p-[22px]">
                <p className="mb-2 text-xs uppercase tracking-[.14em] text-rojo">{programa.edad_label} años</p>
                <h3 className="mb-2 font-titulo text-xl font-semibold uppercase tracking-[.03em]">
                  {programa.nombre}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-texto-suave">{programa.enfoque}</p>
                <Link
                  href="/programas"
                  className="font-titulo text-[13px] font-semibold uppercase tracking-[.09em] text-marino hover:text-rojo"
                >
                  Más info →
                  <span className="sr-only"> sobre {programa.nombre}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
