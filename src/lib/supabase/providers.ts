import { supabaseEnvOrNull } from './env';

/**
 * Proveedores de acceso activos en el proyecto.
 *
 * Hace falta comprobarlo antes de mandar a nadie a Supabase: si el proveedor
 * está desactivado, `/auth/v1/authorize` responde un 400 crudo
 * («Unsupported provider: provider is not enabled») y la persona se queda
 * tirada en una página de error de Supabase, sin vuelta al sitio.
 *
 * `signInWithOAuth` no lo detecta porque no llama al servidor: sólo construye
 * la URL.
 *
 * La respuesta se cachea cinco minutos: cambia cuando se toca el panel de
 * Supabase, no en cada clic.
 */
export async function isProviderEnabled(provider: string): Promise<boolean> {
  const env = supabaseEnvOrNull();
  if (!env) return false;

  try {
    const response = await fetch(`${env.url}/auth/v1/settings`, {
      headers: { apikey: env.key },
      next: { revalidate: 300 },
    });

    if (!response.ok) return false;

    const settings = (await response.json()) as { external?: Record<string, boolean> };
    return settings.external?.[provider] === true;
  } catch (error) {
    console.error('[slidersfc] no se pudo consultar los proveedores de acceso:', error);
    // Ante la duda dejamos pasar: peor que un mensaje es bloquear un acceso
    // que sí funciona porque la comprobación falló.
    return true;
  }
}
