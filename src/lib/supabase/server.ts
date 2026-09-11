import { cookies } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
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
    unstable_rethrow(error);
    console.error('[slidersfc] getCurrentUser falló:', error);
    return null;
  }
}

/**
 * Sesión y perfil en una sola llamada, para que el header no pida el usuario
 * dos veces. `profile` puede ser null con `user` presente: la fila de perfil
 * se repara al entrar en /perfil.
 */
export async function getSessionProfile() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, profile: null };

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return { user, profile };
  } catch (error) {
    unstable_rethrow(error);
    console.error('[slidersfc] getSessionProfile falló:', error);
    return { user: null, profile: null };
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
    unstable_rethrow(error);
    console.error('[slidersfc] getCurrentProfile falló:', error);
    return null;
  }
}
