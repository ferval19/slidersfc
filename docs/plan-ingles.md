# Tener la web en inglés

**Escrito el 22/09. Revisado el 27/09**, después del lanzamiento de FC27 y con
los primeros desconocidos dentro. Lo que decía sigue en pie casi entero; lo que
ha cambiado es **por qué** conviene, y eso cambia el orden.

---

## Esto contradice una decisión anterior, y está bien

La hoja de ruta ponía «traducir al inglés» en lo que **no** haría, con este
motivo: duplica el trabajo de contenido para siempre. Se escribió con la web a
cero visitas.

El coste sigue siendo cierto. Por eso medio plan va de acotarlo, no de fingir
que no existe.

---

## Qué ha cambiado desde el 22

**La web ha crecido, pero el trabajo de traducir no.** Medido hoy: **401
cadenas en 61 ficheros y 17 rutas**. El 22 eran «unas 400». La cifra aguanta
porque lo que se ha añadido son iconos, índices y datos estructurados, no
prosa. La guía no se ha tocado.

**Hay cuatro superficies nuevas** que el plan del 22 no listaba: la tarjeta de
compartir de una comparación, el índice pegado del formulario, la imagen de
OpenGraph de la comparación y las descripciones del JSON-LD. Las dos primeras
llevan texto; las dos segundas, más.

**Y hay un dato que antes no existía: cómo escribe la gente.** Seis perfiles,
seis sets publicados, y **el 100% del contenido está en castellano**. El único
desconocido que ha publicado escribió en castellano. Ningún perfil tiene
biografía salvo el tuyo.

---

## La consecuencia incómoda, dicha entera

La decisión que sostiene todo este plan es que **el contenido de la gente no se
traduce**. Con los datos de hoy eso significa una cosa concreta: alguien que
entre por `/en` se encontrará una interfaz en inglés alrededor de **seis sets
escritos en castellano**.

Suena a plan roto. No lo es, y la razón importa:

> **Un set es nombres y números.** Los nombres salen del catálogo, que va a
> estar en inglés porque se lee del juego. Los números no tienen idioma. La
> descripción y los comentarios son lo único que se queda en castellano.

Traducir el armazón y el catálogo **sí entrega lo que alguien viene a buscar**.
Lo que no entrega es la conversación.

Y aquí está la otra cara: **hoy hay cero comentarios**. Lo que la decisión de
no traducir te hace perder es, ahora mismo, casi nada — y sólo va a ir a más.
Si esto se hace, **se hace barato ahora**.

---

## Lo que hay que traducir, medido hoy

| Qué | Tamaño | Dificultad |
| --- | --- | --- |
| Texto de interfaz | **401 cadenas** en 61 ficheros / 17 rutas | Mecánico, pero está por todas partes |
| Catálogo de sliders | 94 nombres + 9 categorías | **No es traducir: es dato del juego** |
| La guía (`/guia`) | ~1.500 palabras | Redacción de verdad |
| Los cuatro heroes | 4 × (antetítulo + 3 líneas + cuerpo) | Copy con voz; traducir literal lo aplana |
| Errores de acceso | ~45 casos (`auth-errors.ts`) | Mecánico |
| **Las dos tarjetas de compartir** | ~8 cadenas, castellano quemado | Pequeño y **es lo que circula** |

Los cinco ficheros con más texto, por si hace falta empezar por algún sitio:
`guia/page.tsx` (51), `auth-errors.ts` (41), `login-form.tsx` (19),
`profile-form.tsx` (19), `actions/sets.ts` (18).

---

## Lo que NO se traduce

- **Títulos, descripciones y comentarios de los sets.** Son de quien los
  escribe. Traducir el comentario de otro es ponerle palabras en la boca.
- **Las notas de versión del historial.** Mismo motivo.
- **Los nombres de usuario.** Obvio, pero se olvida al montar el diccionario.

La web queda **bilingüe en su envoltorio y multilingüe en su contenido**, que
es lo que ya son los foros de sliders de verdad.

---

## El catálogo no es una traducción

