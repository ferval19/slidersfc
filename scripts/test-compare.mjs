#!/usr/bin/env node
/**
 * Prueba la comparación de dos sets del mismo juego.
 *
 *   npm run test:compare
 *
 * No hace falta el catálogo real: las definiciones de cada prueba se montan
 * a mano con `definitionsFrom`, lo justo para ejercitar cada regla (ámbitos
 * que faltan, valores por defecto, orden de categorías que no coincide con
 * el alfabético...).
 *
 * Carga `src/lib/compare.ts` directamente: Node quita los tipos, y el módulo
 * es puro (sólo importa tipos) para que eso baste.
 */

import { buildCompareView } from '../src/lib/compare.ts';

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

/**
 * Construye `SliderDefinition[]` a partir de una lista de sliders.
 * Cada elemento: { slug, name, category, scopes, defaults? }.
 * `scopes` es la lista de ámbitos del slider (en el orden que se quiera).
 * `defaults` es un mapa ámbito → default_value; si no se da, 50 para todos.
 */
function definitionsFrom(sliders) {
  const definitions = [];
  let id = 1;
  let sortOrder = 0;

  for (const slider of sliders) {
    for (const scope of slider.scopes) {
      definitions.push({
        id: id++,
        game_id: 1,
        category: slider.category,
        applies_to: scope,
        name: slider.name,
        slug: slider.slug,
        min_value: 1,
        max_value: 99,
        default_value: slider.defaults?.[scope] ?? 50,
        sort_order: sortOrder++,
      });
    }
  }

  return definitions;
}

const find = (definitions, slug, scope) =>
  definitions.find((d) => d.slug === slug && d.applies_to === scope);

// --- Dos sets iguales: nada difiere --------------------------------------
{
  const definitions = definitionsFrom([
    { slug: 'velocidad', name: 'Velocidad', category: 'Ritmo', scopes: ['user', 'cpu'] },
    { slug: 'marcaje', name: 'Marcaje', category: 'Defensa', scopes: ['user', 'cpu'] },
  ]);
  const a = { [find(definitions, 'velocidad', 'user').id]: 40, [find(definitions, 'velocidad', 'cpu').id]: 45 };
  const view = buildCompareView({ definitions, a, b: { ...a } });

  check('sets iguales: nada difiere', view.differing === 0, `${view.differing}`);
  check('sets iguales: todos los spread a 0', view.rows.every((row) => row.spread === 0));
}

// --- Diferencia de usuario, con signo -------------------------------------
{
  const definitions = definitionsFrom([
    { slug: 'velocidad', name: 'Velocidad', category: 'Ritmo', scopes: ['user', 'cpu'] },
  ]);
  const idUser = find(definitions, 'velocidad', 'user').id;
  const idCpu = find(definitions, 'velocidad', 'cpu').id;
  const a = { [idUser]: 40, [idCpu]: 45 };
  const b = { [idUser]: 55, [idCpu]: 45 };
  const view = buildCompareView({ definitions, a, b });
  const row = view.rows[0];
  const userCell = row.cells.find((cell) => cell.scope === 'user');

  check('delta con signo (b - a)', userCell.delta === 15, `${userCell.delta}`);
  check('spread igual al valor absoluto del delta', row.spread === 15, `${row.spread}`);
}

// --- Sólo difiere la CPU: la fila cuenta como distinta --------------------
{
  const definitions = definitionsFrom([
    { slug: 'agresividad', name: 'Agresividad', category: 'Defensa', scopes: ['user', 'cpu'] },
  ]);
  const idUser = find(definitions, 'agresividad', 'user').id;
  const idCpu = find(definitions, 'agresividad', 'cpu').id;
  const a = { [idUser]: 50, [idCpu]: 50 };
  const b = { [idUser]: 50, [idCpu]: 70 };
  const view = buildCompareView({ definitions, a, b });

  check('sólo difiere la CPU: cuenta como distinta', view.differing === 1, `${view.differing}`);
}

// --- Slider sin ámbito de CPU: celda a null y no afecta al spread --------
{
  const definitions = definitionsFrom([
    { slug: 'velocidad', name: 'Velocidad', category: 'Ritmo', scopes: ['user', 'cpu'] },
    { slug: 'solo_usuario', name: 'Sólo usuario', category: 'Ritmo', scopes: ['user'] },
  ]);
  const idUser = find(definitions, 'solo_usuario', 'user').id;
  const a = { [idUser]: 30 };
  const b = { [idUser]: 30 };
  const view = buildCompareView({ definitions, a, b });
  const row = view.rows.find((candidate) => candidate.slug === 'solo_usuario');
  const cpuCell = row.cells.find((cell) => cell.scope === 'cpu');

  check(
    'sin ámbito de CPU: celda a/b/delta a null',
    cpuCell.a === null && cpuCell.b === null && cpuCell.delta === null,
  );
  check('sin ámbito de CPU: no afecta al spread', row.spread === 0, `${row.spread}`);
}

