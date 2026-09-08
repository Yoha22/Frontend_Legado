import type { Metadata } from "next";
import { GaleriaFiltrable } from "@/components/galeria/GaleriaFiltrable";
import { EncabezadoPagina } from "@/components/ui/Tipografia";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Fotos y videos de entrenamientos, torneos, clínicas y testimonios de las familias de la escuela.",
  alternates: { canonical: "/galeria" },
};

export default function PaginaGaleria() {
  return (
    <>
      <EncabezadoPagina antetitulo="Galería" titulo="Momentos del legado" />
      <GaleriaFiltrable />
    </>
  );
}
