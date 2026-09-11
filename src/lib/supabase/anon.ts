import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/database.types';
import { supabaseEnv } from './env';

/**
 * Cliente sin cookies, para lecturas que no dependen del usuario (sitemap).
 * Al no tocar `cookies()`, la ruta que lo use puede cachearse y revalidarse
 * en lugar de renderizarse en cada petición.
 *
 * Sólo ve lo que RLS permite al rol anónimo: sets publicados y catálogo.
 */
export function createSupabaseAnonClient() {
  const { url, key } = supabaseEnv();

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
