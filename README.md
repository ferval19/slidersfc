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
4. `supabase/migrations/20260920100000_cpu_behaviour.sql` — comportamiento de
   la CPU. **Va antes del catálogo**: crea la columna `has_cpu_behaviour` que
   el catálogo escribe
5. `supabase/seed/01_catalog.sql` — juegos y catálogo de sliders
6. `supabase/migrations/20260912140000_set_slugs.sql` — URLs amigables
7. `supabase/seed/02_set_full_manual_fg.sql` — set de inicio para FC26
8. `supabase/seed/03_set_fc27_realista.sql` — valores por defecto de FC27
   (requiere haber entrado una vez con `ferval19@gmail.com`; ver
   [supabase/README.md](supabase/README.md))
9. `supabase/migrations/20260919160000_username_history.sql` — que cambiar de
   nombre de usuario no rompa los enlaces ya compartidos
10. `supabase/migrations/20260919180000_profile_youtube.sql` — el canal de
   YouTube en el perfil
13. `supabase/storage/01_avatars.sql` — almacén de las fotos de perfil. Va
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
| `npm run test:conditions` | Prueba la validación de dificultad, duración y cámara |
| `npm run test:backup` | Vuelca, repone en una base vacía y comprueba que ha vuelto todo |
| `npm test` | Los seis anteriores, en orden |
| `npm run backup` | Copia de seguridad a `copias/`: JSON + SQL de reposición |

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

### 19/09 · Que el contenido no sea rehén de un plan gratuito

`npm run backup` deja dos ficheros en `copias/`. El JSON es el archivo: las
siete tablas tal cual están. El `.sql` es lo que lo hace útil, porque una copia
que no sabes reponer no es una copia — y el camino de reposición de este
proyecto ya existe y es conocido: pegar SQL en el editor de Supabase.

Repone perfiles, sets, valores y comentarios. Los juegos y el catálogo de
sliders no, a propósito: son código, y reponerlos desde un volcado sería
quedarse con una foto vieja del catálogo.

Los sets y los comentarios conservan su UUID, así que las URLs por id siguen
valiendo. Pero el dueño va por nombre de usuario, el juego por slug y cada
valor por (slug del slider, ámbito), porque los ids de `profiles` vienen de
`auth.users` y los de `games` y `slider_definitions` son series: en otro
proyecto no coincidirían y la copia serviría de adorno.

Sin la clave de servicio la copia sólo lleva lo que vería cualquiera —RLS se
aplica igual— y el script lo avisa por pantalla. Una copia incompleta que se
cree completa es peor que no tener ninguna.

Y lo que lo sostiene: `npm run test:backup` hace el viaje entero contra un
Postgres en memoria. Vuelca, genera el SQL, lo aplica en una base vacía y
comprueba que ha vuelto todo, incluido que los valores caen en la definición
correcta pese a que los ids no coinciden.

### 19/09 · Los cuatro maestros

Una tarjeta de sliders de FC27 publicada por @WilsdorfAndreas traía arriba del
todo un aviso que no estábamos recogiendo: *«pon los cuatro maestros a 50
antes de nada»* — error de tiro, velocidad y altura de tiro, error de pase y
velocidad y altura de pase, cada uno escalando su grupo entero.

Contados uno a uno, los 45 sliders de jugabilidad de sus tarjetas ya estaban
todos en el catálogo (y nosotros tenemos 16 más, los de comportamiento de la
CPU, que sus tarjetas no cubren). Lo único que faltaba eran esos cuatro. Y no
es cosmético: un set publicado con sus 45 valores pero con un maestro en 60 no
se comporta igual en quien lo copie con los maestros a 50. Sin ellos, un set
es ambiguo.

Son sliders normales del catálogo, a la cabeza de Tiro y de Pase. Nada en la
aplicación sabe que son «maestros», y no hace falta: la marca gris de fábrica
está en su 50, así que mover uno se ve al instante.

Los nombres en español están reconstruidos a partir de la tarjeta (en inglés) y
de FC26, donde estos cuatro eran los únicos que había antes de que EA los
desdoblara por tipo. Si el menú los llama de otra forma se corrigen en
`catalog.mjs` y se regenera: los sets referencian el slug, no el nombre, así
que no se toca ningún dato.

FC27 pasa de 61 a 65 sliders, de 121 a 129 filas.

### 20/09 · Cómo se comporta la CPU

