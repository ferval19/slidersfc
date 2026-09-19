# SlidersFC

Sliders de EA SPORTS FC publicados por la comunidad, con comentarios anclados a
cada slider individual. Sub-marca de **Full Manual FG**.

Stack: Next.js 16 (App Router, TypeScript, Tailwind v4) + Supabase (Postgres, Auth, RLS).

- [Mapa del código](codemap.md) — qué hay dónde y las decisiones que no se deducen leyendo
- [Dirección visual](docs/direccion-visual.md) — la pizarra del entrenador
- [Hoja de ruta](docs/hoja-de-ruta.md) — qué viene y en qué orden
- [Comunicación en X](docs/comunicacion-x.md) — el plan de lanzamiento, con los posts escritos
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
8. `supabase/migrations/20260919160000_username_history.sql` — que cambiar de
   nombre de usuario no rompa los enlaces ya compartidos
9. `supabase/migrations/20260919180000_profile_youtube.sql` — el canal de
   YouTube en el perfil
10. `supabase/storage/01_avatars.sql` — almacén de las fotos de perfil. Va
    aparte de las migraciones porque es configuración de Storage y
    `npm run test:sql` no puede probarla

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
| `npm run test:import` | Prueba el importador de texto pegado contra el catálogo real |
| `npm run test:profile` | Prueba la validación del perfil |
| `npm run test:compare` | Prueba el modelo de comparar dos sets |
| `npm test` | Los cuatro anteriores, en orden |

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

### 19/09 · Sliders fantasma y hoja de ruta de pet project

El borrado de sincronización del catálogo miraba sólo el `slug`, así que
veinte ámbitos «CPU compañero» de la versión preliminar de FC27 seguían vivos
en la base de datos: sliders fantasma en la ficha. Ahora se borra por
**(slug, ámbito)**, con prueba de regresión.

La [hoja de ruta](docs/hoja-de-ruta.md) se rehace con el encuadre de proyecto
personal: arriba lo que sirve contigo solo, fuera lo que genera cola, y una
regla explícita — no construir más funciones de comunidad hasta que un
desconocido comente.

### 19/09 · La marca de fábrica

Los valores que trae FC27 de fábrica pasan al catálogo, a `default_value`, y
la ficha de un set los dibuja como una marca gris detrás de cada muesca. Con
eso, un set deja de ser una lista de números y se lee como **qué ha tocado
esta persona y cuánto**: si la muesca está sobre la marca, no lo ha tocado.

Vive en el catálogo y no en el set de referencia a propósito: así no depende
de que exista una fila que alguien podría borrar, no añade consultas, y el
formulario arranca un set nuevo con lo que trae el juego en vez de con
cincuentas. En FC26 no conocemos el preajuste, y la interfaz lo detecta sola
para no enseñar una referencia falsa.

Y analítica, que es una línea y la única forma de saber si el 25 entró
alguien.

### 19/09 · Llevar un set al juego nuevo

Con FC27 a la vuelta, quien tenga un set de FC26 no va a querer meter treinta
valores otra vez. «Llevar a FC27» empareja por slug, aplica los dos renombres
de EA y crea un **borrador** que lleva a revisar. Con el set de Full Manual FG
viajan **49 de 50 valores**; el único que se queda fuera es «Agresividad en las
entradas», que FC27 parte en dos y elegir una sería inventar. Los 72 sliders
nuevos arrancan con lo que trae el juego.

### 19/09 · Pegar un set en vez de teclearlo

Rellenar 61 sliders a mano son quince minutos, y es el peaje que hay entre
tener un set escrito y publicarlo. Ahora el formulario acepta el texto tal cual
esté: la tabla de Notion con tabuladores, Notion pegado celda a celda, una
tabla en Markdown, o el texto corrido de un mensaje con «usuario 65, CPU 70».

Lo que se ve antes de aplicar nada es a propósito: cuántos sliders se han
reconocido de cuántos hay, con qué valor ha quedado cada uno, qué valores se
han recortado por salirse del rango del juego y **qué líneas no se han
entendido**. Un importador que se traga lo que no sabe leer es peor que no
tenerlo, porque publicas un set con valores que no son los tuyos.

El análisis es un módulo sin UI, y `npm run test:import` lo prueba contra el
catálogo de verdad: las cuatro formas de pegar, que el nombre largo gane al
corto que lo prefija, que un «8 minutos» no se cuele como valor y que los 61
sliders de FC27 se reconozcan enteros.

### 19/09 · La ficha: editar el perfil

Hasta hoy el perfil lo escribía el trigger al registrarte y ahí se quedaba:
ni foto, ni biografía, ni cambiar el nombre. Y el perfil no es adorno en esto:
quien abre un set quiere saber quién lo firma y **cómo juega**, porque unos
valores sin saber la dificultad, la duración de los tiempos o la cámara no
significan lo mismo.

