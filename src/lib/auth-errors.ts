/**
 * Traducción de los errores de Supabase Auth.
 *
 * Llegan en inglés y por tres vías distintas: como código (`error.code`), como
 * texto (`error.message`) y como parámetros en la URL de vuelta
 * (`?error_code=`, `#error_description=`). Aquí se normalizan las tres a un
 * mensaje en el idioma de quien lee que dice qué hacer, no sólo qué ha fallado.
 *
 * El texto vive en el diccionario (`i18n/es.ts` / `i18n/en.ts`, zona
 * `authErrores`) y este módulo sólo sabe qué código de Supabase corresponde a
 * qué clave. No importa nada de servidor a propósito: lo usan tanto Server
 * Actions como componentes de cliente (`auth-hash-handler.tsx`,
 * `auth-relay.tsx`), y un import de servidor aquí rompería a los segundos.
 */

import { getDictionary, type Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/locale';

type AuthErrores = Dictionary['authErrores'];

function porCodigo(t: AuthErrores): Record<string, string> {
  return {
    // Enlaces y códigos
    otp_expired: t.otpExpired,
    otp_disabled: t.otpDisabled,
    flow_state_expired: t.flowStateExpired,
    flow_state_not_found: t.flowStateNotFound,

    // Límites
    over_email_send_rate_limit: t.overEmailSendRateLimit,
    over_request_rate_limit: t.overRequestRateLimit,
    over_sms_send_rate_limit: t.overSmsSendRateLimit,

    // Cuenta
    email_not_confirmed: t.emailNotConfirmed,
    email_address_invalid: t.emailAddressInvalid,
    email_address_not_authorized: t.emailAddressNotAuthorized,
    user_not_found: t.userNotFound,
    user_banned: t.userBanned,
    signup_disabled: t.signupDisabled,
    invalid_credentials: t.invalidCredentials,
    weak_password: t.weakPassword,
    user_already_exists: t.userAlreadyExists,
    email_exists: t.userAlreadyExists,
    same_password: t.samePassword,
    session_not_found: t.sessionNotFound,
    provider_email_needs_verification: t.providerEmailNeedsVerification,

    // Proveedores
    provider_disabled: t.providerDisabled,
    oauth_provider_not_supported: t.oauthProviderNotSupported,

    // Genéricos
    access_denied: t.accessDenied,
    invalid_request: t.invalidRequest,
    validation_failed: t.validationFailed,
    bad_json: t.badJson,
    bad_jwt: t.badJwt,
    session_expired: t.sessionExpired,
    request_timeout: t.requestTimeout,
    captcha_failed: t.captchaFailed,
    server_error: t.serverError,
    unexpected_failure: t.serverError,
  };
}

/**
 * Algunos errores llegan sólo como texto, sin código. Se reconocen por un
 * fragmento estable del mensaje (siempre en inglés: es lo que manda Supabase).
 */
function porTexto(t: AuthErrores): [RegExp, string][] {
  return [
    [/pkce code verifier not found/i, t.pkceSoloMismoNavegador],
    [/email link is invalid or has expired/i, t.enlaceCorreoCaducado],
    [/token has expired or is invalid/i, t.codigoYaNoVale],
    [/invalid flow state/i, t.procesoAccesoCaducadoEmpiezaOtraVez],
    [/invalid login credentials/i, t.invalidCredentials],
    [/password should be at least/i, t.contrasenaMinimoOcho],
    [/user already registered|already been registered/i, t.userAlreadyExists],
    [/auth session missing/i, t.sessionNotFound],
    [/email rate limit exceeded/i, t.overEmailSendRateLimit],
    [/signups not allowed/i, t.signupDisabled],
    [/email not confirmed/i, t.emailNotConfirmed],
    [/network|fetch failed|failed to fetch/i, t.errorDeRed],
  ];
}

/** «For security purposes, you can only request this after 47 seconds.» */
function rateLimitWithSeconds(message: string, t: AuthErrores) {
  const match = /only request this after (\d+) second/i.exec(message);
  if (!match) return null;

  return t.esperarSegundos(Number(match[1]));
}

type UnknownAuthError = { message?: string | null; code?: string | null } | null | undefined;

/** Traduce un error devuelto por el cliente de Supabase, en el idioma que toca. */
export function authErrorMessage(error: UnknownAuthError, locale: Locale): string {
  const t = getDictionary(locale).authErrores;
  const porCodigoT = porCodigo(t);

  if (!error) return t.fallback;

  if (error.code && porCodigoT[error.code]) return porCodigoT[error.code];

  const message = error.message ?? '';

  const waiting = rateLimitWithSeconds(message, t);
  if (waiting) return waiting;

  for (const [pattern, translated] of porTexto(t)) {
    if (pattern.test(message)) return translated;
  }

  // Sin traducción: devolvemos el genérico, pero lo dejamos en el log para
  // poder añadirlo a la tabla en lugar de enseñar inglés al usuario.
  if (message) {
    console.warn(
      `[slidersfc] error de auth sin traducir — code=${error.code ?? '—'}: ${message}`,
    );
  }

  return t.fallback;
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
export function authErrorFrom(params: URLSearchParams, locale: Locale): string | null {
  const code = params.get('error_code');
  const description = params.get('error_description');

  if (!code && !description) return null;

  const porCodigoT = porCodigo(getDictionary(locale).authErrores);

  if (code && porCodigoT[code]) return porCodigoT[code];

  const error = params.get('error');
  if (error && porCodigoT[error]) return porCodigoT[error];

  // Supabase codifica las descripciones con + en lugar de espacios.
  return authErrorMessage({ message: description?.replace(/\+/g, ' ') ?? '' }, locale);
}
