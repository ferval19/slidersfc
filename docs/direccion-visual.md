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
