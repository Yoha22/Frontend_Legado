import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { COLUMNAS_FOOTER } from "@/content/institucional";
import { SITIO } from "@/lib/sitio";

const LEGALES = [
  { href: "/legal/privacidad", etiqueta: "Política de privacidad" },
  { href: "/legal/tratamiento-de-datos", etiqueta: "Tratamiento de datos (Ley 1581)" },
  { href: "/legal/reglamento", etiqueta: "Reglamento" },
];

export function Footer() {
  return (
    <footer className="border-t-[3px] border-rojo bg-marino">
      <div className="contenedor grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:pt-14 md:pb-10">
        <div>
          <div className="mb-[18px]">
            <Logo tamano="sm" />
          </div>
          <p className="max-w-[300px] text-[15px] leading-relaxed text-azul-medio">
            Escuela de béisbol infantil y juvenil. {SITIO.ciudad}, {SITIO.departamento}, {SITIO.pais}.
          </p>
        </div>

        {COLUMNAS_FOOTER.map((columna) => (
          <div key={columna.titulo}>
            <h2 className="mb-4 text-[11px] uppercase tracking-[.18em] text-azul-oscuro">{columna.titulo}</h2>
            <ul className="flex flex-col gap-2.5">
              {columna.enlaces.map((enlace) => (
                <li key={enlace.href + enlace.etiqueta}>
                  <Link
                    href={enlace.href}
                    className="text-[15px] text-azul-claro transition-colors hover:text-white"
                  >
                    {enlace.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="contenedor border-t border-white/10 py-6 md:pb-10">
        <div className="flex flex-col gap-4 text-[13px] text-azul-oscuro md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITIO.nombre}
          </p>
          <ul className="flex flex-col gap-2 md:flex-row md:gap-[22px]">
            {LEGALES.map((legal) => (
              <li key={legal.href}>
                <Link href={legal.href} className="transition-colors hover:text-azul-claro">
                  {legal.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
