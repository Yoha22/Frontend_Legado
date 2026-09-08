import { Boton } from "@/components/ui/Boton";

export function CtaFinal() {
  return (
    <section className="contenedor py-16 text-center md:py-[90px]">
      <h2 className="mb-4 text-balance font-titulo text-[30px] font-bold uppercase tracking-[.02em] text-marino md:text-[46px]">
        Los cupos son limitados
      </h2>
      <p className="mx-auto mb-8 max-w-[560px] text-[17px] leading-relaxed text-texto-suave md:text-[19px]">
        Completa la pre-inscripción y te contactamos por WhatsApp en menos de 24 horas para agendar la prueba.
      </p>
      <Boton href="/inscripciones" tamano="xl">
        Iniciar pre-inscripción
      </Boton>
    </section>
  );
}
