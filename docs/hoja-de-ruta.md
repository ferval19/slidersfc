# Hoja de ruta — SlidersFC

Corte: **27/09/2026**. FC27 salió el **25/09** y ya hay gente dentro que no
conocemos. Es el primer corte con datos en vez de suposiciones, y eso cambia
casi todo lo de abajo.

## El encuadre: esto es un pet project

Importa porque cambia el criterio. El modo de fallo de un proyecto personal no
es «no creció»: es **«se volvió una obligación y lo abandoné»**. De ahí tres
reglas que ordenan todo lo demás:

1. **Que siga siendo útil contigo solo.** El modo consola ya lo es. Cuanto más
   peso tenga lo que te sirve a ti, menos depende de que aparezca una
   comunidad.
2. **Nada que genere cola.** Moderar, responder, revisar. Una cola es un
   impuesto para siempre, y es lo que mata estos proyectos.
3. **Que aguante el abandono.** Si no lo tocas en un mes, tiene que seguir en
   pie y sin parecer muerto.

Sigue en pie entero. Es lo único de este documento que no ha cambiado.

---

## Los datos, que es lo nuevo

| | 19/09 | **27/09** |
| --- | --- | --- |
| Perfiles | 1 | **6** — tres se registraron el 26 |
| Sets publicados | 2 | **6** — uno es de **@sergiogs**, un desconocido |
| Comentarios | 0 | **1**, y es de Fernando |
| Favoritos | — | **0** |

Tres cosas que leer ahí, por orden de importancia:

**El registro no falló.** Era el riesgo marcado como «alto y con una sola
oportunidad» y lo pasó sin que nadie lo hubiera probado antes: tres personas
entraron solas el día siguiente al lanzamiento.

**Un desconocido publicó un set.** Rellenó el formulario entero, con
condiciones, y le dio a publicar. Es la segunda acción más difícil de la web.

**Nadie ha comentado.** El único comentario lo puso Fernando en el set de
@sergiogs. La tesis del producto —que la gente discuta valor a valor— sigue
**sin probar**, y ya no por falta de visitas.

---

## Qué se hizo desde el corte del 19/09

Todo lo que había en «AHORA» está hecho: catálogo reaplicado, confirmación de
correo desactivada, analítica puesta, la marca gris de fábrica y llevar un set
a otro juego.

Encima, y sin estar en ninguna lista: la guía, las condiciones opcionales de un
set, comparar dos sets, el historial de versiones, la barra pegada, los
favoritos, los iconos de la botonera, compartir una comparación con su tarjeta,
las pruebas de punta a punta con Playwright, los datos estructurados, y **la
web entera en castellano e inglés**.

Dos de ellas enseñan algo:

- **Los favoritos llevan un día publicados y se han usado cero veces.** No es
  un fracaso a estas alturas, pero conviene apuntarlo: se construyeron porque
  se pidieron, no porque hubiera una señal.
- **El inglés se hizo en dos días** y costó tres errores de 500 que ninguna
  comprobación estática vio. El impuesto que anunciaba su plan —cada texto
  nuevo nace ya en dos idiomas— se empieza a pagar ahora.

---

## AHORA — la semana del 29/09

**No construir. Mirar.** Es la recomendación de este corte, y va en serio.

| # | Qué | Por qué | Esfuerzo |
| --- | --- | --- | --- |
| 1 | **Abrir Vercel Analytics** | Nadie ha mirado un número desde el lanzamiento. ¿Cuánta gente entró? ¿Llegan a la ficha de un set o se quedan en la portada? ¿Desde dónde? Sin eso, lo que se construya se elige a ciegas | 15 min · **de Fernando** |
| 2 | **Ver si @sergiogs contesta** | Fernando comentó su set el 26. Si contesta, la tesis tiene pulso; si no, hay que preguntarse por qué | Esperar |
| 3 | **Dar una semana a los cambios del 27** | La ficha ya no anuncia «0 comentarios», los valores se ven pulsables en el móvil y hay una invitación a dejar el primero. Se cambiaron para esto: medirlos antes de tocar nada más | Esperar |
| 4 | **Los cuatro nombres «(general)» de FC27** | Están adivinados. Cuatro pantallas del menú en inglés | 10 min · **de Fernando** |

