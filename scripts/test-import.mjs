#!/usr/bin/env node
/**
 * Prueba el importador de texto pegado contra el catálogo real.
 *
 *   npm run test:import
 *
 * El formato de entrada no lo controlamos —cada uno pega su set como lo tiene
 * escrito—, así que lo que aquí se comprueba son las formas que ya hemos visto
 * en la práctica: la tabla de Notion, el texto corrido de WhatsApp, la tabla
 * en Markdown y el pegado de Notion celda a celda.
 *
 * Carga `src/lib/import-sliders.ts` directamente: Node quita los tipos, y el
 * módulo es puro (sólo importa tipos) para que eso baste.
 */

import { parseSliderText } from '../src/lib/import-sliders.ts';
import { games, slidersByGame } from '../supabase/seed/catalog.mjs';

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

/** Las mismas definiciones que acaban en la base, pero en memoria. */
function definitionsFor(gameSlug) {
  const game = games.find((candidate) => candidate.slug === gameSlug);
  const { user, cpu, cpuTeammate } = game.scopes;
  const definitions = [];
  let id = 1;
  let sortOrder = 0;

  for (const slider of slidersByGame[gameSlug]) {
    const sides = slider.sides ?? 'both';
    const scopes =
      sides === 'user' ? [user]
      : sides === 'cpu' ? [cpu]
      : sides === 'cpu_both' ? (cpuTeammate ? [cpu, cpuTeammate] : [cpu])
      : [user, cpu];

    for (const scope of scopes) {
      definitions.push({
        id: id++,
        game_id: 1,
        category: slider.category,
        applies_to: scope,
        name: slider.name,
        slug: slider.slug,
        min_value: game.range.min,
        max_value: game.range.max,
        default_value: slider.defaults?.[scope] ?? slider.default ?? game.range.default,
        sort_order: sortOrder++,
      });
    }
  }

  return definitions;
}

const fc26 = definitionsFor('fc26');
const fc27 = definitionsFor('fc27');

const find = (definitions, slug, scope) =>
  definitions.find((d) => d.slug === slug && d.applies_to === scope);
const valueOf = (report, definitions, slug, scope) =>
  report.values[String(find(definitions, slug, scope).id)];

// --- Tabla de Notion, pegada con tabuladores ------------------------------
{
  const report = parseSliderText(
    [
      'Slider\tUsuario\tCPU',
      'Velocidad\t49\t49',
      'Aceleración\t48\t50',
      'Fallo al tirar\t55\t55',
      'Altura de la línea\t60\t45',
    ].join('\n'),
    fc26,
  );

  check('tabla de Notion: 4 sliders', report.rows.length === 4, `${report.rows.length}`);
  check('tabla de Notion: usuario', valueOf(report, fc26, 'acceleration', 'user') === 48);
  check('tabla de Notion: cpu', valueOf(report, fc26, 'acceleration', 'cpu') === 50);
  check('tabla de Notion: la cabecera no cuenta', report.unmatched.length === 0, report.unmatched.join(' | '));
}

// --- Nombre largo antes que el corto que lo prefija -----------------------
{
  const report = parseSliderText(
    ['Velocidad de tiros de calidad 40 40', 'Velocidad 35 35'].join('\n'),
    fc27,
  );

  check(
    'gana el nombre más largo',
    valueOf(report, fc27, 'finesse_shot_speed', 'user') === 40 &&
      valueOf(report, fc27, 'sprint_speed', 'user') === 35,
  );
}

// --- Texto corrido, con los ámbitos escritos -----------------------------
{
  const report = parseSliderText(
    [
      'Marcaje: usuario 65, CPU 70',
      'Frecuencia de desmarques — Usuario 45 / CPU rival 50',
      'Agresividad en defensa: CPU rival 62, CPU compañero 68',
    ].join('\n'),
    fc27,
  );

  check('ámbito escrito: usuario', valueOf(report, fc27, 'marking', 'user') === 65);
  check(
    'ámbito escrito: «CPU» a secas cae en el rival cuando el juego lo desdobla',
    valueOf(report, fc27, 'marking', 'cpu_opponent') === 70,
  );
  check(
    'ámbito escrito: rival y compañero por separado',
    valueOf(report, fc27, 'cpu_defending_aggression', 'cpu_opponent') === 62 &&
      valueOf(report, fc27, 'cpu_defending_aggression', 'cpu_teammate') === 68,
  );
}

// --- Un solo número quiere decir «igual en ambos lados» ------------------
{
  const report = parseSliderText('Fallo al interceptar 90', fc27);

  check(
    'un número, los dos lados',
    valueOf(report, fc27, 'interception_error', 'user') === 90 &&
      valueOf(report, fc27, 'interception_error', 'cpu_opponent') === 90,
  );
}

// --- Notion celda a celda: el nombre y debajo los valores ----------------
{
  const report = parseSliderText(
    ['Velocidad', '35', '35', 'Aceleración', '48', '50'].join('\n'),
    fc27,
  );

  check(
    'celda a celda',
    valueOf(report, fc27, 'sprint_speed', 'user') === 35 &&
      valueOf(report, fc27, 'acceleration', 'cpu_opponent') === 50,
    `${report.rows.length} filas`,
  );
}

// --- Tabla en Markdown y lista con viñetas -------------------------------
{
  const report = parseSliderText(
    [
      '| Slider | Usuario | CPU |',
      '| --- | --- | --- |',
      '| Marcaje | 65 | 70 |',
      '- Ancho de la línea 50 50',
      '2. Distancia de la línea 35 35',
    ].join('\n'),
    fc27,
  );

  check('markdown y viñetas: 3 sliders', report.rows.length === 3, `${report.rows.length}`);
  check(
    'la numeración de la lista no se toma por valor',
    valueOf(report, fc27, 'line_length', 'user') === 35,
  );
}

// --- Valores fuera del rango del juego -----------------------------------
{
  const report = parseSliderText('Velocidad 0 0', fc27); // FC27 va de 1 a 99
  const row = report.rows.find((candidate) => candidate.slug === 'sprint_speed');

  check(
    'recorta al rango del juego y lo señala',
    valueOf(report, fc27, 'sprint_speed', 'user') === 1 && row.values.every((v) => v.clamped),
  );
}

// --- Lo que no se reconoce se dice, no se traga en silencio --------------
{
  const report = parseSliderText(
    ['Dificultad: Leyenda', 'Duración de los tiempos 8 minutos', 'Velocidad 35 35'].join('\n'),
    fc27,
  );

  check(
    'las líneas sin slider se listan aparte',
    report.rows.length === 1 && report.unmatched.length === 1,
    report.unmatched.join(' | '),
  );
  check('un «8 minutos» no se cuela como valor', report.rows[0].slug === 'sprint_speed');
}

// --- Un set entero de FC27, tal como se ve en el juego -------------------
{
  const text = slidersByGame.fc27
    .map((slider) => `${slider.name}\t50\t50`)
    .join('\n');
  const report = parseSliderText(text, fc27);

  check(
    'el catálogo entero se reconoce',
    report.rows.length === report.total && report.unmatched.length === 0,
    `${report.rows.length} de ${report.total}`,
  );
}

// --- Texto vacío ---------------------------------------------------------
{
  const report = parseSliderText('   \n\n', fc27);
  check('texto vacío no rompe', report.rows.length === 0 && report.unmatched.length === 0);
}

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
