import { TituloSeccion } from "@/components/ui/Tipografia";
import { obtenerProximosEventos } from "@/lib/supabase/consultas";
import { diaYMes, fechaLarga } from "@/lib/utils/formato";

export async function ProximosEventos() {
  const eventos = await obtenerProximosEventos();
  if (eventos.length === 0) return null;

  return (
    <section className="contenedor py-16 md:py-[82px]">
      <TituloSeccion className="mb-9">Próximos eventos</TituloSeccion>

      <ul className="grid gap-5 md:grid-cols-3">
        {eventos.map((evento) => {
          const { dia, mes } = diaYMes(evento.fecha);
          return (
            <li
              key={evento.id}
              className="flex gap-5 rounded-card border border-marco bg-white p-6 shadow-card"
            >
              <time dateTime={evento.fecha} className="shrink-0 text-center">
                <span className="block font-titulo text-[34px] font-bold leading-none text-marino">{dia}</span>
                <span className="mt-1 block text-xs uppercase tracking-[.14em] text-rojo">{mes}</span>
                <span className="sr-only">{fechaLarga(evento.fecha)}</span>
              </time>
              <div className="border-l border-marco pl-5">
                <h3 className="mb-2 font-titulo text-[17px] font-semibold uppercase tracking-[.03em]">
                  {evento.titulo}
                </h3>
                {evento.detalle ? (
                  <p className="text-sm leading-relaxed text-texto-suave">{evento.detalle}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
