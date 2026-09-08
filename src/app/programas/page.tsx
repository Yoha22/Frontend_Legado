import type { Metadata } from "next";
import { Boton } from "@/components/ui/Boton";
import { EncabezadoPagina, TituloMenor } from "@/components/ui/Tipografia";
import { obtenerProgramas } from "@/lib/supabase/consultas";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Programas y horarios",
  description:
    "Categorías por edad: Iniciación (5–7), Infantil (8–10), Pre-juvenil (11–13), Juvenil / Alto rendimiento (14–17), vacacionales y clínicas especializadas.",
  alternates: { canonical: "/programas" },
};

const COLUMNAS = ["Programa", "Edad", "Días", "Horario", "Sede"] as const;

export default async function PaginaProgramas() {
  const programas = await obtenerProgramas();

  return (
    <>
      <EncabezadoPagina
        antetitulo="Programas"
        titulo="Categorías y horarios"
        descripcion="Cada categoría trabaja fundamentos distintos según la edad. Si no sabes en cuál va tu hijo, el formulario la sugiere automáticamente."
      />

      <section className="contenedor py-14 md:py-[70px]">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programas.map((programa) => (
            <li
              key={programa.id}
              className="overflow-hidden rounded-card border border-marco bg-white shadow-card"
            >
              <div
                role="img"
                aria-label={programa.foto_alt}
                className="flex h-[150px] items-center justify-center border-b border-marco bg-ph-fondo p-4 text-center text-[11px] uppercase leading-relaxed tracking-[.1em] text-ph-texto"
              >
                {programa.foto_alt}
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2 className="font-titulo text-[23px] font-semibold uppercase tracking-[.03em]">
                    {programa.nombre}
                  </h2>
                  <span className="shrink-0 font-titulo text-[15px] font-bold text-rojo">
                    {programa.edad_label}
                  </span>
                </div>

                <p className="mb-5 text-[15px] leading-relaxed text-texto-suave">{programa.enfoque}</p>

                <dl className="mb-5 flex flex-col gap-2.5 border-y border-marco py-4 text-sm">
                  {[
                    ["Días", programa.dias],
                    ["Horario", programa.horario],
                    ["Sede", programa.sede],
                    ["Cupos", programa.cupos_label],
                  ].map(([etiqueta, valor]) => (
                    <div key={etiqueta} className="flex justify-between gap-3">
                      <dt className="text-texto-apagado">{etiqueta}</dt>
                      <dd className="text-right font-semibold text-marino">{valor}</dd>
                    </div>
                  ))}
                </dl>

                <Boton href="/inscripciones" variante="marino" anchoCompleto>
                  Inscribirme
                  <span className="sr-only"> en {programa.nombre}</span>
                </Boton>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Tabla comparativa. En móvil la tabla de 5 columnas no cabe, así que
          se sustituye por la lista de cards de arriba. */}
      <section className="hidden border-t border-marco bg-white lg:block">
        <div className="contenedor py-[70px]">
          <TituloMenor className="mb-6">Tabla comparativa de horarios</TituloMenor>

          <div className="overflow-hidden rounded-card border border-marco">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-marco bg-hueso">
                  {COLUMNAS.map((columna) => (
                    <th
                      key={columna}
                      scope="col"
                      className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[.16em] text-texto-tenue"
                    >
                      {columna}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {programas.map((programa) => (
                  <tr key={programa.id} className="border-b border-marco-suave transition-colors hover:bg-arena">
                    <th scope="row" className="px-5 py-4 text-[15px] font-semibold text-marino">
                      {programa.nombre}
                    </th>
                    <td className="px-5 py-4 text-[15px] text-texto-suave">{programa.edad_label}</td>
                    <td className="px-5 py-4 text-[15px] text-texto-suave">{programa.dias}</td>
                    <td className="px-5 py-4 text-[15px] text-texto-suave">{programa.horario}</td>
                    <td className="px-5 py-4 text-[15px] text-texto-suave">{programa.sede}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
