"use client";

import { useState, useTransition } from "react";
import { registrarInteresPortal } from "@/actions/portal";
import { Boton } from "@/components/ui/Boton";

export function FormularioInteres() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const [enviando, iniciarEnvio] = useTransition();

  if (listo) {
    return (
      <p className="animate-aparecer rounded-campo border border-verde-ok/30 bg-white px-4 py-3.5 text-[15px] text-marino">
        Listo. Te avisaremos a <strong>{correo}</strong> cuando el portal esté disponible.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setMensaje(null);
        const datos = new FormData();
        datos.append("correo", correo);
        iniciarEnvio(async () => {
          const resultado = await registrarInteresPortal(datos);
          if (resultado.ok) setListo(true);
          else setMensaje(resultado.mensaje);
        });
      }}
      noValidate
      className="flex flex-col gap-3"
    >
      <label className="flex flex-col gap-[7px] text-left">
        <span className="text-[13px] font-semibold text-texto">Tu correo</span>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@ejemplo.com"
          autoComplete="email"
          aria-invalid={!!mensaje}
          className="campo"
        />
      </label>

      {mensaje ? (
        <p role="alert" className="text-[13px] font-semibold text-rojo">
          {mensaje}
        </p>
      ) : null}

      <Boton type="submit" disabled={enviando} anchoCompleto>
        {enviando ? "Registrando…" : "Avísenme cuando esté listo"}
      </Boton>
    </form>
  );
}
