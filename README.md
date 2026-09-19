# SlidersFC

Sliders de EA SPORTS FC publicados por la comunidad, con comentarios anclados a
cada slider individual. Sub-marca de **Full Manual FG**.

Stack: Next.js 16 (App Router, TypeScript, Tailwind v4) + Supabase (Postgres, Auth, RLS).

- [Mapa del código](codemap.md) — qué hay dónde y las decisiones que no se deducen leyendo
- [Dirección visual](docs/direccion-visual.md) — la pizarra del entrenador
- [Hoja de ruta](docs/hoja-de-ruta.md) — qué viene y en qué orden
- [Historial](#historial) — qué se ha hecho y por qué

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

En Vercel no hace falta ponerla: el origen sale de las variables que Vercel
inyecta solo (`VERCEL_PROJECT_PRODUCTION_URL`). Ponla sólo cuando uses un
dominio propio, y entonces manda ella.

De ese origen dependen los enlaces absolutos de las metaetiquetas: si está mal,
el `og:image` apunta a un sitio que nadie puede descargar y al compartir un
enlace no sale la imagen.

### 3. Esquema y datos

Los ficheros están en `supabase/`. Aplícalos **en este orden** desde el SQL
Editor del dashboard, o con la CLI (`supabase db push`):

1. `supabase/migrations/20260911120000_init_schema.sql` — tablas y triggers
2. `supabase/migrations/20260911120100_rls.sql` — Row Level Security
3. `supabase/migrations/20260911120200_profiles_trigger.sql` — perfil automático al registrarse
4. `supabase/seed/01_catalog.sql` — juegos y catálogo de sliders
5. `supabase/migrations/20260912140000_set_slugs.sql` — URLs amigables
6. `supabase/seed/02_set_full_manual_fg.sql` — set de inicio para FC26
7. `supabase/seed/03_set_fc27_realista.sql` — valores por defecto de FC27
   (requiere haber entrado una vez con `ferval19@gmail.com`; ver
   [supabase/README.md](supabase/README.md))

El seed es idempotente: se puede volver a aplicar sin duplicar nada.

### 4. Auth

En **Authentication → Providers**:

- **Email**: activado por defecto. La app ofrece **correo y contraseña** como
  camino principal, y el enlace mágico como alternativa.

  **Desactiva «Confirm email»** (*Authentication → Providers → Email*) si
  quieres que crear una cuenta no mande ningún correo. Con la confirmación
  activada, registrarse sigue dependiendo del correo — y por tanto del límite
  de envíos. Con ella desactivada, la cuenta queda lista al instante y el
  correo sólo hace falta para recuperar una contraseña olvidada.

  Puedes comprobar cómo está con:

  ```bash
  curl -s -H "apikey: $ANON_KEY" "$SUPABASE_URL/auth/v1/settings" | grep autoconfirm
  ```

  `mailer_autoconfirm: true` = no manda correo al registrarse.
- **Twitter (X)**: actívalo y pega el API Key / API Secret de tu app de
  developer.x.com. Ojo: el proveedor de Supabase usa **OAuth 1.0a**, así que
  son la *API Key* y la *API Secret*, no el client id/secret de OAuth 2.0.

  En la app de X:
  - Callback URL: `https://<tu-proyecto>.supabase.co/auth/v1/callback`
  - Website URL: tu dominio
  - Activa **«Request email address from users»**. Sin eso, X no devuelve
    correo, la cuenta se crea sin él y Supabase no puede enlazarla con una
    cuenta que ya exista con el mismo correo: saldrían dos usuarios distintos.

  Mientras el proveedor esté desactivado, el botón no te saca del sitio: la
  aplicación lo comprueba antes (`src/lib/supabase/providers.ts`) porque
  `/auth/v1/authorize` responde un 400 crudo y dejaría a la persona tirada en
  una página de error de Supabase.

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

#### Límite de correos

El SMTP que trae Supabase de serie es para pruebas: tiene un límite de unos
pocos correos **por hora y por proyecto**, no por destinatario, así que cambiar
de correo no lo esquiva. Antes de abrir la web a gente hay que configurar un
SMTP propio en *Project Settings → Authentication → SMTP Settings* (Resend,
Brevo, Mailgun, SES...). Mientras, el acceso con X no gasta correos.

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

Está en el [mapa del código](codemap.md), con las decisiones que no se deducen
leyendo los ficheros. Aquí no se repite para que no se desvíe.

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

### URLs

Los sets viven en `/u/<usuario>/<slug>`. El slug lo pone un trigger al
insertar, a partir del título, y **no cambia aunque cambie el título**: un
enlace compartido tiene que seguir funcionando. Las URLs antiguas por UUID
(`/sets/<id>`) redirigen de forma permanente.

Se descartó `/<usuario>/<slug>` a secas porque un espacio de nombres en la
raíz choca con `/login`, `/perfil`, `/juegos` y `/auth`, y obligaría a
mantener una lista de nombres reservados cada vez que se añade una ruta.

### Imagen para redes sociales

Cada set genera su propia tarjeta en `opengraph-image.tsx`: título, autor,
juego y cinco sliders con sus valores dibujados a escala. Se cachea una hora y
usa el cliente anónimo, sin cookies, porque quien la pide son los bots.

Las fuentes viven en `public/fonts/` como fichero, no descargadas en caliente.
`fetch(new URL(..., import.meta.url))` no funciona al prerenderizar con
Turbopack, y `public/` es lo único que se despliega siempre tal cual.

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

## Historial

Qué se ha ido haciendo y, sobre todo, **por qué**. Se actualiza conforme
avanzamos; los detalles de implementación están en el
[mapa del código](codemap.md).

### 11–12/09/2026 · Del plan al MVP

Arranca el proyecto desde un plan previo: Next.js + Supabase, sets de sliders
con **comentarios anclados a cada valor**, que es el diferencial del producto.
Esquema completo con RLS en las seis tablas, catálogo de sliders generado
desde un único fichero, CRUD de sets, feed, perfiles y comentarios.

Los dos documentos de referencia del plan no eran accesibles, así que el
catálogo se montó con la lista canónica de EA FC. Resultó estar incompleto —
ver más abajo.

### 12/09 · Arreglos de arranque

Cuatro fallos que impedían levantar la app, todos encontrados probándola de
verdad:

- `NEXT_PUBLIC_SITE_URL` presente pero **vacía** hacía `new URL('')` en el
  layout: 500 en todas las páginas. `??` no captura la cadena vacía.
- La URL de Supabase copiada del panel puede traer el sufijo `/rest/v1/`, y el
  cliente añade esa ruta él mismo: *Invalid path specified in request URL*.
  Ahora se normaliza.
- El proxy leía el entorno fuera del `try`.
- Los `catch` de lectura se tragaban las excepciones internas de Next.

### 12/09 · SlidersFC y la pizarra táctica

Cambio de nombre desde SliderXI. El primer diseño (negro y un acento) era la
plantilla por defecto, así que se rehace partiendo del material propio: **la
pizarra del entrenador**. Verde botella, tiza y trazo dibujado a mano.

Lo que lo sostiene: los **tres rotuladores codifican el ámbito** del slider
(tú / CPU compañero / CPU rival), y el elemento firma es **el regulador** — un
valor se lee como posición en una escala, y las muescas de todos los ámbitos
comparten carril, así que la forma de un set se ve de un vistazo.

### 12/09 · El catálogo real de FC26 y fuera los modos

Con el documento de Full Manual FG en mano, el catálogo de FC26 pasa a ser el
real: **29 sliders en español**, no los 17 inventados en inglés. Y se carga el
set «Full Manual FG v3.0» con sus 50 valores, con el crédito a @Shinogoblin.

Se elimina el campo `mode`: los sliders sólo existen offline, así que no
distinguía nada útil.

### 12/09 · La saga del acceso

Varias vueltas, todas por el mismo sitio: el correo.

- `/auth/confirm` sólo miraba `token_hash`, pero la plantilla por defecto de
  Supabase manda `?code=`. El enlace del correo caía siempre en error.
- Los errores salían **en inglés**; se traducen todos por código y por texto.
- Un usuario con sesión pero sin fila de perfil veía «Entrar» y `/login` lo
  devolvía a la portada: **bucle sin salida**. El header pasa a mirar la
  sesión, y `/perfil` repara el perfil si falta.
- Supabase devuelve al *Site URL* cuando el `redirect_to` no está en la lista
  blanca, así que `AuthRelay` recoge la vuelta **caiga donde caiga**.
- Los escáneres de correo consumen el enlace antes que la persona
  (`otp_expired` en el primer clic): se añade **código de 6 dígitos**.
- Y finalmente **correo y contraseña**, que es lo que no depende del correo.

### 12/09 · URLs amigables, compartir y favicon

Los sets pasan de `/sets/<uuid>` a **`/u/<usuario>/<slug>`**, con el slug
puesto por un trigger y estable aunque cambie el título. Botón de compartir,
**tarjeta de OpenGraph** por set con sus valores dibujados a escala, y favicon
SFC con la tipografía de la marca.

Se descartó `/<usuario>/<slug>` a secas: choca con `/login`, `/perfil` y
compañía, y obligaría a mantener una lista de nombres reservados.

### 12/09 · Pruebas del SQL

Tras dos errores de SQL descubiertos pegándolo en el panel de Supabase,
`npm run test:sql` levanta un **Postgres en memoria** (PGlite) y ejecuta toda
la cadena: migraciones, seeds, los caminos de error y la cobertura de RLS.

### 12/09 · Modo consola y orden del menú

El orden de las categorías que había era inventado: **cinco de nueve estaban
mal**. El real sale del documento de Full Manual FG y se confirma después con
el juego. No es estético — se consulta un set mientras se meten los valores.

Y se añade el **modo consola**: una columna, números grandes, marca por slider
con el progreso guardado, y bloqueo de pantalla.

### 19/09 · FC27, del juego real

Con el acceso anticipado, el catálogo de FC27 se rehace desde las capturas del
menú: **61 sliders** con sus nombres y su orden reales. Los totales coincidían
con la reconstrucción previa, pero casi nada más: «tiros de calidad» y no
«colocado», «vaselina», «zapatazo», «brega»; varios sliders son de **altura**
y no de velocidad; y el desdoble CPU rival / CPU de tu equipo resulta estar
**sólo** en la pestaña de comportamiento de la CPU.

Se carga también «Jugabilidad realista de FC27» con los 121 valores de fábrica,
como referencia contra la que comparar cualquier set.

### 19/09 · La imagen que no salía

Compartir un set por WhatsApp no enseñaba imagen. Las metaetiquetas estaban,
pero anunciaban `http://localhost:3000/...`: sin `NEXT_PUBLIC_SITE_URL` en
Vercel, el origen caía a localhost. Ahora sale de una cascada que incluye las
variables que Vercel pone solas. Y se añade una **imagen por defecto** para
portada, juegos y perfiles, que no tenían ninguna.

---

Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.
