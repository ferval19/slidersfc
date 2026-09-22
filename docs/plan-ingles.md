# Plan: SlidersFC en inglés

Corte: **22/09/2026**. Escrito después de que Fernando detectara interacción
con público de habla inglesa.

## Esto contradice una decisión anterior, y está bien

La hoja de ruta tiene «traducir al inglés» en **lo que NO haría**, con este
motivo: «duplica el trabajo de contenido para siempre». Eso se escribió cuando
la web tenía **cero visitas**. Era una apuesta razonable sin datos, y ahora hay
datos que la contradicen.

Lo que **no** cambia es el coste. Sigue siendo verdad que duplica el trabajo
para siempre, y la mitad de este plan trata de acotar ese impuesto en lugar de
fingir que no existe.

## Lo que hay que traducir, medido

| Qué | Tamaño | Dificultad |
| --- | --- | --- |
| Texto de interfaz | ~400 cadenas en 20 rutas | Mecánico, pero está por todas partes |
| Catálogo de sliders | 94 nombres + 9 categorías | **No es traducir: es dato del juego** |
| La guía (`/guia`) | ~1.500 palabras | Redacción de verdad |
| Los cuatro heroes | 4 × (antetítulo + 3 líneas + cuerpo) | Copy con voz; traducir literal lo aplana |
| Mensajes de error de acceso | ~45 casos | Mecánico |

## Lo que NO se traduce, y es la decisión que salva el proyecto

**El contenido de la gente se queda como lo escribió su autor.** Títulos,
descripciones, comentarios, notas de versión, biografías. Un set escrito en
castellano sigue en castellano aunque lo abras en `/en`.

No es pereza: es lo único sostenible. No puedes traducir el comentario de otro
sin ponerle palabras en la boca, y una traducción automática de «ese 35 se me
queda corto con equipos de segunda» sería peor que el original. La web pasa a
ser **bilingüe en su envoltorio, y multilingüe en su contenido**, que es lo que
ya son los foros de sliders de verdad.

Consecuencia que conviene asumir de antemano: un angloparlante verá la interfaz
en inglés y algunos sets en castellano. Es aceptable — los números se entienden
igual, y el catálogo sí estará en su idioma.

## El catálogo no es una traducción

Los 94 nombres de sliders **no se traducen: se leen del juego en inglés**. EA
publica FC en los dos idiomas; «Error en tiros de calidad» tiene un nombre
oficial en inglés y no es el que yo elija.

Esto ya nos costó caro dos veces con los nombres en castellano de FC27. La
regla se mantiene: **nada de inventar nombres del juego**.

→ **Hace falta de Fernando**: poner el juego en inglés y capturar los menús de
sliders, igual que hizo con las 18 capturas de septiembre. Es la tarea que
bloquea todo lo demás, y no la puedo hacer yo.

## Decisión de URL: `/en/...`

Tres opciones, y por qué una:

- **Sólo cookie**, misma URL para los dos idiomas. Lo más barato. **Descartado**:
  no se puede compartir «la página en inglés» ni indexarla, y el motivo de todo
  esto es justamente llegar a gente nueva.
- **Subdominio** `en.slidersfc.com`. Correcto pero pide tocar DNS y Vercel para
  nada que el prefijo no dé.
- **Prefijo de ruta** `/en/...`, castellano en la raíz. ✅ Compartible,
  indexable, y con `hreflang` los buscadores entienden que son la misma página
  en dos idiomas.

Las URL de los sets no cambian: `/u/usuario/slug` sale del título que puso su
autor, y eso es contenido suyo.

## Cómo acotar el impuesto

Tres reglas, y las tres tienen que estar desde el primer día o no sirven:

1. **Un fichero por idioma**, `messages/es.json` y `messages/en.json`, con las
   mismas claves. Nada de texto suelto en los componentes.
2. **Una prueba que falle si falta una clave** en cualquiera de los dos. Veinte
   líneas, al lado de las otras pruebas. Sin esto, en dos semanas el inglés
   está a medias y nadie se entera.
3. **El catálogo sigue saliendo de un solo fichero**: `catalog.mjs` gana un
   `nameEn` por slider. Un juego nuevo (FC28) sigue siendo un rato de datos, no
   de código, sólo que ahora con dos nombres.

Sin librería: para dos idiomas, sin plurales complicados y con un solo formato
de fecha, `next-intl` trae más superficie de la que ahorra. Un diccionario y
una función `t()` con tipos bastan, y encajan con cómo está hecho el resto.

## Fases

### Fase 0 — Los nombres del juego · **de Fernando**
Poner FC27 en inglés y capturar los menús de sliders. Sin esto no empieza nada.

### Fase 1 — El armazón y lo que se lee
El prefijo `/en`, el diccionario, el selector de idioma, el `lang` y el
`hreflang`, y el catálogo bilingüe. Traducido: portada, ficha de un set, modo
consola, comparación y las tarjetas de compartir (que llevan castellano
quemado).

Es lo que necesita quien llega desde un enlace compartido, que es el 90% de las
visitas nuevas. **Dos o tres sesiones.**

El catálogo no se puede dejar para después: una ficha con la interfaz en inglés
y los sliders en castellano no sirve de nada, y la ficha es el destino.

### Fase 2 — Lo que se escribe
Formulario de sets, perfil, acceso y sus mensajes de error, y la guía. Es para
quien ya ha decidido quedarse. **Una o dos sesiones.**

### Lo que se queda fuera a propósito
- **Los correos de Supabase** (acceso, recuperar contraseña). Sus plantillas son
  del proyecto, no del usuario: o están en un idioma o en el otro. Se quedan en
  inglés, que es lo menos malo para quien no entiende ninguno de los dos.
- **Detectar el idioma por el navegador y redirigir.** Molesta más de lo que
  ayuda y rompe los enlaces compartidos. El selector se ve y punto.

## Detalles que es fácil olvidar

- `<html lang>` y `openGraph.locale`, hoy fijos en `es`.
- `hreflang` cruzado en cada página y las dos versiones en el `sitemap.xml`.
- Las tarjetas de OpenGraph llevan «comentarios» y «de fábrica» quemados.
- El importador de texto empareja por nombre de slider: debería aceptar los dos
  idiomas, que es casi gratis con el catálogo bilingüe.
- Las fechas van con `toLocaleDateString('es-ES')`.
- `SITE_TAGLINE` y los metadatos de la raíz.

## Lo que yo recomendaría

Hacer la **fase 1 entera y parar ahí un tiempo**. Deja la web utilizable en
inglés para quien llega de fuera, que es el problema que has visto, sin
comprometerte todavía a mantener la guía en dos idiomas.

Y antes de nada, la fase 0. Es lo único que bloquea, y es tuya.
