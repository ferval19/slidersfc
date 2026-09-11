/**
 * Supabase puede devolver al usuario a una URL cualquiera con el error del
 * login en la query, en el fragmento, o en los dos. Estos son los códigos que
 * salen en la práctica, traducidos a algo que dice qué hacer.
 */
const MESSAGES: Record<string, string> = {
  otp_expired:
    'El enlace del correo ya se había usado o ha caducado. Son de un solo uso: pide uno nuevo.',
  access_denied: 'Se ha denegado el acceso. Pide un enlace nuevo e inténtalo otra vez.',
  invalid_request: 'El enlace de acceso venía incompleto. Pide uno nuevo.',
  server_error: 'Supabase ha fallado al validar el acceso. Inténtalo de nuevo en un momento.',
  validation_failed: 'Los datos del acceso no son válidos. Pide un enlace nuevo.',
  provider_email_needs_verification:
    'Tienes que verificar el correo de tu cuenta antes de entrar.',
  flow_state_expired: 'El proceso de acceso ha caducado. Empieza de nuevo.',
  flow_state_not_found:
    'No encontramos el proceso de acceso. Abre el enlace en el mismo navegador donde lo pediste.',
};

/** Saca el mensaje de error de unos parámetros de vuelta, o null si no hay. */
export function authErrorFrom(params: URLSearchParams) {
  const code = params.get('error_code');
  const description = params.get('error_description');
  const error = params.get('error');

  if (!code && !description && !error) return null;

  if (code && MESSAGES[code]) return MESSAGES[code];
  if (error && MESSAGES[error]) return MESSAGES[error];

  // Supabase manda las descripciones con + en lugar de espacios.
  return description?.replace(/\+/g, ' ') ?? 'No se ha podido completar el acceso.';
}
