# Dirección visual — SlidersFC

## Concepto: la pizarra del entrenador

El material propio de este mundo no es el "dashboard oscuro": es la **pizarra
táctica**. Verde botella, tiza, flechas dibujadas a mano y dos rotuladores.
Todo lo que se ve sale de ahí.

Lo que se descarta a propósito: negro casi puro con un acento vivo, crema con
serif de alto contraste, y la retícula tipo periódico con filetes finos. Son
los tres sitios donde aterriza cualquier diseño generado por defecto.

## Color

| Token | Valor | Papel |
| --- | --- | --- |
| `board` | `#0b241f` | Fondo. Verde botella de pizarra, no negro. |
| `board-deep` | `#06170f` | Pozos: inputs, celdas hundidas. |
| `board-raised` | `#12342c` | Paneles sobre la pizarra. |
| `chalk` | `#f2efe4` | Tiza. Blanco cálido, nunca `#fff`. |
| `chalk-dim` | `#93a9a1` | Texto secundario. |
| `ink-user` | `#ffd24a` | **Tú.** Acción primaria. |
| `ink-mate` | `#7fe0c8` | **CPU compañero.** |
| `ink-rival` | `#ff5c7a` | **CPU rival.** |

Los tres rotuladores no son decoración: **codifican el ámbito del slider**.
Un entrenador pinta a los suyos de un color y al rival de otro, y este
producto tiene exactamente esa distinción en la base de datos
(`applies_to`: user / cpu_teammate / cpu_opponent). Mirando un set se ve de un
vistazo dónde se separa el usuario de la CPU.

Sobre el verde: el de EA SPORTS FC es una lima eléctrica sobre negro. Un verde
botella de pizarra con tiza amarilla no se confunde con él, y es mucho más
fútbol que el azul que había antes.

## Tipografía

- **Display: Big Shoulders 900.** Ultracondensada, de señalética de estadio.
  Va en mayúsculas, muy grande y apilada. Se usa poco y fuerte.
- **Texto: IBM Plex Sans 400/600.** Técnica, con carácter, legible en párrafo.
- **Datos y etiquetas: IBM Plex Mono 500.** Cifras tabulares para que las
  columnas de valores se alineen, y versalitas para las etiquetas.

Contraste deliberado: ultracondensada negra contra ancho normal regular; pesos
900 contra 400; saltos de tamaño de 3× o más.

**Nada de fuentes manuscritas.** La tiza está en los dibujos, no en la letra:
una tipografía de imitación a mano es justo el atajo que abarata esto.

## Estructura

- Radio de esquina 2–3 px. La tarjeta redondeada con borde suave es plantilla.
- Los separadores son **filetes dibujados a mano**, con temblor real, no
  `border-top: 1px solid`.
- Grano de polvo de tiza sobre toda la página, muy bajo, en `soft-light`.

## Elemento firma: el regulador

Un valor no se pinta como un número en una caja, sino como una **escala de
medida**: carril de 0 a 100, marcas cada 25, muesca en el valor y la cifra en
mono. Los tres ámbitos se apilan en la misma fila, cada uno con su rotulador.

```
SPRINT SPEED   0 ├────────●──────────────┤ 100   35
                 ├──────────────●────────┤        48
```

Es lo que hace que un set se lea de un vistazo en lugar de tener que comparar
34 números, y es la razón por la que los comentarios cuelgan de un valor
concreto: el comentario vive pegado a la muesca de la que habla.

## Ilustración

Diagramas de pizarra en SVG en línea, trazo único de tiza con temblor y un
filtro de rugosidad: medio campo con flechas, balón, bota, silbato, formación.
Se usan como portada del hero, marcas de sección y estados vacíos. Nunca como
relleno.

**Dos familias, no una.** Los dibujos de arriba se ven a 28 px o más y pueden
permitirse detalle. Los **iconos de botón** viven a 14-16 px, y ahí el detalle
se convierte en mugre: lienzo de 48, trazo de 4 —a 14 px da el mismo grosor
aparente que un dibujo de trazo 2 a 28— y tres o cuatro caminos como mucho. El
mando del hero y el mando del botón son dos dibujos distintos a propósito.

**Un icono sólo entra donde hay algo de lo que distinguirse.** Varias acciones
compitiendo en la misma barra, o un botón tan estrecho que se queda en una
palabra. Repasada la web entera, eso son cinco sitios: la botonera de la ficha,
las dos acciones del perfil propio, la barra pegada del set, la cabecera del
modo consola y las dos herramientas del formulario.

Y lo que **no** lleva icono, que es casi todo: el botón solo de una página
—«Leer la guía», «Volver al feed», el de un estado vacío—, los pares de
formulario tipo Guardar / Cancelar, los cierres de un panel y el botón del
encabezado. No hay nada de lo que distinguirlos, y un dibujo ahí es el relleno
que esta página prohíbe.

**Las marcas ajenas no se dibujan en tiza.** El logotipo de X va tal cual es.
Una marca no es decoración, y redibujarla es falsificarla.
