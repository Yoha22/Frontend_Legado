import type { Metadata } from "next";
import { Calendario } from "@/components/noticias/Calendario";
import { EncabezadoPagina, TituloMenor } from "@/components/ui/Tipografia";
import { obtenerEventos, obtenerNoticias } from "@/lib/supabase/consultas";
import { fechaCorta, fechaLarga } from "@/lib/utils/formato";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Noticias y eventos",
  description:
    "Calendario de entrenamientos, torneos y reuniones de padres, y las últimas noticias de la escuela.",
  alternates: { canonical: "/noticias" },
};

export default async function PaginaNoticias() {
  const [eventos, noticias] = await Promise.all([obtenerEventos(), obtenerNoticias()]);

  return (
    <>
      <EncabezadoPagina antetitulo="Noticias y eventos" titulo="Qué está pasando" />

      <section className="contenedor pb-10 pt-12 md:pt-16">
        <Calendario eventos={eventos} />
      </section>

      <section className="contenedor pb-16 pt-5 md:pb-[84px]">
        <TituloMenor className="mb-6">Últimas noticias</TituloMenor>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <li
              key={noticia.id}
              className="overflow-hidden rounded-card border border-marco bg-white shadow-card"
            >
              <div
                role="img"
                aria-label={noticia.foto_alt}
                className="flex h-40 items-center justify-center border-b border-marco bg-ph-fondo p-4 text-center text-[11px] uppercase leading-relaxed tracking-[.1em] text-ph-texto"
              >
                {noticia.foto_alt}
              </div>
              <div className="p-6">
                <time
                  dateTime={noticia.fecha}
                  title={fechaLarga(noticia.fecha)}
                  className="mb-2.5 block text-xs uppercase tracking-[.14em] text-rojo"
                >
                  {fechaCorta(noticia.fecha)}
                </time>
                <h2 className="mb-2.5 font-titulo text-xl font-semibold uppercase leading-tight tracking-[.02em] text-marino">
                  {noticia.titulo}
                </h2>
                <p className="text-[15px] leading-relaxed text-texto-suave">{noticia.resumen}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
