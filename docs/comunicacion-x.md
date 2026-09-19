# Comunicación en X — SlidersFC

Plan de lanzamiento y promoción desde **@FullManualFG**, con los posts escritos
para copiar y pegar. Fecha de este corte: **19/09/2026**.

Las imágenes están en `promo/x/` y se regeneran con `node scripts/promo-images.mjs`.

- [Qué perseguimos](#qué-perseguimos-y-qué-no)
- [Antes de publicar nada](#antes-de-publicar-nada--bloqueante)
- [Las reglas de la casa](#las-reglas-de-la-casa)
- [Fase 1 · 19–24/09 · El dato de FC27](#fase-1--1924092026--el-dato-que-nadie-tiene)
- [Fase 2 · 25/09 · El hilo de lanzamiento](#fase-2--25092026--el-hilo-de-lanzamiento)
- [Fase 3 · 26/09–09/10 · La semilla de autores](#fase-3--26091009--la-semilla-de-autores)
- [Fase 4 · Ritmo sostenido](#fase-4--ritmo-sostenido)
- [Respuestas preparadas](#respuestas-preparadas)
- [Lo que NO hay que hacer](#lo-que-no-hay-que-hacer)
- [Cómo medir](#cómo-medir)

---

## Qué perseguimos (y qué no)

La [hoja de ruta](hoja-de-ruta.md) ya nombra el riesgo alto del proyecto: **«la
semilla de autores no cuaja»**. Sin sets de otra gente, SlidersFC es un blog de
una persona con base de datos. Y sin sets ajenos tampoco hay nada que comentar,
que es el diferencial entero.

Así que el objetivo de esta campaña **no es tráfico ni seguidores**. Es:

| Métrica | Objetivo a 4 semanas | Por qué esa |
| --- | --- | --- |
| **Sets publicados por gente que no eres tú** | **5** | Es el único número que dice si el producto existe |
| Comentarios anclados a un valor, de terceros | 15 | Prueba que el diferencial se entiende sin explicarlo |
| Cuentas registradas | 40 | Instrumental: sin cuenta no hay set |
| Visitas únicas | 600 | El más vanidoso de los cuatro. Se mira el último |

Cinco sets ajenos suena a poco. No lo es: es la diferencia entre una web muerta
y una web con vida, y con 200–2.000 seguidores se consiguen **hablando con
gente una por una**, no publicando más.

Corolario que ordena todo lo demás: **cada post se juzga por si acerca a un
autor**, no por los likes.

---

## Lo que tienes que nadie más tiene

Esto es lo que hace que la campaña funcione, y caduca:

1. **El catálogo real de FC27** — 61 sliders con sus nombres y su orden del
   menú, leídos del juego con el acceso anticipado. Del 19 al 25 de septiembre
   esto es información que se busca y no está publicada en español.
2. **Los 121 valores de fábrica** del preajuste «Jugabilidad realista».
   Referencia que nadie más ha transcrito.
3. **El desdoble CPU rival / CPU de tu equipo**, que es nuevo en FC27 y del que
   casi nadie se ha dado cuenta todavía.

La estrategia entera es una sola idea: **regalas el dato, y el dato vive en la
web**. No hay muro, no hay «suscríbete para ver». El post se entiende solo; el
enlace es donde está completo.

**La ventaja se agota el 25.** A partir del lanzamiento el catálogo lo tiene
todo el mundo. Lo que quede después es la comunidad que hayas montado esa
semana.

---

## Antes de publicar nada · BLOQUEANTE

No publiques el primer post hasta tener esto. Un enlace que da 401 el día que
más gente entra no se recupera.

- [ ] **Quitar la Deployment Protection de Vercel.** Hoy la web sólo la ves tú
      (punto 3 de la hoja de ruta). Compruébalo abriendo `slidersfc.vercel.app`
      en el móvil, con datos y sin wifi.
- [ ] **SMTP propio** (Resend/Brevo/SES), o como mínimo **«Confirm email»
      desactivado** en Supabase. Con el SMTP de serie, dos registros a la vez
      dejan fuera al resto durante una hora.
- [ ] **Acceso con X activado.** Es el camino que no gasta correos, y tu
      audiencia ya está ahí. El botón está hecho; falta el proveedor.
- [ ] **Analítica** (Vercel Analytics o Plausible). Sin esto no sabrás si algo
      funcionó.
- [ ] **Comprobar la tarjeta al compartir.** Pégate el enlace a ti mismo por DM
      y mira que sale la imagen. Si aparece `localhost`, falta
      `NEXT_PUBLIC_SITE_URL` en Vercel.
- [ ] **Perfil de X al día:** enlace a `slidersfc.vercel.app` en la bio, y una
      línea que diga qué es. Propuesta de bio:

      > Modo carrera con controles manuales. Sliders, tácticas y partidos
      > largos. Publico mis sets en SlidersFC.

Enlaces que vas a usar todo el rato:

| Qué | URL |
| --- | --- |
| Portada | `slidersfc.vercel.app` |
| Valores de fábrica de FC27 | `slidersfc.vercel.app/u/fullmanualfg/jugabilidad-realista-de-fc27` |
| Todos los sets de FC27 | `slidersfc.vercel.app/juegos/fc27` |
| Tu perfil | `slidersfc.vercel.app/u/fullmanualfg` |
| Publicar un set | `slidersfc.vercel.app/sets/nuevo` |

---

## Las reglas de la casa

**Voz.** La misma que la web: seca, concreta, sin hipérbole. Nada de «¡La mejor
web de sliders!». Dices lo que hay y el dato hace el trabajo. Si un post
necesita signos de exclamación para funcionar, no funciona.

**Emojis: ninguno o casi.** Un ⚽ perdido no arregla un post flojo y rompe la
marca, que es tiza sobre pizarra.

**Cada post da algo aunque no hagas clic.** Un valor, una cifra, una
observación. Si el post es sólo un anzuelo, la gente aprende a ignorarte.

**El enlace va en la primera respuesta, no en el post raíz.** X reparte peor lo
que saca gente de la plataforma. Post raíz: dato + imagen. Respuesta 1: enlace.
La excepción es el hilo de lanzamiento, donde el enlace es el contenido.

**Un hashtag como mucho.** `#FC27` y para de contar. Las cadenas de cinco
hashtags marcan cuenta de spam.

**Horario.** Audiencia española que juega al modo carrera: la franja buena es
**21:30–23:00**, y la segunda **14:00–15:00**. Publica el post importante a las
21:30 y quédate media hora respondiendo — las respuestas de la primera hora son
lo que decide si el post se reparte.

**Responde a todo el mundo el primer mes.** Con esta escala, cada respuesta es
un autor potencial. Es literalmente el trabajo.

**Formato de los valores.** Siempre `Nombre del slider — valor`, con el nombre
tal cual sale del menú español. Es la costumbre que quieres crear: si la gente
copia tu formato, sus sets se pueden leer.

---

## Fase 1 · 19–24/09/2026 · El dato que nadie tiene

Abre el **post de presentación** (P0) y detrás van seis de calentamiento. En los
seis **no vendes la web**: publicas información útil y la web aparece como el
sitio donde está completa. Cuando llegue el día 25 la gente ya sabrá que existe.

El orden importa. P0 cuenta *por qué* existe esto y deja a la gente predispuesta;
los seis siguientes demuestran que sabes de lo que hablas. Al revés no funciona:
un post emotivo de alguien que todavía no ha enseñado nada se lee como anuncio.

---

### P0 · Viernes 19/09, 21:30 · EL POST DE PRESENTACIÓN · imagen `00-presentacion.png`

El que abre todo. Es el **único post personal de la campaña**, y funciona
precisamente porque es el único: si todos los posts fueran así, ninguno
emocionaría.

La emoción aquí no la ponen los adjetivos, la ponen los datos pequeños y
verdaderos. «Va por la versión 3.0» conmueve más que «con mucho cariño», porque
deja ver los años que hay detrás sin nombrarlos.

> En diciembre abrí un documento con mis sliders. Va por la v3.0 y lo he pegado
> en respuestas más veces de las que recuerdo.
>
> Cada año sale juego nuevo y todos volvemos a empezar de cero. Los números se
> comparten. El porqué se pierde.
>
> He montado un sitio para que deje de pasar.

**Respuesta 1 (inmediata):**

> Se llama SlidersFC. Está recién hecha y faltan cosas, pero ya se puede entrar,
> publicar tu set y que alguien te pregunte por un valor concreto.
>
> slidersfc.vercel.app

---

#### Versión en hilo de 4 · si quieres darle recorrido

Un solo post es más limpio, pero el arco emocional respira mejor en cuatro. Si
eliges esta versión, **este es el hilo que fijas hasta el día 25**, y el del
lanzamiento lo sustituye después.

**1/4** · imagen `00-presentacion.png` — el mismo texto de arriba.

**2/4** · sin imagen — el corazón del hilo:

> Lo raro es que los valores que más he defendido nunca fueron míos. La base del
> set que llevo es de @Shinogoblin; yo sólo la fui tocando partido a partido.
>
> Un set nunca es de uno. Es una conversación larga que hoy vive en respuestas y
> se borra sola.

**3/4** · imagen `05-comentarios.png`

> Así que en tres tardes he montado SlidersFC.
>
> Publicas tu set y la gente comenta encima de cada valor, no debajo del post.
> El porqué de un 35 se queda pegado al 35.
>
> Y si luego lo cambias, los comentarios viejos siguen ahí, marcados.

**4/4** · imagen `01-marca.png`

> El jueves sale FC27 y a todos se nos queda viejo el set. Buen momento para no
> empezar de cero otra vez.
>
> slidersfc.vercel.app
>
> Gracias a los que lleváis meses preguntándome por el documento: esto es culpa
> vuestra.

---

#### Antes de publicarlo: tres frases que tienes que confirmar

Están sacadas del repo, pero el repo no lo sabe todo de ti. Si alguna no es
exacta, cámbiala — **en un post así, un detalle inflado se huele**, y es lo
único que puede estropearlo.

| Frase | De dónde sale | Revisa |
| --- | --- | --- |
| «En diciembre abrí un documento» | El documento de Full Manual FG es del 07/12/2025 | Si lo abriste antes, pon el año real: cuanto más largo, mejor |
| «Va por la versión 3.0» | `supabase/seed/02_set_full_manual_fg.sql` | Si ya vas por la v4, dilo |
| «En tres tardes» | El historial de git: 11/09, 12/09 y 19/09 | Si le echaste más, súbelo. No lo bajes para parecer más rápido |
| «Lleváis meses preguntándome» | Supuesto mío | Si no te lo ha pedido nadie, quítalo y cierra con el enlace |

**Y avisa a @Shinogoblin antes**, por DM, de que le vas a mencionar. Es de buena
educación y además suele convertirse en el primer retuit del proyecto — que
viene de la persona con más autoridad posible para darte crédito.

---

### P1 · Sábado 20/09, 14:00 · imagen `02-preajuste-realista.png`

> Llevo dos días con el acceso anticipado apuntando el menú de FC27.
>
> El preajuste de jugabilidad realista no es «todo a 50». Sale así de fábrica:
>
> Velocidad 35
> Aceleración 48
> Error al primer toque 85
> Fallo al interceptar 90
> Impacto del físico 99
>
> Los 121 valores, abajo.

**Respuesta 1 (inmediata):**

> Los he transcrito enteros, con el nombre y el orden exactos del menú:
> slidersfc.vercel.app/u/fullmanualfg/jugabilidad-realista-de-fc27
>
> Sirven de referencia: lo que no has tocado en tu set, sigue en ese valor.

*Por qué funciona:* «no es todo a 50» rompe una creencia extendida. Y los cinco
valores elegidos son los raros (99, 90, 85), que es lo que hace que alguien
pare a mirar.

---

### P2 · Sábado 20/09, 21:30 · imagen `03-cpu-asimetria.png`

Este es el mejor post de la campaña. Si sólo publicas uno, publica este.

> Dato de FC27 que no he visto contar a nadie: la CPU de tu equipo y la del
> rival vienen configuradas distinto de fábrica.
>
> Velocidad de creación — rival 98, tuyo 89
> Tiros de calidad — 53 / 38
> Tiros lejanos — 54 / 40
> Filigranas — 50 / 65
>
> No estás loco. Tu delantero tira menos.

**Respuesta 1:**

> Es nuevo de FC27: los controles de la CPU se desdoblan en rival y compañero.
> Los de jugabilidad siguen siendo tú contra la CPU rival, sin más.
>
> Los 16 sliders con sus dos valores: slidersfc.vercel.app/juegos/fc27

**Respuesta 2 (para dejarlo abierto):**

> Lo que no sé todavía es si compensa igualarlos o si EA lo ha hecho a propósito
> para que el rival parezca más listo. Si lo pruebas, cuéntamelo.

*Por qué funciona:* «no estás loco» pone nombre a una sospecha que mucha gente
tiene y no sabe articular. Es el tipo de post que se cita.

---

### P3 · Domingo 21/09, 21:30 · imagen `04-catalogo.png`

> El menú de sliders de FC27, entero:
>
> 61 sliders
> 121 valores que meter a mano
> 9 categorías
>
> Son 23 más que en FC26. La mitad de la pestaña de tiro es nueva: vaselina,
> zapatazo y tiros rasos potentes tienen ahora su propio error y su propia
> velocidad.

**Respuesta 1:**

> La lista completa, en el orden exacto del menú para que la sigas con el mando
> en la mano: slidersfc.vercel.app/juegos/fc27

---

### P4 · Lunes 22/09, 14:00 · sin imagen

Un post de pregunta. Busca respuestas, no likes: las respuestas te dan gente con
la que hablar en la fase 3.

> Lesiones en FC27, valores de fábrica del preajuste realista:
>
> Frecuencia 75
> Gravedad 30
>
> O sea: muchas lesiones, casi todas leves. A mí en carrera me funciona al
> revés — menos frecuencia y más gravedad, para que cuando caiga uno se note.
>
> ¿Tú cómo los tienes?

**Apunta las respuestas.** Cada persona que conteste con sus dos números es
alguien que ya piensa en sliders y tiene un set. Esa es tu lista de la fase 3.

---

### P5 · Martes 23/09, 21:30 · imagen `06-modo-consola.png`

Primer post donde la web es el asunto.

> Lo peor de un set no es decidir los valores. Es meter 121 números en el menú
> sin perder la cuenta de por dónde ibas.
>
> Así que le he puesto un modo para eso: una columna, en el orden del menú,
> números grandes, vas marcando lo que ya has metido y la pantalla no se apaga.

**Respuesta 1:**

> Funciona en cualquier set de la web, también en los que publiques tú:
> slidersfc.vercel.app
>
> Lo hice porque se me apagaba el móvil por la mitad y volvía a empezar.

*Por qué funciona:* es la queja concreta de alguien que ha hecho esto de verdad.
Reconocer el problema vende la solución sin argumentar.

---

### P6 · Miércoles 24/09, 21:30 · imagen `05-comentarios.png`

La víspera. Aquí explicas el *porqué* del producto, para que el hilo de mañana
no tenga que hacerlo.

> Lo que se pierde de un set de sliders no son los números. Es el porqué.
>
> «Velocidad 35» no dice nada. «35 porque a 40 los centrales llegan a todo, pero
> a 6 minutos por parte no rematas ni un centro» sí.
>
> Eso no cabe en una captura. Mañana enseño dónde lo he metido.

**Respuesta 1:**

> Mañana sale FC27 y a todo el mundo se le queda viejo su set. Buen día para
> empezar de otra manera.

---

## Fase 2 · 25/09/2026 · El hilo de lanzamiento

**Jueves 25 de septiembre, 21:30.** Un solo hilo, y lo **fijas en el perfil**
durante tres semanas.

Publica los ocho tuits seguidos, sin esperar entre ellos, y luego quédate una
hora respondiendo.

---

**1/8** · imagen `01-marca.png`

> Hoy sale FC27 y a todos se nos queda viejo el set de sliders.
>
> Llevo dos semanas montando una web para que esta vez no empecemos cada uno de
> cero: SlidersFC.
>
> Publicas tu set, y la gente comenta **valor a valor**. No el set entero: el
> valor.

**2/8** · imagen `05-comentarios.png`

> El problema de siempre: alguien comparte una captura con 121 números y en
> respuestas se pregunta «¿por qué 35 y no 42?».
>
> Nadie contesta, porque no hay dónde.
>
> Aquí cada comentario cuelga de la muesca de la que habla.

**3/8** · imagen `04-catalogo.png`

> El catálogo de FC27 está entero y es el de verdad: 61 sliders, 121 valores,
> con los nombres y el orden exactos del menú en español.
>
> Sacado del juego estos días, no traducido a ojo. «Tiros de calidad», no «tiro
> colocado».

**4/8** · imagen `02-preajuste-realista.png`

> Y está cargado el preajuste de jugabilidad realista con sus 121 valores de
> fábrica.
>
> No es un set bueno ni malo: es el punto de partida. Sirve para ver de un
> vistazo qué ha tocado cada quien en el suyo.
>
> slidersfc.vercel.app/u/fullmanualfg/jugabilidad-realista-de-fc27

**5/8** · imagen `06-modo-consola.png`

> Tiene modo consola, que es lo que yo necesitaba: el móvil en la mano, una
> columna en el orden del menú, números grandes, marcando lo que ya has metido
> y sin que se apague la pantalla.

**6/8** · imagen `03-cpu-asimetria.png`

> Y separa lo que FC27 ha separado este año: usuario, CPU rival y CPU de tu
> equipo, cada uno con su color.
>
> Porque de fábrica no son iguales. Tu delantero tira a puerta con frecuencia
> 39; el del rival, 53.

**7/8** · imagen `07-publica-tu-set.png`

> Está recién hecha y se nota. Faltan cosas y habrá fallos.
>
> Lo que no falta es lo importante: puedes entrar, publicar tu set y que alguien
> te pregunte por un valor concreto.
>
> slidersfc.vercel.app

**8/8** · sin imagen

> Si tienes un set de FC26 que te funcionaba, súbelo también. Sirve de punto de
> partida para el de FC27 y para discutirlo.
>
> Es un proyecto de comunidad, sin relación con EA. Si algo se rompe, dímelo por
> aquí y lo arreglo.

---

**Justo después de publicar el hilo:**

1. **Fíjalo** en tu perfil.
2. **Publica tu propio set de FC27** en la web, aunque sea preliminar. Nadie
   publica el primero. Tienen que encontrar dos o tres ya hechos.
3. Manda los DMs de la fase 3 esa misma noche, con el hilo ya publicado.

---

## Fase 3 · 26/09–10/09 · La semilla de autores

**Esta es la fase que decide si el proyecto vive.** Los posts anteriores traen
lectores; los autores se consiguen hablando con ellos uno por uno.

### El DM

Haz una lista de **10 a 15 personas** que ya publiquen sets, tácticas o modo
carrera en español. Salen de tres sitios: quien te respondió en P4, quien
comparte sets en respuestas a cuentas grandes, y las cuentas medianas de modo
carrera que ya sigues.

Mándalo **uno a uno, editado a mano** para mencionar algo suyo de verdad. Un
copiar-pegar idéntico a quince personas se nota y quema el contacto.

> Hola [nombre], te sigo desde [lo que sea concreto — «el hilo de la táctica
> 4-4-2 de la temporada pasada»].
>
> He montado una web para publicar sets de sliders donde la gente puede comentar
> valor por valor, en vez de discutirlo en respuestas: [enlace al hilo].
>
> Está el catálogo de FC27 entero, con los nombres del menú. Si te apetece subir
> el tuyo, te lo enlazo desde mi perfil y te aviso de cada comentario que te
> dejen.
>
> Y si no te encaja, sin problema — cualquier cosa que le veas mal me sirve
> igual.

**Qué hace que esto funcione:** ofreces algo (visibilidad + un sitio donde su
set no se pierde) antes de pedir nada, y das salida fácil. La tasa realista es
de **3 a 5 sets sobre 15 mensajes**. Con eso basta.

### Post de llamada · Sábado 27/09, 21:30 · imagen `07-publica-tu-set.png`

> Si tienes tus sliders de FC27 en una nota del móvil y estás harto de
> reescribirlos cada vez que alguien te los pide, súbelos:
> slidersfc.vercel.app/sets/nuevo
>
> Quedan con su enlace y su tarjeta, y quien pregunte por un valor pregunta
> encima del valor.

### Post de reconocimiento · en cuanto alguien publique el primero

**El post más importante de toda la campaña.** Demuestra públicamente que
publicar tiene recompensa. Repítelo con cada set nuevo las primeras semanas.

> Primer set de FC27 que no es mío en SlidersFC, de @[usuario].
>
> Tiene la velocidad a [X] y el marcaje a [Y], que es bastante más agresivo que
> lo que yo llevo. Le he dejado dos preguntas encima de los valores.
>
> [enlace al set]

Ese post **le llega a sus seguidores**, que son gente nueva para ti. Es el único
mecanismo de crecimiento real que tienes a esta escala.

### Post de comparación · Martes 30/09

Cuando haya tres o cuatro sets, el contenido se genera solo:

> Tres sets de FC27 publicados y los tres bajan la velocidad, pero no igual:
>
> @[uno] — 35
> @[dos] — 42
> @[tres] — 28
>
> Los tres explican por qué en el propio valor. Merece la pena leer los tres
> porqués antes de copiar ninguno.
>
> slidersfc.vercel.app/juegos/fc27

### Post de humildad · cuando se rompa algo

Va a pasar. Publicarlo es bueno: a esta escala la cercanía es el activo.

> [Alguien] me ha avisado de que [lo que sea] no funcionaba en móvil. Arreglado.
>
> Si os encontráis algo raro, decídmelo por aquí. Es una web hecha por una
> persona a ratos y se nota.

---

## Fase 4 · Ritmo sostenido

A partir de octubre, **tres posts por semana** en formatos que se repiten. Los
formatos repetibles son lo que hace sostenible publicar durante meses sin tener
que inventar nada.

### Formato A · «El slider de la semana» (martes)

Coge un slider, explica qué hace de verdad y qué está poniendo la gente.

> **Distancia de la línea**, el slider que casi nadie toca.
>
> No es la altura de la defensa: es cuánto se estira el equipo entre línea y
> línea. De fábrica FC27 lo trae a 35, o sea compacto.
>
> Súbelo a 60 y tendrás más espacio entre líneas — y más contras en contra.

Da para 61 semanas. Y es lo que acabará indexando la web en Google, que es el
canal que no depende de X.

### Formato B · «Set de la semana» (jueves)

Destacas el set de otra persona, con un valor concreto que te haya llamado la
atención. Un post cada semana, siempre de alguien distinto.

### Formato C · «Antes / después» (sábado, cuando tengas material)

Un problema concreto de tu carrera y el valor que lo arregló:

> Llevaba media temporada sin que me pitaran una falta a favor.
>
> Frecuencia de faltas tácticas de la CPU rival: de 47 a 65.
>
> Cuatro partidos después, tres faltas al borde del área. No sé si es casualidad
> todavía, pero lo apunto.

Ese «no sé si es casualidad todavía» es la voz del proyecto. La honestidad sobre
lo que no sabes es lo que te separa de las cuentas que venden el set definitivo.

### Cuándo replantearse el idioma

La hoja de ruta dice, con razón, que traducir al inglés todavía no. La señal
para reabrirlo: **cuando haya 20 sets publicados y más de la mitad no sean
tuyos**. Antes, duplicar el contenido sólo duplica el trabajo.

---

## Respuestas preparadas

Las mismas preguntas van a salir una y otra vez. Tenerlas escritas te ahorra
pensar a las once de la noche.

**«¿Otra web de sliders? Ya está fifauteam / tal foro.»**

> Esas publican sets. Lo que aquí no hay en otro sitio es que el comentario
> cuelgue de un valor concreto: preguntas por qué 35 encima del 35, no tres
> mensajes más abajo. Y el catálogo está en español con los nombres del menú.

**«¿Es tuya? ¿Vas a cobrar?»**

> Es mía, la he hecho estas dos semanas. No cobra nada ni tiene publicidad ni la
> va a tener. La monté porque yo mismo perdía mis sets entre notas del móvil.

**«¿Y esto es oficial de EA?»**

> No, nada que ver. Proyecto de comunidad, sin relación con EA SPORTS.

**«Tus valores están mal, X va a 50.»**

> Puede ser — están leídos del menú en el acceso anticipado y algo se me habrá
> colado. ¿Qué te sale a ti en el menú? Si es distinto lo corrijo hoy mismo.

Esta última es oro: convierte una corrección en una conversación, y quien te
corrige suele acabar publicando su set.

**«No me llega el correo para entrar.»**

> Entra con contraseña o con X, que no dependen del correo. Si ya lo pediste,
> mira el código de 6 dígitos del email: se puede escribir a mano en la web.

---

## Lo que NO hay que hacer

Decirlo explícitamente ahorra decisiones malas a las dos de la mañana.

- **No comprar seguidores ni usar cuentas automáticas.** A esta escala, 50
  seguidores de verdad valen más que 5.000 falsos, y los falsos te hunden el
  alcance de todo lo que publiques después.
- **No responder «mira mi web» a cuentas grandes.** Es spam, te bloquean y
  quemas el nombre del proyecto. Responde con el dato; si aporta, ya preguntarán.
- **No pedir retuits.** «RT si te sirve» abarata el post y funciona peor que el
  post sin la coletilla.
- **No publicar el enlace pelado.** Un enlace sin dato es un anuncio, y se
  ignora.
- **No prometer lo que no hay.** Nada de «la comunidad de sliders» cuando hay
  tres sets. Di «recién hecha, con tres sets» — es más creíble y no decepciona
  al que entra.
- **No discutir con el que venga a tocar las narices.** Una respuesta educada y
  a otra cosa.
- **No encadenar hashtags.** Uno, si acaso.
- **No traducir al inglés todavía.** Ver arriba.

---

## Cómo medir

**Una vez por semana, el lunes**, apunta cuatro números. Cinco minutos.

| Número | De dónde sale |
| --- | --- |
| Sets publicados que no son tuyos | `slidersfc.vercel.app/juegos/fc27` |
| Comentarios de terceros | Los propios sets |
| Cuentas nuevas | Supabase → Authentication → Users |
| Visitas únicas | Vercel Analytics |

**La señal de que va bien:** alguien publica un set sin que tú se lo hayas
pedido. Hasta que eso pase, sigues en fase 3 y el trabajo son los DMs, no los
posts.

**La señal de alarma:** dos semanas con visitas y cero sets ajenos. Si pasa, el
problema no es la comunicación — es que publicar cuesta demasiado. Ahí toca el
**importador de sets desde texto pegado** (punto 6 de la hoja de ruta), que
convierte quince minutos de formulario en treinta segundos, y volver a
intentarlo con las mismas personas.

---

## Las imágenes

En `promo/x/`, a 1600×900 (la proporción con la que X enseña una imagen suelta,
así que no recorta nada). Se regeneran con:

```bash
node scripts/promo-images.mjs
```

| Fichero | Qué es | Dónde se usa |
| --- | --- | --- |
| `00-presentacion.png` | «Cada año empezamos todos de cero» | P0 |
| `01-marca.png` | La marca y para qué sirve | Hilo 1/8, P0 en hilo 4/4 |
| `02-preajuste-realista.png` | Valores de fábrica de FC27 | P1, hilo 4/8 |
| `03-cpu-asimetria.png` | CPU rival vs. CPU de tu equipo | P2, hilo 6/8 |
| `04-catalogo.png` | 61 sliders, 121 valores, 9 categorías | P3, hilo 3/8 |
| `05-comentarios.png` | El comentario anclado a un valor | P6, hilo 2/8 |
| `06-modo-consola.png` | El modo consola | P5, hilo 5/8 |
| `07-publica-tu-set.png` | La llamada a publicar | Hilo 7/8, fase 3 |

Los valores que aparecen **no están escritos a mano**: el script los lee de
`supabase/seed/catalog.mjs` y de `supabase/seed/03_set_fc27_realista.sql`. Si
corriges el catálogo, regenera las imágenes y vuelven a cuadrar.

**Pon texto alternativo siempre.** X lo permite y hace que las imágenes de datos
sirvan a quien usa lector de pantalla. Vale con describir los valores:
«Velocidad 35, Aceleración 48, Error al primer toque 85…».

### La imagen que no genera ningún script

En `imagenes/sliders/` tienes 18 capturas en 4K del menú de FC27 hechas por ti en
el acceso anticipado. Una de ellas vale más que cualquier tarjeta que yo dibuje,
porque **es la prueba**: enseña «Velocidad - Usuario/a 35» con la interfaz del
juego alrededor, y eso no se puede inventar.

Úsalas así:

- **En P1**, como **segunda imagen** del post, junto a `02-preajuste-realista.png`.
  La tarjeta se lee bien y ordena; la foto demuestra que no te lo has inventado.
  `IMG_6172.jpeg` es la buena: sale la pestaña de tipo de partida con Velocidad
  35/35 y Aceleración 48/48 a la vez.
- **En el hilo del día 25**, en el tuit 3/8, por lo mismo.

Dos avisos. Recórtalas antes de subirlas para quitar cualquier cosa personal que
salga en pantalla (nombre de usuario de la consola, notificaciones). Y si el
acceso anticipado que tienes viene con condiciones sobre publicar capturas,
compruébalo: no merece la pena arriesgar la cuenta por una foto cuando la
tarjeta generada dice lo mismo.
