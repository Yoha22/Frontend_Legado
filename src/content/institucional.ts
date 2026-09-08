/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CONTENIDO INSTITUCIONAL — REQUIERE REVISIÓN DE LA ESCUELA ANTES DE PUBLICAR
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El prototipo de Claude Design traía estos campos marcados como "Texto
 * pendiente" y "Nombre pendiente". Por decisión del cliente se redactó texto
 * plausible para que el sitio se pueda ver terminado, PERO nada de lo que sigue
 * ha sido confirmado por la escuela.
 *
 * Es invención y hay que verificarlo antes del lanzamiento:
 *
 *   · HISTORIA          — la biografía de Diover Ávila. Es una persona real.
 *   · LINEA_TIEMPO      — todas las fechas (1998, 2008, 2014, 2021).
 *   · MISION_VISION     — misión y visión.
 *   · ENTRENADORES      — los cuatro nombres y sus trayectorias son ficticios.
 *   · CIFRAS            — 12 años, 340 niños, 18 torneos, 7 jugadores.
 *   · CONTACTO          — teléfonos, correo y dirección son marcadores.
 *   · NIVELES_PATROCINIO — los precios en pesos son una propuesta, no una tarifa.
 *
 * Lo que sí viene del prototipo y está aprobado: diferenciadores, objetivos,
 * requisitos, preguntas frecuentes y beneficios de patrocinio.
 */
export const REVISADO = false;

// ── Navegación ──────────────────────────────────────────────────────────────

export const NAVEGACION = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/programas", etiqueta: "Programas" },
  { href: "/galeria", etiqueta: "Galería" },
  { href: "/inscripciones", etiqueta: "Inscripciones" },
  { href: "/noticias", etiqueta: "Noticias" },
  { href: "/patrocinadores", etiqueta: "Patrocinadores" },
  { href: "/contacto", etiqueta: "Contacto" },
  { href: "/portal", etiqueta: "Portal" },
] as const;

export const COLUMNAS_FOOTER = [
  {
    titulo: "Escuela",
    enlaces: [
      { href: "/nosotros", etiqueta: "Nosotros" },
      { href: "/programas", etiqueta: "Programas" },
      { href: "/galeria", etiqueta: "Galería" },
      { href: "/noticias", etiqueta: "Noticias" },
    ],
  },
  {
    titulo: "Familias",
    enlaces: [
      { href: "/inscripciones", etiqueta: "Inscripciones" },
      { href: "/inscripciones#requisitos", etiqueta: "Requisitos" },
      { href: "/inscripciones#preguntas", etiqueta: "Preguntas frecuentes" },
      { href: "/portal", etiqueta: "Portal de padres" },
    ],
  },
  {
    titulo: "Aliados",
    enlaces: [
      { href: "/patrocinadores", etiqueta: "Patrocinadores" },
      { href: "/patrocinadores#niveles", etiqueta: "Sé patrocinador" },
      { href: "/patrocinadores#contacto", etiqueta: "Apadrina un jugador" },
      { href: "/contacto", etiqueta: "Contacto" },
    ],
  },
] as const;

// ── Inicio ──────────────────────────────────────────────────────────────────

export const CIFRAS = [
  { valor: "12", etiqueta: "Años de trayectoria" },
  { valor: "340", etiqueta: "Niños formados" },
  { valor: "18", etiqueta: "Torneos ganados" },
  { valor: "7", etiqueta: "Jugadores en selecciones" },
] as const;

export const DIFERENCIADORES = [
  {
    numero: "01",
    titulo: "Metodología por edades",
    cuerpo: "Cada categoría tiene su plan técnico. Nada de juntar a todos en el mismo entrenamiento.",
  },
  {
    numero: "02",
    titulo: "Formación en valores",
    cuerpo: "Puntualidad, respeto y estudio primero. Se firma un compromiso con la familia.",
  },
  {
    numero: "03",
    titulo: "Cuerpo técnico titulado",
    cuerpo: "Entrenadores con experiencia profesional y certificación en formación deportiva.",
  },
  {
    numero: "04",
    titulo: "Ruta al alto rendimiento",
    cuerpo: "Evaluaciones periódicas, video y contacto con scouts para los juveniles.",
  },
] as const;

