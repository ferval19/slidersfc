import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/locale';
import { updateSession } from '@/lib/supabase/session';

/**
 * Refresca la sesión de Supabase en cada navegación y protege las rutas
 * privadas. En Next.js 16 esta convención se llama `proxy` (antes `middleware`).
 *
 * Y además resuelve el idioma. Las rutas viven una sola vez, bajo
 * `app/[lang]/`, pero el castellano **no lleva prefijo en la URL**: los
 * enlaces que ya circulan apuntan a `/u/pepe/su-set` y tienen que seguir
 * funcionando. Así que `/loquesea` se reescribe por dentro a `/es/loquesea`.
 *
 * Reescribir, no redirigir: la URL que ve quien navega no cambia. Una
 * redirección convertiría todos los enlaces compartidos en un salto extra y
 * dejaría `/es/...` circulando por ahí, que es justo lo que se quiere evitar.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const yaTieneIdioma = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!yaTieneIdioma) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
    // La sesión se refresca sobre la petición original y sus cookies viajan
    // con la reescritura: si no, cada navegación en castellano perdería el
    // refresco del token.
    const sesion = await updateSession(request);
    const reescrito = NextResponse.rewrite(url, { request });
    sesion.cookies.getAll().forEach((cookie) => reescrito.cookies.set(cookie));
    return reescrito;
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    // Fuera lo de Next, los ficheros estáticos y los cinco de metadatos, que
    // son del sitio entero y no de un idioma.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
