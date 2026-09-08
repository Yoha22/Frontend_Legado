import type { Evento, Noticia, Patrocinador, Programa, Testimonio } from "@/lib/supabase/tipos";

/**
 * Copia local de `supabase/seed.sql`.
 *
 * Sirve para que `npm run dev` muestre el sitio completo aunque todavía no
 * existan credenciales de Supabase — es lo primero que hará quien reciba este
 * repo. Las consultas caen aquí cuando la base no está configurada o responde
 * con error, y en ese caso se registra un aviso en consola.
 *
 * IMPORTANTE: si editas el seed, edita también este archivo. La fuente de
 * verdad en producción siempre es la base de datos.
 */

const AHORA = "2026-01-01T00:00:00.000Z";

export const PROGRAMAS_RESPALDO: Programa[] = [
  {
    id: "respaldo-iniciacion",
    slug: "iniciacion",
    nombre: "Iniciación",
    edad_min: 5,
    edad_max: 7,
    edad_label: "5–7",
    enfoque: "Motricidad, juego y primeros fundamentos. Sin competencia formal.",
    dias: "Sáb",
    horario: "8:00 – 10:00 a.m.",
    sede: "Sede norte",
    cupos_label: "6 disponibles",
    foto_alt: "Foto: niños pequeños con tee",
    orden: 1,
    destacado: true,
    activo: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-infantil",
    slug: "infantil",
    nombre: "Infantil",
    edad_min: 8,
    edad_max: 10,
    edad_label: "8–10",
    enfoque: "Fundamentos técnicos, reglas del juego y trabajo en equipo.",
    dias: "Mar · Jue · Sáb",
    horario: "4:00 – 6:00 p.m.",
    sede: "Sede norte",
    cupos_label: "9 disponibles",
    foto_alt: "Foto: práctica de bateo",
    orden: 2,
    destacado: true,
    activo: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-pre-juvenil",
    slug: "pre-juvenil",
    nombre: "Pre-juvenil",
    edad_min: 11,
    edad_max: 13,
    edad_label: "11–13",
    enfoque: "Técnica avanzada, lectura de juego y fundamentos tácticos.",
    dias: "Lun · Mié · Vie",
    horario: "4:00 – 6:30 p.m.",
    sede: "Sede sur",
    cupos_label: "4 disponibles",
    foto_alt: "Foto: fildeo en el cuadro",
    orden: 3,
    destacado: true,
    activo: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-juvenil",
    slug: "juvenil",
    nombre: "Juvenil / Alto rendimiento",
    edad_min: 14,
    edad_max: 17,
    edad_label: "14–17",
    enfoque: "Preparación competitiva, física y exposición a showcases.",
    dias: "Lun a Vie",
    horario: "5:00 – 8:00 p.m.",
    sede: "Sede sur",
    cupos_label: "Cupos cerrados",
    foto_alt: "Foto: lanzador en el montículo",
    orden: 4,
    destacado: true,
    activo: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-vacacionales",
    slug: "vacacionales",
    nombre: "Vacacionales",
    edad_min: 5,
    edad_max: 15,
    edad_label: "5–15",
    enfoque: "Intensivos de dos semanas en junio y diciembre.",
    dias: "Lun a Sáb",
    horario: "8:00 a.m. – 12:00 m.",
    sede: "Sede norte",
    cupos_label: "Abre en mayo",
    foto_alt: "Foto: grupo del vacacional",
    orden: 5,
    destacado: false,
    activo: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-clinicas",
    slug: "clinicas",
    nombre: "Clínicas especializadas",
    edad_min: null,
    edad_max: null,
    edad_label: "Todas",
    enfoque: "Pitcheo, cátcher y bateo con entrenadores invitados.",
    dias: "Un sábado al mes",
    horario: "9:00 a.m. – 1:00 p.m.",
    sede: "Sede sur",
    cupos_label: "Por convocatoria",
    foto_alt: "Foto: clínica de pitcheo",
    orden: 6,
    destacado: false,
    activo: true,
    created_at: AHORA,
  },
];

