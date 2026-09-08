import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFlotante } from "@/components/layout/WhatsAppFlotante";
import { SITIO } from "@/lib/sitio";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: `${SITIO.nombre} · ${SITIO.ciudad}, ${SITIO.departamento}`,
    template: `%s · ${SITIO.nombreCorto}`,
  },
  description: SITIO.descripcion,
  applicationName: SITIO.nombre,
  keywords: [
    "escuela de béisbol",
    "béisbol infantil",
    `béisbol ${SITIO.ciudad}`,
    `béisbol ${SITIO.departamento}`,
    "Legado Diover Ávila",
    "inscripciones béisbol",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITIO.nombre,
    url: SITIO.url,
    title: `${SITIO.nombre} · ${SITIO.ciudad}, ${SITIO.departamento}`,
    description: SITIO.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: SITIO.nombre,
    description: SITIO.descripcion,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO">
      <body className={`${oswald.variable} ${sourceSans.variable} antialiased`}>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-boton focus:bg-rojo focus:px-4 focus:py-2 focus:font-titulo focus:uppercase focus:text-white"
        >
          Saltar al contenido
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <WhatsAppFlotante />
      </body>
    </html>
  );
}
