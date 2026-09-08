/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TEXTOS LEGALES — BORRADOR, NO REVISADO POR UN ABOGADO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El prototipo enlazaba estas tres páginas desde el footer pero no traía su
 * contenido. Lo que sigue es un ESQUELETO con las secciones que exige la Ley
 * 1581 de 2012 y su decreto reglamentario 1377 de 2013, con los datos concretos
 * marcados como pendientes.
 *
 * La política de tratamiento de datos es especialmente delicada porque la
 * escuela maneja datos de menores de edad, que la ley considera de tratamiento
 * restringido. NO publiques esto sin que lo revise un abogado.
 */
export const LEGAL_REVISADO = false;

export type Documento = {
  slug: string;
  titulo: string;
  antetitulo: string;
  descripcion: string;
  actualizado: string;
  secciones: { titulo: string; parrafos: string[] }[];
};

const PENDIENTE = "[Pendiente: dato por confirmar con la escuela]";

export const DOCUMENTOS_LEGALES: Documento[] = [
  {
    slug: "tratamiento-de-datos",
    titulo: "Política de tratamiento de datos personales",
    antetitulo: "Ley 1581 de 2012",
    descripcion:
      "Cómo la escuela recolecta, usa y protege los datos personales de los niños y sus acudientes.",
    actualizado: PENDIENTE,
    secciones: [
      {
        titulo: "1. Responsable del tratamiento",
        parrafos: [
          `Escuela de Béisbol Legado Diover Ávila, con NIT ${PENDIENTE}, domiciliada en ${PENDIENTE}, Moñitos, Córdoba.`,
          `Canales de atención: ${PENDIENTE} (correo) y ${PENDIENTE} (teléfono).`,
        ],
      },
      {
        titulo: "2. Datos que recolectamos",
        parrafos: [
          "Del menor: nombre completo, fecha de nacimiento, género, EPS, condiciones médicas o alergias, experiencia deportiva previa y posición preferida.",
          "Del acudiente: nombre completo, parentesco, número de cédula, teléfono de WhatsApp, correo electrónico y dirección de residencia.",
          "Documentos: fotografía del menor, registro civil o tarjeta de identidad, carnet de EPS y certificado médico de aptitud deportiva, cuando el acudiente decide aportarlos.",
        ],
      },
      {
        titulo: "3. Datos de menores de edad",
        parrafos: [
          "El tratamiento de datos de niños, niñas y adolescentes es de naturaleza restringida. Solo se realiza cuando responde al interés superior del menor, respeta sus derechos fundamentales y cuenta con la autorización previa del representante legal.",
          "La autorización la otorga el acudiente al completar el formulario de pre-inscripción, marcando de forma expresa la casilla correspondiente.",
        ],
      },
      {
        titulo: "4. Finalidades",
        parrafos: [
          "Gestionar la pre-inscripción y agendar la prueba deportiva.",
          "Contactar al acudiente por WhatsApp, teléfono o correo para el seguimiento del proceso.",
          "Conformar las categorías por edad y llevar el registro académico y deportivo del menor.",
          "Atender obligaciones legales y requerimientos de autoridades competentes.",
          "El uso de la imagen del menor en redes sociales y material de la escuela requiere una autorización separada y opcional: negarla no impide la inscripción ni afecta la prestación del servicio.",
        ],
      },
      {
        titulo: "5. Derechos del titular",
        parrafos: [
          "Conocer, actualizar y rectificar sus datos personales.",
          "Solicitar prueba de la autorización otorgada.",
          "Ser informado sobre el uso que se ha dado a sus datos.",
          "Presentar quejas ante la Superintendencia de Industria y Comercio.",
          "Revocar la autorización y solicitar la supresión de los datos cuando no exista un deber legal o contractual que lo impida.",
        ],
      },
      {
        titulo: "6. Procedimiento para ejercer los derechos",
        parrafos: [
          `Las consultas y reclamos se reciben en ${PENDIENTE}. Las consultas se atienden en un plazo máximo de diez (10) días hábiles y los reclamos en quince (15) días hábiles, conforme a los artículos 14 y 15 de la Ley 1581 de 2012.`,
        ],
      },
      {
        titulo: "7. Seguridad y conservación",
        parrafos: [
          "Los documentos aportados se almacenan cifrados en un repositorio privado, sin acceso público, y solo son consultables por el personal autorizado de la escuela.",
          `Los datos se conservan mientras dure la relación con la familia y por el término adicional que exija la ley. ${PENDIENTE}`,
        ],
      },
    ],
  },
  {
    slug: "privacidad",
    titulo: "Política de privacidad",
    antetitulo: "Sitio web",
    descripcion: "Qué información recoge este sitio web y cómo se utiliza.",
    actualizado: PENDIENTE,
    secciones: [
      {
        titulo: "Información que recoge el sitio",
        parrafos: [
          "Este sitio no utiliza cookies de publicidad ni de seguimiento de terceros.",
          "La única información personal que se recoge es la que el usuario envía voluntariamente a través del formulario de pre-inscripción, del formulario de patrocinio o del registro de interés en el portal de padres.",
        ],
      },
      {
        titulo: "Servicios de terceros",
        parrafos: [
          "Los datos de los formularios se almacenan en Supabase y los correos de confirmación se envían con Resend. El sitio se aloja en Vercel.",
          "Los videos se muestran embebidos desde YouTube en modo sin cookies, y solo se carga el reproductor cuando el usuario pulsa reproducir.",
        ],
      },
      {
        titulo: "Tratamiento de datos personales",
        parrafos: [
          "Todo lo relativo a datos personales de los menores y sus acudientes se rige por la política de tratamiento de datos, disponible en este mismo sitio.",
        ],
      },
    ],
  },
  {
    slug: "reglamento",
    titulo: "Reglamento interno",
    antetitulo: "Compromiso con la familia",
    descripcion: "Normas de convivencia, asistencia y compromiso académico de la escuela.",
    actualizado: PENDIENTE,
    secciones: [
      {
        titulo: "Documento pendiente",
        parrafos: [
          "La escuela debe entregar el texto definitivo del reglamento interno antes del lanzamiento del sitio.",
          "Debería cubrir al menos: horarios y política de puntualidad, requisitos de asistencia mínima, uniforme e implementos, conducta esperada de jugadores y acudientes, condiciones de pago de matrícula y mensualidad, causales de retiro y el compromiso de rendimiento académico que la escuela exige.",
          "Mientras tanto, el formulario de pre-inscripción sí exige aceptar este reglamento, así que publicarlo es un requisito previo a poner el sitio en producción.",
        ],
      },
    ],
  },
];

export function documentoLegal(slug: string): Documento | undefined {
  return DOCUMENTOS_LEGALES.find((d) => d.slug === slug);
}
