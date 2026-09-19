#!/usr/bin/env node
// Genera supabase/seed/01_catalog.sql a partir de supabase/seed/catalog.mjs.
// El SQL resultante es idempotente y sincroniza: lo que ya no está en el
// catálogo se borra, para que renombrar un slug no deje filas huérfanas.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { games, slidersByGame, categoryOrder } from '../supabase/seed/catalog.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'supabase', 'seed', '01_catalog.sql');

const q = (value) => `'${String(value).replace(/'/g, "''")}'`;

/**
 * Valor de fábrica de un slider en un ámbito. Los de comportamiento de la CPU
 * difieren entre rival y compañero, así que pueden traerlo por ámbito.
 */
function defaultFor(slider, scope, game) {
  return slider.defaults?.[scope] ?? slider.default ?? game.range.default;
}

/** Los ámbitos concretos de un slider en un juego, según su `sides`. */
function scopesFor(slider, game) {
  const { user, cpu, cpuTeammate } = game.scopes;

  switch (slider.sides ?? 'both') {
    case 'user':
      return [user];
    case 'cpu':
      return [cpu];
    // Rival y compañero por separado. Si el juego no los desdobla (FC26),
    // queda un solo lado de CPU.
    case 'cpu_both':
      return cpuTeammate ? [cpu, cpuTeammate] : [cpu];
    default:
      return [user, cpu];
  }
}

const lines = [
  '-- GENERADO POR scripts/build-seed.mjs — no editar a mano.',
  '-- Editar supabase/seed/catalog.mjs y ejecutar `npm run seed:build`.',
  '',
  'begin;',
  '',
  '-- Juegos ------------------------------------------------------------------',
  'insert into public.games (slug, name, release_year) values',
  games.map((g) => `  (${q(g.slug)}, ${q(g.name)}, ${g.release_year})`).join(',\n'),
  'on conflict (slug) do update',
  '  set name = excluded.name, release_year = excluded.release_year;',
  '',
  '-- Sliders -----------------------------------------------------------------',
];

const rows = [];
const summary = [];

for (const game of games) {
  const sliders = slidersByGame[game.slug] ?? [];
  const ordered = [...sliders].sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
  );

  let sortOrder = 0;
  let gameRows = 0;

  for (const slider of ordered) {
    for (const scope of scopesFor(slider, game)) {
      rows.push(
        `  ((select id from public.games where slug = ${q(game.slug)}), ` +
          `${q(slider.category)}, ${q(scope)}, ${q(slider.name)}, ${q(slider.slug)}, ` +
          `${slider.min ?? game.range.min}, ${slider.max ?? game.range.max}, ` +
          `${defaultFor(slider, scope, game)}, ${sortOrder})`,
      );
      gameRows += 1;
    }
    sortOrder += 10;
  }

  summary.push(`${game.slug}: ${sliders.length} sliders → ${gameRows} filas`);
}

lines.push(
  'insert into public.slider_definitions',
  '  (game_id, category, applies_to, name, slug, min_value, max_value, default_value, sort_order)',
  'values',
  rows.join(',\n'),
  'on conflict (game_id, slug, applies_to) do update',
  '  set category      = excluded.category,',
  '      name          = excluded.name,',
  '      min_value     = excluded.min_value,',
  '      max_value     = excluded.max_value,',
  '      default_value = excluded.default_value,',
  '      sort_order    = excluded.sort_order;',
  '',
  '-- Limpieza: lo que ya no está en el catálogo -------------------------------',
);

// Se borra por (slug, ámbito), no sólo por slug: si un slider deja de existir
// en un lado —a FC27 le sobraban veinte ámbitos «CPU compañero» de una versión
// preliminar del catálogo— el slug sigue estando y un borrado por slug no los
// ve. Quedaban como sliders fantasma en la ficha del set.
for (const game of games) {
  const pairs = (slidersByGame[game.slug] ?? []).flatMap((slider) =>
    scopesFor(slider, game).map((scope) => `(${q(slider.slug)}, ${q(scope)})`),
  );

  lines.push(
    'delete from public.slider_definitions',
    `where game_id = (select id from public.games where slug = ${q(game.slug)})`,
    '  and (slug, applies_to) not in (',
    `    ${pairs.join(',\n    ')}`,
    '  );',
    '',
  );
}

lines.push('commit;', '');

writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`✓ ${rows.length} filas → supabase/seed/01_catalog.sql`);
for (const line of summary) console.log(`  ${line}`);
