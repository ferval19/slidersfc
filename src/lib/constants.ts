import type { SetMode, SliderScope } from './database.types';

export const SITE_NAME = 'SlidersFC';
export const SITE_TAGLINE = 'Sliders de EA SPORTS FC, con la comunidad comentando valor a valor.';
export const SITE_BYLINE = 'by Full Manual FG';

export const MODES: { value: SetMode; label: string; hint: string }[] = [
  { value: 'carrera', label: 'Modo carrera', hint: 'Temporadas largas, simulación' },
  { value: 'online', label: 'Online', hint: 'Clubes, amistosos online' },
  { value: 'amistoso', label: 'Amistoso', hint: 'Partidos sueltos offline' },
];

export const MODE_LABELS: Record<SetMode, string> = {
  carrera: 'Carrera',
  online: 'Online',
  amistoso: 'Amistoso',
};

export const CATEGORY_LABELS: Record<string, string> = {
  speed: 'Velocidad',
  shooting: 'Tiro',
  passing: 'Pase',
  ball_control: 'Control de balón',
  goalkeeping: 'Portería',
  positioning: 'Posicionamiento',
  injuries: 'Lesiones',
};

export const CATEGORY_ORDER = [
  'speed',
  'shooting',
  'passing',
  'ball_control',
  'goalkeeping',
  'positioning',
  'injuries',
];

export const SCOPE_LABELS: Record<SliderScope, string> = {
  user: 'Usuario',
  cpu: 'CPU',
  cpu_opponent: 'CPU rival',
  cpu_teammate: 'CPU compañero',
};

export const SCOPE_ORDER: SliderScope[] = ['user', 'cpu', 'cpu_opponent', 'cpu_teammate'];

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

export function isMode(value: unknown): value is SetMode {
  return value === 'carrera' || value === 'online' || value === 'amistoso';
}
