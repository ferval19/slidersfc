# SlidersFC

Sliders de EA SPORTS FC publicados por la comunidad, con comentarios anclados a
cada slider individual. Sub-marca de **Full Manual FG**.

Stack: Next.js 16 (App Router, TypeScript, Tailwind v4) + Supabase (Postgres, Auth, RLS).

---

## Puesta en marcha

### 1. Dependencias

```bash
npm install
```

### 2. Proyecto de Supabase

Crea un proyecto en [supabase.com](https://supabase.com) y copia sus claves a
`.env.local` (parte de `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=            # vacío en local
```

### 3. Esquema y datos

Los ficheros están en `supabase/`. Aplícalos **en este orden** desde el SQL
Editor del dashboard, o con la CLI (`supabase db push`):

1. `supabase/migrations/20260911120000_init_schema.sql` — tablas y triggers
2. `supabase/migrations/20260911120100_rls.sql` — Row Level Security
3. `supabase/migrations/20260911120200_profiles_trigger.sql` — perfil automático al registrarse
4. `supabase/seed/01_catalog.sql` — juegos y catálogo de sliders
5. `supabase/seed/02_set_full_manual_fg.sql` — set de inicio para FC26
   (requiere haber entrado una vez con `ferval19@gmail.com`; ver
   [supabase/README.md](supabase/README.md))

El seed es idempotente: se puede volver a aplicar sin duplicar nada.

### 4. Auth

En **Authentication → Providers**:

- **Email**: activado por defecto. La app usa magic link, sin contraseñas.
- **Twitter (X)**: actívalo y pega el API Key / API Secret de tu app de
  developer.x.com. En la app de X, la callback URL es
  `https://<tu-proyecto>.supabase.co/auth/v1/callback`.

En **Authentication → URL Configuration**, añade a *Redirect URLs*:

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
http://localhost:3000/auth/finalizar
https://<tu-dominio>/auth/callback
https://<tu-dominio>/auth/confirm
https://<tu-dominio>/auth/finalizar
```

#### Plantilla del email de acceso (importante)

La app acepta las tres formas en las que Supabase puede devolver al usuario
(`?code=`, `?token_hash=` y `#access_token=`), así que con la plantilla por
defecto funciona. Pero la plantilla por defecto usa el flujo PKCE, y eso obliga
a abrir el enlace **en el mismo navegador** que lo pidió: si te llega al móvil y
lo pediste en el portátil, falla con *«PKCE code verifier not found»*.

Para evitarlo, en **Authentication → Emails → Magic Link** cambia el enlace por:

```html
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
    Entrar en SlidersFC
  </a>
</p>
<p>O escribe este código en la web: <strong>{{ .Token }}</strong></p>
```

Dos cosas cambian con esa plantilla:

- Con `TokenHash` el enlace apunta directo a la app, así que la verificación no
  depende de una cookie previa y funciona desde cualquier dispositivo. Con la
  plantilla por defecto (`{{ .ConfirmationURL }}`, flujo PKCE) sólo vale en el
  navegador que lo pidió.
- `{{ .Token }}` imprime el código de 6 dígitos, y la pantalla de «te lo hemos
  enviado» acepta escribirlo a mano. Eso es la salida cuando el enlace no
  funciona: los escáneres de Gmail y Outlook abren los enlaces de los correos
  antes que la persona y **consumen el token de un solo uso**, lo que produce
  un `otp_expired` en el primer clic. Un código escrito a mano no se gasta.

Ojo también con el **Site URL** del proyecto: Supabase entrega ahí los errores
de acceso, así que si apunta a producción, un fallo probando en local te deja
en el dominio de producción. La app detecta esos parámetros de error en
cualquier página y lleva a /login con el motivo (ver
`src/components/auth-error-relay.tsx`).

### 5. Arrancar

```bash
npm run dev
```

---

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run seed:build` | Regenera `supabase/seed/01_catalog.sql` desde `supabase/seed/catalog.mjs` |
| `npm run test:sql` | Ejecuta migraciones y seeds contra un Postgres en memoria y comprueba el resultado |

## Estructura

```
src/
  app/
    page.tsx                  feed público con filtros
    juegos/[slug]/            listado por juego
    sets/[id]/                detalle: valores + comentarios por slider
    sets/[id]/editar/         edición (sólo el dueño)
    sets/nuevo/               creación
    u/[username]/             perfil público
    login/                    email + X
    auth/callback|confirm/    vuelta de OAuth y de magic link
    actions/                  Server Actions (sets, comentarios, auth)
  components/                 UI
  lib/
    queries.ts                lecturas del servidor
    set-view.ts               adapta el detalle del set a los Client Components
    supabase/                 clientes (server, browser, sesión)
supabase/
  migrations/                 esquema + RLS + trigger de perfil
  seed/catalog.mjs            catálogo de sliders (fuente de verdad)
  seed/01_catalog.sql         generado desde catalog.mjs
scripts/build-seed.mjs        generador del seed
```

## Dirección visual

La pizarra del entrenador: verde botella, tiza y tres rotuladores que codifican
el ámbito de cada slider. Está documentada en
[docs/direccion-visual.md](docs/direccion-visual.md) — léela antes de tocar
`globals.css`.

## Modelo de datos

`profiles`, `games`, `slider_definitions`, `slider_sets`, `slider_set_values`,
`slider_comments`. En `slider_comments`, `slider_definition_id` nulo significa
*comentario general al set*; con valor, *comentario anclado a ese slider*.

`slider_definitions.applies_to` modela la separación de FC27:
`user` / `cpu_opponent` / `cpu_teammate` (en FC26 y anteriores, `user` / `cpu`).
Los sliders que sólo existen de un lado usan un único ámbito: la barra de
potencia es sólo del usuario, y los controles de la CPU sólo de la CPU.

### Versionado

Cuando el autor cambia valores de un set **ya publicado**, `slider_sets.version`
sube en uno. Los comentarios guardan la versión en la que se escribieron
(`set_version`), así que los antiguos siguen visibles pero marcados como
«de la v1» en lugar de quedar colgando de un valor que ya no existe.

## Seguridad

Todo el control de acceso vive en RLS (`supabase/migrations/...rls.sql`):
lectura pública de sets publicados, escritura sólo del dueño, comentarios de
cualquier usuario autenticado editables sólo por su autor. La app nunca usa la
service role key.

## Despliegue

Vercel, importando el repo. Añade en el proyecto las mismas variables de
`.env.local`, con `NEXT_PUBLIC_SITE_URL` apuntando al dominio real, y añade ese
dominio a las Redirect URLs de Supabase.

---

Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.
