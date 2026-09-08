import type { Metadata } from "next";
import { FormularioPatrocinio } from "@/components/patrocinadores/FormularioPatrocinio";
import { EncabezadoPagina, TituloMenor } from "@/components/ui/Tipografia";
import { NIVELES_PATROCINIO } from "@/content/institucional";
import { obtenerPatrocinadores } from "@/lib/supabase/consultas";
import { pesos } from "@/lib/utils/formato";
import { cn } from "@/lib/utils/cn";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Patrocinadores y aliados",
  description:
    "Niveles de patrocinio Oro, Plata y Bronce, beneficios para las empresas aliadas y formulario de contacto empresarial.",
  alternates: { canonical: "/patrocinadores" },
};

export default async function PaginaPatrocinadores() {
  const patrocinadores = await obtenerPatrocinadores();

  return (
    <>
      <EncabezadoPagina
        antetitulo="Patrocinadores"
        titulo="Aliados del legado"
        descripcion="Cada aporte se convierte en implementos, uniformes y becas para niños que no pueden pagar la mensualidad."
      />

      {patrocinadores.length > 0 ? (
        <section className="contenedor pb-5 pt-14 md:pt-16">
          <TituloMenor className="mb-6">Nos apoyan</TituloMenor>
          <ul className="grid grid-cols-2 gap-[18px] sm:grid-cols-3 lg:grid-cols-5">
            {patrocinadores.map((patrocinador) => (
              <li
                key={patrocinador.id}
                className="flex h-24 items-center justify-center rounded-card border border-marco bg-white p-3.5 text-center text-[11px] uppercase tracking-[.1em] text-ph-texto-suave"
              >
                {patrocinador.nombre}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="niveles" className="contenedor scroll-mt-24 py-14">
        <TituloMenor className="mb-6">Sé patrocinador</TituloMenor>
        <ul className="grid gap-5 md:grid-cols-3">
          {NIVELES_PATROCINIO.map((nivel) => (
            <li
              key={nivel.nombre}
              className={cn(
                "rounded-card bg-white p-7 shadow-card",
                nivel.destacado ? "border-2 border-rojo" : "border border-marco",
              )}
            >
              <span
                className={cn(
                  "inline-block rounded-full px-3.5 py-[7px] font-titulo text-[13px] font-semibold uppercase tracking-[.14em]",
                  nivel.destacado ? "bg-rojo text-white" : "bg-hueso text-texto-suave",
                )}
              >
                {nivel.nombre}
              </span>
              <p className="mb-1.5 mt-[18px] font-titulo text-4xl font-bold leading-none text-marino">
                {pesos(nivel.precio)}
              </p>
              <p className="mb-5 text-[13px] text-texto-apagado">{nivel.periodo}</p>
              <ul className="flex flex-col gap-2.5">
                {nivel.beneficios.map((beneficio) => (
                  <li
                    key={beneficio}
                    className="grid grid-cols-[16px_1fr] gap-2.5 text-[15px] leading-snug text-texto"
                  >
                    <span aria-hidden className="text-rojo">
                      ✓
                    </span>
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section id="contacto" className="scroll-mt-24 border-t border-marco bg-white">
        <div className="mx-auto max-w-[760px] px-5 py-14 md:px-8 md:pb-[84px] md:pt-16">
          <TituloMenor className="mb-5">Contacto empresarial</TituloMenor>
          <FormularioPatrocinio />
        </div>
      </section>
    </>
  );
}
