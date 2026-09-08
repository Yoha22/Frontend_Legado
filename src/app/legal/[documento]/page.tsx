import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EncabezadoPagina } from "@/components/ui/Tipografia";
import { DOCUMENTOS_LEGALES, documentoLegal, LEGAL_REVISADO } from "@/content/legal";

type Props = { params: Promise<{ documento: string }> };

export function generateStaticParams() {
  return DOCUMENTOS_LEGALES.map((d) => ({ documento: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { documento: slug } = await params;
  const documento = documentoLegal(slug);
  if (!documento) return {};

  return {
    title: documento.titulo,
    description: documento.descripcion,
    alternates: { canonical: `/legal/${documento.slug}` },
    // Mientras el texto sea un borrador sin revisión legal, no se indexa.
    robots: LEGAL_REVISADO ? undefined : { index: false, follow: true },
  };
}

export default async function PaginaLegal({ params }: Props) {
  const { documento: slug } = await params;
  const documento = documentoLegal(slug);
  if (!documento) notFound();

  return (
    <>
      <EncabezadoPagina antetitulo={documento.antetitulo} titulo={documento.titulo} compacto />

      <article className="mx-auto max-w-[760px] px-5 py-12 md:px-8 md:py-16">
        {!LEGAL_REVISADO ? (
          <p className="mb-8 rounded-campo border border-rojo bg-rojo-suave px-4 py-3.5 text-[15px] leading-relaxed text-rojo-oscuro">
            <strong>Borrador.</strong> Este texto es un esqueleto de referencia y no ha sido revisado por un
            abogado. No debe publicarse así.
          </p>
        ) : null}

        <p className="mb-8 text-sm text-texto-apagado">Última actualización: {documento.actualizado}</p>

        {documento.secciones.map((seccion) => (
          <section key={seccion.titulo} className="mb-8">
            <h2 className="mb-3 font-titulo text-xl font-semibold uppercase tracking-[.03em] text-marino">
              {seccion.titulo}
            </h2>
            {seccion.parrafos.map((parrafo, i) => (
              <p key={i} className="mb-3 text-[16px] leading-[1.75] text-texto-suave">
                {parrafo}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
