# Hoja de ruta — SlidersFC

Estado: MVP funcionando. Fecha de este corte: 12/09/2026.

## El calendario que ordena todo lo demás

| Fecha | Qué |
| --- | --- |
| **18/09** | Acceso anticipado a FC27: se puede ver el menú de sliders definitivo |
| **25/09** | Lanzamiento de FC27 |

El pico anual de búsquedas de este nicho es la semana del 25, cuando a todo el
mundo se le queda obsoleto su set. Quedan **13 días**, y el catálogo de FC27 ya
no es una incógnita bloqueante: tiene fecha propia el 18 y es una tarde de
comprobar nombres, no de investigar.

Eso convierte la prioridad en una pregunta sola: **¿qué tiene que estar listo
para el 25?** Lo que no responda a eso, espera.

## El criterio de priorización

Con la web recién abierta hay un problema de arranque en frío: el diferencial
—comentar valor por valor— **no sirve de nada hasta que hay gente dentro**. Así
que arriba va lo que es útil **con cero usuarios más**, y después lo que
necesita comunidad.

| | Útil con 0 usuarios | Necesita comunidad |
| --- | --- | --- |
| **Alto valor** | Modo consola, importar set, catálogo de FC27 | Comentarios, consenso |
| **Bajo valor** | Etiquetas, historial | Gamificación, votos |

Por eso el modo consola y el importador van antes que cualquier mejora de los
comentarios, aunque los comentarios sean la razón de ser del producto: son lo
que hace que la web valga la pena visitar el primer día.

---

## AHORA — antes de que salga FC27

Presupuesto realista: unas 10 tardes. Es todo lo que hay.

| # | Qué | Por qué ahora | Esfuerzo |
| --- | --- | --- | --- |
| 1 | **SMTP propio** (Resend, Brevo, SES) | Bloqueante. El SMTP de serie de Supabase da unos pocos correos **por hora y por proyecto**: con él, dos personas registrándose a la vez dejan fuera al resto | 1 tarde |
| 2 | **Acceso con X** | Bloqueante de hecho: tu audiencia ya está en X y así nadie depende del correo. El botón está hecho, falta activar el proveedor | 1 hora |
| 3 | **Quitar Deployment Protection** y dominio propio | Ahora mismo la web sólo la ves tú | 30 min |
| 4 | **Confirmar el catálogo de FC27** con el juego delante | Ya está cargado a partir de las Pitch Notes de EA y del listado de fifauteam: 61 sliders, 121 filas. Falta cotejar los nombres del menú en español y el rango 1-99. Nombres mal = pierdes credibilidad ante justo la gente que se fija | 1 tarde, el **18/09** |
| 5 | **Modo consola** | *La* función de retorno. Un set se usa con el móvil en la mano navegando menús en la tele: vista móvil, orden del menú del juego, números grandes y una marca por slider según los metes. Nadie más lo hace | 2 tardes |
| 6 | **Importar set desde texto pegado** | La diferencia entre 2 y 15 sets el día del lanzamiento. La gente ya tiene sus sliders en Notion, en una captura o en un hilo; pegarlos y mapearlos al catálogo convierte 15 minutos de formulario en 30 segundos | 2 tardes |
| 7 | **Mínimos de moderación**: borrar tu propio comentario, reportar, límite de ritmo | La acción de borrar ya existe pero no tiene interfaz. Sin esto, el primer troll es un problema manual | 1 tarde |
| 8 | **Analítica** (Vercel Analytics o Plausible) | Sin esto vas a ciegas en la única semana que importa | 30 min |

## SIGUIENTE — 1 a 3 meses, con gente dentro

| # | Qué | Por qué | Esfuerzo |
| --- | --- | --- | --- |
| 9 | **Avisos por correo** cuando alguien comenta tu set | El bucle de retorno del producto. Depende de (1) | 1-2 tardes |
| 10 | **Editar perfil** (bio, avatar, handle de X) | Hoy es imposible: sólo lo pone el trigger al registrarse | 1 tarde |
| 11 | **Paginación y búsqueda** del feed | El feed corta en 30 sets sin más | 1-2 tardes |
| 12 | **Duplicar un set ajeno** como punto de partida | El 90% del valor del «fork con diff» con el 10% del trabajo | 1 tarde |
| 13 | **Historial de versiones visible** | Ya se guarda `version` y los comentarios saben de qué versión son; falta enseñarlo | 1-2 tardes |
| 14 | **Página de error propia** y `error.tsx` | Hoy un fallo enseña la pantalla cruda de Next | 2 horas |
| 15 | **Pruebas de humo** (Playwright) de tres caminos: entrar, publicar un set, comentar un valor | Lo único que se ha roto dos veces en esta obra ha sido el login. Las pruebas de SQL ya existen; falta la app | 2 tardes |

