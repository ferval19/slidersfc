import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import type { Database } from '@/lib/database.types';
import { supabaseEnv } from './env';

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Lee y refresca la sesión desde las cookies de la petición.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, key } = supabaseEnv();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Los Server Components no pueden escribir cookies. El middleware
          // ya se encarga de refrescar la sesión, así que es seguro ignorarlo.
        }
      },
    },
  });
}

/** Usuario autenticado actual, o null. No lanza si Supabase no responde. */
export async function getCurrentUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('[sliderxi] getCurrentUser falló:', error);
    return null;
  }
}

/** Perfil del usuario autenticado actual, o null. */
export async function getCurrentProfile() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return data;
  } catch (error) {
    console.error('[sliderxi] getCurrentProfile falló:', error);
    return null;
  }
}
