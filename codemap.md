# Mapa del código — SlidersFC

> Manténlo al día. Cuando muevas una pieza o tomes una decisión que no se
> deduzca leyendo el fichero, actualiza aquí. Lo mismo con el historial del
> [README](README.md).

Next.js 16 (App Router, TypeScript, Tailwind v4) + Supabase (Postgres, Auth,
RLS). Unas 7.500 líneas. Sin capa de API propia: lectura con Server Components
y escritura con Server Actions.

---

## Mapa rápido

```
src/app/
  page.tsx                       feed: hero, muestra del regulador, sets recientes
  juegos/[slug]/                 sets de un juego
  u/[username]/                  perfil público
  u/[username]/[slug]/           ficha del set: valores + comentarios por slider
  u/[username]/[slug]/consola/   modo consola (móvil en la mano)
  u/[username]/[slug]/editar/    edición, sólo el dueño
  u/[username]/[slug]/opengraph-image.tsx   tarjeta del set para redes
  sets/nuevo/                    creación
  sets/[id]/                     URLs antiguas → redirección permanente
  login/ recuperar/ cuenta/contrasena/      acceso
  auth/callback|confirm/         vuelta de Supabase (servidor)
  auth/finalizar/                vuelta por fragmento (cliente)
  perfil/                        resuelve la sesión a /u/<username>
  icon.tsx apple-icon.tsx        favicon SFC generado
  opengraph-image.tsx            tarjeta por defecto del resto de la web
  actions/                       auth.ts · sets.ts · comments.ts

src/components/                  UI. Los de cliente llevan 'use client'
src/lib/                         lógica sin UI (ver abajo)
src/proxy.ts                     refresco de sesión y rutas protegidas

supabase/migrations/             esquema, RLS, triggers
supabase/seed/catalog.mjs        catálogo de sliders: FUENTE DE VERDAD
supabase/seed/0*.sql             generado + sets de inicio
scripts/build-seed.mjs           catalog.mjs → 01_catalog.sql
scripts/test-sql.mjs             toda la cadena SQL contra Postgres en memoria
scripts/test-import.mjs          el importador de texto contra el catálogo real
docs/                            dirección visual · hoja de ruta
```

### `src/lib`

| Fichero | Para qué |
| --- | --- |
| `queries.ts` | Todas las lecturas. Cada una envuelta en `safeRead`: si Supabase no responde, la página se queda vacía en vez de caerse |
| `set-view.ts` | Convierte el detalle de un set en algo plano y serializable para los Client Components |
| `import-sliders.ts` | Lee un set pegado en texto. Módulo **puro** (sólo importa tipos) para poder probarlo con `node` sin levantar la aplicación |
| `category-order.ts` | Ordena las categorías por `sort_order`. Módulo aparte **sin nada del servidor**: lo usan la ficha (servidor) y el formulario (cliente) |
| `constants.ts` | Etiquetas, ámbitos y el color de cada rotulador |
| `paths.ts` | Rutas en un solo sitio. `resolveSetPath` tolera que falte el slug |
| `database.types.ts` | Tipos escritos a mano. Regenerables con `supabase gen types` |
| `auth-errors.ts` | Traducción de los errores de Supabase Auth |
| `auth-callback.ts` | Handler compartido por `/auth/callback` y `/auth/confirm` |
| `site-url.ts` | Origen público. Cascada: variable explícita → Vercel → localhost |
| `og-fonts.ts` | Fuentes de las imágenes generadas, leídas de `public/fonts/` |
| `supabase/` | `server` (con cookies) · `client` (navegador) · `anon` (sin cookies) · `session` (proxy) · `env` · `providers` |

---

## Modelo de datos

```
profiles            espejo público de auth.users (username, display_name, twitter_handle, bio)
games               fc26, fc27
slider_definitions  catálogo por juego: category, applies_to, name, slug, rango, sort_order
slider_sets         owner_id, game_id, title, slug, description, version, is_published
slider_set_values   (set, definition) → value
slider_comments     slider_definition_id NULL = comentario general al set
```

`applies_to` es `user` | `cpu` | `cpu_opponent` | `cpu_teammate`.
En FC26, los lados son usuario / CPU. En FC27, los sliders de jugabilidad son
usuario / CPU rival, y el desdoble rival vs. compañero existe **sólo** en los
de comportamiento de la CPU.