// --- Sin valor guardado, se usa el default_value --------------------------
{
  const definitions = definitionsFrom([
    {
      slug: 'velocidad',
      name: 'Velocidad',
      category: 'Ritmo',
      scopes: ['user'],
      defaults: { user: 42 },
    },
  ]);
  const view = buildCompareView({ definitions, a: {}, b: {} });
  const cell = view.rows[0].cells[0];

  check('sin valor guardado: se usa el default_value', cell.a === 42 && cell.b === 42, `${cell.a} / ${cell.b}`);
}

// --- Spread es el máximo cuando difieren los dos ámbitos ------------------
{
  const definitions = definitionsFrom([
    { slug: 'velocidad', name: 'Velocidad', category: 'Ritmo', scopes: ['user', 'cpu'] },
  ]);
  const idUser = find(definitions, 'velocidad', 'user').id;
  const idCpu = find(definitions, 'velocidad', 'cpu').id;
  const a = { [idUser]: 40, [idCpu]: 40 };
  const b = { [idUser]: 45, [idCpu]: 70 };
  const view = buildCompareView({ definitions, a, b });

  check('spread es el máximo de la fila', view.rows[0].spread === 30, `${view.rows[0].spread}`);
}

// --- hasReference: false si todos los default_value son iguales ----------
{
  const definitions = definitionsFrom([
    { slug: 'velocidad', name: 'Velocidad', category: 'Ritmo', scopes: ['user', 'cpu'], defaults: { user: 50, cpu: 50 } },
    { slug: 'marcaje', name: 'Marcaje', category: 'Defensa', scopes: ['user'], defaults: { user: 50 } },
  ]);
  const view = buildCompareView({ definitions, a: {}, b: {} });

  check('hasReference false cuando todos los default coinciden', view.hasReference === false);
}
{
  const definitions = definitionsFrom([
    { slug: 'velocidad', name: 'Velocidad', category: 'Ritmo', scopes: ['user', 'cpu'], defaults: { user: 50, cpu: 60 } },
  ]);
  const view = buildCompareView({ definitions, a: {}, b: {} });

  check('hasReference true cuando los default difieren', view.hasReference === true);
}

// --- Orden por sort_order, no alfabético ni por aparición -----------------
{
  // «Zafarrancho» aparece primero pero su sort_order es el más alto; la
  // categoría «Zona» sale primero en el catálogo (sort_order más bajo) pero
  // alfabéticamente iría después de «Ataque».
  const definitions = definitionsFrom([
    { slug: 'zafarrancho', name: 'Zafarrancho', category: 'Zona', scopes: ['user'] },
    { slug: 'aceleracion', name: 'Aceleración', category: 'Zona', scopes: ['user'] },
    { slug: 'presion', name: 'Presión', category: 'Ataque', scopes: ['user'] },
  ]);
  const view = buildCompareView({ definitions, a: {}, b: {} });

  check(
    'categorías por sort_order, no alfabético',
    view.blocks.map((block) => block.category).join(',') === 'Zona,Ataque',
    view.blocks.map((block) => block.category).join(','),
  );
  check(
    'filas dentro de la categoría por sort_order del slug',
    view.blocks[0].rows.map((row) => row.slug).join(',') === 'zafarrancho,aceleracion',
    view.blocks[0].rows.map((row) => row.slug).join(','),
  );
}

// --- rows es el aplanado de blocks, en el mismo orden ---------------------
{
  const definitions = definitionsFrom([
    { slug: 'velocidad', name: 'Velocidad', category: 'Ritmo', scopes: ['user'] },
    { slug: 'marcaje', name: 'Marcaje', category: 'Defensa', scopes: ['user'] },
  ]);
  const view = buildCompareView({ definitions, a: {}, b: {} });
  const flattened = view.blocks.flatMap((block) => block.rows.map((row) => row.slug));

  check('rows.length === total', view.rows.length === view.total, `${view.rows.length} / ${view.total}`);
  check(
    'rows es el aplanado de blocks en el mismo orden',
    view.rows.map((row) => row.slug).join(',') === flattened.join(','),
  );
}

// --- definitions vacío no rompe -------------------------------------------
{
  const view = buildCompareView({ definitions: [], a: {}, b: {} });

  check(
    'definitions vacío no rompe',
    view.blocks.length === 0 &&
      view.rows.length === 0 &&
      view.differing === 0 &&
      view.total === 0 &&
      view.scopes.length === 0 &&
      view.hasReference === false,
  );
}

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
