"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enviarInscripcion } from "@/actions/inscripcion";
import { Boton } from "@/components/ui/Boton";
import { Campo, Opciones } from "@/components/inscripciones/Campos";
import { SubidaArchivo } from "@/components/inscripciones/SubidaArchivo";
import { DOCUMENTOS, OPCIONES } from "@/content/institucional";
import type { Programa } from "@/lib/supabase/tipos";
import { calcularEdad, categoriaSugerida, parsearFecha } from "@/lib/utils/categoria";
import {
  CAMPOS_POR_PASO,
  esquemaInscripcion,
  NOMBRES_PASOS,
  TOTAL_PASOS,
  type DatosFormulario,
} from "@/lib/validaciones/inscripcion";
import { cn } from "@/lib/utils/cn";

const CONSENTIMIENTOS = [
  {
    campo: "consentImagen" as const,
    texto: "Autorizo el uso de imagen de mi hijo en redes sociales y material de la escuela.",
    obligatorio: false,
  },
  {
    campo: "consentDatos" as const,
    texto: "Autorizo el tratamiento de datos personales de menores conforme a la Ley 1581 de 2012.",
    obligatorio: true,
  },
  {
    campo: "consentReglamento" as const,
    texto: "Acepto el reglamento interno y el compromiso de puntualidad y asistencia.",
    obligatorio: true,
  },
];

type Documentos = Record<string, File | null>;

