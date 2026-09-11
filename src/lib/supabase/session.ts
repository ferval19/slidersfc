import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from '@/lib/database.types';
import { supabaseEnv } from './env';

const PROTECTED_PREFIXES = ['/sets/nuevo', '/ajustes'];

/**
 * Refresca el token de sesión en cada navegación y protege las rutas
 * que requieren sesión. Las rutas /sets/[id]/editar se comprueban además
 * en el servidor, porque sólo el dueño puede editar.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = supabaseEnv();

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
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
    console.error('[sliderxi] refresco de sesión falló:', error);
    return response;
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

  return response;
}