export const FOTOS_INICIO = [
  "Foto: bateo",
  "Foto: celebración",
  "Foto: entrenador y niño",
  "Foto: equipo completo",
] as const;

export const VIDEO_DESTACADO_INICIO = "Video destacado: resumen del torneo departamental";

export const VIDEO_HERO = "Video en loop: entrenamiento en el campo, 15 s, sin audio";

// ── Nosotros ────────────────────────────────────────────────────────────────

export const HISTORIA = {
  fotoAlt: "Retrato de Diover Ávila en el campo, vertical",
  parrafos: [
    "Diover Ávila entendió antes que nadie en Moñitos que un guante prestado podía cambiarle el rumbo a un niño. Durante más de dos décadas entrenó en canchas improvisadas del municipio, con pelotas remendadas y sin más presupuesto que su tiempo, convencido de que la disciplina del béisbol servía tanto para fildear un roletazo como para llegar puntual al colegio.",
    "La palabra «Legado» no la escogimos por nostalgia. La escogimos porque lo que él construyó no se acabó con él: sus exalumnos volvieron a dirigir, las familias del sector siguieron llevando a sus hijos y su forma de enseñar —primero la persona, después el pelotero— quedó escrita en la metodología que hoy usamos en todas las categorías.",
  ],
} as const;

export const LINEA_TIEMPO = [
  {
    anio: "1998",
    texto: "Diover Ávila comienza a entrenar niños en las canchas de barrio de Moñitos, con implementos prestados.",
  },
  { anio: "2008", texto: "El primer equipo formado por él llega a la final departamental de Córdoba." },
  { anio: "2014", texto: "Se consolida la metodología por categorías de edad que hoy sigue usando la escuela." },
  { anio: "2021", texto: "La familia y un grupo de exalumnos fundan formalmente la escuela con su nombre." },
  { anio: "Hoy", texto: "Más de 340 niños formados y siete jugadores en selecciones departamentales." },
] as const;

export const MISION_VISION = [
  {
    icono: "M",
    titulo: "Misión",
    cuerpo:
      "Formar niños y jóvenes íntegros a través del béisbol, combinando preparación técnica seria, acompañamiento familiar y una exigencia de disciplina que les sirva dentro y fuera del campo.",
  },
  {
    icono: "V",
    titulo: "Visión",
    cuerpo:
      "Ser en 2030 la escuela de formación de referencia en la costa de Córdoba, reconocida tanto por la calidad técnica de sus egresados como por el trato humano con las familias del municipio.",
  },
  {
    icono: "★",
    titulo: "Valores",
    cuerpo: "Respeto, puntualidad, trabajo en equipo, honestidad y responsabilidad con el estudio.",
  },
] as const;

export const OBJETIVOS = [
  {
    tipo: "Formativos",
    items: [
      "Enseñar los fundamentos del béisbol por etapas de desarrollo",
      "Reforzar hábitos de estudio y puntualidad",
      "Involucrar a la familia en el proceso",
    ],
  },
  {
    tipo: "Deportivos",
    items: [
      "Competir en las ligas departamentales de cada categoría",
      "Preparar juveniles para showcases y pruebas",
      "Evaluar el progreso técnico cada trimestre",
    ],
  },
  {
    tipo: "Sociales",
    items: [
      "Ofrecer becas a niños de bajos recursos",
      "Ocupar el tiempo libre con actividad deportiva",
      "Construir comunidad entre las familias del municipio",
    ],
  },
] as const;

