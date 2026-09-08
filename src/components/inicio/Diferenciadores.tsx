import { Antetitulo, TituloSeccion } from "@/components/ui/Tipografia";
import { DIFERENCIADORES } from "@/content/institucional";

export function Diferenciadores() {
  return (
    <section className="contenedor py-16 md:py-[82px]">
      <Antetitulo className="mb-3">Diferenciadores</Antetitulo>
      <TituloSeccion className="mb-10">¿Por qué Legado Diover Ávila?</TituloSeccion>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {DIFERENCIADORES.map((item) => (
          <li key={item.numero} className="rounded-card border border-marco bg-white p-7 shadow-card">
            <span className="mb-[18px] flex size-11 items-center justify-center rounded-campo bg-marino font-titulo text-lg font-bold text-white">
              {item.numero}
            </span>
            <h3 className="mb-2.5 font-titulo text-[19px] font-semibold uppercase tracking-[.03em]">
              {item.titulo}
            </h3>
            <p className="text-[15px] leading-relaxed text-texto-suave">{item.cuerpo}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