export const TESTIMONIOS_RESPALDO: Testimonio[] = [
  {
    id: "respaldo-t1",
    cita: "Mi hijo llegó tímido y hoy es capitán de su categoría. Aquí no solo le enseñan béisbol, le enseñan a comportarse.",
    autor: "Marta P., mamá de Samuel · Infantil",
    orden: 1,
    publicado: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-t2",
    cita: "Los entrenadores conocen a cada niño por su nombre y saben qué necesita mejorar. Eso no se paga.",
    autor: "Jorge R., papá de Andrés · Pre-juvenil",
    orden: 2,
    publicado: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-t3",
    cita: "Entré a los nueve años sin saber agarrar un guante. Ahora juego en la selección Córdoba.",
    autor: "Camilo D., exalumno · Juvenil",
    orden: 3,
    publicado: true,
    created_at: AHORA,
  },
];

export const EVENTOS_RESPALDO: Evento[] = [
  { id: "respaldo-e1", titulo: "Entrenamiento", detalle: null, fecha: "2026-06-04", tipo: "entrenamiento", publicado: true, created_at: AHORA },
  { id: "respaldo-e2", titulo: "Torneo local sub-12", detalle: "Sede norte · fase de grupos, todo el día.", fecha: "2026-06-06", tipo: "torneo", publicado: true, created_at: AHORA },
  { id: "respaldo-e3", titulo: "Reunión de padres", detalle: "Informe del semestre y calendario de vacacionales.", fecha: "2026-06-11", tipo: "reunion", publicado: true, created_at: AHORA },
  { id: "respaldo-e4", titulo: "Torneo local", detalle: null, fecha: "2026-06-13", tipo: "torneo", publicado: true, created_at: AHORA },
  { id: "respaldo-e5", titulo: "Clínica de pitcheo", detalle: "Con entrenador invitado. Cupos por convocatoria.", fecha: "2026-06-18", tipo: "clinica", publicado: true, created_at: AHORA },
  { id: "respaldo-e6", titulo: "Amistoso", detalle: null, fecha: "2026-06-20", tipo: "amistoso", publicado: true, created_at: AHORA },
  { id: "respaldo-e7", titulo: "Evaluaciones", detalle: "Evaluación técnica trimestral por categoría.", fecha: "2026-06-25", tipo: "evaluacion", publicado: true, created_at: AHORA },
  { id: "respaldo-e8", titulo: "Inicio vacacional", detalle: "Arranca el intensivo de dos semanas.", fecha: "2026-06-27", tipo: "vacacional", publicado: true, created_at: AHORA },
];

export const NOTICIAS_RESPALDO: Noticia[] = [
  {
    id: "respaldo-n1",
    slug: "sub-12-campeon-cordoba",
    titulo: "Sub-12 campeón del torneo de Córdoba",
    resumen: "El equipo cerró invicto la fase final. Resumen del partido y palabras del cuerpo técnico.",
    contenido: null,
    fecha: "2026-05-24",
    foto_alt: "Foto: equipo con trofeo",
    publicado: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-n2",
    slug: "dos-juveniles-a-la-seleccion",
    titulo: "Dos juveniles convocados a la selección departamental",
    resumen: "Los resultados de las evaluaciones de abril abrieron la puerta a la convocatoria.",
    contenido: null,
    fecha: "2026-05-12",
    foto_alt: "Foto: jugador firmando",
    publicado: true,
    created_at: AHORA,
  },
  {
    id: "respaldo-n3",
    slug: "becas-segundo-semestre",
    titulo: "Abren las becas del segundo semestre",
    resumen: "Diez cupos para familias del sector. Requisitos y fechas de postulación.",
    contenido: null,
    fecha: "2026-05-03",
    foto_alt: "Foto: entrega de becas",
    publicado: true,
    created_at: AHORA,
  },
];

export const PATROCINADORES_RESPALDO: Patrocinador[] = [
  { id: "respaldo-p1", nombre: "Logo aliado 1", logo_url: null, nivel: "oro", url: null, orden: 1, activo: true, created_at: AHORA },
  { id: "respaldo-p2", nombre: "Logo aliado 2", logo_url: null, nivel: "plata", url: null, orden: 2, activo: true, created_at: AHORA },
  { id: "respaldo-p3", nombre: "Logo aliado 3", logo_url: null, nivel: "plata", url: null, orden: 3, activo: true, created_at: AHORA },
  { id: "respaldo-p4", nombre: "Logo aliado 4", logo_url: null, nivel: "bronce", url: null, orden: 4, activo: true, created_at: AHORA },
  { id: "respaldo-p5", nombre: "Logo aliado 5", logo_url: null, nivel: "bronce", url: null, orden: 5, activo: true, created_at: AHORA },
];
