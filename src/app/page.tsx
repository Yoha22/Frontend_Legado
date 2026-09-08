import type { Metadata } from "next";
import { Hero } from "@/components/inicio/Hero";
import { Cifras } from "@/components/inicio/Cifras";
import { Diferenciadores } from "@/components/inicio/Diferenciadores";
import { ProgramasDestacados } from "@/components/inicio/ProgramasDestacados";
import { MosaicoGaleria } from "@/components/inicio/MosaicoGaleria";
import { Testimonios } from "@/components/inicio/Testimonios";
import { ProximosEventos } from "@/components/inicio/ProximosEventos";
import { FranjaPatrocinadores } from "@/components/inicio/FranjaPatrocinadores";
import { CtaFinal } from "@/components/inicio/CtaFinal";
import { obtenerTestimonios } from "@/lib/supabase/consultas";
import { SITIO } from "@/lib/sitio";

/** Contenido que cambia poco: se regenera cada 5 minutos. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: `Escuela de béisbol en ${SITIO.ciudad}, ${SITIO.departamento}`,
  description: SITIO.descripcion,
  alternates: { canonical: "/" },
};

export default async function PaginaInicio() {
  const testimonios = await obtenerTestimonios();

  return (
    <>
      <Hero />
      <Cifras />
      <Diferenciadores />
      <ProgramasDestacados />
      <MosaicoGaleria />
      <Testimonios testimonios={testimonios} />
      <ProximosEventos />
      <FranjaPatrocinadores />
      <CtaFinal />
    </>
  );
}
