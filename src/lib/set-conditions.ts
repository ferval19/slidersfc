/**
 * Validación de las condiciones de un set.
 *
 * Módulo puro —sin React, sin Supabase, sólo tipos importados— por lo mismo
 * que `profile.ts`: lo usan el formulario y la acción de servidor con las
 * mismas reglas, y se puede probar con `npm run test:conditions`.
 *
 * Un set de sliders sólo significa algo si se sabe en qué condiciones se
 * probó. Hasta ahora eso iba suelto en la descripción, en texto libre, y no
 * servía para comparar sets entre sí; aquí se convierte en campos.
 *
 * `half_length` se guarda como texto («8» o «7-8») y no como número: mucha
 * gente juega a duraciones variables («7 u 8 minutos» según el partido) y
 * obligar a elegir un único número les haría mentir en el dato. Un rango
 * corto vale más que un número inventado.
 */

import type { Locale } from './i18n/locale';

const DEFAULT_LOCALE: Locale = 'es';

/**
 * Los textos de este módulo viven aquí y no en el diccionario, igual que las
 * cámaras y las dificultades: son datos del juego más que interfaz.
 *
 * Y hay un motivo técnico que manda sobre el gusto: este fichero **no puede
 * importar nada que no sea un tipo**. Así `node` le quita los tipos y
 * `scripts/test-conditions.mjs` lo prueba sin levantar Next. Traer el
 * diccionario como valor rompía la prueba con un «Cannot find module» que no
 * decía nada del problema real.
 */
const TEXTO: Record<Locale, {
  dificultadNoExiste: string;
  duracionNoSeEntiende: string;
  faltaCamara: string;
  camaraDemasiadoLarga: string;
  alturaDeLaCamara: string;
  zoomDeLaCamara: string;
  tieneQueSerUnNumero: (label: string) => string;
  vaDeAA: (label: string, min: number, max: number) => string;
  minutos: (n: number | string) => string;
  altura: (n: number) => string;
  zoom: (n: number) => string;
}> = {
  es: {
    dificultadNoExiste: 'Esa dificultad no existe.',
    duracionNoSeEntiende: 'La duración no se entiende. Pon los minutos, por ejemplo 8 o 7-8.',
    faltaCamara: 'Dinos qué cámara usas antes de ajustar su altura o su zoom.',
    camaraDemasiadoLarga: 'El nombre de la cámara es demasiado largo.',
    alturaDeLaCamara: 'La altura de la cámara',
    zoomDeLaCamara: 'El zoom de la cámara',
    tieneQueSerUnNumero: (label: string) => `${label} tiene que ser un número.`,
    vaDeAA: (label: string, min: number, max: number) => `${label} va de ${min} a ${max}.`,
    minutos: (n: number | string) => `${n} minutos`,
    altura: (n: number) => `altura ${n}`,
    zoom: (n: number) => `zoom ${n}`,
  },
  en: {
    dificultadNoExiste: "That difficulty doesn't exist.",
    duracionNoSeEntiende: "The half length doesn't parse. Enter the minutes, for example 8 or 7-8.",
    faltaCamara: 'Tell us which camera you use before setting its height or zoom.',
    camaraDemasiadoLarga: 'The camera name is too long.',
    alturaDeLaCamara: 'The camera height',
    zoomDeLaCamara: 'The camera zoom',
    tieneQueSerUnNumero: (label: string) => `${label} has to be a number.`,
    vaDeAA: (label: string, min: number, max: number) => `${label} runs from ${min} to ${max}.`,
    minutos: (n: number | string) => `${n} minutes`,
    altura: (n: number) => `height ${n}`,
    zoom: (n: number) => `zoom ${n}`,
  },
};

export type Difficulty =
  | 'beginner'
  | 'semi_pro'
  | 'professional'
  | 'world_class'
  | 'legendary'
  | 'ultimate';

/** En el orden del menú del juego, de menos a más. Los valores no cambian con el idioma. */
const DIFFICULTY_VALUES: Difficulty[] = [
  'beginner',
  'semi_pro',
  'professional',
  'world_class',
  'legendary',
  'ultimate',
];

