/**
 * Comparar dos sets del mismo juego, slider a slider.
 *
 * El caso real: alguien tiene su set y el de un compañero (o dos versiones
 * suyas, antes y después de un torneo) y quiere ver de un vistazo dónde
 * difieren y cuánto. Los dos sets son del mismo juego, así que comparten las
 * mismas definiciones —no hay que emparejar por slug entre catálogos.
 *
 * Es un módulo puro a propósito —sin React ni nada del servidor— para poder
 * probarlo desde `npm run test:compare` sin levantar la aplicación ni tocar
 * la base. No importa `@/lib/constants` ni `@/lib/category-order`: aunque son
 * la misma lógica, importarlos arrastraría la cadena hasta módulos que sí
 * dependen del servidor, así que se reimplementan aquí (son unas pocas
 * líneas cada una).
 */

import type { SliderDefinition, SliderScope } from './database.types';

export type CompareCell = {
  scope: SliderScope;
  /** null cuando ese ámbito no existe en este slider. */
  a: number | null;
  b: number | null;
  /** b - a. null si falta alguno de los dos. */
  delta: number | null;
};

export type CompareRow = {
  slug: string;
  name: string;
  category: string;
  /** Lo que trae el juego de fábrica, o null si no lo sabemos. */
  reference: number | null;
  cells: CompareCell[];
  /** La mayor diferencia absoluta de la fila. 0 = los dos sets coinciden. */
  spread: number;
};

export type CompareBlock = {
  category: string;
  rows: CompareRow[];
};

export type CompareView = {
  scopes: SliderScope[];
  /** Si el juego trae preajuste de fábrica; si no, no se dibuja referencia. */
  hasReference: boolean;
  min: number;
  max: number;
  /** En el orden del menú del juego, agrupadas por categoría. */
  blocks: CompareBlock[];
  /** Todas las filas, en el orden del menú, sin agrupar. */
  rows: CompareRow[];
  /** Cuántas filas tienen spread > 0. */
  differing: number;
  /** Cuántas filas hay en total. */
  total: number;
};

/** Duplicado de `@/lib/constants`: ese módulo no es puro para este propósito. */
const SCOPE_ORDER: SliderScope[] = ['user', 'cpu', 'cpu_opponent', 'cpu_teammate'];

type SlugGroup = {
  slug: string;
  name: string;
  category: string;
  sortOrder: number;
  byScope: Partial<Record<SliderScope, SliderDefinition>>;
};

/**
 * Agrupa las definiciones por slug, quedándose con el nombre, la categoría y
 * el `sort_order` más bajo de sus sliders (el primero que aparece en el menú
 * del juego), y con la definición de cada ámbito para leer su valor.
 */
function buildGroups(definitions: SliderDefinition[]) {
  const groups = new Map<string, SlugGroup>();

  for (const definition of definitions) {
    let group = groups.get(definition.slug);
    if (!group) {
      group = {
        slug: definition.slug,
        name: definition.name,
        category: definition.category,
        sortOrder: definition.sort_order,
        byScope: {},
      };
      groups.set(definition.slug, group);
    } else if (definition.sort_order < group.sortOrder) {
      group.sortOrder = definition.sort_order;
    }
    group.byScope[definition.applies_to] = definition;
  }

  return groups;
}

/**
 * Duplicado de `orderCategories` en `@/lib/category-order`: la misma idea
 * (ordenar por el `sort_order` más bajo de cada grupo, que es el orden del
 * menú del juego), pero sin importar ese módulo para que éste siga siendo
 * puro.
 */
function orderByLowestSortOrder<T extends { key: string; sortOrder: number }>(items: T[]) {
  const first = new Map<string, number>();

  for (const item of items) {
    const current = first.get(item.key);
    if (current === undefined || item.sortOrder < current) first.set(item.key, item.sortOrder);
  }

  return [...new Set(items.map((item) => item.key))].sort(
    (a, b) => (first.get(a) ?? Number.MAX_SAFE_INTEGER) - (first.get(b) ?? Number.MAX_SAFE_INTEGER),
  );
}

