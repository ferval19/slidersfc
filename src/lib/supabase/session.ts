import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from '@/lib/database.types';
import { supabaseEnvOrNull } from './env';

const PROTECTED_PREFIXES = ['/sets/nuevo', '/ajustes'];

/**
 * Refresca el token de sesión en cada navegación y protege las rutas
 * que requieren sesión. Las rutas /sets/[id]/editar se comprueban además
 * en el servidor, porque sólo el dueño puede editar.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const env = supabaseEnvOrNull();

  // Sin configuración de Supabase no hay sesión que refrescar. Dejamos pasar
  // la petición para que las páginas puedan renderizar el aviso de setup en
  // lugar de que todo el sitio devuelva un 500.
  if (!env) return response;

  let sessionResponse = response;

  const supabase = createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        sessionResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          sessionResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (error) {
    // Si Supabase no responde no bloqueamos la navegación: las páginas
    // protegidas vuelven a comprobar la sesión en el servidor.
    console.error('[slidersfc] refresco de sesión falló:', error);
    return sessionResponse;
  }

  const { pathname } = request.nextUrl;
  const needsAuth =
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    /^\/sets\/[^/]+\/editar$/.test(pathname);

  if (!user && needsAuth) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return sessionResponse;
}
