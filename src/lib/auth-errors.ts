/**
 * Traducción de los errores de Supabase Auth.
 *
 * Llegan en inglés y por tres vías distintas: como código (`error.code`), como
 * texto (`error.message`) y como parámetros en la URL de vuelta
 * (`?error_code=`, `#error_description=`). Aquí se normalizan las tres a un
 * mensaje en español que dice qué hacer, no sólo qué ha fallado.
 */

const BY_CODE: Record<string, string> = {
  // Enlaces y códigos
  otp_expired:
    'El enlace o el código ya se había usado o ha caducado. Son de un solo uso: pide uno nuevo.',
  otp_disabled: 'El acceso por correo está desactivado en el proyecto.',
  flow_state_expired: 'El proceso de acceso ha caducado. Empieza otra vez desde el principio.',
  flow_state_not_found:
    'No encontramos el proceso de acceso. Abre el enlace en el mismo navegador donde lo pediste, o usa el código de 6 dígitos.',

  // Límites
  over_email_send_rate_limit:
    'Se han enviado demasiados correos seguidos. Espera unos minutos antes de pedir otro enlace.',
  over_request_rate_limit: 'Demasiados intentos seguidos. Espera un momento y vuelve a probar.',
  over_sms_send_rate_limit: 'Demasiados envíos seguidos. Espera un momento.',

  // Cuenta
  email_not_confirmed: 'Tienes que confirmar tu correo antes de entrar.',
  email_address_invalid: 'Ese correo no es válido.',
  email_address_not_authorized: 'Ese correo no está autorizado en este proyecto.',
  user_not_found: 'No hay ninguna cuenta con ese correo.',
  user_banned: 'Esta cuenta está bloqueada.',
  signup_disabled: 'El registro está cerrado en este momento.',
  invalid_credentials: 'Correo o contraseña incorrectos.',
  weak_password: 'La contraseña es demasiado corta o demasiado fácil de adivinar.',
  user_already_exists: 'Ya existe una cuenta con ese correo. Entra en vez de crearla.',
  email_exists: 'Ya existe una cuenta con ese correo. Entra en vez de crearla.',
  same_password: 'La contraseña nueva es la misma que la anterior.',
  session_not_found: 'Tu sesión ha caducado. Pide otro enlace para cambiar la contraseña.',
  provider_email_needs_verification: 'Verifica el correo de tu cuenta antes de entrar.',

  // Proveedores
  provider_disabled: 'Ese proveedor de acceso está desactivado en el proyecto.',
  oauth_provider_not_supported: 'Ese proveedor de acceso no está disponible.',

  // Genéricos
  access_denied: 'Se ha denegado el acceso. Pide un enlace nuevo e inténtalo otra vez.',
  invalid_request: 'La petición de acceso venía incompleta. Pide un enlace nuevo.',
  validation_failed: 'Los datos del acceso no son válidos. Pide un enlace nuevo.',
  bad_json: 'La respuesta del servidor de acceso no era válida.',
  bad_jwt: 'Tu sesión no es válida. Vuelve a entrar.',
  session_expired: 'Tu sesión ha caducado. Vuelve a entrar.',
  request_timeout: 'El servidor de acceso ha tardado demasiado. Inténtalo otra vez.',
  captcha_failed: 'No se ha podido verificar el captcha.',
  server_error: 'El servidor de acceso ha fallado. Inténtalo de nuevo en un momento.',
  unexpected_failure: 'El servidor de acceso ha fallado. Inténtalo de nuevo en un momento.',
};

/**
 * Algunos errores llegan sólo como texto, sin código. Se reconocen por un
 * fragmento estable del mensaje.
 */
const BY_TEXT: [RegExp, string][] = [
  [
    /pkce code verifier not found/i,
    'Ese enlace sólo funciona en el navegador desde el que lo pediste. Ábrelo ahí, o usa el código de 6 dígitos.',
  ],
  [
    /email link is invalid or has expired/i,
    'El enlace del correo ya se había usado o ha caducado. Son de un solo uso: pide uno nuevo.',
  ],
  [/token has expired or is invalid/i, 'El código ya no vale. Pide uno nuevo.'],
  [/invalid flow state/i, 'El proceso de acceso ha caducado. Empieza otra vez.'],
  [/invalid login credentials/i, 'Correo o contraseña incorrectos.'],
  [/password should be at least/i, 'La contraseña debe tener al menos 8 caracteres.'],
  [/user already registered|already been registered/i,
    'Ya existe una cuenta con ese correo. Entra en vez de crearla.'],
  [/auth session missing/i,
    'Tu sesión ha caducado. Pide otro enlace para cambiar la contraseña.'],
  [/user already registered/i, 'Ya existe una cuenta con ese correo.'],
  [/email rate limit exceeded/i,
    'Se han enviado demasiados correos seguidos. Espera unos minutos antes de pedir otro enlace.'],
  [/signups not allowed/i, 'El registro está cerrado en este momento.'],
  [/email not confirmed/i, 'Tienes que confirmar tu correo antes de entrar.'],
  [/network|fetch failed|failed to fetch/i,
    'No se ha podido conectar con el servidor de acceso. Comprueba tu conexión.'],
];

const FALLBACK = 'No se ha podido completar el acceso. Pide un enlace nuevo e inténtalo otra vez.';

/** «For security purposes, you can only request this after 47 seconds.» */
function rateLimitWithSeconds(message: string) {
  const match = /only request this after (\d+) second/i.exec(message);
  if (!match) return null;

  const seconds = Number(match[1]);
  return `Por seguridad hay que esperar ${seconds} segundo${seconds === 1 ? '' : 's'} antes de pedir otro enlace.`;
}

type UnknownAuthError = { message?: string | null; code?: string | null } | null | undefined;

/** Traduce un error devuelto por el cliente de Supabase. */
export function authErrorMessage(error: UnknownAuthError): string {
  if (!error) return FALLBACK;

  if (error.code && BY_CODE[error.code]) return BY_CODE[error.code];

  const message = error.message ?? '';

  const waiting = rateLimitWithSeconds(message);
  if (waiting) return waiting;

  for (const [pattern, translated] of BY_TEXT) {
    if (pattern.test(message)) return translated;
  }

  // Sin traducción: devolvemos el genérico, pero lo dejamos en el log para
  // poder añadirlo a la tabla en lugar de enseñar inglés al usuario.
  if (message) {
    console.warn(
      `[slidersfc] error de auth sin traducir — code=${error.code ?? '—'}: ${message}`,
    );
  }

  return FALLBACK;
}

/**
 * Traduce los parámetros de error de una URL de vuelta de Supabase. Devuelve
 * null si no hay error, para poder distinguir «no hay» de «no lo entiendo».
 *
 * Exige `error_code` o `error_description`, que son los que pone Supabase. Un
 * `?error=` a secas es nuestro: lo usan /login y las rutas de vuelta para
 * pasar un mensaje ya traducido, y tratarlo como error de Supabase lo
 * sustituía por el genérico.
 */
export function authErrorFrom(params: URLSearchParams): string | null {
  const code = params.get('error_code');
  const description = params.get('error_description');

  if (!code && !description) return null;

  if (code && BY_CODE[code]) return BY_CODE[code];

  const error = params.get('error');
  if (error && BY_CODE[error]) return BY_CODE[error];

  // Supabase codifica las descripciones con + en lugar de espacios.
  return authErrorMessage({ message: description?.replace(/\+/g, ' ') ?? '' });
}