## MÁS ADELANTE — apuestas, 3 a 6 meses

| # | Qué | Por qué esperar |
| --- | --- | --- |
| 16 | **Consenso por slider**: mediana y distribución de cada valor por juego | Es el foso defensivo a largo plazo y lo que hace la web indexable por sí sola («qué pone la gente en Sprint Speed en FC27»). Necesita volumen: con 5 sets, una mediana es ruido |
| 17 | **Fork con diff visual** entre dos sets | Necesita que haya sets de los que partir |
| 18 | **Comparar dos sets** lado a lado | Misma razón |
| 19 | **Etiquetas por estilo** (simulación, arcade, competitivo) | Sin volumen no hay nada que filtrar |
| 20 | **Roles y moderación de verdad** | Cuando el volumen lo pida, no antes |

## Lo que NO haría

Decirlo explícitamente ahorra discusiones después.

- **Votos o estrellas en los sets.** Canibalizan el diferencial: la gracia es
  que expliques por qué 35 y no 42, no que pongas cuatro estrellas y te vayas.
- **Gamificación** (puntos, insignias, rachas). Audiencia pequeña y experta:
  huele a producto que no confía en su contenido.
- **App móvil.** El modo consola bien hecho en web cubre el caso real.
- **Vídeo o clips.** Otro producto, otro coste.
- **Traducir la web al inglés** *todavía*. Duplica el trabajo de contenido y tu
  semilla es hispanohablante. Cuando haya tracción, es la primera palanca de
  crecimiento — no antes.

## Riesgos y dependencias

| Riesgo | Impacto | Qué hacer |
| --- | --- | --- |
| **La semilla de autores no cuaja** | Alto: sin sets ajenos, la web es un publicador de una sola persona | El importador (6) baja el coste de publicar. Habla con los 5-10 antes del lanzamiento, no después |
| **Los nombres del catálogo de FC27 no son los del menú** | Bajo ya: la estructura está y cuadra con las cifras de EA (+23 y +9 frente a los +25 y +10 anunciados). Lo que falta son los rótulos | (4) el 18/09. Se corrigen en `catalog.mjs` y se regenera |
| **El SMTP se queda corto en el pico** | Alto: nadie entra el día que más gente llega | Con (2) el correo deja de ser el único camino |
| **Trabajas solo y a ratos** | Alto: 10 tardes es el techo | Si algo entra en Ahora, algo sale. El orden de la tabla ya es el orden de recorte: de abajo hacia arriba |

## Nota sobre el catálogo de FC27

Está cargado ya, pero **es preliminar**: reconstruido antes del lanzamiento a
partir de las Pitch Notes de EA y del listado publicado por fifauteam. Lo que
sé y lo que no:

**Fiable** — la estructura. EA anuncia 25 sliders de jugabilidad y 10 de CPU
nuevos, y el listado da +23 y +9 frente a FC26: cuadra. Y confirma el desdoble
**CPU rival / CPU compañero**, que sólo afecta a los de comportamiento de la
CPU: los de jugabilidad siguen siendo usuario / CPU rival. Eso corrige lo que
había antes, que daba tres lados a todos los sliders.

**Por confirmar el 18/09** — los rótulos exactos del menú en español (los he
traducido yo: «tiro colocado» para *finesse*, «contención» para *jockey*,
«faltas tácticas» para *professional*…), si falta algún slider, y si el rango
es 1-99 como dice la fuente. FC26 se queda en 0-100 hasta tener evidencia de
lo contrario.

Los slugs son lo que no conviene cambiar después; los nombres se corrigen en
`supabase/seed/catalog.mjs` y se regenera con un comando.

## Lo que ya está bien y no hay que tocar

Para no gastar tardes en lo que no lo necesita:

- El modelo de datos aguanta lo de «Más adelante» sin migraciones grandes:
  `applies_to`, el versionado y los comentarios anclados ya están.
- RLS cubre las seis tablas y está comprobada.
- El catálogo se regenera desde un fichero, así que un juego nuevo es un rato
  de datos, no de código.
- `npm run test:sql` prueba migraciones y seeds contra un Postgres real antes
  de tocar Supabase.