/**
 * Etiqueta de cada dificultad. Son las seis del menú del juego, así que en
 * inglés van las suyas (`World Class`, `Legendary`...) y no una traducción
 * libre — igual que las cámaras de más abajo.
 */
const DIFFICULTY_LABELS: Record<Locale, Record<Difficulty, string>> = {
  es: {
    beginner: 'Principiante',
    semi_pro: 'Semiprofesional',
    professional: 'Profesional',
    world_class: 'Clase Mundial',
    legendary: 'Leyenda',
    ultimate: 'Ultimate',
  },
  en: {
    beginner: 'Beginner',
    semi_pro: 'Semi-Pro',
    professional: 'Professional',
    world_class: 'World Class',
    legendary: 'Legendary',
    ultimate: 'Ultimate',
  },
};

/** Las seis dificultades, con su etiqueta en el idioma que toca. */
export function difficulties(locale: Locale = DEFAULT_LOCALE): { value: Difficulty; label: string }[] {
  return DIFFICULTY_VALUES.map((value) => ({ value, label: DIFFICULTY_LABELS[locale][value] }));
}

/**
 * Las cámaras del juego, como sugerencias.
 *
 * NO es una lista cerrada, y eso es deliberado: el campo sigue siendo texto
 * libre. Estos nombres salen de guías de FC 26 y FC 27 (el menú de FC 27
 * hereda la lista), no de haberlos leído en el menú en español, y ya se pagó
 * una vez en este proyecto inventar nombres del juego. Si alguno no coincide
 * con el menú, se corrige aquí y nadie pierde nada: los sets guardan el texto
 * que escribió su autor.
 *
 * Son términos del juego, no interfaz: la misma lista sirve para los dos
 * idiomas, porque el menú de cámaras de FC va en inglés también en la versión
 * en castellano. La excepción es «Tradicional», que es como la llama Fernando
 * en sus sets y no un nombre confirmado del menú en inglés — se queda igual
 * en los dos idiomas hasta que se confirme cuál es el suyo.
 */
export const CAMERAS = [
  'Co-op',
  'Tele Broadcast',
  'Tele',
  'Broadcast',
  'EA Sports GameCam',
  'Classic',
  'Tradicional',
  'Legacy',
  'Dynamic',
  'End to End',
  'Tactical',
  'Tactical Focus',
  'Pro',
] as const;

export const CAMERA_MAX = 40; // largo máximo del nombre de la cámara
export const CAMERA_SETTING_MIN = 0; // altura y zoom
export const CAMERA_SETTING_MAX = 20;

export type SetConditions = {
  difficulty: Difficulty | null;
  /** «8» o «7-8». Texto a propósito: ver el comentario del módulo. */
  half_length: string | null;
  camera: string | null;
  camera_height: number | null;
  camera_zoom: number | null;
};

export type ConditionsInput = {
  difficulty: string;
  halfLength: string;
  camera: string;
  cameraHeight: string;
  cameraZoom: string;
};

/**
 * Acepta un `string` y no sólo una `Difficulty` porque la columna de la base
 * es texto: si algún día llega un valor que esta versión no conoce, mejor
 * enseñarlo tal cual que romperse.
 */
export function difficultyLabel(value: string, locale: Locale = DEFAULT_LOCALE): string {
  return DIFFICULTY_LABELS[locale][value as Difficulty] ?? value;
}

/**
 * Reconoce la duración del tiempo en cualquiera de las formas en que la
 * gente la escribe: un número solo, con la palabra «minutos», o un rango
 * con guión, guión largo, «a» o barra —con o sin espacios alrededor—.
 *
 * Devuelve:
 *   - `null` si la entrada está vacía (no hay duración que guardar).
 *   - la forma canónica (`'8'` o `'7-8'`) si la reconoce.
 *   - `undefined` si hay texto pero no se reconoce, incluye los rangos al
 *     revés (`'8-7'`) o con los dos números iguales (`'8-8'`, que no es un
 *     rango: si son iguales hay que poner el número solo) —para que
 *     `validateConditions` lo distinga de «vacío».
 */
