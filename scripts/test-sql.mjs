#!/usr/bin/env node
/**
 * Ejecuta toda la cadena de SQL (migraciones + seeds) contra un Postgres en
 * memoria y comprueba el resultado. Sirve para no descubrir un error de SQL
 * pegándolo en el editor de Supabase.
 *
 *   npm run test:sql
 *
 * Lo que NO cubre: PGlite no trae pgcrypto (en Supabase sí está, y
 * gen_random_uuid() es del core desde Postgres 13) y no reproduce el motor de
 * RLS con roles reales — sólo comprueba que las políticas se crean y que RLS
 * queda activada en todas las tablas.
 */

import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) =>
  readFileSync(join(repo, file), 'utf8').replace(/create extension if not exists pgcrypto;/, '');

const MIGRATIONS = [
  'supabase/migrations/20260911120000_init_schema.sql',
  'supabase/migrations/20260911120100_rls.sql',
  'supabase/migrations/20260911120200_profiles_trigger.sql',
  'supabase/migrations/20260912090000_drop_mode.sql',
];
const CATALOG = 'supabase/seed/01_catalog.sql';
const STARTER_SET = 'supabase/seed/02_set_full_manual_fg.sql';
const EMAIL = 'ferval19@gmail.com';

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

/** Base limpia con los stubs de lo que aporta Supabase (auth.users, auth.uid). */
async function freshDatabase({ withUser = true, withCatalog = true } = {}) {
  const db = await new PGlite();

  await db.exec(`
    create schema if not exists auth;
    create table auth.users (
      id uuid primary key default gen_random_uuid(),
      email text,
      raw_user_meta_data jsonb default '{}'::jsonb
    );
    create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
    create role anon;
    create role authenticated;
  `);

  // El drop de `mode` va después del catálogo, como en la puesta en marcha real.
  for (const file of MIGRATIONS.slice(0, 3)) await db.exec(read(file));
  if (withCatalog) await db.exec(read(CATALOG));
  await db.exec(read(MIGRATIONS[3]));
  if (withUser) await db.exec(`insert into auth.users (email) values ('${EMAIL}');`);

  return db;
}

const count = async (db, sql) => (await db.query(sql)).rows[0].n;

// --- Camino normal --------------------------------------------------------
{
  const db = await freshDatabase();

  const username = await db.query(`select username from public.profiles`);
  check(
    'el trigger crea el perfil al registrarse',
    username.rows[0]?.username === 'ferval19',
    JSON.stringify(username.rows),
  );

  await db.exec(read(STARTER_SET));

  check('fc26 tiene 50 sliders', 50 === await count(db,
    `select count(*)::int as n from slider_definitions d join games g on g.id = d.game_id where g.slug = 'fc26'`));
  check('fc27 tiene 71 sliders', 71 === await count(db,
    `select count(*)::int as n from slider_definitions d join games g on g.id = d.game_id where g.slug = 'fc27'`));
  check('el set de inicio queda publicado', 1 === await count(db,
    `select count(*)::int as n from slider_sets where is_published`));
  check('con los 50 valores', 50 === await count(db,
    `select count(*)::int as n from slider_set_values`));
  check('y el perfil pasa a fullmanualfg', 1 === await count(db,
    `select count(*)::int as n from profiles where username = 'fullmanualfg'`));

  const gaps = await db.query(`
    select d.slug, d.applies_to
    from slider_definitions d
    join games g on g.id = d.game_id
    left join slider_set_values v on v.slider_definition_id = d.id
    where g.slug = 'fc26' and v.id is null
  `);
  check('ningún slider de fc26 se queda sin valor', gaps.rows.length === 0, JSON.stringify(gaps.rows));

  // Valores concretos del documento de origen
  const spot = await db.query(`
    select d.slug, d.applies_to, v.value
    from slider_set_values v join slider_definitions d on d.id = v.slider_definition_id
  `);
  const value = (slug, scope) =>
    spot.rows.find((r) => r.slug === slug && r.applies_to === scope)?.value;
  check(
    'los valores son los del documento',
    value('sprint_speed', 'user') === 33 &&
      value('sprint_speed', 'cpu') === 32 &&
      value('line_width', 'cpu') === 75 &&
      value('power_bar', 'user') === 48 &&
      value('cpu_flair_frequency', 'cpu') === 1,
  );

  // Reejecutar no debe duplicar
  await db.exec(read(CATALOG));
  await db.exec(read(STARTER_SET));
  check('reejecutar los seeds no duplica', 1 === await count(db,
    `select count(*)::int as n from slider_sets`) && 50 === await count(db,
    `select count(*)::int as n from slider_set_values`));

  await db.close();
}

// --- Caminos de error -----------------------------------------------------
const expectFailure = async (label, setUp, needle) => {
  const db = await setUp();
  let message = null;
  try {
    await db.exec(read(STARTER_SET));
  } catch (error) {
    message = error.message;
  }
  check(label, Boolean(message?.includes(needle)), message?.split('\n')[0] ?? 'no falló');
  return db;
};

await (await expectFailure(
  'sin usuario registrado, aborta con un mensaje claro',
  () => freshDatabase({ withUser: false }),
  'No existe ningún usuario',
)).close();

await (await expectFailure(
  'sin catálogo aplicado, aborta con un mensaje claro',
  () => freshDatabase({ withCatalog: false }),
  'Falta el juego fc26',
)).close();

{
  const db = await expectFailure(
    'con el catálogo incompleto, aborta en lugar de publicar un set a medias',
    async () => {
      const fresh = await freshDatabase();
      await fresh.exec(`delete from slider_definitions where slug = 'cpu_flair_frequency'`);
      return fresh;
    },
    'no están en el catálogo',
  );
  check('y no deja nada escrito', 0 === await count(db, `select count(*)::int as n from slider_sets`));
  await db.close();
}

// --- RLS ------------------------------------------------------------------
{
  const db = await freshDatabase();
  const { rows } = await db.query(`
    select relname, relrowsecurity
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r'
  `);
  const without = rows.filter((row) => !row.relrowsecurity).map((row) => row.relname);
  check(
    `RLS activada en las ${rows.length} tablas`,
    rows.length === 6 && without.length === 0,
    without.join(', '),
  );
  await db.close();
}

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
