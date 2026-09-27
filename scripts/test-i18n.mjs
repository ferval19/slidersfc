#!/usr/bin/env node
/**
 * Prueba que el diccionario inglés no se quede atrás del castellano.
 *
 *   npm run test:i18n
 *
 * `es.ts` y `en.ts` son `.ts` con `as const`: Node los podría importar (sólo
 * llevan tipos, no runtime que no entienda), pero aquí es más simple y más
 * robusto leerlos como texto y comparar las claves con una expresión
 * regular sobre el fuente — así la prueba no depende de que el resto del
 * árbol de tipos compile.
 *
 * Dos comprobaciones:
 *   1. Las mismas claves en los dos ficheros (ni de más ni de menos).
 *   2. Ninguna cadena literal de `en.ts` es idéntica a la de `es.ts` en la
 *      misma clave — salvo las de la lista blanca (nombres propios que no
 *      se traducen).
 *
 * Sólo mira valores de cadena («clave: '...'»); las funciones (los plurales
 * y las que llevan variables, como `version: (n) => ...`) no se comparan
 * cadena a cadena porque no hay una sola cadena que comparar.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const esPath = path.join(here, '../src/lib/i18n/es.ts');
const enPath = path.join(here, '../src/lib/i18n/en.ts');

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

/** Nombres propios que se quedan igual en los dos idiomas a propósito. */
const WHITELIST = new Set(['SlidersFC', 'EA SPORTS FC', 'X']);

/** Quita comentarios de bloque y de línea, para que no se cuelen en el regex. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/**
 * Junta una línea `clave:` suelta (el valor va en la siguiente, como en las
 * frases largas de la ayuda) con la línea que le sigue, para que el regex de
 * abajo las vea como una sola.
 */
function joinBrokenValues(source) {
  return source.replace(/^(\s{4}\w+):\s*\n\s*/gm, '$1: ');
}

/**
 * Recorre el fuente línea a línea y devuelve, por zona, sus claves y — sólo
 * cuando el valor es una cadena entre comillas simples y no una función —
 * el texto de esa cadena.
 *
 * Un nivel de indentación por anidamiento: la zona a 2 espacios, sus claves
 * a 4. Es la forma exacta en que está escrito `es.ts` / `en.ts`.
 */
function parseDictionary(source) {
  const lines = joinBrokenValues(stripComments(source)).split('\n');
  const keys = new Set();
  const strings = new Map(); // "zona.clave" -> texto de la cadena
  let zone = null;

  for (const line of lines) {
    const zoneOpen = line.match(/^ {2}(\w+): \{\s*$/);
    if (zoneOpen) {
      zone = zoneOpen[1];
      continue;
    }
    if (zone && /^ {2}\},?\s*$/.test(line)) {
      zone = null;
      continue;
    }
    if (!zone) continue;

    const keyLine = line.match(/^ {4}(\w+):\s*(.*)$/);
    if (!keyLine) continue;

    const [, key, rest] = keyLine;
    const fullKey = `${zone}.${key}`;
    keys.add(fullKey);

    // Sólo cuenta como «cadena» si el valor son unas comillas simples solas
    // en la línea (con o sin coma final) — una función arranca con `(`.
    const stringMatch = rest.match(/^'((?:[^'\\]|\\.)*)',?$/);
    if (stringMatch) {
      strings.set(fullKey, stringMatch[1]);
    }
  }

  return { keys, strings };
}

const esSource = readFileSync(esPath, 'utf8');
const enSource = readFileSync(enPath, 'utf8');

const es = parseDictionary(esSource);
const en = parseDictionary(enSource);

// --- Mismo conjunto de claves ----------------------------------------------

const onlyInEs = [...es.keys].filter((key) => !en.keys.has(key));
const onlyInEn = [...en.keys].filter((key) => !es.keys.has(key));

check(
  'es.ts y en.ts tienen las mismas claves',
  onlyInEs.length === 0 && onlyInEn.length === 0,
  [
    onlyInEs.length > 0 ? `faltan en en.ts: ${onlyInEs.join(', ')}` : '',
    onlyInEn.length > 0 ? `sobran en en.ts: ${onlyInEn.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(' · '),
);

check('se han leído claves de es.ts', es.keys.size > 0, `${es.keys.size} claves`);
check('se han leído claves de en.ts', en.keys.size > 0, `${en.keys.size} claves`);

// --- Ninguna cadena en inglés igual a la española (salvo lista blanca) ----

const identical = [];
for (const [key, enValue] of en.strings) {
  if (WHITELIST.has(enValue)) continue;
  const esValue = es.strings.get(key);
  if (esValue !== undefined && esValue === enValue) identical.push(key);
}

check(
  'ninguna cadena de en.ts es idéntica a la de es.ts (salvo la lista blanca)',
  identical.length === 0,
  identical.length > 0 ? identical.join(', ') : '',
);

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