export function normalizeHalfLength(raw: string): string | null | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const singleMatch = trimmed.match(/^(\d{1,2})\s*(?:minutos?)?$/i);
  if (singleMatch) {
    const minutes = Number(singleMatch[1]);
    return minutes >= 1 && minutes <= 45 ? String(minutes) : undefined;
  }

  const rangeMatch = trimmed.match(/^(\d{1,2})\s*(?:-|–|a|\/)\s*(\d{1,2})$/i);
  if (rangeMatch) {
    const from = Number(rangeMatch[1]);
    const to = Number(rangeMatch[2]);
    if (from < 1 || from > 45 || to < 1 || to > 45) return undefined;
    if (from >= to) return undefined; // al revés o iguales: no es un rango válido
    return `${from}-${to}`;
  }

  return undefined;
}

function emptyToNull(text: string) {
  const trimmed = text.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * Convierte un campo de cámara (altura o zoom) en número, o dice por qué no
 * puede. `label` va ya en la forma de la frase del mensaje de error, p. ej.
 * «La altura de la cámara».
 */
function parseCameraSetting(
  raw: string,
  label: string,
  t: (typeof TEXTO)[Locale],
): { value: number | null } | { error: string } {
  const trimmed = raw.trim();
  if (trimmed === '') return { value: null };

  if (!/^-?\d+$/.test(trimmed)) {
    return { error: t.tieneQueSerUnNumero(label) };
  }

  const value = Number(trimmed);
  if (value < CAMERA_SETTING_MIN || value > CAMERA_SETTING_MAX) {
    return { error: t.vaDeAA(label, CAMERA_SETTING_MIN, CAMERA_SETTING_MAX) };
  }

  return { value };
}

export function validateConditions(
  input: ConditionsInput,
  locale: Locale = DEFAULT_LOCALE,
): { fields: SetConditions } | { error: string } {
  const t = TEXTO[locale];

  const difficultyRaw = input.difficulty.trim();
  let difficulty: Difficulty | null = null;
  if (difficultyRaw) {
    const match = DIFFICULTY_VALUES.find((value) => value === difficultyRaw);
    if (!match) {
      return { error: t.dificultadNoExiste };
    }
    difficulty = match;
  }

  const halfLength = normalizeHalfLength(input.halfLength);
  if (halfLength === undefined) {
    return { error: t.duracionNoSeEntiende };
  }

  const camera = emptyToNull(input.camera);
  if (camera && camera.length > CAMERA_MAX) {
    return { error: t.camaraDemasiadoLarga };
  }

  const heightResult = parseCameraSetting(input.cameraHeight, t.alturaDeLaCamara, t);
  if ('error' in heightResult) {
    return { error: heightResult.error };
  }

  const zoomResult = parseCameraSetting(input.cameraZoom, t.zoomDeLaCamara, t);
  if ('error' in zoomResult) {
    return { error: zoomResult.error };
  }

  // Unos números de cámara sin saber cuál cámara es no significan nada.
  if (!camera && (heightResult.value !== null || zoomResult.value !== null)) {
    return { error: t.faltaCamara };
  }

  return {
    fields: {
      difficulty,
      half_length: halfLength,
      camera,
      camera_height: heightResult.value,
      camera_zoom: zoomResult.value,
    },
  };
}

/**
 * Las condiciones rellenas, como frases cortas listas para enseñar.
 * Las que estén a null no aparecen; si no hay ninguna, devuelve `[]`.
 */
export type StoredConditions = Omit<SetConditions, 'difficulty'> & { difficulty: string | null };

export function conditionsSummary(conditions: StoredConditions, locale: Locale = DEFAULT_LOCALE): string[] {
  const t = TEXTO[locale];
  const lines: string[] = [];

  if (conditions.difficulty) {
    lines.push(difficultyLabel(conditions.difficulty, locale));
  }

  if (conditions.half_length) {
    lines.push(t.minutos(conditions.half_length));
  }

  if (conditions.camera) {
    const extras: string[] = [];
    if (conditions.camera_height !== null) extras.push(t.altura(conditions.camera_height));
    if (conditions.camera_zoom !== null) extras.push(t.zoom(conditions.camera_zoom));
    lines.push(extras.length > 0 ? `${conditions.camera} · ${extras.join(' · ')}` : conditions.camera);
  }

  return lines;
}
