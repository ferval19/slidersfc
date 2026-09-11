// Acepta tanto el nombre nuevo de la clave pública de Supabase
// (PUBLISHABLE_KEY) como el clásico (ANON_KEY).

export type SupabaseEnv = { url: string; key: string };

/**
 * El dashboard de Supabase muestra en algunos sitios el endpoint REST
 * (`https://xxx.supabase.co/rest/v1/`) en lugar del origen del proyecto.
 * El cliente añade `/rest/v1` y `/auth/v1` por su cuenta, así que con el
 * sufijo pegado pide `/rest/v1/rest/v1/...` y Supabase responde
 * "Invalid path specified in request URL" (PGRST125).
 *
 * Normalizamos a origen para que da igual cuál de los dos se pegue.
 */
function normalizeUrl(raw: string) {
  return raw.trim().replace(/\/+$/, '').replace(/\/(rest|auth|storage|realtime)\/v1$/, '');
}

/** Devuelve la configuración, o null si falta. No lanza. */
export function supabaseEnvOrNull(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return { url: normalizeUrl(url), key: key.trim() };
}

/** ¿Está Supabase configurado? Para avisar en la UI en lugar de fallar. */
export function isSupabaseConfigured() {
  return supabaseEnvOrNull() !== null;
}

export function supabaseEnv(): SupabaseEnv {
  const env = supabaseEnvOrNull();

  if (!env) {
    throw new Error(
      'Faltan variables de entorno de Supabase. Copia .env.example a .env.local y rellena NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  return env;
}
