import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from '@/lib/database.types';
import { supabaseEnvOrNull } from './env';

const PROTECTED_PREFIXES = ['/sets/nuevo', '/ajustes'];

/**
 * Refresca el token de sesión en cada navegación y protege las rutas que
 * requieren sesión. Las de edición se comprueban además en el servidor,
 * porque aquí sólo sabemos si hay sesión, no si es el dueño.
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

  // El idioma va delante en inglés (`/en/sets/nuevo`), así que se separa antes
  // de comparar: si no, ninguna ruta en inglés entraba en la lista de
  // protegidas y el guardián no guardaba nada de ese lado.
  const prefijo = pathname.startsWith('/en/') || pathname === '/en' ? '/en' : '';
  const sinIdioma = prefijo ? pathname.slice(prefijo.length) || '/' : pathname;

  const needsAuth =
    PROTECTED_PREFIXES.some((prefix) => sinIdioma.startsWith(prefix)) ||
    sinIdioma.endsWith('/editar');

  if (!user && needsAuth) {
    const loginUrl = request.nextUrl.clone();
    // Al acceso del mismo idioma, y de vuelta a donde ibas.
    loginUrl.pathname = `${prefijo}/login`;
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return sessionResponse;
}
