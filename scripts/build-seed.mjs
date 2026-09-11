#!/usr/bin/env node
// Genera supabase/seed/01_catalog.sql a partir de supabase/seed/catalog.mjs.
// El SQL resultante es idempotente: se puede volver a aplicar sin duplicar.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { games, sliders, categoryOrder, DEFAULTS } from '../supabase/seed/catalog.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'supabase', 'seed', '01_catalog.sql');

const q = (value) => `'${String(value).replace(/'/g, "''")}'`;

const lines = [
  '-- GENERADO POR scripts/build-seed.mjs — no editar a mano.',
  '-- Editar supabase/seed/catalog.mjs y ejecutar `npm run seed:build`.',
  '',
  'begin;',
  '',
];

lines.push('-- Juegos ------------------------------------------------------------------');
lines.push('insert into public.games (slug, name, release_year) values');
lines.push(
  games
    .map((g) => `  (${q(g.slug)}, ${q(g.name)}, ${g.release_year})`)
    .join(',\n'),
);
lines.push('on conflict (slug) do update');
lines.push('  set name = excluded.name, release_year = excluded.release_year;');
lines.push('');

lines.push('-- Sliders -----------------------------------------------------------------');

const rows = [];
for (const game of games) {
  let sortOrder = 0;
  const ordered = [...sliders].sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
  );

  for (const slider of ordered) {
    // Un slider de la CPU va en el ámbito rival del juego: `cpu` en FC26,
    // `cpu_opponent` en FC27.
    const cpuScope = game.scopes.find((scope) => scope.startsWith('cpu'));
    const scopes = slider.userOnly
      ? ['user']
      : slider.cpuOnly
        ? [cpuScope].filter(Boolean)
        : game.scopes;
    for (const scope of scopes) {
      rows.push(
        `  ((select id from public.games where slug = ${q(game.slug)}), ` +
          `${q(slider.category)}, ${q(scope)}, ${q(slider.name)}, ${q(slider.slug)}, ` +
          `${slider.min ?? DEFAULTS.min}, ${slider.max ?? DEFAULTS.max}, ` +
          `${slider.default ?? DEFAULTS.default}, ${sortOrder})`,
      );
    }
    sortOrder += 10;
  }
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
);

// Sincroniza: lo que ya no está en el catálogo se borra, para que renombrar
// un slug no deje sliders huérfanos colgando en la UI.
lines.push('-- Limpieza de sliders que ya no están en el catálogo ---------------------');
for (const game of games) {
  const slugs = sliders.map((slider) => q(slider.slug)).join(', ');
  lines.push(
    'delete from public.slider_definitions',
    `where game_id = (select id from public.games where slug = ${q(game.slug)})`,
    `  and slug not in (${slugs});`,
    '',
  );
}

lines.push('commit;', '');

writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`✓ ${rows.length} sliders para ${games.length} juegos → supabase/seed/01_catalog.sql`);
