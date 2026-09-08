/** Formateo de fechas, meses y moneda en español de Colombia. */

const MESES_CORTOS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const MESES_LARGOS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Convierte "AAAA-MM-DD" (lo que devuelve Postgres para `date`) en una fecha
 * local. Usar `new Date("2026-06-24")` la interpretaría como UTC y en Colombia
 * (UTC-5) mostraría el día anterior.
 */
export function fechaDesdeISO(iso: string): Date {
  const [anio, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

/** "24 May 2026" — el formato de las cards de noticias del prototipo. */
export function fechaCorta(iso: string): string {
  const f = fechaDesdeISO(iso);
  return `${String(f.getDate()).padStart(2, "0")} ${MESES_CORTOS[f.getMonth()]} ${f.getFullYear()}`;
}

/** "24 de mayo de 2026" — para `<time>` y textos corridos. */
export function fechaLarga(iso: string): string {
  const f = fechaDesdeISO(iso);
  return `${f.getDate()} de ${MESES_LARGOS[f.getMonth()].toLowerCase()} de ${f.getFullYear()}`;
}

/** Día y mes separados, como el bloque de "Próximos eventos". */
export function diaYMes(iso: string): { dia: string; mes: string } {
  const f = fechaDesdeISO(iso);
  return { dia: String(f.getDate()).padStart(2, "0"), mes: MESES_CORTOS[f.getMonth()] };
}

/** "Junio 2026" — encabezado del calendario. */
export function mesYAnio(anio: number, mes: number): string {
  return `${MESES_LARGOS[mes]} ${anio}`;
}

export function nombreMes(mes: number): string {
  return MESES_LARGOS[mes];
}

/** "$1.200.000" en pesos colombianos, sin decimales. */
export function pesos(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

/** Deja solo dígitos: para construir enlaces `wa.me` y `tel:`. */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** "+57 300 000 0000" a partir de un número en crudo. */
export function telefonoLegible(valor: string): string {
  const d = soloDigitos(valor);
  const nacional = d.startsWith("57") ? d.slice(2) : d;
  if (nacional.length !== 10) return valor;
  return `+57 ${nacional.slice(0, 3)} ${nacional.slice(3, 6)} ${nacional.slice(6)}`;
}