/** El valor guardado si lo hay; si no, lo que trae el slider por defecto. */
function valueFor(values: Record<string, number>, definition: SliderDefinition) {
  const raw = values[String(definition.id)];
  return raw ?? definition.default_value;
}

export function buildCompareView(input: {
  definitions: SliderDefinition[];
  /** id de definición (como string) → valor, para cada set. */
  a: Record<string, number>;
  b: Record<string, number>;
}): CompareView {
  const { definitions, a, b } = input;

  if (definitions.length === 0) {
    return {
      scopes: [],
      hasReference: false,
      min: 0,
      max: 100,
      blocks: [],
      rows: [],
      differing: 0,
      total: 0,
    };
  }

  const scopes = SCOPE_ORDER.filter((scope) =>
    definitions.some((definition) => definition.applies_to === scope),
  );

  // Si todos los defaults del catálogo son iguales, es el neutro del menú y
  // no sabemos el preajuste real del juego.
  const distinctDefaults = new Set(definitions.map((definition) => definition.default_value));
  const hasReference = distinctDefaults.size > 1;

  const min = Math.min(...definitions.map((definition) => definition.min_value));
  const max = Math.max(...definitions.map((definition) => definition.max_value));

  const groups = buildGroups(definitions);

  const categoryOrder = orderByLowestSortOrder(
    [...groups.values()].map((group) => ({ key: group.category, sortOrder: group.sortOrder })),
  );

  const rowsBySlug = new Map<string, CompareRow>();

  for (const group of groups.values()) {
    const cells: CompareCell[] = scopes.map((scope) => {
      const definition = group.byScope[scope];
      if (!definition) return { scope, a: null, b: null, delta: null };

      const valueA = valueFor(a, definition);
      const valueB = valueFor(b, definition);
      return { scope, a: valueA, b: valueB, delta: valueB - valueA };
    });

    const deltas = cells
      .map((cell) => cell.delta)
      .filter((delta): delta is number => delta !== null)
      .map((delta) => Math.abs(delta));
    const spread = deltas.length > 0 ? Math.max(...deltas) : 0;

    // La referencia es la del ámbito de usuario; si el slider no lo tiene
    // (p.ej. un slider sólo de CPU), la de la primera definición del slug.
    const referenceDefinition = group.byScope.user ?? Object.values(group.byScope)[0] ?? null;
    const reference = referenceDefinition ? referenceDefinition.default_value : null;

    rowsBySlug.set(group.slug, {
      slug: group.slug,
      name: group.name,
      category: group.category,
      reference,
      cells,
      spread,
    });
  }

  const slugOrder = orderByLowestSortOrder(
    [...groups.values()].map((group) => ({ key: group.slug, sortOrder: group.sortOrder })),
  );

  const blocks: CompareBlock[] = categoryOrder.map((category) => ({
    category,
    rows: slugOrder
      .filter((slug) => groups.get(slug)!.category === category)
      .map((slug) => rowsBySlug.get(slug)!),
  }));

  const rows = blocks.flatMap((block) => block.rows);
  const differing = rows.filter((row) => row.spread > 0).length;

  return {
    scopes,
    hasReference,
    min,
    max,
    blocks,
    rows,
    differing,
    total: rows.length,
  };
}

/** Las filas donde más se separan los dos sets, de mayor a menor. */
export function topDifferences(
  view: CompareView,
  limit: number,
): { name: string; a: number | null; b: number | null; delta: number }[] {
  return view.rows
    .filter((row) => row.spread > 0)
    .map((row) => {
      // La celda que manda en el spread de la fila: si hay empate, la
      // primera en el orden en que vienen las celdas.
      const cell = row.cells.find((candidate) => Math.abs(candidate.delta ?? 0) === row.spread)!;
      return { name: row.name, a: cell.a, b: cell.b, delta: cell.delta ?? 0 };
    })
    .sort((rowA, rowB) => Math.abs(rowB.delta) - Math.abs(rowA.delta))
    .slice(0, limit);
}
