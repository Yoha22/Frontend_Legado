-- ═══════════════════════════════════════════════════════════════════════════
--  Esquema base — Escuela de Béisbol Legado Diover Ávila
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── Tipos ───────────────────────────────────────────────────────────────────

create type estado_inscripcion as enum (
  'nuevo',
  'contactado',
  'prueba_programada',
  'inscrito',
  'rechazado'
);

create type tipo_evento as enum (
  'entrenamiento',
  'torneo',
  'reunion',
  'clinica',
  'amistoso',
  'evaluacion',
  'vacacional'
);

create type nivel_patrocinio as enum ('oro', 'plata', 'bronce', 'aliado');

-- ── Programas ───────────────────────────────────────────────────────────────

create table public.programas (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  nombre        text not null,
  -- Nulos en programas sin rango fijo ("Clínicas especializadas: todas las edades").
  edad_min      smallint,
  edad_max      smallint,
  edad_label    text not null,
  enfoque       text not null,
  dias          text not null,
  horario       text not null,
  sede          text not null,
  cupos_label   text not null,
  foto_alt      text not null,
  orden         smallint not null default 0,
  -- Los cuatro destacados que el inicio y el paso 3 del wizard muestran.
  destacado     boolean not null default false,
  activo        boolean not null default true,
  created_at    timestamptz not null default now(),

  constraint programas_edades_coherentes
    check (edad_min is null or edad_max is null or edad_min <= edad_max)
);

create index programas_orden_idx on public.programas (orden) where activo;

-- ── Noticias ────────────────────────────────────────────────────────────────

create table public.noticias (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  titulo      text not null,
  resumen     text not null,
  contenido   text,
  fecha       date not null,
  foto_alt    text not null,
  publicado   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index noticias_fecha_idx on public.noticias (fecha desc) where publicado;

-- ── Eventos (calendario + "Próximos eventos" del inicio) ────────────────────

create table public.eventos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  detalle     text,
  fecha       date not null,
  tipo        tipo_evento not null default 'entrenamiento',
  publicado   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index eventos_fecha_idx on public.eventos (fecha) where publicado;

-- ── Testimonios ─────────────────────────────────────────────────────────────

create table public.testimonios (
  id          uuid primary key default gen_random_uuid(),
  cita        text not null,
  autor       text not null,
  orden       smallint not null default 0,
  publicado   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Patrocinadores ──────────────────────────────────────────────────────────

create table public.patrocinadores (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  logo_url    text,
  nivel       nivel_patrocinio not null default 'aliado',
  url         text,
  orden       smallint not null default 0,
  activo      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Inscripciones ───────────────────────────────────────────────────────────
--
-- Contiene datos personales de menores de edad. El acceso queda cerrado en la
-- migración de RLS: solo se escribe desde Server Actions con la service role.

create table public.inscripciones (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  estado                    estado_inscripcion not null default 'nuevo',

  -- Paso 1 · datos del niño
  nino_nombre               text not null,
  nino_fecha_nacimiento     date not null,
  nino_genero               text not null,
  categoria_sugerida        text not null,
  nino_posicion             text,
  nino_experiencia          text,
  nino_eps                  text,
  nino_condiciones_medicas  text,

  -- Paso 2 · datos del acudiente
  acudiente_nombre          text not null,
  acudiente_parentesco      text not null,
  acudiente_cedula          text not null,
  acudiente_whatsapp        text not null,
  acudiente_correo          text not null,
  acudiente_direccion       text,

  -- Paso 3 · programa
  programa_id               uuid references public.programas (id) on delete set null,
  como_nos_conocio          text,

  -- Paso 4 · rutas dentro del bucket privado `inscripciones` (todas opcionales)
  doc_foto                  text,
  doc_identidad             text,
  doc_eps                   text,
  doc_medico                text,

  -- Paso 5 · autorizaciones
  -- El uso de imagen es opt-in separable: la Ley 1581 no permite condicionar
  -- el servicio a que la familia acepte publicar fotos del menor.
  consent_imagen            boolean not null default false,
  consent_datos             boolean not null default false,
  consent_reglamento        boolean not null default false,

  -- Gestión interna
  notas_admin               text,

  constraint inscripciones_consent_datos_obligatorio check (consent_datos),
  constraint inscripciones_consent_reglamento_obligatorio check (consent_reglamento),
  constraint inscripciones_correo_valido
    check (acudiente_correo ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

-- Nota: la edad de 5 a 17 años NO se valida con un CHECK. Un CHECK se reevalúa
-- en cada UPDATE, así que cambiar el estado de una solicitud fallaría en cuanto
-- el niño cumpliera 18. Además Postgres no admite now() en un CHECK por no ser
-- inmutable. La regla vive en Zod, en cliente y servidor.

create index inscripciones_estado_idx on public.inscripciones (estado, created_at desc);
create index inscripciones_programa_idx on public.inscripciones (programa_id);

-- ── Interesados en el portal de padres (fase 2) ──────────────────────────────

create table public.portal_interes (
  id          uuid primary key default gen_random_uuid(),
  correo      text not null unique,
  created_at  timestamptz not null default now(),

  constraint portal_interes_correo_valido
    check (correo ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
