-- ═══════════════════════════════════════════════════════════════════════════
--  Row Level Security
-- ═══════════════════════════════════════════════════════════════════════════
--
--  Dos regímenes distintos:
--
--  1. Contenido público (programas, noticias, eventos, testimonios,
--     patrocinadores): lectura abierta, filtrada por `publicado`/`activo`.
--     Nunca escritura desde el cliente.
--
--  2. Datos personales (inscripciones, portal_interes): RLS activo y CERO
--     políticas. En Postgres eso significa denegar todo. El service role
--     ignora RLS por diseño, y es el único camino de escritura — siempre
--     desde Server Actions, nunca desde el navegador.

alter table public.programas       enable row level security;
alter table public.noticias        enable row level security;
alter table public.eventos         enable row level security;
alter table public.testimonios     enable row level security;
alter table public.patrocinadores  enable row level security;
alter table public.inscripciones   enable row level security;
alter table public.portal_interes  enable row level security;

-- ── Contenido público: solo SELECT ──────────────────────────────────────────

create policy "programas: lectura pública"
  on public.programas for select
  to anon, authenticated
  using (activo);

create policy "noticias: lectura pública"
  on public.noticias for select
  to anon, authenticated
  using (publicado);

create policy "eventos: lectura pública"
  on public.eventos for select
  to anon, authenticated
  using (publicado);

create policy "testimonios: lectura pública"
  on public.testimonios for select
  to anon, authenticated
  using (publicado);

create policy "patrocinadores: lectura pública"
  on public.patrocinadores for select
  to anon, authenticated
  using (activo);

-- ── Datos personales: sin políticas y sin permisos ──────────────────────────
--
-- RLS ya bloquea, pero Supabase concede GRANTs por defecto a anon/authenticated
-- sobre el esquema public. Se revocan para que ni siquiera exista el permiso.

revoke all on public.inscripciones  from anon, authenticated;
revoke all on public.portal_interes from anon, authenticated;
