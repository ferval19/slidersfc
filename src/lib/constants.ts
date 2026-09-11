import type { SliderScope } from './database.types';

export const SITE_NAME = 'SlidersFC';
export const SITE_TAGLINE = 'Sliders de EA SPORTS FC, con la comunidad comentando valor a valor.';
export const SITE_BYLINE = 'by Full Manual FG';

export const CATEGORY_LABELS: Record<string, string> = {
  speed: 'Velocidad',
  shooting: 'Tiro',
  passing: 'Pase',
  ball_control: 'Control de balón',
  defending: 'Defensa',
  goalkeeping: 'Portería',
  positioning: 'Posición del equipo',
  injuries: 'Lesiones',
  cpu_controls: 'Controles de la CPU',
};

export const CATEGORY_ORDER = [
  'speed',
  'shooting',
  'passing',
  'ball_control',
  'defending',
  'goalkeeping',
  'positioning',
  'injuries',
  'cpu_controls',
];

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

export function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

export function sortCategories(categories: string[]) {
  return [...categories].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

export function sortScopes(scopes: SliderScope[]) {
  return [...scopes].sort((a, b) => SCOPE_ORDER.indexOf(a) - SCOPE_ORDER.indexOf(b));
}
