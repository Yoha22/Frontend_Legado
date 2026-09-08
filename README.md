# Escuela de Béisbol Legado Diover Ávila

Sitio web de la escuela de béisbol infantil y juvenil de Moñitos, Córdoba.
Implementa el prototipo aprobado en Claude Design como aplicación de producción.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Storage) ·
Server Actions · Zod · Resend · despliegue en Vercel.

---

## ⚠ Antes de publicar: contenido pendiente

El prototipo traía varios campos marcados como *"Texto pendiente"* y *"Nombre pendiente"*. Para que el
sitio se pudiera ver terminado se redactó **texto plausible que nadie ha confirmado**. Hay que revisarlo
con la escuela antes del lanzamiento.

| Dónde | Qué está inventado |
|---|---|
| `src/content/institucional.ts` | Biografía de Diover Ávila, línea de tiempo (1998–hoy), misión, visión, **los cuatro nombres y bios de entrenadores**, cifras de impacto, teléfono, correo y dirección |
| `src/content/legal.ts` | Las tres páginas legales son un esqueleto **sin revisión de un abogado** |
| `supabase/seed.sql` | Programas, horarios, sedes, cupos y precios de patrocinio |

Ambos archivos exportan una bandera (`REVISADO`, `LEGAL_REVISADO`) puesta en `false`. Las páginas
legales se sirven con `noindex` mientras siga así.

Diover Ávila es una persona real: su biografía y las de los entrenadores son lo más urgente de corregir.

**Bloqueante legal:** el formulario exige aceptar el reglamento interno, pero el reglamento todavía no
existe. Hay que redactarlo y publicarlo antes de poner el sitio en producción.

---

## Instalación

Requiere Node 20 o superior.

```bash
npm install
cp .env.example .env.local   # y rellena los valores
npm run dev                  # http://localhost:3000
```

El sitio **arranca sin Supabase**: si faltan credenciales, las páginas públicas usan los datos locales
de `src/content/respaldo.ts` y avisan por consola. Lo único que no funciona sin base de datos es el
envío del formulario de inscripción.

---

## Base de datos

### Con Supabase CLI (requiere Docker)

```bash
npx supabase start
npx supabase db reset    # aplica migrations/ y seed.sql
```

### Sin Docker

