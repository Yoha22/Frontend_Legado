import { obtenerPatrocinadores } from "@/lib/supabase/consultas";

export async function FranjaPatrocinadores() {
  const patrocinadores = await obtenerPatrocinadores();
  if (patrocinadores.length === 0) return null;

  return (
    <section className="border-y border-marco bg-white">
      <div className="contenedor flex flex-col gap-6 py-10 md:flex-row md:items-center md:gap-10 md:py-[52px]">
        <h2 className="max-w-[130px] shrink-0 text-xs uppercase leading-relaxed tracking-[.16em] text-ph-texto">
          Con el apoyo de
        </h2>
        <ul className="grid flex-1 grid-cols-2 gap-[18px] sm:grid-cols-3 lg:grid-cols-5">
          {patrocinadores.map((patrocinador) => (
            <li
              key={patrocinador.id}
              className="flex h-[62px] items-center justify-center rounded-campo border border-dashed border-ph-borde-suave px-3 text-center text-[11px] uppercase tracking-[.1em] text-ph-texto-suave"
            >
              {patrocinador.nombre}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
