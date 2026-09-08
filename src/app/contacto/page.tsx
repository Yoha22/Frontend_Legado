import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/ui/Tipografia";
import { CONTACTO, REDES } from "@/content/institucional";
import { SITIO, WHATSAPP, enlaceWhatsApp } from "@/lib/sitio";
import { soloDigitos } from "@/lib/utils/formato";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Escríbenos por WhatsApp, llámanos o visítanos en ${SITIO.ciudad}, ${SITIO.departamento}. Horarios de atención y redes sociales.`,
  alternates: { canonical: "/contacto" },
};

const ACCIONES = [
  {
    tipo: "WhatsApp",
    valor: WHATSAPP.legible,
    nota: "Respondemos de 8 a.m. a 8 p.m.",
    href: enlaceWhatsApp(),
    externo: true,
  },
  {
    tipo: "Teléfono",
    valor: CONTACTO.telefonoFijo,
    nota: "Oficina, lunes a viernes.",
    href: `tel:+57${soloDigitos(CONTACTO.telefonoFijo)}`,
    externo: false,
  },
  {
    tipo: "Correo",
    valor: CONTACTO.correo,
    nota: "Para patrocinios y prensa.",
    href: `mailto:${CONTACTO.correo}`,
    externo: false,
  },
];

export default function PaginaContacto() {
  return (
    <>
      <EncabezadoPagina antetitulo="Contacto" titulo="Escríbenos" />

      <section className="contenedor grid gap-8 py-14 md:pb-[90px] md:pt-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-10">
        <div className="flex flex-col gap-4">
          {ACCIONES.map((accion) => (
            <a
              key={accion.tipo}
              href={accion.href}
              {...(accion.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="block rounded-card border border-marco bg-white p-6 transition-colors hover:border-rojo"
            >
              <span className="mb-2 block text-[11px] uppercase tracking-[.16em] text-rojo">{accion.tipo}</span>
              <span className="block font-titulo text-[22px] font-semibold tracking-[.02em] text-marino">
                {accion.valor}
              </span>
              <span className="mt-1.5 block text-sm text-texto-suave">{accion.nota}</span>
            </a>
          ))}

          <div className="rounded-card border border-marco bg-white p-6">
            <h2 className="mb-3.5 text-[11px] uppercase tracking-[.16em] text-rojo">Redes sociales</h2>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {REDES.map((red) => (
                <li key={red.nombre}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-campo border border-marco p-3 text-center text-[11px] uppercase tracking-[.1em] text-texto-suave transition-colors hover:bg-hueso hover:text-marino"
                  >
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div
            role="img"
            aria-label={CONTACTO.mapaAlt}
            className="mb-5 flex aspect-[16/11] items-center justify-center rounded-card border border-dashed border-ph-borde bg-ph-fondo p-6 text-center"
          >
            <span className="max-w-[300px] text-xs uppercase leading-[1.7] tracking-[.1em] text-ph-texto">
              {CONTACTO.mapaAlt}
            </span>
          </div>

          <div className="rounded-card border border-marco bg-white p-6">
            <h2 className="mb-3 text-[11px] uppercase tracking-[.16em] text-texto-tenue">
              Sede y horarios de atención
            </h2>
            <address className="text-base not-italic leading-[1.75] text-texto">
              {CONTACTO.direccion}
              <br />
              {CONTACTO.horarios}
            </address>
          </div>
        </div>
      </section>
    </>
  );
}
