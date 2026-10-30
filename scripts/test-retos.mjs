#!/usr/bin/env node
/**
 * Comprueba que cada reto de modo carrera es coherente consigo mismo.
 *
 *   npm run test:retos
 *
 * Carga los ficheros de `src/content/retos/` directamente: Node quita los
 * tipos, y los retos son datos puros (sólo importan tipos). Lo mismo vale
 * para `banderas.ts`, que por eso no puede importar nada más.
 *
 * Los errores que caza son los que el compilador no ve porque los datos los
 * enlazan por cadenas: un `once` que nombra a un jugador que no está en la
 * plantilla, un país sin bandera o un color escrito a medias.
 */

import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { BANDERAS } from '../src/components/reto/banderas.ts';

const carpeta = fileURLToPath(new URL('../src/content/retos/', import.meta.url));
const ficheros = readdirSync(carpeta).filter((f) => f.endsWith('.ts') && f !== 'index.ts');

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

const HEX = /^#[0-9a-f]{6}$/i;

const retos = [];
for (const fichero of ficheros) {
  const { reto } = await import(path.join(carpeta, fichero));
  retos.push({ fichero, reto });
}

check('hay al menos un reto', retos.length > 0, `${retos.length} fichero(s)`);

const slugs = retos.map(({ reto }) => reto.slug);
check('los slugs son únicos', new Set(slugs).size === slugs.length, slugs.join(', '));

for (const { fichero, reto } of retos) {
  const nombre = reto.slug;
  console.log(`\n${nombre}`);

  check(`${nombre}: el slug coincide con el nombre del fichero`, fichero === `${reto.slug}.ts`, fichero);

  // Tema: colores en #rrggbb (la imagen para compartir les añade el alfa en hexadecimal).
  const { camiseta, ...colores } = reto.tema;
  const malos = [...Object.entries(colores), ...camiseta.colores.map((c, i) => [`camiseta.colores[${i}]`, c])]
    .filter(([, valor]) => !HEX.test(valor))
    .map(([clave]) => clave);
  check(`${nombre}: los colores del tema son #rrggbb`, malos.length === 0, malos.join(', '));
  check(
    `${nombre}: la camiseta tiene patrón y dos colores`,
    ['rayas', 'aros', 'mitades', 'banda', 'liso'].includes(camiseta.patron) && camiseta.colores.length === 2,
    camiseta.patron,
  );

  const plantillas = reto.secciones.filter((s) => s.tipo === 'plantilla');
  const jugadores = plantillas.flatMap((s) => s.jugadores);
  const ids = jugadores.map((j) => j.id);
  check(`${nombre}: los id de jugador son únicos`, new Set(ids).size === ids.length);

  // Cada plan: once titulares exactos, dentro del campo, y jugadores que existen.
  for (const seccion of reto.secciones.filter((s) => s.tipo === 'pizarra')) {
    for (const plan of seccion.planes) {
      const etiqueta = `${nombre}: plan ${plan.clave}`;
      check(`${etiqueta} tiene 11 titulares`, plan.once.length === 11, `${plan.once.length}`);

      const fuera = plan.once.filter((t) => !(t.x >= 0 && t.x <= 100 && t.y >= 0 && t.y <= 100));
      check(`${etiqueta}: x e y entre 0 y 100`, fuera.length === 0, fuera.map((t) => t.jugador).join(', '));

      const desconocidos = plan.once.filter((t) => !ids.includes(t.jugador)).map((t) => t.jugador);
      check(`${etiqueta}: todos los titulares están en la plantilla`, desconocidos.length === 0, desconocidos.join(', '));

      const repetidos = plan.once.length - new Set(plan.once.map((t) => t.jugador)).size;
      check(`${etiqueta}: nadie repetido`, repetidos === 0);
    }
  }

  // Banderas: cada país que aparezca tiene la suya.
  const paises = [
    ...jugadores.map((j) => j.pais),
    ...reto.secciones.filter((s) => s.tipo === 'mercado').flatMap((s) => s.objetivos.map((o) => o.pais)),
  ].filter(Boolean);
  const sinBandera = [...new Set(paises)].filter((p) => !Object.hasOwn(BANDERAS, p));
  check(`${nombre}: todos los países tienen bandera`, sinBandera.length === 0, sinBandera.join(', '));
}

console.log(failures === 0 ? '\nTodo bien.' : `\n${failures} fallo(s).`);
process.exit(failures === 0 ? 0 : 1);
