import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** Marca del header y del footer: cuadro rojo "LD" + wordmark en dos líneas. */
export function Logo({ tamano = "md" }: { tamano?: "sm" | "md" }) {
  const chico = tamano === "sm";

  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Legado Diover Ávila · Ir al inicio">
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-campo bg-rojo font-titulo font-bold text-white",
          chico ? "size-[38px] text-[17px]" : "size-[42px] text-xl",
        )}
      >
        LD
      </span>
      {chico ? (
        <span className="font-titulo text-[17px] font-semibold uppercase tracking-[.06em] text-white">
          Legado Diover Ávila
        </span>
      ) : (
        <span className="leading-none">
          <span className="block font-titulo text-[19px] font-semibold uppercase tracking-[.06em] text-white">
            Legado
          </span>
          <span className="mt-[3px] block text-[11px] uppercase tracking-[.18em] text-azul-medio">
            Diover Ávila
          </span>
        </span>
      )}
    </Link>
  );
}