La página se ordena alrededor de una **ficha en vivo**: arriba, tal como te
van a ver, con la foto que se cambia pinchándola y el nombre y la biografía
actualizándose mientras escribes. Debajo, los campos. El nombre de usuario se
escribe dentro de su propia URL —`slidersfc.vercel.app/u/…`— y se normaliza al
vuelo: «Pepé García» se queda en `pepe_garcia` según lo tecleas, en vez de
rechazártelo al guardar.

Lo que hace que cambiar de nombre no dé miedo es una tabla: **`username_history`**.
El nombre está en la URL de todo lo que has compartido, así que al cambiarlo el
viejo queda como alias y `/u/<viejo>` y sus sets redirigen al nuevo. El enlace
que pegaste en un grupo hace dos meses sigue funcionando.

La foto se recorta en cuadrado y se reduce a 512 px **en el navegador** antes
de subir: la misma foto de móvil pasa de cuatro megas a unas decenas de kilos.
Cada quien escribe sólo dentro de su carpeta del almacén, y sólo se acepta una
URL de ahí: un avatar remoto le enseñaría la IP de cada visitante a un
servidor ajeno. La única excepción es la foto de X de quien entró con X, que
ya estaba guardada y pasa tal cual.

### 19/09 · Comparar dos sets

La marca de fábrica contestaba «qué ha tocado esta persona». Faltaba la
pregunta que se acaba haciendo todo el mundo: **en qué se diferencia de lo que
yo tengo puesto**. Eso es `/comparar`.

Cada slider sale con las dos muescas en el mismo carril y **la distancia
dibujada entre ellas**, que es lo que se lee antes que los números. Cuando
coinciden, una sola muesca partida en dos colores: ahí no hay nada que
discutir. El titular lo resume — «Se separan en 23 de 61» — y hay dos mandos:
el orden del menú del juego (por defecto, porque lo primero que hace uno es
sentarse a meterlos) y el orden por diferencia, que explica el otro set en diez
segundos. Más un filtro para esconder lo que coincide.

El color cambia de significado aquí y es deliberado: en una ficha dice el
ámbito, al comparar dice de quién es el valor. El ámbito pasa a ir escrito a la
izquierda de cada carril.

Sólo se compara dentro del mismo juego. FC26 y FC27 no son dos versiones de la
misma lista sino listas distintas, así que el selector ni siquiera ofrece la
mezcla. El enlace va en la ruta —`/comparar/<usuario>/<set>/<usuario>/<set>`—
porque una comparación es justo de lo que se pega en un grupo.

Reparto del trabajo: el modelo (`src/lib/compare.ts`) y sus 16 comprobaciones
los escribió Sonnet con el encargo cerrado; el diseño, la interfaz y las rutas,
Opus. Es la primera vez que se aplica la regla de trabajo del mapa del código.

### 19/09 · Sliders de verdad para poner sliders

Meter un set era ir picando números en casillas. En una web que va de
reguladores, eso era la contradicción de la casa — y en el móvil, que es por
donde va a entrar la gente, era además lento.

Ahora cada valor es un **regulador que se arrastra**: un `input type="range"`
nativo vestido de tiza, con el mismo carril y la misma marca gris de fábrica
que ya se ven en la ficha de un set. Nativo a propósito: así funcionan el
teclado y el lector de pantalla sin escribir nada, y sobre todo funciona el
gesto que importa en un móvil — tocar en cualquier punto del carril lleva la
muesca ahí, sin tener que acertarle al pulgar.

Arrastrar sirve para acercarse. Para clavar un 48 no: en una pantalla de 375 px
hay tres píxeles por unidad. Por eso cada regulador lleva **−1 y +1** en
botones grandes y la casilla del número sigue ahí para teclear. Ese es el
reparto: el dedo para lo bruto, los botones para lo fino.

Dos cosas que no se ven pero sostienen esto. Las filas están **memorizadas**
con un comparador que mira sólo sus propios valores, porque si no, arrastrar
uno repintaba los ciento veintidós en cada píxel del gesto. Y las **categorías
se pliegan**: un set de FC27 eran diecinueve pantallas de móvil, plegado son
dos y media. Plegar esconde pero no desmonta, que un regulador desmontado deja
de enviarse y su valor se perdería en silencio.

### 19/09 · El canal de YouTube en el perfil

Junto a la cuenta de X. Se guarda la URL entera y no un identificador porque un
canal se puede señalar de cuatro formas (`@handle`, `/channel/UC…`, `/c/…`,
`/user/…`) y quedarse con el handle dejaría fuera a los canales antiguos. Se
puede pegar el enlace tal cual, con o sin `https`, con `www` o con `m.`, con
subruta o con parámetros: se normaliza solo y la ficha de arriba enseña al
momento cómo ha quedado. El enlace de un vídeo se rechaza con su motivo — es un
vídeo, no un canal. La validación la escribió Sonnet con el encargo cerrado, y
son 43 comprobaciones.

---

Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.
