#!/usr/bin/env node
/**
 * Prueba la validación de las condiciones de un set.
 *
 *   npm run test:conditions
 *
 * Aquí se cuela lo que escribe cualquiera al describir cómo probó su set: la
 * duración como «7 u 8», con guión, con guión largo, con «a» o con barra; y
 * una comprobación que no es de comodidad sino de sentido: unos números de
 * cámara sin decir qué cámara es no significan nada.
 */

import {
  DIFFICULTIES,
  conditionsSummary,
  normalizeHalfLength,
  validateConditions,
} from '../src/lib/set-conditions.ts';

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

const base = {
  difficulty: '',
  halfLength: '',
  camera: '',
  cameraHeight: '',
  cameraZoom: '',
};
const run = (input) => validateConditions({ ...base, ...input });

// --- Duración del tiempo --------------------------------------------------
check('un número solo', normalizeHalfLength('8') === '8');
check('con espacios alrededor', normalizeHalfLength(' 8 ') === '8');
check('con la palabra minutos', normalizeHalfLength('8 minutos') === '8');
check('un rango con guión', normalizeHalfLength('7-8') === '7-8');
check('un rango con espacios y guión', normalizeHalfLength('7 - 8') === '7-8');
check('un rango con guión largo', normalizeHalfLength('7–8') === '7-8');
check('un rango con «a»', normalizeHalfLength('7 a 8') === '7-8');
check('un rango con barra', normalizeHalfLength('7/8') === '7-8');

check('vacío es null', normalizeHalfLength('') === null);
check('sólo espacios es null', normalizeHalfLength('   ') === null);
check('texto sin sentido es undefined', normalizeHalfLength('mucho rato') === undefined);
check('un rango al revés se rechaza', normalizeHalfLength('8-7') === undefined);
check('un rango con los dos iguales se rechaza', normalizeHalfLength('8-8') === undefined);
check('0 se rechaza', normalizeHalfLength('0') === undefined);
check('46 se rechaza', normalizeHalfLength('46') === undefined);

// --- Todo vacío no es error ------------------------------------------------
{
  const result = run({});
  check(
    'todo vacío da todos los campos a null y no es error',
    'fields' in result &&
      result.fields.difficulty === null &&
      result.fields.half_length === null &&
      result.fields.camera === null &&
      result.fields.camera_height === null &&
      result.fields.camera_zoom === null,
  );
}

// --- Dificultad ------------------------------------------------------------
check('una dificultad válida vale', 'fields' in run({ difficulty: 'legendary' }));
check('una dificultad que no existe se rechaza', 'error' in run({ difficulty: 'imposible' }));
{
  const result = run({ difficulty: 'imposible' });
  check('con el mensaje correcto', 'error' in result && result.error === 'Esa dificultad no existe.');
}
check('cubre las seis dificultades del menú', DIFFICULTIES.length === 6);

// --- Duración dentro de validateConditions ---------------------------------
{
  const result = run({ halfLength: 'mucho rato' });
  check(
    'la duración sin sentido da el mensaje correcto',
    'error' in result &&
      result.error === 'La duración no se entiende. Pon los minutos, por ejemplo 8 o 7-8.',
  );
}

// --- Cámara ------------------------------------------------------------
check('un nombre de cámara normal vale', 'fields' in run({ camera: 'EA Sports' }));
{
  const result = run({ camera: 'a'.repeat(41) });
  check(
    'un nombre de cámara demasiado largo se rechaza',
    'error' in result && result.error === 'El nombre de la cámara es demasiado largo.',
  );
}
{
  const result = run({ camera: '  EA Sports  ' });
  check('la cámara se recorta con trim', 'fields' in result && result.fields.camera === 'EA Sports');
}

// --- Altura y zoom -----------------------------------------------------
{
  const result = run({ camera: 'EA Sports', cameraHeight: 'alta' });
  check(
    'una altura que no es número da el mensaje correcto',
    'error' in result && result.error === 'La altura de la cámara tiene que ser un número.',
  );
}
{
  const result = run({ camera: 'EA Sports', cameraZoom: 'mucho' });
  check(
    'un zoom que no es número da el mensaje correcto',
    'error' in result && result.error === 'El zoom de la cámara tiene que ser un número.',
  );
}
{
  const result = run({ camera: 'EA Sports', cameraHeight: '21' });
  check(
    'una altura fuera de rango da el mensaje correcto',
    'error' in result && result.error === 'La altura de la cámara va de 0 a 20.',
  );
}
{
  const result = run({ camera: 'EA Sports', cameraZoom: '-1' });
  check(
    'un zoom fuera de rango da el mensaje correcto',
    'error' in result && result.error === 'El zoom de la cámara va de 0 a 20.',
  );
}
{
  const result = run({ camera: 'EA Sports', cameraHeight: '0', cameraZoom: '20' });
  check(
    'los límites 0 y 20 valen',
    'fields' in result && result.fields.camera_height === 0 && result.fields.camera_zoom === 20,
  );
}

// --- Altura o zoom sin cámara -----------------------------------------------
{
  const result = run({ cameraHeight: '10' });
  check(
    'una altura sin cámara se rechaza',
    'error' in result &&
      result.error === 'Dinos qué cámara usas antes de ajustar su altura o su zoom.',
  );
}
{
  const result = run({ cameraZoom: '10' });
  check(
    'un zoom sin cámara se rechaza',
    'error' in result &&
      result.error === 'Dinos qué cámara usas antes de ajustar su altura o su zoom.',
  );
}

// --- Resumen de condiciones --------------------------------------------
check('sin nada, el resumen está vacío', conditionsSummary({
  difficulty: null,
  half_length: null,
  camera: null,
  camera_height: null,
  camera_zoom: null,
}).length === 0);

{
  const summary = conditionsSummary({
    difficulty: 'legendary',
    half_length: '7-8',
    camera: null,
    camera_height: null,
    camera_zoom: null,
  });
  check(
    'con sólo algunos campos, salen en orden y sin la cámara',
    summary.length === 2 && summary[0] === 'Leyenda' && summary[1] === '7-8 minutos',
  );
}

{
  const summary = conditionsSummary({
    difficulty: 'legendary',
    half_length: '8',
    camera: 'EA Sports',
    camera_height: 0,
    camera_zoom: 0,
  });
  check(
    'con todo relleno, la cámara lleva altura y zoom',
    summary.length === 3 &&
      summary[0] === 'Leyenda' &&
      summary[1] === '8 minutos' &&
      summary[2] === 'EA Sports · altura 0 · zoom 0',
  );
}

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