/** ⚠ Nombres y trayectorias ficticios. Reemplazar con el cuerpo técnico real. */
export const ENTRENADORES = [
  {
    nombre: "Rafael Ospino",
    cargo: "Director técnico",
    bio: "Veinte años dirigiendo categorías menores en Córdoba. Especialidad: bateo y planificación de temporada.",
    fotoAlt: "Foto: entrenador principal",
  },
  {
    nombre: "Édinson Petro",
    cargo: "Entrenador de pitcheo",
    bio: "Exlanzador de liga departamental, certificado en formación deportiva. Especialidad: mecánica de lanzamiento.",
    fotoAlt: "Foto: entrenador de pitcheo",
  },
  {
    nombre: "Jairo Berrío",
    cargo: "Entrenador de defensa",
    bio: "Formado en la escuela desde niño y hoy parte del cuerpo técnico. Especialidad: cuadro interior y cátcher.",
    fotoAlt: "Foto: entrenador de defensa",
  },
  {
    nombre: "Luis Carlos Támara",
    cargo: "Preparador físico",
    bio: "Licenciado en educación física, a cargo del trabajo por edades. Especialidad: movilidad y prevención de lesiones.",
    fotoAlt: "Foto: preparador físico",
  },
] as const;

// ── Inscripciones ───────────────────────────────────────────────────────────

export const REQUISITOS = [
  "Edad entre 5 y 17 años cumplidos",
  "Registro civil o tarjeta de identidad",
  "Carnet de EPS vigente",
  "Certificado médico de aptitud deportiva",
  "Guante y gorra propios (se pueden comprar en la escuela)",
] as const;

export const PREGUNTAS_FRECUENTES = [
  {
    pregunta: "¿Hay que pagar algo al inscribirse?",
    respuesta: "No. La pre-inscripción es gratuita; el pago de matrícula se hace después de la prueba.",
  },
  {
    pregunta: "¿Qué pasa si mi hijo nunca ha jugado?",
    respuesta:
      "La mayoría entra sin experiencia. Se ubica en la categoría de su edad y empieza por fundamentos.",
  },
  {
    pregunta: "¿Cuándo es la prueba?",
    respuesta:
      "Te la agendamos por WhatsApp dentro de las 24 horas siguientes al envío del formulario.",
  },
  {
    pregunta: "¿Hay becas?",
    respuesta: "Sí, un número limitado por semestre. Se solicitan en la reunión con la dirección.",
  },
] as const;

export const DOCUMENTOS = [
  { campo: "docFoto", nombre: "Foto del niño", ayuda: "JPG o PNG · máx. 5 MB" },
  { campo: "docIdentidad", nombre: "Registro civil o TI", ayuda: "PDF o imagen · máx. 5 MB" },
  { campo: "docEps", nombre: "Carnet de EPS", ayuda: "PDF o imagen · máx. 5 MB" },
  { campo: "docMedico", nombre: "Certificado médico", ayuda: "Opcional en esta etapa" },
] as const;

export const OPCIONES = {
  genero: ["Masculino", "Femenino"],
  parentesco: ["Madre", "Padre", "Abuelo / abuela", "Otro"],
  posicion: ["Sin definir", "Lanzador", "Cátcher", "Cuadro interior", "Jardinero"],
  experiencia: ["Ninguna", "Menos de 1 año", "1 a 3 años", "Más de 3 años"],
  comoNosConocio: [
    "Instagram",
    "Recomendación de otra familia",
    "Facebook",
    "Pasé por el campo",
    "Búsqueda en Google",
  ],
} as const;

// ── Patrocinadores ──────────────────────────────────────────────────────────

