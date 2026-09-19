#!/usr/bin/env node
/**
 * Prueba de ida y vuelta para las copias de seguridad.
 *
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/test-backup.mjs
 *
 * La pregunta que contesta esta prueba es una sola: ¿el SQL que genera
 * `buildRestoreSql` repone de verdad lo que había? Un volcado que no se sabe
 * reponer no es una copia.
 *
 * El viaje, contra PGlite:
 *   1. Se monta una base de origen con un set de prueba (título, slug,
 *      descripción, valores en varios ámbitos y dos comentarios).
 *   2. Se lee todo con `select` y se monta el `dump` con la misma forma que
 *      escribe `scripts/backup.mjs`.
 *   3. Se genera el SQL con `buildRestoreSql(dump)`.
 *   4. Se monta una base NUEVA y vacía (migraciones + catálogo + el mismo
 *      usuario en `auth.users`, pero sin el set ni el perfil a mano) y se
 *      ejecuta el SQL generado.
 *   5. Se comprueba que ha vuelto todo.
 *
 * Los ids de `slider_definitions` son `serial`: para no aprobar la prueba por
 * casualidad, la base de destino desplaza sus secuencias antes de aplicar el
 * catálogo, así sus ids no coinciden con los de la base de origen y sólo
 * puede pasar quien resuelva los valores por (slug, ámbito), que es lo que
 * de verdad se está probando.
 */

import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATALOG, MIGRATIONS_ANTES, MIGRATIONS_DESPUES } from './schema-files.mjs';

import { PGlite } from '@electric-sql/pglite';

import { buildRestoreSql } from './backup-sql.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) =>
  readFileSync(join(repo, file), 'utf8').replace(/create extension if not exists pgcrypto;/, '');


const EMAIL = 'ferval19@gmail.com';

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

const q = (value) => `'${String(value).replace(/'/g, "''")}'`;

/**
 * Base limpia con los stubs de lo que aporta Supabase, igual que en
 * `test-sql.mjs`. `idOffset`, distinto de cero, desplaza las secuencias de
 * `games` y `slider_definitions` antes de aplicar el catálogo, para que sus
 * ids no coincidan con los de otra base montada con un desplazamiento
 * distinto (o sin desplazar).
 */
async function freshDatabase({ withUser = true, idOffset = 0 } = {}) {
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

  for (const file of MIGRATIONS_ANTES) await db.exec(read(file));

  if (idOffset) {
    await db.exec(`select setval(pg_get_serial_sequence('public.games', 'id'), ${idOffset}, false);`);
    await db.exec(
      `select setval(pg_get_serial_sequence('public.slider_definitions', 'id'), ${idOffset * 10}, false);`,
    );
  }

  await db.exec(read(CATALOG));
  for (const file of MIGRATIONS_DESPUES) await db.exec(read(file));
  if (withUser) await db.exec(`insert into auth.users (email) values (${q(EMAIL)});`);

  return db;
}

const one = async (db, sql) => (await db.query(sql)).rows[0];
const rows = async (db, sql) => (await db.query(sql)).rows;
const count = async (db, sql) => (await db.query(sql)).rows[0].n;