**El control de acceso vive en RLS**, no en Next. Lectura pública de sets
publicados, escritura sólo del dueño, comentarios de cualquier usuario
autenticado editables sólo por su autor. Las seis tablas tienen RLS activada y
`npm run test:sql` lo comprueba.

---

## Flujos

**Publicar un set.** `/sets/nuevo` → `createSet` valida contra el catálogo →
inserta set y valores → redirige a `/u/<usuario>/<slug>`. El slug lo pone un
trigger y **no cambia aunque cambie el título**.

**Comentar.** Cada celda (slider × ámbito) abre su hilo. El comentario guarda
`set_version`; si el autor edita valores de un set publicado, la versión sube y
los comentarios viejos salen marcados «de la vN».

**Acceso.** Correo y contraseña (principal), enlace mágico con código de 6
dígitos como alternativa, y X. La vuelta de Supabase la recoge `AuthRelay`
desde el layout, caiga en la página que caiga.

**Modo consola.** Una columna en el orden del menú, números grandes, marca por
slider guardada en `localStorage` y bloqueo de pantalla.

---

## Decisiones que no se deducen leyendo el código

Aquí está lo que ha costado sangre. Si vas a tocar algo de esto, lee primero.

**El catálogo se genera, no se escribe a mano.** Edita
`supabase/seed/catalog.mjs`, ejecuta `npm run seed:build` y reaplica
`01_catalog.sql`. El SQL generado **borra** lo que ya no esté en el catálogo,
así que renombrar un slug es seguro.

**El orden de las categorías es el del menú del juego**, no una elección
estética: la gente consulta un set mientras mete los valores en la consola. Ese
orden vive **sólo** en `catalog.mjs` → `sort_order`, y la aplicación lo deriva
de ahí. Antes estaba duplicado en las constantes y se desvió sin que se notara.

**`default_value` guarda lo que trae el juego de fábrica**, no un 50 genérico.
De ahí sale la marca gris de la ficha: lo que se separe de ella es lo que ha
tocado el autor. En FC26 no conocemos el preajuste, así que se quedan todos en
el neutro — y la interfaz lo detecta sola (`hasReference`: si todos los valores
por defecto son iguales, no enseña una referencia falsa).

**Llevar un set a otro juego empareja por slug**, y los renombres viven en
`src/lib/game-migration.ts`. Crea un **borrador** y lleva a editarlo: nada se
publica sin que el autor lo vea. Lo que no encaja se queda fuera de forma
explícita en vez de adivinar — `cpu_tackle_aggression` de FC26 no se copia
porque FC27 lo parte en dos.

**El borrado de sincronización del catálogo va por (slug, ámbito)**, no sólo
por slug. Si un slider deja de existir en un lado, el slug sigue estando y un
borrado por slug no lo ve: a FC27 le sobrevivieron veinte ámbitos «CPU
compañero» de una versión preliminar, visibles como sliders fantasma.

**Los cuatro sliders maestros de FC27 no están en el catálogo** («Todos los
controles de error de tiro» y compañía). No son valores, son atajos que cambian
de golpe todos los de debajo; guardarlos duplicaría información.

**`category-order.ts` está aparte por el límite cliente/servidor.** Cuando
vivía en `set-view.ts`, importarlo desde el formulario arrastraba la cadena
hasta `supabase/server`, que usa `next/headers`, y rompía el build. Ni `tsc` ni
eslint ven ese límite: **sólo `next build`**.

**Supabase no siempre devuelve a la ruta que le pides.** Si el `redirect_to` no
está en la lista blanca del proyecto, usa el Site URL — normalmente la portada.
Por eso `AuthRelay` vive en el layout y recoge `?code=`, `#access_token=` y los
errores en cualquier página.

**Los enlaces de acceso son frágiles.** Los escáneres de Gmail y Outlook los
abren antes que la persona y consumen el token de un solo uso (`otp_expired` en
el primer clic), y con PKCE sólo valen en el navegador que los pidió. De ahí el
código de 6 dígitos y, sobre todo, el acceso con contraseña.

**Se comprueba que un proveedor esté activo antes de salir del sitio.**
`signInWithOAuth` no llama al servidor, sólo construye la URL; con el proveedor
desactivado Supabase responde un 400 crudo y la persona se queda tirada.

**El origen público sale de una cascada.** Si depende sólo de
`NEXT_PUBLIC_SITE_URL` y nadie la pone, el `og:image` apunta a localhost y al
compartir un enlace no sale imagen. Pasó de verdad.