«Error en tiros de calidad» tiene un nombre oficial en inglés y no es el que yo
elija. Si lo invento, el set no se puede seguir con el menú del juego delante —
que es exactamente para lo que existe esta web.

**Se leen del juego.** Es la misma regla que ya costó cara dos veces con los
nombres en castellano.

→ Era la **fase 0**. **Hecha el 27/09, por otro camino**: los slugs del
catálogo ya eran los nombres ingleses en minúsculas —`sprint_speed`,
`line_width`, `goalkeeper_ability`—, así que no hubo que traducir del
castellano, sino des-slugificar y contrastar. Los 94 `nameEn` están en
`catalog.mjs`.

**Lo que eso no arregla.** `name` está leído del juego; `nameEn` está
derivado. Para `sprint_speed` da igual, es «Sprint Speed» desde hace quince
años. Para lo que **FC27 estrena** no hay precedente que valga, y ahí sigue
haciendo falta una mirada al menú en inglés. Doce nombres, cuatro pantallas:

| Slug | Castellano (leído) | Inglés (derivado) |
| --- | --- | --- |
| `master_shot_error` | Error de tiro (general) | Shot Error (Master) |
| `master_shot_speed` | Velocidad y altura de tiro (general) | Shot Speed & Height (Master) |
| `master_pass_error` | Error de pase (general) | Pass Error (Master) |
| `master_pass_speed` | Velocidad y altura de pase (general) | Pass Speed & Height (Master) |
| `shot_error` | Error en tiros normales | Normal Shot Error |
| `pass_error` | Error en pases rasos normales | Normal Ground Pass Error |
| `jog_dribbling` | Conducción al trote | Jog Dribbling |
| `sprint_dribbling` | Conducciones en carrera | Sprint Dribbling |
| `controlled_sprint_dribbling` | Conducciones controladas en carrera | Controlled Sprint Dribbling |
| `jockey_speed` | Velocidad de brega normal | Normal Jockey Speed |
| `physicality_impact` | Impacto del físico | Physicality Impact |
| `cpu_professional_frequency` | Frecuencia de faltas tácticas | Professional Foul Frequency |

No bloquean: se puede empezar la fase 1 con estos doce como están y corregirlos
cuando se miren. Es un `nameEn` en un fichero, no una migración.

**FC26 también los tiene**, pero no hace falta revisarlos: son los clásicos de
siempre y el juego ya no importa.

---

## Decisión de URL: `/en/...`

Castellano en la raíz, inglés bajo `/en`. Descartadas:

- **Sólo cookie**, sin cambiar la URL. Más barato, pero entonces no se puede
  compartir ni indexar «la página en inglés» — que es el motivo de todo esto.
- **Subdominio** `en.slidersfc…`. Pide tocar DNS para nada que el prefijo no dé,
  y reparte la autoridad de un dominio que además todavía no es tuyo.

---

## El inglés no es una jugada de SEO, y conviene saberlo antes de empezar

El estudio del 26/09 dice dos cosas que apuntan aquí:

1. `site:slidersfc.vercel.app` **no devuelve nada**. Google no ha indexado ni
   una página.
2. En inglés, «sliders FC» lo copan **Operation Sports, Dexerto y GameTyrant**.

Traducir al inglés es entrar en el terreno de esos tres, con cero autoridad,
sin indexar y desde un subdominio de Vercel que no es tuyo. **Como palanca de
búsqueda, no va a mover nada a corto plazo.**

Lo que sí mueve: **la gente que ya habla contigo en X**. Ése es el público real
y llega **por enlace compartido**, no por búsqueda.

Y eso decide el orden: lo primero que hay que tener en inglés es **aquello en
lo que aterriza un enlace compartido** — la ficha de un set, la comparación y
las tarjetas que se ven en el propio tuit. La guía puede esperar.

---

## Cómo acotar el impuesto

Tres reglas, y son la mitad del valor de este documento:

1. **Un fichero por idioma y ninguno más.** `src/lib/i18n/es.ts` y `en.ts`, con
   el mismo tipo. Nada de texto suelto en los componentes.
