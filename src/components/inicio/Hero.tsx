import { Boton } from "@/components/ui/Boton";
import { Marcador } from "@/components/ui/Marcador";
import { VIDEO_HERO } from "@/content/institucional";
import { SITIO } from "@/lib/sitio";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-marino">
      {/* Textura diagonal sutil del prototipo. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,.03) 0 2px, transparent 2px 22px)",
        }}
      />

      <div className="contenedor relative grid items-center gap-10 py-16 md:gap-14 md:pt-[110px] md:pb-24 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="mb-6 inline-block rounded-full border border-rojo/60 px-3.5 py-[7px] text-xs uppercase tracking-[.18em] text-rosa">
            {SITIO.ubicacion}
          </p>

          <h1 className="mb-5 text-balance font-titulo text-[38px] font-bold uppercase leading-[1.03] tracking-[.01em] text-white md:text-[66px]">
            Formando peloteros,
            <br />
            <span className="text-rojo">formando personas</span>
          </h1>

          <p className="mb-8 max-w-[520px] text-[17px] leading-relaxed text-azul-claro md:mb-9 md:text-[19px]">
            Escuela de béisbol infantil y juvenil para niños de 5 a 17 años. Disciplina, técnica y valores en
            cada entrenamiento.
          </p>

          <div className="flex flex-col gap-3.5 sm:flex-row">
            <Boton href="/inscripciones" tamano="lg">
              Inscribe a tu hijo
            </Boton>
            <Boton href="/galeria" variante="contornoClaro" tamano="lg">
              Ver entrenamientos
            </Boton>
          </div>
        </div>

        <Marcador tipo="video" tono="oscuro" className="aspect-[4/3] p-6">
          {VIDEO_HERO}
        </Marcador>
      </div>
    </section>
  );
}