Abre el proyecto en [supabase.com](https://supabase.com) → **SQL Editor** y ejecuta en este orden:

1. `supabase/migrations/20260907000001_init.sql`
2. `supabase/migrations/20260907000002_rls.sql`
3. `supabase/migrations/20260907000003_storage.sql`
4. `supabase/seed.sql`

### Regenerar los tipos tras cambiar el esquema

```bash
npx supabase gen types typescript --local > src/lib/supabase/tipos.ts
```

Ahora mismo `tipos.ts` está escrito a mano para que el repo compile sin una instancia corriendo.

### Tablas

| Tabla | Contenido | Acceso público |
|---|---|---|
| `programas` | Categorías, horarios, sedes, cupos | Lectura si `activo` |
| `noticias` | Artículos del blog | Lectura si `publicado` |
| `eventos` | Calendario y "próximos eventos" | Lectura si `publicado` |
| `testimonios` | Citas de familias | Lectura si `publicado` |
| `patrocinadores` | Logos de aliados | Lectura si `activo` |
| `inscripciones` | **Datos personales de menores** | **Ninguno** |
| `portal_interes` | Correos para el portal (fase 2) | **Ninguno** |

Estados de una inscripción: `nuevo` → `contactado` → `prueba_programada` → `inscrito` / `rechazado`.

### Seguridad

Es lo más delicado del proyecto, porque el sistema almacena registros civiles y datos médicos de niños.

- RLS activo en las siete tablas.
- `inscripciones` y `portal_interes` tienen **cero políticas** y los permisos revocados: con RLS activo
  y sin políticas, Postgres deniega todo. La clave anónima no puede leerlas ni escribirlas.
- El bucket `inscripciones` de Storage es **privado y sin políticas**. Para mostrar un documento hay que
  firmar una URL temporal desde el servidor.
- Toda escritura pasa por Server Actions con la *service role key*, protegida con `server-only` para que
  el build falle si alguien la importa desde un componente de cliente.

Comprobación rápida de que funciona — con la clave anónima esto debe devolver cero filas y un error de
permisos, no la lista de solicitudes:

```sql
set role anon;
select * from public.inscripciones;
```

---

## Estructura

```
src/
  app/            Rutas (App Router). Una carpeta por página del prototipo
  components/     layout · ui · inicio · inscripciones · noticias · galeria · patrocinadores · portal · media
  content/        Contenido estático tipado (institucional, legal, respaldo)
  lib/
    supabase/     clientes (público/admin), tipos y consultas
    validaciones/ esquemas Zod compartidos entre cliente y servidor
    email/        Resend y plantillas HTML
    utils/        categoría por edad, formatos, cn
  actions/        Server Actions (inscripción, patrocinio, portal)
supabase/         migrations/ y seed.sql
```

### Sistema de diseño

Los tokens del prototipo (colores, tipografías, radios, sombras) están en el bloque `@theme` de
`src/app/globals.css`. Ninguna pantalla debería escribir un hex a mano.

Tipografías: **Oswald** para titulares y botones, **Source Sans 3** para el cuerpo.

El prototipo era solo de escritorio. El diseño móvil (menú hamburguesa, calendario en vista agenda,
tabla de horarios convertida en cards) se derivó de esos mismos tokens.

---

## Formulario de inscripción

Wizard de 5 pasos en `src/components/inscripciones/Wizard.tsx`.

El esquema de `src/lib/validaciones/inscripcion.ts` es la **única fuente de verdad**: lo usa el
navegador y lo vuelve a aplicar la Server Action, así que desactivar JavaScript no salta ninguna regla.

Reglas destacadas:

- Edad entre 5 y 17 años, calculada en el servidor a partir de la fecha de nacimiento.
  *No* es un `CHECK` de Postgres a propósito: un `CHECK` se reevalúa en cada `UPDATE` y fallaría al
  cambiar el estado de una solicitud en cuanto el niño cumpliera 18.
- Categoría sugerida automática: 5–7 Iniciación · 8–10 Infantil · 11–13 Pre-juvenil · 14–17 Juvenil.
- WhatsApp: celular colombiano (`3XX XXX XXXX`, `+57` opcional).
- Documentos opcionales, máx. 5 MB, PDF/JPG/PNG. El límite se aplica en el cliente, en Zod **y** en el
  propio bucket de Storage.
- **La autorización de uso de imagen es opcional**, a diferencia del prototipo. Bajo la Ley 1581 no se
  puede condicionar el servicio a que la familia acepte publicar fotos del menor. Tratamiento de datos y
  reglamento sí son obligatorios, y hay un `CHECK` en la tabla que lo garantiza.

Orden de guardado: validar → subir documentos → insertar fila → enviar correos.
Si falla el insert se borran los archivos ya subidos, para no dejar documentos de menores huérfanos.
Si falla Resend **la solicitud se conserva igual**: una caída del proveedor de correo no puede costar un
lead.

---

## Despliegue en Vercel

1. Importa el repositorio en Vercel. Detecta Next.js solo; no hay que tocar el comando de build.
2. Carga las variables de `.env.example` en **Settings → Environment Variables**.
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` y `CORREO_ADMIN` no llevan el prefijo `NEXT_PUBLIC_`
   y no deben llevarlo nunca.
3. Pon `NEXT_PUBLIC_SITE_URL` con el dominio definitivo (`https://…`, sin barra final) o los metadatos
   Open Graph y el `sitemap.xml` apuntarán a localhost.
4. Verifica el dominio del remitente en Resend antes de dar por buenos los correos.

Las páginas públicas se generan estáticamente y se revalidan cada 5 minutos (`export const revalidate`).

---

## Fase 2 — Portal de padres

No implementado, según lo acordado. `/portal` es una página de "muy pronto" que captura correos en
`portal_interes` y va con `noindex`.

Lo que ya está preparado: `@supabase/ssr` instalado, tabla de interesados y separación estricta entre el
cliente público y el de servicio.

---

## Deuda técnica conocida

- `npm audit` reporta una vulnerabilidad de `postcss` que llega a través de Next.js 15. El único arreglo
  es subir a Next 16, que es un cambio mayor y contradice el stack acordado. Es un fallo de
  *build-time*, sin exposición en producción, pero conviene revisarlo al planear la actualización.
- `src/content/respaldo.ts` duplica `supabase/seed.sql`. Es deliberado —permite ver el sitio sin base de
  datos— pero si editas uno hay que editar el otro.
- Las fotos y videos son marcadores punteados con el texto de lo que debe ir en cada hueco. El
  componente `VideoYouTube` ya soporta embebidos con carga diferida: basta con poner el ID del video en
  `GALERIA`, dentro de `institucional.ts`.