En FC27 los sliders de la pestaña de la CPU no siempre se usan: el juego deja
elegir entre **táctico**, **dinámico** y **personalizado**, y sólo en el último
significan algo. Los dos primeros los ajusta el juego según los equipos. En el
menú aparece como *AI behaviour*.

Un set que enseñara dieciséis valores de CPU sin decir en qué modo va estaba
mintiendo a medias, así que el selector aparece **en la cabecera de su propia
categoría** —donde manda— y no en los metadatos del set. Al elegir táctico o
dinámico, esos sliders desaparecen de la ficha y en su lugar queda la frase que
explica qué hace el juego.

Va **por juego**, no global: FC26 no tiene la opción, así que allí no sale
selector y sus sliders de CPU van siempre. La bandera vive en el catálogo
(`games.has_cpu_behaviour`).

Tres detalles con su porqué:

- **Los sets que ya existen se quedan en personalizado.** Ponerles táctico
  escondería unos valores que su autor sí puso. Lo que nace en táctico es lo
  nuevo, que es lo que trae el juego.
- **Cambiar de modo esconde los reguladores, no los borra**: se siguen
  enviando con el formulario, así que volver a personalizado te devuelve tus
  valores donde estaban.
- **El modo consola cambia dieciséis pasos por uno**: «Comportamiento de la
  CPU → Táctico». Mandar a alguien a teclear valores que el juego no va a usar
  es lo contrario de para lo que existe esa pantalla.

Y la comparación deja fuera esa pestaña cuando alguno de los dos sets la lleva
en automático, diciéndolo: serían diferencias que no existen en el campo.

De paso, las dos pruebas de SQL compartían una copia de la lista de migraciones
y se desviaron en cuanto entró una nueva. Ahora sale de un solo sitio
(`scripts/schema-files.mjs`), que además es donde está escrito por qué el
catálogo va en medio y no al final.

### 20/09 · Cómo lo juegas

La descripción llevaba desde el principio un recordatorio en el hueco de
escribir: «dificultad, duración de los tiempos, cámara y controles». Pedirlo en
texto libre significaba que unos lo ponían y otros no, y que no se podía
enseñar igual en ningún sitio. Ahora son campos, debajo de la descripción:
**dificultad**, **duración de cada tiempo** y **cámara** con su altura y su
zoom, cada uno con su dibujo de tiza — el de la cámara es nuevo.

Todo opcional. Un set sin esto sigue siendo un set; con esto es un set que
alguien puede reproducir. En la ficha salen arriba, junto al título, porque es
lo primero que hay que saber: los mismos valores en otra dificultad no dan el
mismo partido. Y en el modo consola van en la cabecera, que la dificultad y los
tiempos también se ponen en el menú.

La duración se guarda como **texto y no como número** a propósito: mucha gente
juega «7 u 8 minutos», y obligar a un solo número les haría mentir. Se acepta
escrito de seis formas distintas (`8`, `8 minutos`, `7-8`, `7 – 8`, `7 a 8`,
`7/8`) y se guarda normalizado; un rango al revés o con los dos números iguales
se rechaza.

La cámara es texto libre con sugerencias, no una lista cerrada. El campo sugiere
las trece del juego —Co-op, Tele Broadcast, Tele, Broadcast, EA Sports GameCam,
Classic, Tradicional, Legacy, Dynamic, End to End, Tactical, Tactical Focus y
Pro— pero admite cualquier cosa, porque esos nombres salen de guías y no de
haberlos leído en el menú en español. Lo que sí se exige es que si pones altura
o zoom haya una cámara: unos números sueltos sin saber de qué cámara no dicen
nada.

La validación y sus 32 comprobaciones las escribió Sonnet con el encargo
cerrado.

### 20/09 · Cuatro portadas y una guía

La portada decía una sola cosa —«publica tus sliders y que te discutan cada
valor»— y el producto ya hace cuatro. Ahora hay **cuatro heroes y se elige uno
al azar en cada carga**: el de los comentarios valor a valor, el de la marca de
fábrica, el del modo consola y el de las condiciones en las que se juega. Cada
uno con su dibujo de tiza, y tres son nuevos: el regulador a tamaño grande, una
muesca con su bocadillo colgando, y un mando.

No es un carrusel a propósito. Sin flechas y sin temporizador: se elige en el
servidor, se queda quieto y cambia al recargar. Un carrusel que se mueve solo
obliga a leer a su ritmo.

