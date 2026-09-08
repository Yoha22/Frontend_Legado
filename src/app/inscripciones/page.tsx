import type { Metadata } from "next";
import { Wizard } from "@/components/inscripciones/Wizard";
import { EncabezadoPagina } from "@/components/ui/Tipografia";
import { PREGUNTAS_FRECUENTES, REQUISITOS } from "@/content/institucional";
import { obtenerProgramas } from "@/lib/supabase/consultas";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pre-inscripción",
  description:
    "Formulario de pre-inscripción en cinco pasos. Es gratuito y te contactamos por WhatsApp en menos de 24 horas para agendar la prueba.",
  alternates: { canonical: "/inscripciones" },
};

export default async function PaginaInscripciones() {
  const programas = await obtenerProgramas();

  return (
    <>
      <EncabezadoPagina antetitulo="Inscripciones" titulo="Pre-inscripción" compacto />

      <section className="contenedor grid items-start gap-8 py-12 md:py-[52px] md:pb-[90px] lg:grid-cols-[1.6fr_.8fr] lg:gap-10">
        <Wizard programas={programas} />

        <aside className="flex flex-col gap-5">
          <div id="requisitos" className="scroll-mt-24 rounded-card border border-marco bg-white p-6">
            <h2 className="mb-4 text-[11px] uppercase tracking-[.16em] text-rojo">Requisitos</h2>
            <ul className="flex flex-col gap-2.5">
              {REQUISITOS.map((requisito) => (
                <li
                  key={requisito}
                  className="grid grid-cols-[16px_1fr] gap-2.5 text-[15px] leading-relaxed text-texto"
                >
                  <span aria-hidden className="text-rojo">
                    ·
                  </span>
                  <span>{requisito}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="preguntas" className="scroll-mt-24 rounded-card border border-marco bg-white p-6">
            <h2 className="mb-4 text-[11px] uppercase tracking-[.16em] text-rojo">Preguntas frecuentes</h2>
            <dl className="flex flex-col gap-[18px]">
              {PREGUNTAS_FRECUENTES.map((faq) => (
                <div key={faq.pregunta}>
                  <dt className="mb-[5px] text-[15px] font-semibold text-marino">{faq.pregunta}</dt>
                  <dd className="text-sm leading-relaxed text-texto-suave">{faq.respuesta}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>
    </>
  );
}