/** ⚠ Precios propuestos en el prototipo, sin confirmar con la escuela. */
export const NIVELES_PATROCINIO = [
  {
    nombre: "Bronce",
    precio: 500_000,
    periodo: "por semestre",
    destacado: false,
    beneficios: ["Logo en la web", "Mención en redes una vez al mes", "Invitación a torneos propios"],
  },
  {
    nombre: "Plata",
    precio: 1_200_000,
    periodo: "por semestre",
    destacado: true,
    beneficios: [
      "Todo lo de Bronce",
      "Logo en el uniforme de entrenamiento",
      "Valla en el campo",
      "Apadrinamiento de un jugador",
    ],
  },
  {
    nombre: "Oro",
    precio: 2_500_000,
    periodo: "por semestre",
    destacado: false,
    beneficios: [
      "Todo lo de Plata",
      "Logo en el uniforme de juego",
      "Nombre en el torneo anual",
      "Presencia en eventos de la escuela",
    ],
  },
] as const;

export const NIVELES_INTERES = ["Oro", "Plata", "Bronce", "Apadrinar un jugador"] as const;

// ── Contacto ────────────────────────────────────────────────────────────────

/** ⚠ Datos de contacto de ejemplo. Reemplazar por los reales antes de publicar. */
export const CONTACTO = {
  telefonoFijo: "(604) 000 0000",
  correo: "hola@legadodioveravila.com",
  direccion: "Campo de béisbol [dirección pendiente], Moñitos, Córdoba.",
  horarios: "Lunes a viernes, 3:00 p.m. – 7:00 p.m. · Sábados, 8:00 a.m. – 12:00 m.",
  mapaAlt: "Mapa de Google embebido: sede principal, Moñitos",
} as const;

export const REDES = [
  { nombre: "Instagram", url: "https://instagram.com/" },
  { nombre: "Facebook", url: "https://facebook.com/" },
  { nombre: "TikTok", url: "https://tiktok.com/" },
  { nombre: "YouTube", url: "https://youtube.com/" },
] as const;

// ── Galería (marcadores hasta que lleguen las fotos reales) ──────────────────

export type ElementoGaleria = {
  etiqueta: string;
  categoria: string;
  tipo: "foto" | "video";
  evento: string;
  /** ID de YouTube. `null` mientras no haya video real cargado. */
  youtubeId?: string | null;
};

export const GALERIA: ElementoGaleria[] = [
  { etiqueta: "Entrenamiento de bateo", categoria: "Infantil", tipo: "foto", evento: "Entrenamientos" },
  { etiqueta: "Final departamental", categoria: "Pre-juvenil", tipo: "foto", evento: "Torneos" },
  { etiqueta: "Calentamiento matutino", categoria: "Iniciación", tipo: "foto", evento: "Entrenamientos" },
  {
    etiqueta: "Video: highlights del torneo",
    categoria: "Juvenil",
    tipo: "video",
    evento: "Torneos",
    youtubeId: null,
  },
  { etiqueta: "Premiación 2025", categoria: "Todas", tipo: "foto", evento: "Torneos" },
  {
    etiqueta: "Video: testimonio de una familia",
    categoria: "Infantil",
    tipo: "video",
    evento: "Testimonios",
    youtubeId: null,
  },
  { etiqueta: "Práctica de fildeo", categoria: "Pre-juvenil", tipo: "foto", evento: "Entrenamientos" },
  { etiqueta: "Clínica de pitcheo", categoria: "Juvenil", tipo: "foto", evento: "Clínicas" },
  {
    etiqueta: "Video: cápsula de valores",
    categoria: "Todas",
    tipo: "video",
    evento: "Testimonios",
    youtubeId: null,
  },
  { etiqueta: "Uniformes nuevos", categoria: "Todas", tipo: "foto", evento: "Entrenamientos" },
  { etiqueta: "Vacacional diciembre", categoria: "Iniciación", tipo: "foto", evento: "Clínicas" },
  { etiqueta: "Video: resumen del año", categoria: "Todas", tipo: "video", evento: "Torneos", youtubeId: null },
];

export const FILTROS_GALERIA = [
  "Todo",
  "Fotos",
  "Videos",
  "Entrenamientos",
  "Torneos",
  "Clínicas",
  "Testimonios",
] as const;
