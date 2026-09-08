"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enviarPropuestaPatrocinio } from "@/actions/patrocinio";
import { Boton } from "@/components/ui/Boton";
import { Campo, Opciones } from "@/components/inscripciones/Campos";
import { NIVELES_INTERES } from "@/content/institucional";
import { esquemaPatrocinio, type DatosPatrocinio } from "@/lib/validaciones/patrocinio";

export function FormularioPatrocinio() {
  const [enviado, setEnviado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, iniciarEnvio] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<DatosPatrocinio>({
    resolver: zodResolver(esquemaPatrocinio),
    mode: "onTouched",
    defaultValues: { empresa: "", contacto: "", correo: "", nivel: NIVELES_INTERES[0], mensaje: "" },
  });

  const onSubmit = handleSubmit((valores) => {
    setErrorGeneral(null);
    const datos = new FormData();
    for (const [clave, valor] of Object.entries(valores)) datos.append(clave, valor);

    iniciarEnvio(async () => {
      const resultado = await enviarPropuestaPatrocinio(datos);
      if (resultado.ok) {
        setEnviado(true);
        reset();
        return;
      }
      setErrorGeneral(resultado.mensaje);
      for (const [campo, mensaje] of Object.entries(resultado.errores ?? {})) {
        setError(campo as keyof DatosPatrocinio, { type: "server", message: mensaje });
      }
    });
  });

  if (enviado) {
    return (
      <div className="animate-aparecer rounded-card border border-marco bg-hueso p-8 text-center">
        <h3 className="mb-3 font-titulo text-2xl font-bold uppercase tracking-[.02em] text-marino">
          Propuesta enviada
        </h3>
        <p className="mx-auto mb-6 max-w-[420px] text-[15px] leading-relaxed text-texto-suave">
          Gracias por el interés. La dirección de la escuela te responderá al correo que nos dejaste.
        </p>
        <Boton variante="contornoOscuro" onClick={() => setEnviado(false)}>
          Enviar otra propuesta
        </Boton>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {errorGeneral ? (
        <p
          role="alert"
          className="mb-5 rounded-campo border border-rojo bg-rojo-suave px-4 py-3 text-[15px] font-semibold text-rojo-oscuro"
        >
          {errorGeneral}
        </p>
      ) : null}

      <div className="grid gap-[18px] sm:grid-cols-2">
        <Campo etiqueta="Empresa" error={errors.empresa?.message}>
          <input
            {...register("empresa")}
            placeholder="Razón social"
            aria-invalid={!!errors.empresa}
            className="campo"
          />
        </Campo>

        <Campo etiqueta="Contacto" error={errors.contacto?.message}>
          <input
            {...register("contacto")}
            placeholder="Nombre y cargo"
            aria-invalid={!!errors.contacto}
            className="campo"
          />
        </Campo>

        <Campo etiqueta="Correo" error={errors.correo?.message}>
          <input
            {...register("correo")}
            type="email"
            autoComplete="email"
            placeholder="correo@empresa.com"
            aria-invalid={!!errors.correo}
            className="campo"
          />
        </Campo>

        <Campo etiqueta="Nivel de interés" error={errors.nivel?.message}>
          <select {...register("nivel")} className="campo">
            <Opciones opciones={NIVELES_INTERES} />
          </select>
        </Campo>

        <Campo etiqueta="Mensaje" error={errors.mensaje?.message} anchoCompleto>
          <textarea
            {...register("mensaje")}
            rows={4}
            placeholder="Cuéntanos qué te interesa"
            aria-invalid={!!errors.mensaje}
            className="campo resize-y"
          />
        </Campo>
      </div>

      <Boton type="submit" disabled={enviando} className="mt-6" tamano="md">
        {enviando ? "Enviando…" : "Enviar propuesta"}
      </Boton>
    </form>
  );
}
