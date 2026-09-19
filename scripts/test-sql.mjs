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
  'supabase/migrations/20260912140000_set_slugs.sql',
  'supabase/migrations/20260919160000_username_history.sql',
  'supabase/migrations/20260919180000_profile_youtube.sql',
];
const CATALOG = 'supabase/seed/01_catalog.sql';
const STARTER_SET = 'supabase/seed/02_set_full_manual_fg.sql';
const FC27_SET = 'supabase/seed/03_set_fc27_realista.sql';
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

  // El drop de `mode` y los slugs van después del catálogo, como en la puesta
  // en marcha real.
  for (const file of MIGRATIONS.slice(0, 3)) await db.exec(read(file));
  if (withCatalog) await db.exec(read(CATALOG));
  for (const file of MIGRATIONS.slice(3)) await db.exec(read(file));
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
  check('fc27 tiene 129 filas de slider', 129 === await count(db,
    `select count(*)::int as n from slider_definitions d join games g on g.id = d.game_id where g.slug = 'fc27'`));

  // FC27 desdobla CPU rival y compañero sólo en los de comportamiento de la
  // CPU; los de jugabilidad son usuario / CPU rival.
  const fc27Teammate = await db.query(`
    select distinct d.category
    from slider_definitions d join games g on g.id = d.game_id
    where g.slug = 'fc27' and d.applies_to = 'cpu_teammate'
  `);
  check(
    'en fc27 sólo los controles de la CPU tienen lado de compañero',
    fc27Teammate.rows.length === 1 && fc27Teammate.rows[0].category === 'cpu_controls',
    JSON.stringify(fc27Teammate.rows.map((r) => r.category)),
  );

  // El orden del menú del juego: es lo que permite ir metiendo los valores
  // mientras se consulta el set, así que se comprueba, no se supone.
  const ORDEN_DEL_MENU = [
    'speed', 'shooting', 'passing', 'injuries', 'goalkeeping',
    'positioning', 'ball_control', 'defending', 'cpu_controls',
  ];

  for (const game of ['fc26', 'fc27']) {
    const ordered = await db.query(`
      select d.category, min(d.sort_order) as first
      from slider_definitions d join games g on g.id = d.game_id
      where g.slug = '${game}'
      group by d.category
      order by first
    `);
    const actual = ordered.rows.map((r) => r.category);
    check(
      `${game} sigue el orden del menú del juego`,
      JSON.stringify(actual) === JSON.stringify(ORDEN_DEL_MENU),
      actual.join(' → '),
    );
  }

  const ranges = await db.query(`
    select distinct g.slug, d.min_value, d.max_value
    from slider_definitions d join games g on g.id = d.game_id
    order by g.slug
  `);
  check(
    'fc27 usa 1-99 y fc26 0-100',
    ranges.rows.length === 2 &&
      ranges.rows.some((r) => r.slug === 'fc27' && r.min_value === 1 && r.max_value === 99) &&
      ranges.rows.some((r) => r.slug === 'fc26' && r.min_value === 0 && r.max_value === 100),
    JSON.stringify(ranges.rows),
  );
  check('el set de inicio queda publicado', 1 === await count(db,
    `select count(*)::int as n from slider_sets where is_published`));
  check('con los 50 valores', 50 === await count(db,
    `select count(*)::int as n from slider_set_values`));
  check('y el perfil pasa a fullmanualfg', 1 === await count(db,
    `select count(*)::int as n from profiles where username = 'fullmanualfg'`));

  // El set de referencia de FC27
  await db.exec(read(FC27_SET));

  check(
    'el set de FC27 queda publicado con sus 129 valores',
    129 ===
      (await count(
        db,
        `select count(*)::int as n from slider_set_values v
         join slider_sets s on s.id = v.slider_set_id
         where s.title = 'Jugabilidad realista de FC27'`,
      )),
  );

  const fc27Gaps = await db.query(`
    select d.slug, d.applies_to
    from slider_definitions d
    join games g on g.id = d.game_id
    left join slider_set_values v
      on v.slider_definition_id = d.id
     and v.slider_set_id = (select id from slider_sets where title = 'Jugabilidad realista de FC27')
    where g.slug = 'fc27' and v.id is null
  `);
  check(
    'ningún slider de fc27 se queda sin valor',
    fc27Gaps.rows.length === 0,
    JSON.stringify(fc27Gaps.rows.slice(0, 5)),
  );

  const fc27Spot = await db.query(`
    select d.slug, d.applies_to, v.value
    from slider_set_values v
    join slider_definitions d on d.id = v.slider_definition_id
    join slider_sets s on s.id = v.slider_set_id
    where s.title = 'Jugabilidad realista de FC27'
  `);
  const fc27Value = (slug, scope) =>
    fc27Spot.rows.find((r) => r.slug === slug && r.applies_to === scope)?.value;
  check(
    'los valores de FC27 son los del menú',
    fc27Value('sprint_speed', 'user') === 35 &&
      fc27Value('gk_deflection_error', 'cpu_opponent') === 99 &&
      fc27Value('power_bar', 'user') === 50 &&
      fc27Value('cpu_buildup_speed', 'cpu_opponent') === 98 &&
      fc27Value('cpu_skill_move_frequency', 'cpu_teammate') === 65,
  );

  // Un slider que deja de existir en un lado tiene que desaparecer al
  // reaplicar el catálogo. Antes el borrado miraba sólo el slug, así que
  // quedaban ámbitos huérfanos: a fc27 le sobraron veinte «cpu_teammate» de
  // una versión preliminar, visibles como sliders fantasma en la ficha.
  await db.exec(`
    insert into slider_definitions (game_id, category, applies_to, name, slug, sort_order)
    values ((select id from games where slug = 'fc27'), 'speed', 'cpu_teammate',
            'Velocidad (ámbito fantasma)', 'sprint_speed', 0)
  `);
  await db.exec(read(CATALOG));
  check(
    'reaplicar el catálogo borra los ámbitos que ya no existen',
    0 === await count(db,
      `select count(*)::int as n from slider_definitions d join games g on g.id = d.game_id
       where g.slug = 'fc27' and d.slug = 'sprint_speed' and d.applies_to = 'cpu_teammate'`),
  );

  const slug = await db.query(`select slug from slider_sets where title = 'Full Manual FG v3.0'`);
  check(
    'el set recibe un slug legible',
    slug.rows[0]?.slug === 'full-manual-fg-v3-0',
    JSON.stringify(slug.rows),
  );

  // Un título con acentos y símbolos, y dos iguales del mismo dueño
  const owner = await db.query(`select id from profiles limit 1`);
  await db.exec(`
    insert into slider_sets (owner_id, game_id, title)
    values ('${owner.rows[0].id}', (select id from games where slug = 'fc26'), 'Simulación ¡Máxima! 2026'),
           ('${owner.rows[0].id}', (select id from games where slug = 'fc26'), 'Simulación ¡Máxima! 2026');
  `);
  const slugs = await db.query(`select slug from slider_sets order by slug`);
  check(
    'los acentos y los duplicados se resuelven',
    slugs.rows.some((r) => r.slug === 'simulacion-maxima-2026') &&
      slugs.rows.some((r) => r.slug === 'simulacion-maxima-2026-1'),
    JSON.stringify(slugs.rows.map((r) => r.slug)),
  );

  // Cambiar el título no debe mover el slug: los enlaces compartidos siguen vivos
  await db.exec(`update slider_sets set title = 'Otro título' where slug = 'simulacion-maxima-2026'`);
  check(
    'cambiar el título no cambia el slug',
    1 === await count(db, `select count(*)::int as n from slider_sets where slug = 'simulacion-maxima-2026'`),
  );

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
  await db.exec(read(FC27_SET));
  check(
    'reejecutar los seeds no duplica',
    2 ===
      (await count(
        db,
        `select count(*)::int as n from slider_sets where title in ('Full Manual FG v3.0', 'Jugabilidad realista de FC27')`,
      )) &&
      50 ===
        (await count(
          db,
          `select count(*)::int as n from slider_set_values v
           join slider_sets s on s.id = v.slider_set_id
           where s.title = 'Full Manual FG v3.0'`,
        )),
  );

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

