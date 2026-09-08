-- ═══════════════════════════════════════════════════════════════════════════
--  Storage — documentos de inscripción
-- ═══════════════════════════════════════════════════════════════════════════
--
--  Bucket PRIVADO. Guarda registros civiles, carnets de EPS y certificados
--  médicos de menores de edad.
--
--  No se crea ninguna política sobre storage.objects para este bucket: sin
--  políticas, `anon` y `authenticated` no pueden listar, leer ni subir nada.
--  Las subidas van por Server Action con la service role, y para mostrar un
--  documento en el futuro panel de administración habrá que firmar una URL
--  temporal desde el servidor.
--
--  El límite de 5 MB y la lista de tipos MIME se aplican también aquí, no solo
--  en Zod: si alguien llamara al endpoint de Storage por fuera de la app, el
--  propio bucket rechazaría el archivo.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inscripciones',
  'inscripciones',
  false,
  5242880, -- 5 MB
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
