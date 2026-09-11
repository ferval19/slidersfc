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
https://<tu-dominio>/auth/callback
https://<tu-dominio>/auth/confirm
```

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

## Modelo de datos

`profiles`, `games`, `slider_definitions`, `slider_sets`, `slider_set_values`,
`slider_comments`. En `slider_comments`, `slider_definition_id` nulo significa
*comentario general al set*; con valor, *comentario anclado a ese slider*.

`slider_definitions.applies_to` modela la separación de FC27:
`user` / `cpu_opponent` / `cpu_teammate` (en FC26 y anteriores, `user` / `cpu`).

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
