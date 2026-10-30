import type { Tema } from '../../lib/retos/tipos';

type Camiseta = Tema['camiseta'];

/**
 * El valor de `background` (o de `border-image`) de cada patrón de camiseta.
 *
 * Es un módulo de datos y funciones sin JSX para que lo usen igual la página,
 * la tarjeta del índice y la imagen para compartir. `paso` es el ancho de cada
 * franja en píxeles (en `mitades` y `banda` no cuenta).
 *
 * `eje` fuerza en qué dirección alternan los colores: `x` los reparte de
 * izquierda a derecha (rayas verticales) e `y` de arriba abajo (aros). Sin
 * `eje`, cada patrón usa el suyo. Los separadores que corren en vertical lo
 * piden en `y`, que es como alternaban en el HTML original.
 *
 * Siempre devuelve una imagen (`liso` es un degradado de un solo color), así
 * que vale también donde sólo se admite una imagen, como `border-image`.
 */
export function fondoCamiseta(camiseta: Camiseta, paso = 8, eje?: 'x' | 'y'): string {
  const [a, b] = camiseta.colores;

  switch (camiseta.patron) {
    case 'rayas':
    case 'aros': {
      const direccion = (eje ?? (camiseta.patron === 'rayas' ? 'x' : 'y')) === 'x' ? 90 : 180;
      return `repeating-linear-gradient(${direccion}deg, ${a} 0 ${paso}px, ${b} ${paso}px ${paso * 2}px)`;
    }
    case 'mitades':
      return `linear-gradient(${eje === 'y' ? 180 : 90}deg, ${a} 50%, ${b} 50%)`;
    case 'banda':
      return `linear-gradient(115deg, ${b} 0 36%, ${a} 36% 64%, ${b} 64% 100%)`;
    case 'liso':
      return `linear-gradient(${a}, ${a})`;
  }
}
