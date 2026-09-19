/**
 * Importar un set desde texto pegado.
 *
 * El caso real: los sets viven en Notion, en un documento de WhatsApp o en un
 * comentario de YouTube. Teclear 61 sliders a mano son quince minutos; pegar
 * el texto son treinta segundos.
 *
 * Es un módulo puro a propósito —sin React ni nada del servidor— para poder
 * probarlo desde `npm run test:import` sin levantar la aplicación. El formato
 * de entrada no lo controlamos, así que la prueba es la única forma de saber
 * que sigue tragando lo que la gente pega.
 */

import type { SliderDefinition, SliderScope } from './database.types';

export type ImportedValue = {
  scope: SliderScope;
  definitionId: number;
  value: number;
  /** El texto traía un valor fuera del rango del juego y se ha recortado. */
  clamped: boolean;
};

export type ImportedRow = {
  slug: string;
  name: string;
  values: ImportedValue[];
};

export type ImportReport = {
  /** Listo para mezclar con el estado del formulario: id de definición → valor. */
  values: Record<string, number>;
  rows: ImportedRow[];
  /** Líneas con letras y números que no se han sabido asignar a ningún slider. */
  unmatched: string[];
  /** Cuántos sliders distintos tiene el juego, para poder decir «48 de 61». */
  total: number;
};

const SCOPE_ORDER: SliderScope[] = ['user', 'cpu', 'cpu_opponent', 'cpu_teammate'];

/**
 * Marcas de ámbito en el texto. Se buscan por palabras, de más específica a
 * menos: «cpu companero» tiene que ganar a «cpu».
 */
const SCOPE_MARKERS: { words: string; scope: SliderScope }[] = [
  { words: 'cpu companero', scope: 'cpu_teammate' },
  { words: 'cpu compa', scope: 'cpu_teammate' },
  { words: 'companero', scope: 'cpu_teammate' },
  { words: 'cpu rival', scope: 'cpu_opponent' },
  { words: 'rival', scope: 'cpu_opponent' },
  { words: 'cpu', scope: 'cpu' },
  { words: 'usuario', scope: 'user' },
  { words: 'user', scope: 'user' },
  { words: 'yo', scope: 'user' },
];

/** Un valor de slider nunca pasa de 100; así un «8 min» o un «2026» no cuela. */
const MAX_PLAUSIBLE = 100;

export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

type Row = {
  slug: string;
  name: string;
  byScope: Partial<Record<SliderScope, SliderDefinition>>;
  scopes: SliderScope[];
};

function buildRows(definitions: SliderDefinition[]) {
  const rows = new Map<string, Row>();

  for (const definition of definitions) {
    let row = rows.get(definition.slug);
    if (!row) {
      row = { slug: definition.slug, name: definition.name, byScope: {}, scopes: [] };
      rows.set(definition.slug, row);
    }
    row.byScope[definition.applies_to] = definition;
  }

  for (const row of rows.values()) {
    row.scopes = SCOPE_ORDER.filter((scope) => row.byScope[scope]);
  }

  return rows;
}

/**
 * Índice de búsqueda: por nombre y también por slug, porque hay quien pega la
 * exportación de otra herramienta. Ordenado por longitud descendente para que
 * «velocidad de tiros de calidad» gane a «velocidad», que es un prefijo suyo.
 */
function buildNeedles(rows: Map<string, Row>) {
  const needles: { text: string; slug: string }[] = [];

  for (const row of rows.values()) {
    needles.push({ text: normalize(row.name), slug: row.slug });
    const fromSlug = normalize(row.slug);
    if (fromSlug !== normalize(row.name)) needles.push({ text: fromSlug, slug: row.slug });
  }

  return needles.sort((a, b) => b.text.length - a.text.length);
}

/** Busca la aguja como palabras completas, no como trozo de otra palabra. */
function findNeedle(line: string, needles: { text: string; slug: string }[]) {
  const padded = ` ${line} `;

  for (const needle of needles) {
    const at = padded.indexOf(` ${needle.text} `);
    if (at === -1) continue;
    return {
      slug: needle.slug,
      // Lo que queda del renglón al quitar el nombre: ahí están los números.
      rest: `${padded.slice(0, at)} ${padded.slice(at + needle.text.length + 2)}`.trim(),
    };
  }

  return null;
}

/**
 * Los números de un renglón, con el ámbito que los precede si lo hay.
 * «Usuario 48 CPU 52» → [{user,48},{cpu,52}]; «48 52» → [{null,48},{null,52}].
 */
