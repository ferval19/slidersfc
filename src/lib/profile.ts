/**
 * Validación del perfil.
 *
 * Módulo puro —sin React, sin Supabase, sólo tipos importados— para que lo
 * usen el formulario (cliente) y la acción de servidor **con las mismas
 * reglas**, y para poder probarlo con `npm run test:profile`. Que el navegador
 * valide es comodidad; la que cuenta es la del servidor, porque el formulario
 * se puede saltar.
 *
 * Las restricciones de la base están en 20260911120000_init_schema.sql:
 *   username ~ '^[a-z0-9_]{3,24}$'   ·   bio <= 280
 * Aquí se repiten a propósito: la base es la red de seguridad, pero un
 * CHECK violado da un error feo y sin explicar qué hay que arreglar.
 */

export const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
export const USERNAME_MAX = 24;
export const BIO_MAX = 280;
export const DISPLAY_NAME_MAX = 60;
/** El límite de X, no nuestro. */
export const TWITTER_MAX = 15;

export type ProfileFields = {
  username: string;
  display_name: string | null;
  bio: string | null;
  twitter_handle: string | null;
  avatar_url: string | null;
};

export type ProfileInput = {
  username: string;
  displayName: string;
  bio: string;
  twitterHandle: string;
  avatarUrl: string;
};

/** Quita acentos: «José» → «jose», en vez de rechazarlo por carácter raro. */
function deaccent(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Deja el nombre de usuario como lo acepta la base, sin inventarse nada: lo
 * que no se pueda arreglar así se rechaza después con un mensaje.
 */
export function normalizeUsername(raw: string) {
  return deaccent(raw)
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[\s.-]+/g, '_')
    .slice(0, USERNAME_MAX);
}

/**
 * Acepta las tres formas en que la gente escribe su cuenta de X: el enlace
 * entero, con arroba y a secas. Devuelve null si no hay nada.
 */
export function normalizeTwitterHandle(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withoutUrl = trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/^(?:www\.)?(?:twitter|x)\.com\//i, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '');

  return withoutUrl.replace(/^@+/, '');
}

function emptyToNull(text: string) {
  const trimmed = text.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * @param options.avatarPrefix Origen permitido para una foto nueva. Sólo se
 *   acepta una URL de nuestro propio almacén: si no, cualquiera podría apuntar
 *   el avatar a un servidor ajeno, que vería la IP de todo el que abra la
 *   página.
 * @param options.currentAvatarUrl La que ya tiene guardada, que pasa tal cual.
 *   Quien entró con X trae la foto de `pbs.twimg.com`, y guardar el perfil sin
 *   tocarla no puede fallar por eso.
 */
export function validateProfile(
  input: ProfileInput,
  options: { avatarPrefix: string; currentAvatarUrl?: string | null },
): { fields: ProfileFields } | { error: string } {
  const username = normalizeUsername(input.username);

  if (username.length < 3) {
    return { error: 'El nombre de usuario necesita al menos 3 caracteres.' };
  }
  if (!USERNAME_PATTERN.test(username)) {
    return {
      error:
        'El nombre de usuario sólo admite letras sin acentos, números y guión bajo, ' +
        `y como mucho ${USERNAME_MAX} caracteres.`,
    };
  }

  const displayName = emptyToNull(input.displayName);
  if (displayName && displayName.length > DISPLAY_NAME_MAX) {
    return { error: `El nombre no puede pasar de ${DISPLAY_NAME_MAX} caracteres.` };
  }

  const bio = emptyToNull(input.bio);
  if (bio && bio.length > BIO_MAX) {
    return { error: `La biografía no puede pasar de ${BIO_MAX} caracteres.` };
  }

  const twitterHandle = normalizeTwitterHandle(input.twitterHandle);
  if (twitterHandle && !/^[A-Za-z0-9_]{1,15}$/.test(twitterHandle)) {
    return { error: 'La cuenta de X sólo admite letras, números y guión bajo (15 como mucho).' };
  }

  const avatarUrl = emptyToNull(input.avatarUrl);
  const unchanged = avatarUrl !== null && avatarUrl === options.currentAvatarUrl;
  if (avatarUrl && !unchanged && !avatarUrl.startsWith(options.avatarPrefix)) {
    return { error: 'La foto tiene que subirse desde aquí.' };
  }

  return {
    fields: {
      username,
      display_name: displayName,
      bio,
      twitter_handle: twitterHandle,
      avatar_url: avatarUrl,
    },
  };
}
