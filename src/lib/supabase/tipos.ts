/**
 * Tipos de la base de datos.
 *
 * Escritos a mano para que el repo compile sin una instancia de Supabase
 * corriendo. Deben regenerarse cuando cambie el esquema:
 *
 *   npx supabase gen types typescript --local > src/lib/supabase/tipos.ts
 *
 * (o `--project-id <ref>` contra el proyecto remoto).
 */

export type EstadoInscripcion =
  | "nuevo"
  | "contactado"
  | "prueba_programada"
  | "inscrito"
  | "rechazado";

export type TipoEvento =
  | "entrenamiento"
  | "torneo"
  | "reunion"
  | "clinica"
  | "amistoso"
  | "evaluacion"
  | "vacacional";

export type NivelPatrocinio = "oro" | "plata" | "bronce" | "aliado";

export type Programa = {
  id: string;
  slug: string;
  nombre: string;
  edad_min: number | null;
  edad_max: number | null;
  edad_label: string;
  enfoque: string;
  dias: string;
  horario: string;
  sede: string;
  cupos_label: string;
  foto_alt: string;
  orden: number;
  destacado: boolean;
  activo: boolean;
  created_at: string;
};

export type Noticia = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string | null;
  fecha: string;
  foto_alt: string;
  publicado: boolean;
  created_at: string;
};

export type Evento = {
  id: string;
  titulo: string;
  detalle: string | null;
  fecha: string;
  tipo: TipoEvento;
  publicado: boolean;
  created_at: string;
};

export type Testimonio = {
  id: string;
  cita: string;
  autor: string;
  orden: number;
  publicado: boolean;
  created_at: string;
};

export type Patrocinador = {
  id: string;
  nombre: string;
  logo_url: string | null;
  nivel: NivelPatrocinio;
  url: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
};

export type Inscripcion = {
  id: string;
  created_at: string;
  estado: EstadoInscripcion;
  nino_nombre: string;
  nino_fecha_nacimiento: string;
  nino_genero: string;
  categoria_sugerida: string;
  nino_posicion: string | null;
  nino_experiencia: string | null;
  nino_eps: string | null;
  nino_condiciones_medicas: string | null;
  acudiente_nombre: string;
  acudiente_parentesco: string;
  acudiente_cedula: string;
  acudiente_whatsapp: string;
  acudiente_correo: string;
  acudiente_direccion: string | null;
  programa_id: string | null;
  como_nos_conocio: string | null;
  doc_foto: string | null;
  doc_identidad: string | null;
  doc_eps: string | null;
  doc_medico: string | null;
  consent_imagen: boolean;
  consent_datos: boolean;
  consent_reglamento: boolean;
  notas_admin: string | null;
};

export type PortalInteres = {
  id: string;
  correo: string;
  created_at: string;
};

/**
 * Forma que espera `@supabase/supabase-js` para cada tabla. Las cinco tablas de
 * contenido son de solo lectura desde la app (RLS solo permite SELECT), pero
 * igual declaran Insert/Update porque el cliente los exige para inferir tipos.
 */
type Tabla<Fila, Requeridos extends keyof Fila = never> = {
  Row: Fila;
  Insert: Pick<Fila, Requeridos> & Partial<Omit<Fila, Requeridos>>;
  Update: Partial<Fila>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      programas: Tabla<Programa>;
      noticias: Tabla<Noticia>;
      eventos: Tabla<Evento>;
      testimonios: Tabla<Testimonio>;
      patrocinadores: Tabla<Patrocinador>;
      inscripciones: Tabla<
        Inscripcion,
        | "nino_nombre"
        | "nino_fecha_nacimiento"
        | "nino_genero"
        | "categoria_sugerida"
        | "acudiente_nombre"
        | "acudiente_parentesco"
        | "acudiente_cedula"
        | "acudiente_whatsapp"
        | "acudiente_correo"
        | "consent_datos"
        | "consent_reglamento"
      >;
      portal_interes: Tabla<PortalInteres, "correo">;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      estado_inscripcion: EstadoInscripcion;
      tipo_evento: TipoEvento;
      nivel_patrocinio: NivelPatrocinio;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
