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
/** Tope de longitud de la URL del canal ya normalizada, no de lo que pega el usuario. */
export const YOUTUBE_MAX = 200;

export type ProfileFields = {
  username: string;
  display_name: string | null;
  bio: string | null;
  twitter_handle: string | null;
  youtube_url: string | null;
  avatar_url: string | null;
};

export type ProfileInput = {
  username: string;
  displayName: string;
  bio: string;
  twitterHandle: string;
  avatarUrl: string;
  youtubeUrl: string;
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

/**
 * Reconoce un canal de YouTube en cualquiera de las formas en que la gente
 * lo pega: el enlace entero (con o sin `www.`/`m.`, con o sin subrutas como
 * `/videos` o `?sub_confirmation=1`), o sólo el `@handle` —con o sin arroba—.
 * También admite los formatos antiguos `/channel/UC...`, `/c/...` y
 * `/user/...`.
 *
 * Devuelve:
 *   - `null` si la entrada está vacía (no hay canal que guardar).
 *   - la URL canónica (`https://www.youtube.com/...`) si la reconoce.
 *   - `undefined` si hay texto pero no es un canal reconocible —incluye los
 *     enlaces a un vídeo suelto (`youtu.be/...`, `.../watch?v=...`), que no
 *     son un canal— para que `validateProfile` lo distinga de «vacío».
 */
export function normalizeYoutube(raw: string): string | null | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Una palabra suelta, con o sin arroba y sin barras ni puntos: se asume
  // que es el handle tal cual, como cuando se pega sólo el nombre de usuario.
  if (!trimmed.includes('/') && !trimmed.includes('.')) {
    const handle = trimmed.replace(/^@+/, '');
    return /^[A-Za-z0-9._-]{3,30}$/.test(handle)
      ? `https://www.youtube.com/@${handle}`
      : undefined;
  }

  // A partir de aquí se trata como una URL, con protocolo o sin él.
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return undefined;
  }

  const host = url.hostname.toLowerCase().replace(/^(?:www|m)\./, '');
  // youtu.be siempre enlaza a un vídeo, nunca a un canal.
  if (host !== 'youtube.com') return undefined;

  const path = url.pathname.replace(/\/+$/, '');

  // /watch?v=... es un vídeo, no un canal.
  if (path === '/watch') return undefined;

  const handleMatch = path.match(/^\/@([A-Za-z0-9._-]{3,30})(?:\/.*)?$/);
  if (handleMatch) return `https://www.youtube.com/@${handleMatch[1]}`;

  const legacyMatch = path.match(/^\/(channel|c|user)\/([A-Za-z0-9._-]{1,100})$/i);
  if (legacyMatch) return `https://www.youtube.com/${legacyMatch[1].toLowerCase()}/${legacyMatch[2]}`;

  return undefined;
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

  const youtubeUrl = normalizeYoutube(input.youtubeUrl);
  if (youtubeUrl === undefined) {
    return { error: 'El canal de YouTube no se reconoce. Pega el enlace de tu canal o tu @nombre.' };
  }
  if (youtubeUrl && youtubeUrl.length > YOUTUBE_MAX) {
    return { error: 'El enlace del canal es demasiado largo.' };
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
      youtube_url: youtubeUrl,
      avatar_url: avatarUrl,
    },
  };
}
