/**
 * Cálculo de edad y categoría sugerida.
 *
 * El prototipo mostraba un campo "Categoría sugerida" de solo lectura ya
 * resuelto ("Infantil (8–10)"). Aquí se deriva de verdad a partir de la fecha
 * de nacimiento. Se usa en el cliente (para pintar el campo en vivo) y en el
 * servidor (para guardar el valor definitivo), así que no depende de React.
 */

export const EDAD_MINIMA = 5;
export const EDAD_MAXIMA = 17;

export type Categoria = {
  slug: string;
  nombre: string;
  etiqueta: string;
  edadMin: number;
  edadMax: number;
};

export const CATEGORIAS: Categoria[] = [
  { slug: "iniciacion", nombre: "Iniciación", etiqueta: "Iniciación (5–7)", edadMin: 5, edadMax: 7 },
  { slug: "infantil", nombre: "Infantil", etiqueta: "Infantil (8–10)", edadMin: 8, edadMax: 10 },
  { slug: "pre-juvenil", nombre: "Pre-juvenil", etiqueta: "Pre-juvenil (11–13)", edadMin: 11, edadMax: 13 },
  {
    slug: "juvenil",
    nombre: "Juvenil / Alto rendimiento",
    etiqueta: "Juvenil / Alto rendimiento (14–17)",
    edadMin: 14,
    edadMax: 17,
  },
];

/**
 * Edad cumplida a la fecha de referencia.
 * `referencia` se inyecta para que el servidor y las pruebas sean deterministas.
 */
export function calcularEdad(nacimiento: Date, referencia: Date = new Date()): number {
  let edad = referencia.getFullYear() - nacimiento.getFullYear();
  const mes = referencia.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && referencia.getDate() < nacimiento.getDate())) {
    edad -= 1;
  }
  return edad;
}

/** Parsea "AAAA-MM-DD" evitando el corrimiento de zona horaria de `new Date(string)`. */
export function parsearFecha(valor: string): Date | null {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor.trim());
  if (!partes) return null;

  const [, anio, mes, dia] = partes;
  const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));

  // Rechaza fechas imposibles que JS normalizaría en silencio (p. ej. 31 de febrero).
  if (
    fecha.getFullYear() !== Number(anio) ||
    fecha.getMonth() !== Number(mes) - 1 ||
    fecha.getDate() !== Number(dia)
  ) {
    return null;
  }
  return fecha;
}

/** Categoría que corresponde a una edad, o `null` si queda fuera del rango 5–17. */
export function categoriaPorEdad(edad: number): Categoria | null {
  return CATEGORIAS.find((c) => edad >= c.edadMin && edad <= c.edadMax) ?? null;
}

/**
 * Texto para el campo de solo lectura del paso 1.
 * Devuelve un mensaje explicativo cuando la fecha aún no permite decidir.
 */
export function categoriaSugerida(fechaISO: string, referencia?: Date): string {
  const fecha = parsearFecha(fechaISO);
  if (!fecha) return "Ingresa la fecha de nacimiento";

  const edad = calcularEdad(fecha, referencia);
  if (edad < EDAD_MINIMA) return `${edad} años · aún no alcanza la edad mínima`;
  if (edad > EDAD_MAXIMA) return `${edad} años · supera la edad máxima`;

  return categoriaPorEdad(edad)?.etiqueta ?? "Sin categoría";
}
