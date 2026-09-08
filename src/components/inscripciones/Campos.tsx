import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Campos del wizard.
 *
 * El `<label>` envuelve al control, así que la asociación es implícita y no
 * puede quedar un input sin etiqueta por olvidar un `id`.
 */

export function Campo({
  etiqueta,
  error,
  ayuda,
  anchoCompleto = false,
  children,
}: {
  etiqueta: string;
  error?: string;
  ayuda?: string;
  anchoCompleto?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-[7px]", anchoCompleto && "sm:col-span-2")}>
      <span className="text-[13px] font-semibold text-texto">{etiqueta}</span>
      {children}
      {ayuda && !error ? <span className="text-[13px] text-texto-apagado">{ayuda}</span> : null}
      {error ? (
        <span role="alert" className="text-[13px] font-semibold text-rojo">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Opciones({ opciones, vacio }: { opciones: readonly string[]; vacio?: string }) {
  return (
    <>
      {vacio ? <option value="">{vacio}</option> : null}
      {opciones.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </>
  );
}
