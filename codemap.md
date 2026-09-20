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
  guia/                          qué lleva un set, explicado campo por campo
  icon.tsx apple-icon.tsx        favicon SFC generado
  opengraph-image.tsx            tarjeta por defecto del resto de la web
  actions/                       auth.ts · sets.ts · comments.ts

src/components/                  UI. Los de cliente llevan 'use client'
src/lib/                         lógica sin UI (ver abajo)
src/proxy.ts                     refresco de sesión y rutas protegidas

supabase/migrations/             esquema, RLS, triggers
supabase/seed/catalog.mjs        catálogo de sliders: FUENTE DE VERDAD
supabase/seed/0*.sql             generado + sets de inicio
supabase/storage/                configuración de Storage (aparte: PGlite no la prueba)
scripts/build-seed.mjs           catalog.mjs → 01_catalog.sql
scripts/test-sql.mjs             toda la cadena SQL contra Postgres en memoria
scripts/test-import.mjs          el importador de texto contra el catálogo real
scripts/test-profile.mjs         la validación del perfil
scripts/test-compare.mjs         el modelo de la comparación
scripts/backup.mjs               volcado de la base a JSON + SQL de reposición
scripts/backup-sql.mjs           el generador del SQL de reposición (puro)
scripts/test-backup.mjs          vuelca, repone en una base vacía y comprueba
scripts/schema-files.mjs         qué ficheros de SQL hay y EN QUÉ ORDEN van
docs/                            dirección visual · hoja de ruta
```

### `src/lib`

| Fichero | Para qué |
| --- | --- |
| `queries.ts` | Todas las lecturas. Cada una envuelta en `safeRead`: si Supabase no responde, la página se queda vacía en vez de caerse |
| `set-view.ts` | Convierte el detalle de un set en algo plano y serializable para los Client Components |
| `set-conditions.ts` | Dificultad, duración y cámara: validación y etiquetas. Puro |
| `compare.ts` | El modelo de comparar dos sets: deltas, spread y orden. Puro, para poder probarlo |
| `profile.ts` | Validación del perfil. Puro: lo comparten el formulario y la acción de servidor, con las mismas reglas |
| `avatar-storage.ts` | Dónde vive cada avatar. El formato de la carpeta lo exige la política de Storage |
| `image.ts` | Recorta y reduce la foto a 512 px en el navegador antes de subirla |
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

**Los ámbitos se calculan por categoría, no por set.** El lado de «CPU
compañero» sólo existe en los sliders de comportamiento de la CPU, y los de esa
pestaña no tienen lado de usuario. Con los ámbitos del set entero, cuarenta y
nueve filas gastaban una columna en pintar un guion y la de la CPU otra. Ahora
cada bloque lleva los suyos (`CategoryBlockView.scopes`) y el regulador se
queda con el ancho que sobra.

**Los rótulos de columna van en cada categoría, no una vez arriba.** Con ciento
veintinueve filas, una cabecera única se pierde de vista a la tercera pantalla
y a partir de ahí estás leyendo números sin saber de quién son. En el móvil,
donde la rejilla se apila y no hay cabecera posible, cada número lleva su
etiqueta encima en micro.

**El alto de la cabecera está en una variable, `--header-h`.** Lo necesitan
las barras que se quedan pegadas debajo de ella y el `scroll-margin` de los
anclas. Estaba puesto a ojo en dos sitios y en uno de ellos estaba mal por
diecisiete píxeles: la barra de la comparación se metía debajo de la cabecera.

**La barra pegada de un set aparece con un escuchador de scroll, no con
IntersectionObserver.** El observador no despertaba de forma fiable en los
saltos programáticos —y ése es justo el caso de quien abre un enlace con ancla
a una categoría—, así que la visibilidad se mira con un rAF por gesto de
scroll. El resaltado de la categoría activa sí usa IntersectionObserver, que
ahí funciona.

**La barra pegada es sólo de escritorio.** Nueve categorías no caben en 375 px
sin convertirse en un carrusel horizontal, y en el móvil ya está el modo
consola, que es la forma buena de recorrer un set con el teléfono en la mano.
Los nombres de las categorías se acortan (`categoryShortLabel`) porque enteros
tampoco caben en una línea a 1024 px.

**La portada elige un hero al azar en el servidor, y no es un carrusel.** No
hay flechas ni temporizador: se elige uno por petición y ahí se queda hasta que
se recargue. Un carrusel que se mueve solo obliga a leer a su ritmo; así cada
visita se lleva un ángulo del producto y con el tiempo se cubren todos. Elegir
en el servidor evita el parpadeo y el salto de maquetación de decidirlo en el
cliente; funciona porque la portada ya es dinámica (lee la sesión). Si algún
día se volviera estática, el hero se quedaría congelado.

**Los titulares del hero no pasan de unos veinte caracteres por línea.** En
ultracondensada a 80 px, una línea más larga se parte sola y el hero se come la
pantalla entera antes de que se lea una palabra del cuerpo.

**La duración de los tiempos se guarda como texto.** Mucha gente juega «7 u 8
minutos» y un entero les obligaría a mentir. El CHECK de la base lo mantiene
con forma de número o de rango (`^[0-9]{1,2}(-[0-9]{1,2})?$`) y la aplicación
lo normaliza antes de guardar, así que sigue siendo comparable de un vistazo
aunque no sea aritmética.

**La cámara es texto libre con sugerencias, no una lista cerrada.** El campo
sugiere las trece cámaras del juego (`CAMERAS` en `set-conditions.ts`), pero
esos nombres salen de guías, no de haberlos leído en el menú en español, y ya
se pagó una vez inventar nombres del juego. Al ser sugerencias y no
restricción, un nombre equivocado no rompe nada: se corrige en ese array y los
sets guardan el texto que escribió su autor. Lo único que se exige es que haya
cámara si hay altura o zoom: unos números sueltos sin saber de qué cámara no
dicen nada, y eso va tanto en la validación como en un CHECK.

**`difficulty` es `string` en los tipos, no la unión estrecha.** La unión buena
vive en `set-conditions.ts`; la columna se lee como texto para que un valor
que esta versión no conozca deje la ficha sin etiqueta en vez de romperla.

**El comportamiento de la CPU esconde sus sliders, no los borra.** En FC27 se
elige entre táctico, dinámico y personalizado, y sólo en el último se usan los
sliders de esa pestaña. Al cambiar de modo siguen enviándose con el formulario
(otra vez `hidden`, no desmontar), así que volver a personalizado devuelve los
valores donde estaban. El selector va en la cabecera de su categoría, no en los
metadatos del set: es donde manda.

**Va por juego.** FC26 no tiene la opción, así que enseñar allí un selector
sería mentir. La bandera es `games.has_cpu_behaviour` y sale del catálogo. Con
la migración sin aplicar, la columna no existe, la bandera llega `undefined` y
todo se comporta como antes: el selector no sale y los sliders van siempre.

**Los sets que ya existían se quedan en `custom`, y los nuevos nacen en
`tactical`.** La migración pone el valor por defecto dos veces a propósito:
primero `'custom'`, que es lo que rellena las filas que ya había, y luego
`'tactical'` para lo que venga. Ponerles táctico a los antiguos escondería unos
valores que su autor sí puso.

**El orden del SQL no es cronológico, y vive en un solo sitio.** El catálogo va
EN MEDIO de las migraciones: las de antes crean las columnas que el catálogo
escribe (`has_cpu_behaviour`), las de después trabajan sobre datos que ya tienen
que estar. Está en `scripts/schema-files.mjs` porque cuando cada prueba tenía
su copia de la lista, una migración nueva entraba en una y no en la otra.

**Los cuatro maestros de tiro y pase son sliders normales del catálogo.** Son
`master_shot_error`, `master_shot_speed`, `master_pass_error` y
`master_pass_speed`: escalan su grupo entero, el juego pide dejarlos en 50 y
tocar sólo los de cada tipo. No se modelan de forma especial a propósito —
nada en la aplicación sabe que son «maestros»— porque la marca gris de fábrica
ya hace el trabajo: si alguien mueve un maestro, se ve al instante que se ha
separado del 50, que es justo lo que hay que notar. Van a la cabeza de su
categoría, no en una categoría propia.

**Sus nombres en español están reconstruidos, no leídos del menú.** Salen de la
tarjeta de @WilsdorfAndreas (en inglés) y de cómo se llamaban en FC26, donde
eran los únicos cuatro que había antes de que EA los desdoblara por tipo de
tiro y de pase. Si en el juego se llaman de otra forma, se cambian en
`catalog.mjs`, `npm run seed:build` y a reaplicar: es un minuto y no toca
datos, porque los sets referencian el slug y no el nombre.

**La copia de seguridad genera SQL, no sólo JSON.** El JSON es el archivo; el
SQL es lo que la hace útil, porque el camino de reposición de este proyecto ya
existe y es conocido: pegar SQL en el editor de Supabase. Una copia que no
sabes reponer no es una copia.

**Lo que la copia repone y lo que no.** Sets, valores, comentarios y perfiles,
sí. Juegos y catálogo de sliders, no: son código, y reponerlos desde un volcado
sería quedarse con una foto vieja del catálogo. Los sets y comentarios
conservan su UUID (las URLs por id siguen valiendo), pero el dueño va por
nombre de usuario, el juego por slug y cada valor por (slug del slider,
ámbito), porque los ids de `profiles` vienen de `auth.users` y los de `games` y
`slider_definitions` son series: en otro proyecto no coinciden.

**Sin la clave de servicio, la copia está incompleta y lo dice.** RLS se aplica
a la clave pública igual que a cualquiera, así que los borradores se quedan
fuera. El script avisa por pantalla: una copia incompleta que se cree completa
es peor que no tener ninguna.

**Los valores se ponen arrastrando, con un `input type="range"` nativo.**
Nativo y no un arrastre propio: así vienen gratis el teclado, el lector de
pantalla y el gesto que más importa en el móvil — tocar en cualquier punto del
carril lleva la muesca ahí. Lo que se viste es el pulgar (`.slider-input` en
globals.css); el carril y la marca de fábrica los dibuja `ScaleRail` detrás,
que es el mismo de la ficha y de la comparación. La altura de 44 px es zona
táctil: lo que se ve es una muesca de 4 px.

**Arrastrar no basta, y por eso están los botones de −1 y +1.** En un móvil de
375 px, cien valores caben en unos trescientos píxeles: tres píxeles por
unidad. Sin paso fino, clavar un 48 es imposible y el formulario queda bonito
e inservible.

**Las filas del formulario están memorizadas con un comparador propio** que
mira sólo los valores de su fila. Sin él, arrastrar un regulador repinta los
ciento veintidós del formulario en cada píxel del gesto, y en un móvil eso se
nota.

**Plegar una categoría la esconde, no la desmonta.** Un `input` desmontado deja
de enviarse con el formulario y su valor se perdería sin avisar; uno con
`display: none` se envía igual. Plegar hace falta de verdad: sin ello, un set
de FC27 son diecinueve pantallas de móvil; plegado, dos y media.

**Los reguladores ya no tienen inputs espejo.** Cada `range` lleva su propio
`name="v_<id>"` y el formulario se envía con ellos. Antes había un `input
hidden` por valor: con ciento veintidós, repintarlos en cada gesto era la mitad
del problema.

**En la comparación el color cambia de significado.** En la ficha de un set
dice el ámbito (usuario / CPU); al comparar dos sets dice **de quién es el
valor**, porque es lo único que se pregunta ahí. El ámbito se rotula fuera, a
la izquierda de cada carril, en vez de pelearse por el mismo canal, y la
leyenda se queda pegada arriba porque con sesenta y un sliders se baja muy
lejos de ella.

**El orden por defecto al comparar es el del menú del juego, no el de mayor
diferencia**, aunque «por diferencia» sea lo que mejor explica el otro set. Lo
primero que hace cualquiera con unos sliders es sentarse a metérselos, y para
eso el orden tiene que ser el de la pantalla que tiene delante. El otro orden
está a un clic.

**Comparar sólo funciona dentro del mismo juego.** FC26 y FC27 no son dos
versiones de la misma lista, son listas distintas: enfrentarlas valor a valor
no diría nada. El selector directamente no ofrece la mezcla, y la ruta directa
lo explica en vez de enseñar una tabla vacía.

**Cambiar de nombre de usuario no rompe los enlaces.** El nombre está en la
URL de todo lo que alguien comparte, así que `username_history` guarda los
liberados y `/u/<viejo>` y sus sets redirigen (301) al actual. Escribe sólo un
trigger `security definer`: la tabla no tiene políticas de escritura. Dos
detalles que parecen de más y no lo son: al cambiar, primero se **borra** el
alias del nombre que se acaba de coger (si no, quien lo tomó de otro acabaría
redirigido al anterior dueño), y volver al nombre de siempre retira su propio
alias, que si no se redirigiría a sí mismo.

**La configuración de Storage vive fuera de `migrations/`.** PGlite no tiene
el esquema `storage`, así que `npm run test:sql` no la puede ejecutar; si
estuviera en la lista de migraciones, la prueba entera dejaría de correr. Está
en `supabase/storage/01_avatars.sql`, es idempotente y se aplica a mano una
vez. La carpeta de cada foto es el id del usuario porque la política se apoya
en ella: `(storage.foldername(name))[1] = auth.uid()`.

**El avatar sólo puede apuntar a nuestro almacén**, menos el que ya estuviera
guardado. Quien entra con X trae la foto de `pbs.twimg.com`, y guardar el
perfil sin tocarla no puede fallar por eso; pero una URL nueva y ajena sí se
rechaza, porque un avatar remoto le enseña la IP de cada visitante a un
servidor de otro.

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
npm run test:profile # la validación del perfil
npm run test:compare # el modelo de la comparación
npm run test:conditions # dificultad, duración y cámara
npm run test:backup  # vuelca, repone en una base vacía y comprueba
npm run backup       # copia de seguridad a copias/ (JSON + SQL)
npm test             # los seis de arriba
```

Antes de dar algo por bueno: `typecheck`, `lint`, **`build`** y, si has tocado
SQL, `test:sql`; y si has tocado el importador, el catálogo, el perfil, la
comparación o la copia de seguridad, `npm test`, que los pasa todos.

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
