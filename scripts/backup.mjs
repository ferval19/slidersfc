#!/usr/bin/env node
/**
 * Copia de seguridad de SlidersFC.
 *
 *   npm run backup
 *
 * Deja dos ficheros en `copias/`:
 *   - `slidersfc-<fecha>.json`  el volcado entero, tal cual está en las tablas
 *   - `slidersfc-<fecha>.sql`   el SQL con el que reponerlo
 *
 * Por qué existe: el contenido no puede ser rehén de un plan gratuito. Los
 * proyectos gratis de Supabase se pausan por inactividad, y un pet project se
 * enfría por definición.
 *
 * Sobre la clave: con la de servicio (SUPABASE_SERVICE_ROLE_KEY) se copia
 * todo, incluidos los borradores. Con la pública sólo se copia lo que vería
 * cualquiera, porque RLS se aplica igual — y en ese caso lo avisa, que una
 * copia incompleta que se cree completa es peor que no tener ninguna.
 */

import { createClient } from '@supabase/supabase-js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildRestoreSql } from './backup-sql.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Las tablas, en orden de dependencia: así el JSON se lee de arriba abajo. */
const TABLES = [
  'games',
  'profiles',
  'username_history',
  'slider_definitions',
  'slider_sets',
  'slider_set_values',
  'slider_set_versions',
  'slider_set_changes',
  'slider_comments',
];

const PAGE = 1000;

/** Lee .env.local sin dependencias: es un fichero de `CLAVE=valor`. */
function readEnvFile() {
  const env = {};
  let raw;
  try {
    raw = readFileSync(join(repo, '.env.local'), 'utf8');
  } catch {
    return env;
  }

  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

const fileEnv = readEnvFile();
const pick = (name) => process.env[name] ?? fileEnv[name];

const url = (pick('NEXT_PUBLIC_SUPABASE_URL') ?? '')
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/(rest|auth|storage|realtime)\/v1$/, '');

const serviceKey = pick('SUPABASE_SERVICE_ROLE_KEY');
const publicKey = pick('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ?? pick('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const key = serviceKey ?? publicKey;

if (!url || !key) {
  console.error(
    'Faltan las variables de Supabase. Necesito NEXT_PUBLIC_SUPABASE_URL y una clave\n' +
      '(SUPABASE_SERVICE_ROLE_KEY para copiarlo todo, o la pública para lo publicado).',
  );
  process.exit(1);
}

if (!serviceKey) {
  console.warn(
    '⚠ Sin SUPABASE_SERVICE_ROLE_KEY: esta copia sólo llevará lo que ve cualquiera.\n' +
      '  Los borradores se quedan fuera. La clave está en el panel de Supabase,\n' +
      '  en Project Settings → API. No la subas al repositorio.\n',
  );
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

/** Trae una tabla entera. PostgREST devuelve 1000 filas como mucho por tirada. */
async function fetchAll(table) {
  const rows = [];

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, from + PAGE - 1);

    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}

const tablas = {};
for (const table of TABLES) {
  tablas[table] = await fetchAll(table);
}

const now = new Date();
const stamp = now.toISOString().slice(0, 10);

const dump = { generado: now.toISOString(), origen: url, tablas };

const dir = join(repo, 'copias');
mkdirSync(dir, { recursive: true });

const jsonPath = join(dir, `slidersfc-${stamp}.json`);
const sqlPath = join(dir, `slidersfc-${stamp}.sql`);

writeFileSync(jsonPath, `${JSON.stringify(dump, null, 2)}\n`);
writeFileSync(sqlPath, buildRestoreSql(dump));

console.log(`Copia de ${url}\n`);
for (const table of TABLES) {
  console.log(`  ${String(tablas[table].length).padStart(5)}  ${table}`);
}
console.log(`\n  copias/${`slidersfc-${stamp}.json`}`);
console.log(`  copias/${`slidersfc-${stamp}.sql`}   ← pégalo en el editor SQL para reponer`);
