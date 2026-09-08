import { CIFRAS } from "@/content/institucional";

export function Cifras() {
  return (
    <section className="border-b border-marco bg-white">
      <div className="contenedor grid grid-cols-2 gap-6 py-11 md:grid-cols-4">
        {CIFRAS.map((cifra) => (
          <div key={cifra.etiqueta} className="text-center">
            <p className="font-titulo text-[40px] font-bold leading-none text-rojo md:text-[52px]">
              {cifra.valor}
            </p>
            <p className="mt-2.5 text-[13px] uppercase tracking-[.14em] text-texto-tenue">{cifra.etiqueta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