export function Wizard({ programas }: { programas: Programa[] }) {
  const opcionesPrograma = useMemo(
    () => (programas.filter((p) => p.destacado).length > 0 ? programas.filter((p) => p.destacado) : programas),
    [programas],
  );

  const [paso, setPaso] = useState(1);
  const [hecho, setHecho] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<Documentos>({
    docFoto: null,
    docIdentidad: null,
    docEps: null,
    docMedico: null,
  });
  const [enviando, iniciarEnvio] = useTransition();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    formState: { errors },
  } = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaInscripcion),
    mode: "onTouched",
    defaultValues: {
      ninoNombre: "",
      ninoFechaNacimiento: "",
      ninoGenero: "Masculino",
      ninoPosicion: OPCIONES.posicion[0],
      ninoExperiencia: OPCIONES.experiencia[0],
      ninoEps: "",
      ninoCondicionesMedicas: "",
      acudienteNombre: "",
      acudienteParentesco: OPCIONES.parentesco[0],
      acudienteCedula: "",
      acudienteWhatsapp: "",
      acudienteCorreo: "",
      acudienteDireccion: "",
      programaId: opcionesPrograma[0]?.id ?? "",
      comoNosConocio: OPCIONES.comoNosConocio[0],
      consentImagen: false,
      consentDatos: false,
      consentReglamento: false,
    },
  });

  const fechaNacimiento = watch("ninoFechaNacimiento");
  const programaId = watch("programaId");
  const programaElegido = opcionesPrograma.find((p) => p.id === programaId) ?? opcionesPrograma[0];
  const categoria = categoriaSugerida(fechaNacimiento ?? "");

  async function siguiente() {
    const valido = await trigger(CAMPOS_POR_PASO[paso]);
    if (!valido) return;
    setPaso((p) => Math.min(p + 1, TOTAL_PASOS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function anterior() {
    setErrorGeneral(null);
    setPaso((p) => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const onSubmit = handleSubmit((valores) => {
    setErrorGeneral(null);

    const datos = new FormData();
    for (const [clave, valor] of Object.entries(valores)) {
      datos.append(clave, typeof valor === "boolean" ? String(valor) : (valor ?? ""));
    }
    for (const [clave, archivo] of Object.entries(documentos)) {
      if (archivo) datos.append(clave, archivo);
    }

    iniciarEnvio(async () => {
      const resultado = await enviarInscripcion(datos);

      if (resultado.ok) {
        setHecho(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setErrorGeneral(resultado.mensaje);

      // Devuelve al paso donde está el primer error para que el usuario lo vea.
      if (resultado.errores) {
        for (const [campo, mensaje] of Object.entries(resultado.errores)) {
          setError(campo as keyof DatosFormulario, { type: "server", message: mensaje });
        }
        const primerCampo = Object.keys(resultado.errores)[0];
        const pasoDelError = Object.entries(CAMPOS_POR_PASO).find(([, campos]) =>
          (campos as string[]).includes(primerCampo),
        );
        if (pasoDelError) setPaso(Number(pasoDelError[0]));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // ── Pantalla de éxito ─────────────────────────────────────────────────────

  if (hecho) {
    return (
      <div className="animate-aparecer rounded-card border border-marco bg-white p-10 text-center shadow-card md:px-10 md:py-16">
        <span
          aria-hidden
          className="mx-auto mb-6 flex size-[66px] items-center justify-center rounded-full bg-marino text-[28px] text-white"
        >
          ✓
        </span>
        <h2 className="mb-3.5 font-titulo text-[26px] font-bold uppercase tracking-[.02em] text-marino md:text-[34px]">
          ¡Recibimos tu solicitud!
        </h2>
        <p className="mx-auto mb-8 max-w-[420px] text-[17px] leading-relaxed text-texto-suave md:text-lg">
          Te contactaremos por WhatsApp en menos de 24 horas para agendar la prueba.
        </p>
        <Boton
          variante="contornoOscuro"
          onClick={() => {
            setHecho(false);
            setPaso(1);
            setDocumentos({ docFoto: null, docIdentidad: null, docEps: null, docMedico: null });
          }}
        >
          Registrar otro niño
        </Boton>
      </div>
    );
  }

  // ── Wizard ────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="overflow-hidden rounded-card border border-marco bg-white shadow-card"
    >
      {/* Barra de progreso */}
      <div className="px-6 pt-6 md:px-[30px]">
        <div className="mb-3.5 flex gap-2" aria-hidden>
          {NOMBRES_PASOS.map((nombre, i) => (
            <span
              key={nombre}
              className={cn("h-1.5 flex-1 rounded-full transition-colors", i < paso ? "bg-rojo" : "bg-marco")}
            />
          ))}
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs uppercase tracking-[.16em] text-texto-apagado">
            Paso {paso} de {TOTAL_PASOS}
          </p>
          <p className="text-xs uppercase tracking-[.16em] text-rojo">{NOMBRES_PASOS[paso - 1]}</p>
        </div>
      </div>

      <div className="px-6 pb-7 pt-7 md:px-[30px]">
        {errorGeneral ? (
          <p
            role="alert"
            className="mb-6 rounded-campo border border-rojo bg-rojo-suave px-4 py-3 text-[15px] font-semibold text-rojo-oscuro"
          >
            {errorGeneral}
          </p>
        ) : null}

        {/* ── Paso 1 · datos del niño ── */}
        {paso === 1 ? (
          <fieldset>
            <legend className="mb-5 font-titulo text-[22px] font-semibold uppercase tracking-[.03em] text-marino md:text-[26px]">
              Datos del niño
            </legend>
            <div className="grid gap-[18px] sm:grid-cols-2">
              <Campo etiqueta="Nombre completo" error={errors.ninoNombre?.message} anchoCompleto>
                <input
                  {...register("ninoNombre")}
                  placeholder="Nombres y apellidos"
                  autoComplete="off"
                  aria-invalid={!!errors.ninoNombre}
                  className="campo"
                />
              </Campo>

              <Campo etiqueta="Fecha de nacimiento" error={errors.ninoFechaNacimiento?.message}>
                <input
                  {...register("ninoFechaNacimiento")}
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  aria-invalid={!!errors.ninoFechaNacimiento}
                  className="campo"
                />
              </Campo>

              <Campo etiqueta="Género" error={errors.ninoGenero?.message}>
                <select {...register("ninoGenero")} className="campo">
                  <Opciones opciones={OPCIONES.genero} />
                </select>
              </Campo>

              <Campo etiqueta="Categoría sugerida" ayuda="Se calcula con la fecha de nacimiento.">
                <input value={categoria} readOnly tabIndex={-1} className="campo" />
              </Campo>

              <Campo etiqueta="Posición preferida">
                <select {...register("ninoPosicion")} className="campo">
                  <Opciones opciones={OPCIONES.posicion} />
                </select>
              </Campo>

              <Campo etiqueta="Experiencia previa">
                <select {...register("ninoExperiencia")} className="campo">
                  <Opciones opciones={OPCIONES.experiencia} />
                </select>
              </Campo>

              <Campo etiqueta="EPS" error={errors.ninoEps?.message}>
                <input {...register("ninoEps")} placeholder="Entidad de salud" className="campo" />
              </Campo>

              <Campo
                etiqueta="Alergias o condiciones médicas"
                error={errors.ninoCondicionesMedicas?.message}
                anchoCompleto
              >
                <textarea
                  {...register("ninoCondicionesMedicas")}
                  rows={3}
                  placeholder="Opcional"
                  className="campo resize-y"
                />
              </Campo>
            </div>
          </fieldset>
        ) : null}

        {/* ── Paso 2 · acudiente ── */}
        {paso === 2 ? (
          <fieldset>
            <legend className="mb-5 font-titulo text-[22px] font-semibold uppercase tracking-[.03em] text-marino md:text-[26px]">
              Datos del acudiente
            </legend>
            <div className="grid gap-[18px] sm:grid-cols-2">
              <Campo etiqueta="Nombre completo" error={errors.acudienteNombre?.message} anchoCompleto>
                <input
                  {...register("acudienteNombre")}
                  placeholder="Nombres y apellidos"
                  autoComplete="name"
                  aria-invalid={!!errors.acudienteNombre}
                  className="campo"
                />
              </Campo>

              <Campo etiqueta="Parentesco" error={errors.acudienteParentesco?.message}>
                <select {...register("acudienteParentesco")} className="campo">
                  <Opciones opciones={OPCIONES.parentesco} />
                </select>
              </Campo>

              <Campo etiqueta="Cédula" error={errors.acudienteCedula?.message}>
                <input
                  {...register("acudienteCedula")}
                  inputMode="numeric"
                  placeholder="Número de documento"
                  aria-invalid={!!errors.acudienteCedula}
                  className="campo"
                />
              </Campo>

              <Campo
                etiqueta="WhatsApp"
                error={errors.acudienteWhatsapp?.message}
                ayuda="Celular colombiano. Por aquí te contactamos."
              >
                <input
                  {...register("acudienteWhatsapp")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="300 000 0000"
                  aria-invalid={!!errors.acudienteWhatsapp}
                  className="campo"
                />
              </Campo>

              <Campo etiqueta="Correo" error={errors.acudienteCorreo?.message}>
                <input
                  {...register("acudienteCorreo")}
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  aria-invalid={!!errors.acudienteCorreo}
                  className="campo"
                />
              </Campo>

              <Campo etiqueta="Dirección y barrio" error={errors.acudienteDireccion?.message} anchoCompleto>
                <input
                  {...register("acudienteDireccion")}
                  placeholder="Calle, número, barrio"
                  autoComplete="street-address"
                  className="campo"
                />
              </Campo>
            </div>
          </fieldset>
        ) : null}

        {/* ── Paso 3 · programa ── */}
        {paso === 3 ? (
          <div>
            <fieldset className="mb-6">
              <legend className="mb-5 font-titulo text-[22px] font-semibold uppercase tracking-[.03em] text-marino md:text-[26px]">
                Programa y horario
              </legend>
              <div className="flex flex-col gap-3">
                {opcionesPrograma.map((programa) => {
                  const seleccionado = programaId === programa.id;
                  return (
                    <label
                      key={programa.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-4 rounded-media border px-5 py-4 transition-colors",
                        seleccionado ? "border-rojo bg-rojo-suave" : "border-marco bg-white hover:border-rojo",
                      )}
                    >
                      <span>
                        <span className="block font-titulo text-[17px] font-semibold uppercase tracking-[.03em] text-marino">
                          {programa.nombre} ({programa.edad_label})
                        </span>
                        <span className="mt-1 block text-sm text-texto-suave">
                          {programa.dias} · {programa.horario}
                        </span>
                      </span>
                      <input
                        {...register("programaId")}
                        type="radio"
                        value={programa.id}
                        className="size-5 shrink-0 accent-rojo"
                      />
                    </label>
                  );
                })}
              </div>
              {errors.programaId ? (
                <p role="alert" className="mt-3 text-[13px] font-semibold text-rojo">
                  {errors.programaId.message}
                </p>
              ) : null}
            </fieldset>

            <Campo etiqueta="¿Cómo nos conociste?">
              <select {...register("comoNosConocio")} className="campo">
                <Opciones opciones={OPCIONES.comoNosConocio} />
              </select>
            </Campo>
          </div>
        ) : null}

        {/* ── Paso 4 · documentos ── */}
        {paso === 4 ? (
          <div>
            <h2 className="mb-2 font-titulo text-[22px] font-semibold uppercase tracking-[.03em] text-marino md:text-[26px]">
              Documentos
            </h2>
            <p className="mb-5 text-[15px] text-texto-suave">
              Puedes subirlos ahora o enviarlos después por WhatsApp. Ninguno es obligatorio en esta etapa.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {DOCUMENTOS.map((documento) => (
                <SubidaArchivo
                  key={documento.campo}
                  nombre={documento.campo}
                  etiqueta={documento.nombre}
                  ayuda={documento.ayuda}
                  archivo={documentos[documento.campo] ?? null}
                  onCambio={(archivo) =>
                    setDocumentos((previos) => ({ ...previos, [documento.campo]: archivo }))
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Paso 5 · autorizaciones y resumen ── */}
        {paso === 5 ? (
          <div>
            <fieldset className="mb-7">
              <legend className="mb-5 font-titulo text-[22px] font-semibold uppercase tracking-[.03em] text-marino md:text-[26px]">
                Autorizaciones
              </legend>
              <div className="flex flex-col gap-3.5">
                {CONSENTIMIENTOS.map((consentimiento) => (
                  <label
                    key={consentimiento.campo}
                    className="grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3.5"
                  >
                    <input
                      {...register(consentimiento.campo)}
                      type="checkbox"
                      aria-invalid={!!errors[consentimiento.campo]}
                      className="mt-0.5 size-6 rounded-[6px] accent-rojo"
                    />
                    <span className="text-[15px] leading-relaxed text-texto">
                      {consentimiento.texto}
                      {consentimiento.obligatorio ? (
                        <span className="ml-1 font-semibold text-rojo">(obligatorio)</span>
                      ) : (
                        <span className="ml-1 text-texto-apagado">(opcional)</span>
                      )}
                      {errors[consentimiento.campo] ? (
                        <span role="alert" className="mt-1 block text-[13px] font-semibold text-rojo">
                          {errors[consentimiento.campo]?.message}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-media border border-marco bg-hueso p-5">
              <h3 className="mb-3.5 text-[11px] uppercase tracking-[.16em] text-texto-tenue">Resumen</h3>
              <dl className="flex flex-col gap-2.5">
                {[
                  ["Niño", watch("ninoNombre") || "—"],
                  [
                    "Edad",
                    (() => {
                      const fecha = parsearFecha(watch("ninoFechaNacimiento") ?? "");
                      return fecha ? `${calcularEdad(fecha)} años` : "—";
                    })(),
                  ],
                  ["Categoría", categoria],
                  ["Programa", programaElegido?.nombre ?? "—"],
                  ["Horario", programaElegido?.horario ?? "—"],
                  ["Acudiente", watch("acudienteNombre") || "—"],
                ].map(([clave, valor]) => (
                  <div key={clave} className="flex justify-between gap-4 text-[15px]">
                    <dt className="text-texto-apagado">{clave}</dt>
                    <dd className="text-right font-semibold text-marino">{valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}

        {/* Navegación */}
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-marco pt-6">
          <button
            type="button"
            onClick={anterior}
            disabled={paso === 1 || enviando}
            className="rounded-boton px-5 py-3.5 font-titulo text-sm font-semibold uppercase tracking-[.09em] text-marino transition-colors hover:bg-hueso disabled:cursor-default disabled:text-texto-deshabilitado disabled:hover:bg-transparent"
          >
            ← Atrás
          </button>

          {paso < TOTAL_PASOS ? (
            <Boton onClick={siguiente} disabled={enviando}>
              Continuar →
            </Boton>
          ) : (
            <Boton type="submit" disabled={enviando}>
              {enviando ? "Enviando…" : "Enviar solicitud"}
            </Boton>
          )}
        </div>
      </div>
    </form>
  );
}