**Satori (las imágenes de OpenGraph) es quisquilloso**: `display: flex`
explícito en cualquier `div` con más de un hijo, y anchos fijos — con
crecimiento elástico las filas se colapsan y las columnas se salen del lienzo.
Las fuentes se leen de `public/fonts/` porque `fetch` sobre un `file:` URL no
está implementado al prerenderizar con Turbopack.

**El editor SQL de Supabase ejecuta cada sentencia en su propia transacción**,
así que una tabla temporal con `on commit drop` no sobrevive a la siguiente. Los
seeds van en un único bloque `do`, que es atómico.

**En el modo consola el progreso va abajo.** Arriba desaparecía tras la
cabecera del sitio, que también es fija y tiene más z-index.

**El importador de texto busca el nombre más largo primero.** «Velocidad» es
prefijo de «Velocidad de tiros de calidad»; si se busca por orden de catálogo,
media lista de FC27 cae en el slider equivocado sin avisar. Otras tres reglas
que parecen arbitrarias y no lo son: un solo número va a los dos lados (es como
lo escribe casi todo el mundo), «CPU» a secas cae en `cpu_opponent` cuando el
juego desdobla rival y compañero —quien pega un set de FC26 en FC27 escribe
«CPU»—, y los números por encima de 100 se descartan, que si no un «8 minutos»
o un «2026» entran como valor.

**`import-sliders.ts` no importa nada que no sea un tipo.** Así `node` puede
cargarlo quitando los tipos y `scripts/test-import.mjs` lo prueba contra el
catálogo real sin levantar Next. El formato de entrada no lo controlamos —cada
uno pega su set como lo tiene escrito—, así que la prueba es lo único que dice
si sigue tragando lo que la gente pega.

---

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # el único que ve el límite cliente/servidor
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run seed:build   # catalog.mjs → 01_catalog.sql
npm run test:sql     # migraciones y seeds contra Postgres en memoria (PGlite)
npm run test:import  # el importador de texto contra el catálogo real
```

Antes de dar algo por bueno: `typecheck`, `lint`, **`build`** y, si has tocado
SQL, `test:sql`; si has tocado el importador o el catálogo, `test:import`.

---

## Cómo se trabaja con Claude en este proyecto

**Opus piensa, Sonnet implementa.** El trabajo de decidir —qué construir, cómo
encaja, qué se rompe— lo hace Opus. Escribir el código de un cambio ya
decidido lo hace Sonnet, en un subagente (`Agent` con `model: "sonnet"`). El
motivo es el coste: la parte cara de un cambio en tokens es teclear ficheros,
y ahí Opus no aporta lo suficiente para lo que cuesta.

Cómo se reparte en la práctica:

| Opus | Sonnet |
| --- | --- |
| Entender qué pide Fernando y traducirlo a un cambio concreto | Escribir el código y las pruebas del cambio ya especificado |
| Decidir dónde vive cada pieza (sobre todo el límite cliente/servidor) | Renombrados, movimientos, repetir un patrón que ya existe |
| Diseñar SQL, RLS y lo que toca datos de verdad | Redactar la prueba de un módulo puro contra un caso descrito |
| Revisar lo que vuelve y pasar las comprobaciones | |
| Actualizar el mapa del código y el historial | |

**Al delegar, el encargo va cerrado**: ficheros a tocar, firma de lo que se
escribe, y qué comprobación tiene que pasar. Un subagente arranca en frío, sin
nada de esta conversación; lo que no vaya en el encargo, se lo inventa.

**Economía de tokens**, en orden de lo que más ahorra:

- Leer trozos (`sed -n`, `grep -n`) antes que ficheros enteros; los ficheros
  enteros sólo cuando se van a reescribir.
- No releer un fichero después de editarlo: si la edición hubiera fallado, la
  herramienta habría dado error.
- Las comprobaciones a fichero y mirar sólo el código de salida y el final;
  `npm run build` escupe cientos de líneas que no dicen nada.
- Preferir `read_page` / `get_page_text` a capturas de pantalla, salvo cuando
  lo que se comprueba es precisamente cómo se ve.
- Nada de resumir de vuelta lo que ya está escrito en el codemap o el README.

Lo que **no** se delega: aplicar SQL sobre la base real, tocar el catálogo,
cualquier cosa de autenticación o RLS, y dar un cambio por bueno.
