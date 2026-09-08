"use client";

import { useMemo, useState } from "react";
import type { Evento } from "@/lib/supabase/tipos";
import { fechaDesdeISO, fechaLarga, mesYAnio } from "@/lib/utils/formato";
import { cn } from "@/lib/utils/cn";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/**
 * Calendario mensual navegable.
 *
 * El prototipo tenía "Junio 2026" quemado en el código y una rejilla fija de 35
 * celdas. Aquí el mes es real y se calcula el número de semanas que hace falta.
 *
 * En móvil la rejilla de 7 columnas con celdas de 96px es ilegible, así que por
 * debajo de `md` se muestra una agenda: la lista de eventos del mes en orden.
 */
export function Calendario({ eventos }: { eventos: Evento[] }) {
  // Arranca en el mes del próximo evento; si ya pasaron todos, en el del último.
  const inicial = useMemo(() => {
    const hoy = new Date();
    const hoyISO = hoy.toISOString().slice(0, 10);
    const referencia = eventos.find((e) => e.fecha >= hoyISO) ?? eventos[eventos.length - 1];
    const fecha = referencia ? fechaDesdeISO(referencia.fecha) : hoy;
    return { anio: fecha.getFullYear(), mes: fecha.getMonth() };
  }, [eventos]);

  const [{ anio, mes }, setMes] = useState(inicial);

  const porDia = useMemo(() => {
    const mapa = new Map<string, Evento[]>();
    for (const evento of eventos) {
      const lista = mapa.get(evento.fecha) ?? [];
      lista.push(evento);
      mapa.set(evento.fecha, lista);
    }
    return mapa;
  }, [eventos]);

  const clave = (dia: number) =>
    `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const desplazamiento = new Date(anio, mes, 1).getDay();
  const totalCeldas = Math.ceil((desplazamiento + diasEnMes) / 7) * 7;

  const delMes = eventos
    .filter((e) => e.fecha.startsWith(`${anio}-${String(mes + 1).padStart(2, "0")}`))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  function mover(delta: number) {
    setMes(({ anio: a, mes: m }) => {
      const fecha = new Date(a, m + delta, 1);
      return { anio: fecha.getFullYear(), mes: fecha.getMonth() };
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2
          aria-live="polite"
          className="font-titulo text-[22px] font-semibold uppercase tracking-[.02em] text-marino md:text-[30px]"
        >
          {mesYAnio(anio, mes)}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => mover(-1)}
            aria-label="Mes anterior"
            className="rounded-boton border border-marco bg-white px-3.5 py-2 text-texto-tenue transition-colors hover:bg-hueso"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            aria-label="Mes siguiente"
            className="rounded-boton border border-marco bg-white px-3.5 py-2 text-texto-tenue transition-colors hover:bg-hueso"
          >
            →
          </button>
        </div>
      </div>

      {/* Rejilla: solo desde md */}
      <div className="hidden overflow-hidden rounded-card border border-marco bg-white md:block">
        <div className="grid grid-cols-7 border-b border-marco bg-hueso">
          {DIAS.map((dia) => (
            <div
              key={dia}
              className="p-3 text-center text-[11px] font-semibold uppercase tracking-[.16em] text-texto-tenue"
            >
              {dia}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: totalCeldas }, (_, i) => {
            const numero = i - desplazamiento + 1;
            const dentro = numero >= 1 && numero <= diasEnMes;
            const delDia = dentro ? (porDia.get(clave(numero)) ?? []) : [];

            return (
              <div
                key={i}
                className={cn(
                  "min-h-24 border-b border-r border-marco-suave p-2.5",
                  dentro ? "bg-white" : "bg-arena",
                )}
              >
                <p
                  className={cn(
                    "mb-2 font-titulo text-sm font-semibold",
                    dentro ? "text-marino" : "text-transparent",
                  )}
                >
                  {dentro ? numero : ""}
                </p>
                {delDia.map((evento) => (
                  <p
                    key={evento.id}
                    className="mb-1 rounded-[4px] border-l-2 border-rojo bg-rojo-suave px-1.5 py-1 text-[11px] leading-tight text-rojo-oscuro"
                  >
                    {evento.titulo}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Agenda: solo en móvil */}
      <div className="md:hidden">
        {delMes.length === 0 ? (
          <p className="rounded-card border border-marco bg-white p-5 text-[15px] text-texto-suave">
            No hay eventos programados este mes.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {delMes.map((evento) => (
              <li
                key={evento.id}
                className="flex gap-4 rounded-card border border-marco bg-white p-4"
              >
                <time dateTime={evento.fecha} className="shrink-0 text-center">
                  <span className="block font-titulo text-2xl font-bold leading-none text-marino">
                    {fechaDesdeISO(evento.fecha).getDate()}
                  </span>
                  <span className="mt-1 block text-[11px] uppercase tracking-[.12em] text-rojo">
                    {DIAS[fechaDesdeISO(evento.fecha).getDay()]}
                  </span>
                  <span className="sr-only">{fechaLarga(evento.fecha)}</span>
                </time>
                <div className="border-l border-marco pl-4">
                  <p className="font-titulo text-base font-semibold uppercase tracking-[.03em] text-marino">
                    {evento.titulo}
                  </p>
                  {evento.detalle ? (
                    <p className="mt-1 text-sm leading-relaxed text-texto-suave">{evento.detalle}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