2. **Una prueba que falle si falta una clave** en cualquiera de los dos. Va en
   `npm test`, junto a las otras seis. Sin esto, en dos semanas el inglés está
   a medias y nadie se entera.
3. **El catálogo sigue viviendo en `catalog.mjs`**, con un `nameEn` al lado de
   cada `name`. Una sola fuente de verdad, como hasta ahora.

**Sin librería.** Para dos idiomas y un formato de fecha, `next-intl` trae más
superficie de la que ahorra. Un diccionario, una función `t()` con tipos y la
prueba de arriba.

---

## Fases

### Fase 0 — Los nombres del juego · **de Fernando** · BLOQUEA TODO
Poner FC27 en inglés y capturar los menús de sliders, igual que con las 18
capturas de septiembre. **Sigue sin hacer.** Nada empieza sin esto.

### Fase 1 — El armazón y lo que aterriza un enlace · **HECHA el 27/09**
El prefijo `/en`, el diccionario, la prueba de claves, el selector, el `lang` y
el `hreflang`, y el catálogo bilingüe.

Traducido, por este orden: **ficha de un set** → **comparación** → **las dos
tarjetas de compartir** → **portada** → **modo consola**.

La ficha va primera y no la portada, y es un cambio respecto al 22: quien llega
de X no aterriza en la portada, aterriza en el set que le han pasado.

El catálogo no se puede dejar para después: una ficha con la interfaz en inglés
y los sliders en castellano no sirve de nada.

### Fase 2 — Lo que se escribe · **HECHA el 27/09**

Del camino de escribir ya está hecho **el acceso entero** —entrar, registrarse,
recuperar la contraseña y sus ~41 errores— porque es el que va de leer a
comentar, y con cero comentarios de desconocidos no convenía tenerlo roto.
Queda el formulario de sets, el perfil y la guía.

Formulario de sets, perfil, acceso y sus ~45 errores, y la guía. Es para quien
ya ha decidido quedarse.

### Fuera a propósito
- **Los correos de Supabase.** Sus plantillas son del proyecto, no del usuario:
  o están en un idioma o en el otro. Se quedan en inglés, que es lo menos malo
  para quien no entiende ninguno de los dos.
- **Detectar el idioma del navegador y redirigir.** Molesta más de lo que ayuda
  y rompe los enlaces compartidos. El selector se ve y punto.

---

## Detalles que es fácil olvidar

- `<html lang>` en `layout.tsx`, hoy fijo a `es`.
- `openGraph.locale`, hoy `es_ES`.
- `hreflang` recíproco en las dos versiones de cada página.
- El `sitemap.ts` tiene que emitir las dos.
- **Las dos tarjetas de compartir llevan castellano quemado**: «Se separan en X
  de Y», «Son el mismo set», «Los N valores coinciden», «sliders». Son lo que
  se ve en el tuit, antes que la web.
- Las descripciones del JSON-LD y el `alt` de las imágenes de OpenGraph.
- El importador de texto debe reconocer los nombres **en los dos idiomas**:
  alguien pegará un set copiado de un foro inglés.
- `toLocaleDateString('es-ES')`, repartido por varios ficheros.

---

## Lo que yo recomendaría

**Fase 1 entera, y parar ahí un tiempo.** Deja la web utilizable en inglés para
quien llega de fuera, que es el problema que viste, sin comprometerte todavía a
mantener la guía en dos idiomas.

Y antes de nada, la **fase 0**. Es lo único que bloquea, y es tuya.

**Una cosa más, sobre el cuándo.** Cinco días después del lanzamiento hay tres
desconocidos dentro, un set ajeno publicado y **cero comentarios**. El número
que decide si este proyecto tiene futuro no es el de idiomas: es el de
comentarios. Si sólo hay sitio para una cosa esta semana, la cosa es averiguar
por qué nadie comenta — el inglés multiplica una tesis que todavía no se ha
demostrado en castellano.

Dicho eso: el impuesto de traducir **nunca va a ser más barato que hoy**, con
seis sets y ningún comentario que se quede sin traducir. Las dos cosas son
verdad a la vez, y la elección es tuya.