// --- Historial de nombres de usuario ---------------------------------------
{
  const db = await freshDatabase({ withCatalog: false });
  const uid = async (email) =>
    (await db.query(`select id from auth.users where email = '${email}'`)).rows[0].id;
  const me = await uid(EMAIL);

  await db.exec(`update public.profiles set username = 'nuevonombre' where id = '${me}'`);

  const alias = await db.query(`select username, profile_id from public.username_history`);
  check(
    'al cambiar de nombre, el viejo queda como alias',
    alias.rows.length === 1 && alias.rows[0].profile_id === me,
    alias.rows.map((row) => row.username).join(', '),
  );

  const antiguo = alias.rows[0]?.username;

  // Volver al de siempre tiene que liberar el alias, o el nombre viejo
  // apuntaría a sí mismo dando una redirección en bucle.
  await db.exec(`update public.profiles set username = '${antiguo}' where id = '${me}'`);
  check(
    'volver al nombre de antes retira su alias',
    0 === (await count(db, `select count(*)::int as n from public.username_history where username = '${antiguo}'`)),
  );

  // Otro usuario toma el nombre que el primero ha dejado libre.
  await db.exec(`insert into auth.users (email) values ('otro@ejemplo.com')`);
  const otro = await uid('otro@ejemplo.com');
  await db.exec(`update public.profiles set username = 'renombrado' where id = '${me}'`);
  await db.exec(`update public.profiles set username = '${antiguo}' where id = '${otro}'`);

  const tras = await db.query(
    `select profile_id from public.username_history where username = '${antiguo}'`,
  );
  check(
    'si otro toma el nombre liberado, manda quien lo tiene ahora',
    tras.rows.length === 0,
    tras.rows.length ? 'el alias sigue apuntando al anterior' : '',
  );

  // Cambiar otra cosa del perfil no debe ensuciar el historial.
  const antes = await count(db, `select count(*)::int as n from public.username_history`);
  await db.exec(`update public.profiles set bio = 'hola' where id = '${me}'`);
  check(
    'tocar la biografía no toca el historial',
    antes === (await count(db, `select count(*)::int as n from public.username_history`)),
  );

  await db.close();
}

// --- Canal de YouTube en el perfil -----------------------------------------
{
  const db = await freshDatabase({ withCatalog: false });
  const me = (await db.query(`select id from auth.users where email = '${EMAIL}'`)).rows[0].id;

  await db.exec(
    `update public.profiles set youtube_url = 'https://www.youtube.com/@FullManualFG' where id = '${me}'`,
  );
  check(
    'un canal de YouTube se guarda',
    1 === (await count(db, `select count(*)::int as n from public.profiles where youtube_url is not null`)),
  );

  // La aplicación normaliza antes de guardar; esto es la red por debajo.
  let rejected = false;
  try {
    await db.exec(`update public.profiles set youtube_url = 'https://vimeo.com/x' where id = '${me}'`);
  } catch {
    rejected = true;
  }
  check('un enlace que no es de YouTube lo rechaza la base', rejected);

  await db.exec(`update public.profiles set youtube_url = null where id = '${me}'`);
  check('se puede dejar vacío', true);

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
    rows.length === 7 && without.length === 0,
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