function readNumbers(rest: string) {
  const tokens = rest.split(' ').filter(Boolean);
  const found: { scope: SliderScope | null; value: number }[] = [];
  let current: SliderScope | null = null;

  for (let index = 0; index < tokens.length; index += 1) {
    const marker = SCOPE_MARKERS.find((candidate) => {
      const words = candidate.words.split(' ');
      return words.every((word, offset) => tokens[index + offset] === word);
    });

    if (marker) {
      current = marker.scope;
      index += marker.words.split(' ').length - 1;
      continue;
    }

    if (/^\d+$/.test(tokens[index])) {
      const value = Number(tokens[index]);
      if (value <= MAX_PLAUSIBLE) found.push({ scope: current, value });
      current = null;
    }
  }

  return found;
}

/**
 * Traduce el ámbito leído en el texto al que existe en este juego. En FC26 la
 * CPU es `cpu`; en FC27 el mismo slider es `cpu_opponent`. Quien pega un set
 * de FC26 en FC27 escribe «CPU», y tiene que caer en el rival.
 */
function resolveScope(scope: SliderScope, row: Row): SliderScope | null {
  if (row.byScope[scope]) return scope;
  if (scope === 'cpu' && row.byScope.cpu_opponent) return 'cpu_opponent';
  if (scope === 'cpu_opponent' && row.byScope.cpu) return 'cpu';
  return null;
}

function assign(row: Row, numbers: { scope: SliderScope | null; value: number }[]) {
  const assigned = new Map<SliderScope, number>();
  const labelled = numbers.some((number) => number.scope !== null);

  if (labelled) {
    for (const number of numbers) {
      if (!number.scope) continue;
      const scope = resolveScope(number.scope, row);
      if (scope) assigned.set(scope, number.value);
    }
    return assigned;
  }

  // Un solo número para un slider de dos lados quiere decir «igual en ambos»,
  // que es como lo escribe casi todo el mundo cuando no los separa.
  if (numbers.length === 1 && row.scopes.length > 1) {
    for (const scope of row.scopes) assigned.set(scope, numbers[0].value);
    return assigned;
  }

  row.scopes.forEach((scope, index) => {
    const number = numbers[index];
    if (number) assigned.set(scope, number.value);
  });

  return assigned;
}

/** Quita viñetas y numeración de lista, que si no cuentan como valor. */
function stripBullet(line: string) {
  return line.replace(/^\s*(?:[-*•·]+|\d{1,2}[.)])\s+/, '');
}

export function parseSliderText(text: string, definitions: SliderDefinition[]): ImportReport {
  const rows = buildRows(definitions);
  const needles = buildNeedles(rows);

  const lines = text.split(/\r?\n/).map((line) => normalize(stripBullet(line)));
  const values: Record<string, number> = {};
  const parsed = new Map<string, ImportedRow>();
  const unmatched: string[] = [];
  const consumed = new Set<number>();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line || consumed.has(index)) continue;

    const match = findNeedle(line, needles);

    if (!match) {
      // Sólo molestamos con lo que parece un slider: texto y número juntos.
      if (/[a-z]/.test(line) && /\d/.test(line)) unmatched.push(line);
      continue;
    }

    const row = rows.get(match.slug)!;
    let numbers = readNumbers(match.rest);

    // Notion pega cada celda en su propio renglón: el nombre y debajo los
    // valores sueltos. Si el renglón del nombre viene sin números, se miran
    // los siguientes mientras sean números pelados.
    if (numbers.length === 0) {
      const ahead: { scope: SliderScope | null; value: number }[] = [];
      for (let next = index + 1; next < lines.length && ahead.length < row.scopes.length; next += 1) {
        if (!/^\d+$/.test(lines[next])) break;
        const value = Number(lines[next]);
        if (value > MAX_PLAUSIBLE) break;
        ahead.push({ scope: null, value });
        consumed.add(next);
      }
      numbers = ahead;
    }

    if (numbers.length === 0) continue;

    const imported: ImportedValue[] = [];

    for (const [scope, raw] of assign(row, numbers)) {
      const definition = row.byScope[scope]!;
      const value = Math.min(definition.max_value, Math.max(definition.min_value, raw));
      values[String(definition.id)] = value;
      imported.push({ scope, definitionId: definition.id, value, clamped: value !== raw });
    }

    if (imported.length > 0) {
      parsed.set(row.slug, { slug: row.slug, name: row.name, values: imported });
    }
  }

  return { values, rows: [...parsed.values()], unmatched, total: rows.size };
}
