# Hoja de ruta — SlidersFC

Corte: **19/09/2026**. FC27 sale el **25/09**.

## El encuadre: esto es un pet project

Importa porque cambia el criterio. El modo de fallo de un proyecto personal no
es «no creció»: es **«se volvió una obligación y lo abandoné»**. De ahí tres
reglas que ordenan todo lo de abajo:

1. **Que siga siendo útil contigo solo.** El modo consola ya lo es. Cuanto más
   peso tenga lo que te sirve a ti, menos depende de que aparezca una
   comunidad.
2. **Nada que genere cola.** Moderar, responder, revisar. Una cola es un
   impuesto para siempre, y es lo que mata estos proyectos.
3. **Que aguante el abandono.** Si no lo tocas en un mes, tiene que seguir en
   pie y sin parecer muerto.

Por eso aquí no hay notificaciones, ni roles, ni búsqueda: no porque sean
malas ideas, sino porque cada una te ata.

## Qué ha cambiado desde el corte anterior (12/09)

**Hecho**: modo consola · catálogo real de FC27 desde el juego · set de
referencia con los valores de fábrica · acceso con contraseña · URLs amigables
· compartir y tarjetas de OpenGraph · favicon · orden del menú · mapa del
código e historial.

**Encontrado hoy**: 20 sliders fantasma en FC27 (ámbitos «CPU compañero» de la
versión preliminar). El borrado de sincronización miraba sólo el slug. Ya está
arreglado, con prueba de regresión — falta reaplicar el catálogo.

**Reordenado**: «comparar sets» sube de *Más adelante* a *Ahora*. Antes
esperaba a tener volumen; con el set de fábrica ya cargado, el segundo término
de la comparación existe desde el primer día.

**Sigue sin hacerse**: acceso con X, analítica, editar perfil.

**Hecho después del corte**: el importador de texto pegado, **editar el
perfil**, **comparar dos sets** y **la copia de seguridad**, todos de
*Siguiente*. Más dos cosas que no estaban en ninguna lista y pidió Fernando:
el canal de YouTube en el perfil y, sobre todo, **poner los valores
arrastrando reguladores de verdad** en vez de picando números — que era la
contradicción de la casa. El importador, porque quita el peaje de
publicar. El perfil, porque es lo que hace que unos valores se lean como los
de alguien que juega de una manera concreta y no como treinta números sueltos
— y de paso trae el historial de nombres, que es lo que permite cambiar de
nombre sin romper los enlaces que ya circulan. La comparación, porque es la
pregunta que se hace todo el que llega a un set ajeno teniendo ya el suyo.

---

## AHORA — antes del 25/09. Unas 4 tardes

| # | Qué | Por qué | Esfuerzo |
| --- | --- | --- | --- |
| 1 | **Reaplicar `01_catalog.sql`** | Borra los 20 sliders fantasma de FC27. Sin esto, el juego que llega el 25 se ve mal | 5 min |
| 2 | **Desactivar «Confirm email»** en Supabase | Registro instantáneo y sin correo. Para un pet project es mejor que montar un SMTP: menos piezas, cero mantenimiento | 10 min |
| 3 | **Analítica** (Vercel Analytics) | Una línea. Sin ella no sabrás si el 25 entró alguien, y eso es justo lo que da gasolina para seguir | 30 min |
| 4 | **Diferencias contra el preajuste de fábrica** | La idea nueva. En la ficha de un set, además de tu muesca, la del preajuste de FC27 en gris. De golpe cualquier set se lee como **«qué ha tocado esta persona y cuánto»**, que es la pregunta real. El regulador ya hace el trabajo difícil | 1-2 tardes |
| 5 | **Copiar un set de FC26 a FC27** | El 25, todo el que tiene un set de FC26 quiere llevárselo. Los slugs coinciden en su mayoría: se copia lo que existe y lo nuevo se queda por defecto. Oportuno y nadie más lo va a tener | 1 tarde |

## SIGUIENTE — octubre, cuando baje el ruido

| # | Qué | Por qué |
| --- | --- | --- |
| 10 | **Límite de ritmo en comentarios** | Sólo cuando llegue el primer comentario de un desconocido. Antes es resolver un problema que no existe |

## MÁS ADELANTE — si apetece

- **Consenso por slider** (mediana y distribución). Sigue siendo el foso, y
  sigue necesitando volumen.
- **Tarjeta de compartir con las diferencias**, no sólo con los valores.
- **FC28**. El catálogo ya está preparado para un juego nuevo: es un rato de
  datos, no de código.

## Lo que NO haría

- **Cola de moderación, roles, notificaciones por correo, búsqueda
  full-text.** Cada una es una obligación permanente. Con 0 comentarios,
  moderar es resolver un problema imaginario.
- **Votos o estrellas.** Canibalizan el diferencial: la gracia es que
  expliques por qué 35 y no 42.
- **App móvil.** El modo consola ya cubre el caso real.
- ~~**Traducir al inglés.**~~ **Revocado el 22/09**: se escribió con cero
  visitas, y Fernando ha detectado interacción con público inglés. El coste que
  decía sigue siendo cierto —duplica el trabajo para siempre—, así que el plan
  se dedica sobre todo a acotarlo: [plan-ingles.md](plan-ingles.md).

## La regla que evita construir de más

**No construir más funciones de comunidad hasta que un desconocido comente.**

Ahora mismo hay 2 sets, 1 perfil y **0 comentarios**. La hipótesis del
producto —que la gente discuta valor a valor— está sin probar. Todo lo de
«Ahora» funciona igual de bien con cero comentarios; lo de comunidad espera a
tener una señal.

## Riesgos

| Riesgo | Impacto | Qué hacer |
| --- | --- | --- |
| **Supabase pausa el proyecto por inactividad** | Alto: la web muere sin avisar | Los planes gratuitos pausan tras días sin actividad. Con tráfico real no pasa; si el proyecto se enfría, compruébalo de vez en cuando |
| **Abandono** | El riesgo principal de un proyecto personal | La mitigación es (4) y el modo consola: que te siga sirviendo a ti aunque no venga nadie |
| **El 25 entra gente y el registro falla** | Alto y con una sola oportunidad | (2) lo resuelve sin depender del correo |
| **La hipótesis de comunidad no se cumple** | Medio | No es fracaso: queda un publicador de sliders muy bueno para ti. Por eso arriba va lo que no depende de nadie más |

## Lo que ya está bien y no hay que tocar

- El modelo de datos aguanta todo lo de «Más adelante» sin migraciones.
- RLS cubre las seis tablas y `npm run test:sql` lo comprueba.
- El catálogo se regenera desde un fichero: un juego nuevo es datos, no código.
- Las decisiones no evidentes están en el [mapa del código](../codemap.md).
