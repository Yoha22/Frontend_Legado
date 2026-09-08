import type { Metadata } from "next";
import { FormularioInteres } from "@/components/portal/FormularioInteres";
import { Boton } from "@/components/ui/Boton";

export const metadata: Metadata = {
  title: "Portal de padres",
  description: "El portal de padres está en construcción. Déjanos tu correo y te avisamos cuando abra.",
  // Sin contenido útil todavía: no tiene sentido que Google la indexe.
  robots: { index: false, follow: true },
};

const FUNCIONES = [
  "Estado de pagos y próximos cobros",
  "Horario semanal y asistencia del niño",
  "Boletín de progreso por trimestre",
  "Fotos de tu hijo y comunicados de la escuela",
];

export default function PaginaPortal() {
  return (
    <section className="flex min-h-[60vh] items-center bg-marino px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[460px] rounded-card bg-white p-8 shadow-modal md:p-11">
        <p className="mb-2.5 text-[11px] uppercase tracking-[.18em] text-rojo">Portal de padres · Fase 2</p>
        <h1 className="mb-4 font-titulo text-[26px] font-bold uppercase tracking-[.02em] text-marino md:text-[30px]">
          Muy pronto
        </h1>
        <p className="mb-6 text-[15px] leading-relaxed text-texto-suave">
          Estamos construyendo el espacio privado para las familias inscritas. Cuando esté listo podrás
          consultar:
        </p>

        <ul className="mb-7 flex flex-col gap-2.5">
          {FUNCIONES.map((funcion) => (
            <li
              key={funcion}
              className="grid grid-cols-[16px_1fr] gap-2.5 text-[15px] leading-snug text-texto"
            >
              <span aria-hidden className="text-rojo">
                ✓
              </span>
              <span>{funcion}</span>
            </li>
          ))}
        </ul>

        <FormularioInteres />

        <div className="mt-6 border-t border-marco pt-5 text-center">
          <p className="mb-3 text-sm text-texto-apagado">¿Todavía no inscribes a tu hijo?</p>
          <Boton href="/inscripciones" variante="contornoOscuro" tamano="sm" anchoCompleto>
            Ir a la pre-inscripción
          </Boton>
        </div>
      </div>
    </section>
  );
}
