import type { Locale } from './i18n/locale';
import type { CpuBehaviour, SliderScope } from './database.types';

export const SITE_NAME = 'SlidersFC';
export const SITE_TAGLINE = 'Sliders de EA SPORTS FC, con la comunidad comentando valor a valor.';
export const SITE_BYLINE = 'by Full Manual FG';

/**
 * Las etiquetas de categorías y ámbitos viven aquí y no en el diccionario de
 * `i18n/`: las usan tanto componentes de cliente como de servidor, y las
 * funciones de abajo (`categoryLabel`, etc.) son justo lo que evita que cada
 * cual tenga que resolver el idioma por su cuenta — reciben el `locale` como
 * parámetro, como cualquier otra función de este fichero.
 */
const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  es: {
    speed: 'Velocidad',
    shooting: 'Tiro',
    passing: 'Pase',
    ball_control: 'Control del balón',
    defending: 'Defensa',
    goalkeeping: 'Portería',
    positioning: 'Posición del equipo',
    injuries: 'Lesiones',
    cpu_controls: 'Controles de la CPU',
  },
  en: {
    speed: 'Speed',
    shooting: 'Shooting',
    passing: 'Passing',
    ball_control: 'Ball control',
    defending: 'Defending',
    goalkeeping: 'Goalkeeping',
    positioning: 'Team positioning',
    injuries: 'Injuries',
    cpu_controls: 'CPU controls',
  },
};

export function categoryLabel(category: string, locale: Locale) {
  return CATEGORY_LABELS[locale][category] ?? category;
}

/**
 * Nombres cortos para las barras de navegación, donde nueve categorías con su
 * nombre entero no caben en una línea.
 */
const CATEGORY_SHORT_LABELS: Record<Locale, Record<string, string>> = {
  es: {
    ball_control: 'Control',
    positioning: 'Posición',
    goalkeeping: 'Portería',
    cpu_controls: 'CPU',
  },
  en: {
    ball_control: 'Control',
    positioning: 'Position',
    goalkeeping: 'Goalkeeping',
    cpu_controls: 'CPU',
  },
};

export function categoryShortLabel(category: string, locale: Locale) {
  return CATEGORY_SHORT_LABELS[locale][category] ?? categoryLabel(category, locale);
}

const SCOPE_LABELS: Record<Locale, Record<SliderScope, string>> = {
  es: {
    user: 'Usuario',
    cpu: 'CPU',
    cpu_opponent: 'CPU rival',
    cpu_teammate: 'CPU compañero',
  },
  en: {
    user: 'User',
    cpu: 'CPU',
    cpu_opponent: 'Opponent CPU',
    cpu_teammate: 'Teammate CPU',
  },
};

export function scopeLabel(scope: SliderScope, locale: Locale) {
  return SCOPE_LABELS[locale][scope];
}

/** El mapa entero, para `ScaleLegend` y cualquier sitio que lo necesite completo. */
export function scopeLabels(locale: Locale): Record<SliderScope, string> {
  return SCOPE_LABELS[locale];
}

/**
 * Nombres cortos de los ámbitos. En el móvil cada valor lleva su etiqueta
 * encima —si no, en la fila sesenta estás leyendo «35 35» sin saber de quién
 * es cada uno—, y ahí «CPU compañero» no cabe.
 */
const SCOPE_SHORT_LABELS: Record<Locale, Record<SliderScope, string>> = {
  es: {
    user: 'Usuario',
    cpu: 'CPU',
    cpu_opponent: 'CPU rival',
    cpu_teammate: 'Compañero',
  },
  en: {
    user: 'User',
    cpu: 'CPU',
    cpu_opponent: 'Opponent CPU',
    cpu_teammate: 'Teammate',
  },
};

export function scopeShortLabel(scope: SliderScope, locale: Locale) {
  return SCOPE_SHORT_LABELS[locale][scope];
}

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
const CPU_BEHAVIOURS: Record<Locale, { value: CpuBehaviour; label: string; hint: string }[]> = {
  es: [
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
  ],
  en: [
    {
      value: 'tactical',
      label: 'Tactical',
      hint: "The CPU adjusts on its own to the team it's facing. It's what the game ships with.",
    },
    {
      value: 'dynamic',
      label: 'Dynamic',
      hint: 'The CPU adjusts on its own and also shifts as the match goes on.',
    },
    {
      value: 'custom',
      label: 'Custom',
      hint: "You set the values on this tab. It's the only case where they're used.",
    },
  ],
};

export function cpuBehaviours(locale: Locale) {
  return CPU_BEHAVIOURS[locale];
}

export function cpuBehaviourLabel(value: CpuBehaviour, locale: Locale) {
  return CPU_BEHAVIOURS[locale].find((behaviour) => behaviour.value === value)?.label ?? value;
}

export function sortScopes(scopes: SliderScope[]) {
  return [...scopes].sort((a, b) => SCOPE_ORDER.indexOf(a) - SCOPE_ORDER.indexOf(b));
}
