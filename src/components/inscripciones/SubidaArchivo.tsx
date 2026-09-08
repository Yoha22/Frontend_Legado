"use client";

import { useId, useRef, useState } from "react";
import { MAX_ARCHIVO_BYTES, TIPOS_ARCHIVO } from "@/lib/validaciones/inscripcion";
import { cn } from "@/lib/utils/cn";

const MB = 1024 * 1024;

/**
 * Selector de documento.
 *
 * Valida tamaño y tipo en cuanto el usuario elige el archivo para dar el aviso
 * de inmediato, pero la validación que cuenta es la del servidor: aquí solo se
 * evita que alguien llegue al paso 5 con un archivo de 40 MB.
 */
export function SubidaArchivo({
  nombre,
  etiqueta,
  ayuda,
  archivo,
  onCambio,
}: {
  nombre: string;
  etiqueta: string;
  ayuda: string;
  archivo: File | null;
  onCambio: (archivo: File | null) => void;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function seleccionar(archivoNuevo: File | null) {
    if (!archivoNuevo) {
      setError(null);
      onCambio(null);
      return;
    }
    if (archivoNuevo.size > MAX_ARCHIVO_BYTES) {
      setError(`Pesa ${(archivoNuevo.size / MB).toFixed(1)} MB; el máximo son 5 MB.`);
      onCambio(null);
      return;
    }
    if (!(TIPOS_ARCHIVO as readonly string[]).includes(archivoNuevo.type)) {
      setError("Formato no admitido. Usa PDF, JPG o PNG.");
      onCambio(null);
      return;
    }
    setError(null);
    onCambio(archivoNuevo);
  }

  return (
    <div
      className={cn(
        "rounded-media border border-dashed p-5 text-center transition-colors",
        error ? "border-rojo bg-rojo-suave" : archivo ? "border-rojo bg-rojo-suave" : "border-ph-borde bg-arena",
      )}
    >
      <label htmlFor={id} className="block cursor-pointer">
        <span className="mb-1.5 block font-titulo text-[15px] font-semibold uppercase tracking-[.04em] text-marino">
          {etiqueta}
        </span>
        <span className="block text-[13px] text-texto-apagado">
          {archivo ? archivo.name : ayuda}
        </span>
      </label>

      <input
        ref={input}
        id={id}
        name={nombre}
        type="file"
        accept={TIPOS_ARCHIVO.join(",")}
        onChange={(e) => seleccionar(e.target.files?.[0] ?? null)}
        className="sr-only"
      />

      {archivo ? (
        <button
          type="button"
          onClick={() => {
            if (input.current) input.current.value = "";
            seleccionar(null);
          }}
          className="mt-2 text-[13px] font-semibold text-rojo underline underline-offset-2"
        >
          Quitar archivo
          <span className="sr-only"> {etiqueta}</span>
        </button>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-[13px] font-semibold text-rojo">
          {error}
        </p>
      ) : null}
    </div>
  );
}