---

## SIGUIENTE — cuando (1) diga algo

| Qué | Cuándo tiene sentido |
| --- | --- |
| **Que comentar no exija cuenta**, o que la cuenta se cree al comentar | Si la analítica dice que llega gente a las fichas y no comenta. Es el peaje más caro que queda en el embudo |
| **Límite de ritmo en comentarios** | **Sólo** cuando comente un desconocido. Sigue sin pasar |
| **Clips de gameplay** | Su [ADR](clips-de-gameplay.md) está escrito y la tubería montada. La fase 0 —grabar dos tomas y comprobar que se entienden— es de Fernando y bloquea el resto |

---

## MÁS ADELANTE — si apetece

- **Consenso por slider** (mediana y distribución). Sigue siendo el foso, y
  sigue necesitando un volumen que no hay.
- **FC28**. El catálogo ya está preparado: un juego nuevo es datos, no código.
- **Los favoritos, en la copia de seguridad.** Se quedaron fuera a propósito.
- **Un dominio propio.** Lo dice el estudio de SEO del 26: para una marca
  literal como «SlidersFC» es la palanca más grande que queda, y no es una
  decisión que tome una sesión de Claude.

---

## Lo que NO haría

- **Cola de moderación, roles, notificaciones por correo, búsqueda
  full-text.** Cada una es una obligación permanente.
- **Votos o estrellas.** Canibalizan el diferencial: la gracia es que
  expliques por qué 35 y no 42. **Sigue en pie**, y por eso los favoritos no
  enseñan cuánta gente ha guardado un set.
- **App móvil.** El modo consola ya cubre el caso real.
- ~~**Traducir al inglés.**~~ Revocado el 22/09 y **hecho el 27**. El coste que
  decía era cierto y se paga en cada texto nuevo; lo que estaba mal era el
  cálculo, hecho con cero visitas.

---

## La regla que evita construir de más

**No construir más funciones de comunidad hasta que un desconocido comente.**

Con 6 perfiles, 6 sets y **un comentario que es tuyo**, la regla sigue vigente
y conviene decirlo claro: **lo construido esta semana casi no la ha violado,
pero tampoco la ha resuelto.** Los favoritos rozaron la línea. Hacer visible
que se puede comentar, no: eso es enseñar lo que ya había.

La versión corta: si una idea sólo tiene sentido cuando haya conversación,
espera a que la haya.

---

## Riesgos

| Riesgo | Impacto | Qué hacer |
| --- | --- | --- |
| **La hipótesis de comunidad no se cumple** | **Es el riesgo vivo.** Ya no es teórico: hay visitas y no hay conversación | Mirar la analítica antes de construir. Y aceptar que, si no se cumple, queda un publicador de sliders muy bueno — que es justo por lo que arriba va lo que no depende de nadie |
| **Abandono** | El principal de un proyecto personal | El modo consola, y que la web te siga sirviendo a ti aunque no venga nadie |
| **El impuesto de los dos idiomas** | Medio, y nuevo | Cada texto nace en dos sitios. `npm run test:i18n` impide que se quede a medias, pero no hace el trabajo |
| **Supabase pausa el proyecto por inactividad** | Alto: la web muere sin avisar | Con tráfico real no pasa; si se enfría, comprobarlo de vez en cuando |

---

## Lo que ya está bien y no hay que tocar

- El modelo de datos aguanta todo lo de «Más adelante» sin migraciones.
- RLS cubre las diez tablas y `npm run test:sql` lo comprueba contándolas.
- El catálogo se regenera desde un fichero, y ya trae los dos idiomas.
- Las decisiones no evidentes están en el [mapa del código](../codemap.md).
- Hay tres árboles de trabajo, uno por sesión, con sus reglas escritas ahí
  mismo. Salieron de dos sustos en veinte minutos.
