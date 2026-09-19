import type { CpuBehaviour, SliderScope } from './database.types';

export const SITE_NAME = 'SlidersFC';
export const SITE_TAGLINE = 'Sliders de EA SPORTS FC, con la comunidad comentando valor a valor.';
export const SITE_BYLINE = 'by Full Manual FG';

export const CATEGORY_LABELS: Record<string, string> = {
  speed: 'Velocidad',
  shooting: 'Tiro',
  passing: 'Pase',
  ball_control: 'Control del balón',
  defending: 'Defensa',
  goalkeeping: 'Portería',
  positioning: 'Posición del equipo',
  injuries: 'Lesiones',
  cpu_controls: 'Controles de la CPU',
};

/**
 * Nombres cortos para las barras de navegación, donde nueve categorías con su
 * nombre entero no caben en una línea.
 */
export const CATEGORY_SHORT_LABELS: Record<string, string> = {
  ball_control: 'Control',
  positioning: 'Posición',
  goalkeeping: 'Portería',
  cpu_controls: 'CPU',
};

export function categoryShortLabel(category: string) {
  return CATEGORY_SHORT_LABELS[category] ?? categoryLabel(category);
}

export const SCOPE_LABELS: Record<SliderScope, string> = {
  user: 'Usuario',
  cpu: 'CPU',
  cpu_opponent: 'CPU rival',
  cpu_teammate: 'CPU compañero',
};

export const SCOPE_ORDER: SliderScope[] = ['user', 'cpu', 'cpu_opponent', 'cpu_teammate'];


/**
 * El rotulador de cada ámbito. Un entrenador pinta a los suyos de un color y
 * al rival de otro; aquí el color dice de quién es el valor, así que en un set
 * se ve de un vistazo dónde se separa el usuario de la CPU.
 *
 * El hex va aparte de la clase porque los dibujos SVG lo necesitan como
 * atributo, no como clase de Tailwind.
 */
export const SCOPE_INK: Record<SliderScope, { hex: string; text: string; border: string }> = {
  user: { hex: '#ffd24a', text: 'text-ink-user', border: 'border-ink-user' },
  cpu: { hex: '#ff5c7a', text: 'text-ink-rival', border: 'border-ink-rival' },
  cpu_opponent: { hex: '#ff5c7a', text: 'text-ink-rival', border: 'border-ink-rival' },
  cpu_teammate: { hex: '#7fe0c8', text: 'text-ink-mate', border: 'border-ink-mate' },
};

/**
 * Cómo se comporta la CPU. Los dos primeros los ajusta el juego solo según los
 * equipos; sólo en el tercero significan algo los sliders de esa pestaña.
 *
 * El orden es el del menú, y `tactical` va primero porque es lo que trae el
 * juego y lo que lleva un set nuevo.
 */
export const CPU_BEHAVIOURS: { value: CpuBehaviour; label: string; hint: string }[] = [
  {
    value: 'tactical',
    label: 'Táctico',
    hint: 'La CPU se ajusta sola al equipo que tiene delante. Es lo que trae el juego.',
  },
  {
    value: 'dynamic',
    label: 'Dinámico',
    hint: 'La CPU se ajusta sola y además va cambiando según cómo vaya el partido.',
  },
  {
    value: 'custom',
    label: 'Personalizado',
    hint: 'Tú pones los valores de esta pestaña. Es el único caso en el que se usan.',
  },
];

export function cpuBehaviourLabel(value: CpuBehaviour) {
  return CPU_BEHAVIOURS.find((behaviour) => behaviour.value === value)?.label ?? value;
}

export function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

export function sortScopes(scopes: SliderScope[]) {
  return [...scopes].sort((a, b) => SCOPE_ORDER.indexOf(a) - SCOPE_ORDER.indexOf(b));
}