Y hay una página nueva, **[/guia](https://slidersfc.vercel.app/guia)**, que
explica campo por campo todo lo que se puede contar de un set y por qué importa
cada cosa: lo básico, las condiciones de juego, los valores —con una escala de
muestra donde se ve la marca de fábrica trabajando—, el comportamiento de la
CPU, los comentarios, y lo que sale solo sin rellenar nada. Se enlaza desde el
pie, desde el formulario y desde los heroes.

### 20/09 · Una barra que no te deja perderte en 129 sliders

Un set de FC 27 son nueve categorías y ciento veintinueve valores. Al bajar por
él se pierde de vista de quién es, en qué condiciones se probó y por dónde vas.
Ahora, en escritorio, al llegar a los valores se queda pegada arriba una barra
con el título del set, sus condiciones, **las nueve categorías en un clic** y el
botón de la consola. La categoría que estás mirando se marca sola.

Sólo escritorio, a propósito: nueve categorías no caben en 375 px sin
convertirse en un carrusel horizontal, y en el móvil ya está el modo consola,
que es la forma buena de recorrer un set con el teléfono en la mano.

Dos cosas que salieron por el camino. El alto de la cabecera estaba puesto a
ojo en dos sitios y en uno estaba mal por diecisiete píxeles, así que la barra
de la comparación se metía debajo; ahora sale de una variable. Y la barra
aparece con un escuchador de scroll y no con IntersectionObserver, porque el
observador no despertaba en los saltos programáticos — que es justo lo que pasa
al abrir un enlace con ancla a una categoría.

### 20/09 · Repaso de diseño de la ficha

Tres arreglos que cambian cómo se usa la página, no cómo se ve.

**Las cabeceras de columna ya no se pierden.** Había una sola arriba del todo:
en la fila sesenta de ciento veintinueve estabas leyendo «35 35» sin saber cuál
era el usuario y cuál la CPU. Ahora cada categoría lleva sus propios rótulos, y
en el móvil —donde la rejilla se apila y no cabe una cabecera— cada número
lleva su etiqueta encima.

**Fuera las columnas muertas.** Los ámbitos se calculan por categoría y no por
set: «CPU compañero» sólo existe en los sliders de comportamiento de la CPU, y
ésos a su vez no tienen lado de usuario. Antes, cuarenta y nueve filas gastaban
una columna entera en un guion. El regulador se queda con ese ancho, y en el
modo consola los números de la mayoría de filas pasan a ir un escalón más
grandes.

**Los valores llegan antes.** El título de la ficha baja un escalón —los
titulares enormes son de la portada— y se aprieta el salto hasta «Valores». En
una pantalla de escritorio, la primera categoría entra ahora en el primer
vistazo en vez de quedarse debajo del pliegue.

### 20/09 · Los seeds buscaban su set por el título

Reaplicar `03_set_fc27_realista.sql` no actualizaba el set de fábrica: creaba
uno nuevo, con el slug sufijado. El motivo es que los ficheros de inicio
identificaban su set **por el título**, y el título lo puede cambiar su autor
desde la web — que es exactamente lo que había pasado.

Ahora lo buscan por el **slug**, que se asigna una vez al crear el set y no
cambia aunque se cambie el título. El slug va además explícito en el `insert`,
para que la clave con la que el fichero se reencuentra con su set no dependa de
cómo se llame el set en ese momento.

Con su prueba de regresión: renombrar el set, reaplicar el seed, y comprobar
que no hay duplicado, que el nombre que puso su autor se respeta y que el set
sigue completo.

### 20/09 · Lo mismo en el móvil, pero sin copiar la barra

En escritorio hay una barra pegada con las nueve categorías. Portarla al móvil
habría sido lo fácil y lo peor: la cabecera del sitio ya se lleva 73 px de 812,
una segunda franja se llevaría otros 44 —un 14% de la pantalla en chrome
permanente— y aun así no verías las nueve de golpe, sino un carrusel horizontal
que además pelea con el gesto de la página.

Lo que hay ahora usa lo que ya estaba. **La cabecera de cada categoría se queda
pegada** mientras la recorres y la empuja la siguiente, como una lista del
sistema: contesta sola «¿dónde estoy?» y no cuesta un píxel, porque ese título
iba a pasar por ahí de todas formas. Y **tocándola se abre el índice**: las
nueve categorías con su dibujo, su número de sliders y la actual marcada. Un
toque de más a cambio de no pagar sitio en todas las pantallas.

De paso, el `scroll-margin` de las secciones pasa a depender del tamaño: en
escritorio descuenta la cabecera y la barra, en el móvil sólo la cabecera. Con
el valor de escritorio, saltar a una categoría dejaba asomando la anterior.

### 20/09 · La diferencia, en verde y en rojo

En la comparación, la cifra de la derecha decía cuánto sube o baja el segundo
set pero iba toda del mismo color, así que había que leer el signo uno a uno.
Ahora va **en verde cuando sube y en rojo cuando baja**, y la columna entera se
lee de un vistazo.

Con **dos colores propios**, no con los rotuladores del sistema. El verde no
puede ser el de la menta: ése ya dice «el segundo set», y con el mismo color no
se sabe si el número está pintado por lo que es o por de quién es. El de la
diferencia es un verde de hierba, que se separa de la menta por tono y por
claridad.

Los dos están medidos contra el fondo: **7,8:1 el verde y 6,7:1 el rojo**, por
encima de lo que pide la norma para texto pequeño, y la cifra va a 12 px. El
color tampoco es nunca el único canal: el signo `+` o `−` está siempre, que es
lo que salva a quien no distingue el rojo del verde. El cero se queda apagado:
que dos sets coincidan en un slider no es ni bueno ni malo.

### 20/09 · La pizarra tiene campo dibujado detrás

Tres trozos de campo al fondo, con el mismo trazo de tiza que todo lo demás: el
círculo central asomando por arriba a la derecha, la esquina del área por el
lado izquierdo y el cuarto de círculo del córner abajo. Fragmentos que se salen
por los bordes, no un campo entero — un campo completo competiría con el
contenido; tres trozos se leen como lo que quedó dibujado de otra vez.

La opacidad no es una elección estética sino un número medido. Sobre esas
líneas se lee texto, así que suben el brillo del fondo: a 0,035 la cifra verde
de la comparación baja de 7,80:1 a 7,16:1, y el listón para texto pequeño es
7:1. No hay margen. Para que se vean más se engorda el trazo, que cubre más
superficie sin cambiar el contraste por píxel.

En el móvil sólo sale uno: tres trozos en 375 px son dos de más.

**Y un punto que no debía estar.** En el listado del perfil salía la viñeta de
la lista. `SetCard` es un `<li>` y ahí colgaba de un `<div>`: un `li` huérfano
conserva su `display: list-item` y pinta su punto. Revisado que no quede
ninguno más.

### 20/09 · Historial de versiones

`slider_sets.version` subía al cambiar valores de un set publicado, pero sólo
servía para marcar los comentarios viejos como «de la v1»: **los valores de
antes no se guardaban en ninguna parte**. Ahora sí.

Se guarda el **cambio, no la foto**. Lo que interesa de un set que evoluciona
no es cómo estaba, es qué tocó su autor y cuánto — y la foto completa de una
versión vieja se reconstruye desde los valores de hoy hacia atrás. Una copia de
los 129 valores por versión sería escribir mucho para responder peor a la
pregunta de verdad. Además sale casi gratis: la acción de guardar **ya
calculaba ese diff** para decidir si subía la versión, sólo había que
escribirlo en vez de tirarlo.

Y una **nota por versión**, opcional, que es lo que le da valor: un set no es
una lista de números, es alguien afinando algo durante una temporada. Leer
«v3: bajé la velocidad dos puntos, los contragolpes eran imposibles de
defender» vale más que ver dos cifras.

En la ficha aparece entre los valores y los comentarios — primero qué es el
set, luego cómo llegó a serlo, después lo que dice la gente — con los mismos
verdes y rojos de la comparación.

Tres decisiones: sólo para sets publicados (en un borrador no hay versión que
estrenar), público si el set lo es, y **no editable** — es un registro, no un
texto más que mantener. La base lo respalda: no hay políticas de UPDATE ni de
DELETE, sólo de lectura e inserción.

Si guardar el historial falla, el set se guarda igual y el fallo queda en el
log. Perder una entrada se nota poco; perder lo que la persona acaba de
guardar, mucho.

El historial entra en la copia de seguridad, con su viaje de ida y vuelta
comprobado — esa parte la escribió Sonnet con el encargo cerrado.

---

Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.