/** Ejecuta SQL contra PGlite sin dejar que una excepción tire abajo el script. */
async function tryExec(db, sql) {
  try {
    await db.exec(sql);
    return { ok: true, message: null };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

/**
 * El volcado entero, con la misma forma que escribe `scripts/backup.mjs`.
 *
 * PGlite devuelve las columnas `timestamptz` como objetos `Date`, pero la
 * copia real llega desde `supabase-js` (PostgREST) ya en JSON, con las
 * fechas como texto ISO. La vuelta por JSON aquí reproduce eso: si no se
 * hace, `String(date)` cuela un `GMT+0200 (...)` que Postgres no reconoce.
 */
async function dumpAllTables(db) {
  const dump = {
    generado: new Date().toISOString(),
    origen: 'prueba local',
    tablas: {
      games: await rows(db, `select * from public.games`),
      profiles: await rows(db, `select * from public.profiles`),
      username_history: await rows(db, `select * from public.username_history`),
      slider_definitions: await rows(db, `select * from public.slider_definitions`),
      slider_sets: await rows(db, `select * from public.slider_sets`),
      slider_set_values: await rows(db, `select * from public.slider_set_values`),
      slider_comments: await rows(db, `select * from public.slider_comments`),
    },
  };
  return JSON.parse(JSON.stringify(dump));
}

// --- 1. Base de origen, con un set de prueba ------------------------------

const origin = await freshDatabase();

const userId = (await one(origin, `select id from auth.users where email = ${q(EMAIL)}`)).id;
const profile = await one(origin, `select id, username from public.profiles limit 1`);

await origin.exec(`
  update public.profiles
  set display_name = ${q('Fernando de prueba')},
      bio           = ${q('Biografía de prueba para el viaje de ida y vuelta.')}
  where id = ${q(profile.id)}
`);

const game = await one(origin, `select id from public.games where slug = 'fc27'`);
const defSprintUser = await one(
  origin,
  `select id from public.slider_definitions
   where game_id = ${game.id} and slug = 'sprint_speed' and applies_to = 'user'`,
);
const defSprintCpu = await one(
  origin,
  `select id from public.slider_definitions
   where game_id = ${game.id} and slug = 'sprint_speed' and applies_to = 'cpu_opponent'`,
);
const defAccelUser = await one(
  origin,
  `select id from public.slider_definitions
   where game_id = ${game.id} and slug = 'acceleration' and applies_to = 'user'`,
);

const setId = randomUUID();
const setTitle = 'Set de prueba para la copia';
const setDescription = 'Descripción de prueba para el viaje de ida y vuelta.';

await origin.exec(`
  insert into public.slider_sets (id, owner_id, game_id, title, description, is_published, cpu_behaviour,
    difficulty, half_length, camera, camera_height, camera_zoom)
  values (${q(setId)}, ${q(profile.id)}, ${game.id}, ${q(setTitle)}, ${q(setDescription)}, true, 'dynamic',
    'legendary', '7-8', 'EA Sports', 0, 3)
`);

await origin.exec(`
  insert into public.slider_set_values (slider_set_id, slider_definition_id, value) values
    (${q(setId)}, ${defSprintUser.id}, 37),
    (${q(setId)}, ${defSprintCpu.id}, 41),
    (${q(setId)}, ${defAccelUser.id}, 60)
`);

const commentOnSliderId = randomUUID();
const commentGeneralId = randomUUID();

await origin.exec(`
  insert into public.slider_comments (id, slider_set_id, slider_definition_id, author_id, body) values
    (${q(commentOnSliderId)}, ${q(setId)}, ${defSprintUser.id}, ${q(profile.id)},
     ${q('Este slider concreto me parece la clave del set.')}),
    (${q(commentGeneralId)}, ${q(setId)}, null, ${q(profile.id)},
     ${q('Comentario general, sin colgar de ningún slider.')})
`);

const originSlug = (await one(origin, `select slug from public.slider_sets where id = ${q(setId)}`)).slug;

const dump = await dumpAllTables(origin);
const sql = buildRestoreSql(dump);

// --- 2. Base de destino, nueva y vacía (mismo usuario, catálogo desplazado) -

const target = await freshDatabase({ withUser: false, idOffset: 500 });
await target.exec(`insert into auth.users (id, email) values (${q(userId)}, ${q(EMAIL)});`);

check(
  'la base de destino desplaza los ids del catálogo respecto al de origen',
  (await one(target, `select id from public.slider_definitions where slug = 'sprint_speed' and applies_to = 'user' and game_id = (select id from public.games where slug = 'fc27')`))
    .id !== defSprintUser.id,
);

const firstRun = await tryExec(target, sql);
check('el SQL generado se ejecuta sin errores', firstRun.ok, firstRun.message ?? '');

// --- 3. Comprobaciones sobre lo repuesto -----------------------------------

const restoredProfile = await one(target, `select username, display_name, bio from public.profiles where id = ${q(userId)}`);
check(
  'el perfil vuelve con su nombre de usuario, su nombre visible y su biografía',
  restoredProfile?.username === profile.username &&
    restoredProfile?.display_name === 'Fernando de prueba' &&
    restoredProfile?.bio === 'Biografía de prueba para el viaje de ida y vuelta.',
  JSON.stringify(restoredProfile),
);

const restoredSet = await one(
  target,
  `select id, title, slug, description, is_published, cpu_behaviour,
          difficulty, half_length, camera, camera_height, camera_zoom
   from public.slider_sets where id = ${q(setId)}`,
);
check(
  'el set vuelve con el mismo uuid, título, slug, descripción, is_published y comportamiento de la CPU',
  restoredSet?.id === setId &&
    restoredSet?.title === setTitle &&
    restoredSet?.slug === originSlug &&
    restoredSet?.description === setDescription &&
    restoredSet?.is_published === true &&
    restoredSet?.cpu_behaviour === 'dynamic',
  JSON.stringify(restoredSet),
);

check(
  'vuelven las condiciones en las que se probó: dificultad, duración y cámara',
  restoredSet?.difficulty === 'legendary' &&
    restoredSet?.half_length === '7-8' &&
    restoredSet?.camera === 'EA Sports' &&
    restoredSet?.camera_height === 0 &&
    restoredSet?.camera_zoom === 3,
  JSON.stringify({
    difficulty: restoredSet?.difficulty,
    half_length: restoredSet?.half_length,
    camera: restoredSet?.camera,
    camera_height: restoredSet?.camera_height,
    camera_zoom: restoredSet?.camera_zoom,
  }),
);

check(
  'vuelven los tres valores del set',
  3 === (await count(target, `select count(*)::int as n from public.slider_set_values where slider_set_id = ${q(setId)}`)),
);

const restoredValues = await rows(
  target,
  `select d.slug, d.applies_to, v.value
   from public.slider_set_values v
   join public.slider_definitions d on d.id = v.slider_definition_id
   where v.slider_set_id = ${q(setId)}`,
);
const restoredValue = (slug, appliesTo) =>
  restoredValues.find((row) => row.slug === slug && row.applies_to === appliesTo)?.value;
check(
  'los valores quedan apuntando a la definición correcta por (slug, ámbito), no por id',
  restoredValue('sprint_speed', 'user') === 37 &&
    restoredValue('sprint_speed', 'cpu_opponent') === 41 &&
    restoredValue('acceleration', 'user') === 60,
  JSON.stringify(restoredValues),
);

const restoredComments = await rows(
  target,
  `select id, slider_definition_id, body from public.slider_comments where slider_set_id = ${q(setId)} order by body`,
);
const onSlider = restoredComments.find((row) => row.id === commentOnSliderId);
const general = restoredComments.find((row) => row.id === commentGeneralId);
check(
  'vuelven los dos comentarios, uno colgado de su definición y otro general',
  restoredComments.length === 2 &&
    onSlider?.slider_definition_id !== null &&
    onSlider?.slider_definition_id !== undefined &&
    general?.slider_definition_id === null,
  JSON.stringify(restoredComments),
);

// --- 4. Reejecutar no debe duplicar nada -----------------------------------

const valuesBefore = await count(target, `select count(*)::int as n from public.slider_set_values where slider_set_id = ${q(setId)}`);
const commentsBefore = await count(target, `select count(*)::int as n from public.slider_comments where slider_set_id = ${q(setId)}`);

const secondRun = await tryExec(target, sql);
check('reejecutar el mismo SQL no lanza error', secondRun.ok, secondRun.message ?? '');

const valuesAfter = await count(target, `select count(*)::int as n from public.slider_set_values where slider_set_id = ${q(setId)}`);
const commentsAfter = await count(target, `select count(*)::int as n from public.slider_comments where slider_set_id = ${q(setId)}`);
check(
  'reejecutar el mismo SQL no duplica valores ni comentarios',
  valuesBefore === valuesAfter && commentsBefore === commentsAfter,
  `valores ${valuesBefore} → ${valuesAfter}, comentarios ${commentsBefore} → ${commentsAfter}`,
);

await origin.close();
await target.close();

// --- 5. Si falta el catálogo, aborta sin dejar el set a medias -------------

{
  const brokenDump = JSON.parse(JSON.stringify(dump));
  const fakeDefinitionId = -1;
  brokenDump.tablas.slider_definitions.push({
    id: fakeDefinitionId,
    game_id: game.id,
    category: 'speed',
    applies_to: 'user',
    name: 'Control ficticio',
    slug: 'control_ficticio_inexistente',
    min_value: 1,
    max_value: 99,
    default_value: 50,
    sort_order: 0,
  });
  brokenDump.tablas.slider_set_values.push({
    slider_set_id: setId,
    slider_definition_id: fakeDefinitionId,
    value: 50,
  });

  const brokenSql = buildRestoreSql(brokenDump);

  const brokenTarget = await freshDatabase({ withUser: false, idOffset: 900 });
  await brokenTarget.exec(`insert into auth.users (id, email) values (${q(userId)}, ${q(EMAIL)});`);

  const brokenRun = await tryExec(brokenTarget, brokenSql);
  check(
    'un valor que apunta a un slider fuera del catálogo hace que el SQL lance una excepción',
    !brokenRun.ok,
    brokenRun.message ?? 'no falló',
  );

  check(
    'y no deja el set a medias: no existe',
    0 === (await count(brokenTarget, `select count(*)::int as n from public.slider_sets where id = ${q(setId)}`)),
  );
  check(
    'ni tiene ningún valor de esa tanda',
    0 === (await count(brokenTarget, `select count(*)::int as n from public.slider_set_values where slider_set_id = ${q(setId)}`)),
  );

  await brokenTarget.close();
}

// --- 6. Un set sin dueño en la copia sale como comentario, no como SQL -----

{
  const orphanDump = {
    generado: new Date().toISOString(),
    origen: 'prueba local',
    tablas: {
      games: [{ id: 1, slug: 'fc27', name: 'EA SPORTS FC 27', release_year: 2026 }],
      profiles: [],
      username_history: [],
      slider_definitions: [],
      slider_sets: [
        {
          id: randomUUID(),
          owner_id: randomUUID(),
          game_id: 1,
          title: 'Set sin dueño en la copia',
          slug: 'set-sin-dueno-en-la-copia',
          description: null,
          version: 1,
          is_published: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      slider_set_values: [],
      slider_comments: [],
    },
  };

  const orphanSql = buildRestoreSql(orphanDump);
  check(
    'un set cuyo dueño no está en la copia sale como comentario OMITIDO',
    orphanSql.includes('-- OMITIDO') &&
      orphanSql.includes('Set sin dueño en la copia') &&
      !orphanSql.includes('insert into public.slider_sets'),
    orphanSql.split('\n').find((line) => line.includes('OMITIDO')) ?? '(no aparece)',
  );
}

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
