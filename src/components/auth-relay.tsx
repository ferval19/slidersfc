'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { authErrorFrom } from '@/lib/auth-errors';

/**
 * Recoge las vueltas de Supabase Auth caigan donde caigan.
 *
 * Supabase no siempre devuelve a la ruta que se le pide: si el `redirect_to`
 * no está en la lista blanca del proyecto, usa el Site URL, que suele ser la
 * portada. Ahí no había nada escuchando, así que el enlace del correo llevaba
 * a la web **sin error y sin sesión**, y parecía que no había pasado nada.
 *
 * Por eso esto vive en el layout y no en /auth: mira cualquier página.
 *
 *   ?error=...            → a /login con el motivo traducido
 *   ?code=...             → a /auth/confirm, que lo canjea en el servidor
 *   #access_token=...     → a /auth/finalizar, que lo lee con JS
 *
 * El fragmento no llega al servidor, y el cliente de Supabase no se importa
 * aquí a propósito: cargarlo en el layout lo metería en el paquete de todas
 * las páginas.
 */
export function AuthRelay() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    // Las rutas de /auth ya saben qué hacer con todo esto.
    if (pathname.startsWith('/auth/')) return;

    // 1. Errores. /login queda fuera porque su ?error= es nuestro, ya
    //    traducido, y volver a interpretarlo lo cambiaría por el genérico.
    if (pathname !== '/login') {
      const message = authErrorFrom(query) ?? authErrorFrom(hash);
      if (message) {
        router.replace(`/login?error=${encodeURIComponent(message)}`);
        return;
      }
    }

    // A dónde volver una vez creada la sesión: aquí mismo, sin los parámetros
    // del acceso.
    const clean = new URLSearchParams(query);
    for (const key of ['code', 'error', 'error_code', 'error_description']) {
      clean.delete(key);
    }
    const rest = clean.toString();
    const next = `${pathname}${rest ? `?${rest}` : ''}`;

    // 2. Flujo PKCE: el código se canjea en el servidor.
    const code = query.get('code');
    if (code) {
      window.location.replace(
        `/auth/confirm?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`,
      );
      return;
    }

    // 3. Flujo implícito: los tokens vienen en el fragmento, que hay que
    //    arrastrar a mano porque una redirección normal no lo conserva.
    if (hash.get('access_token') && hash.get('refresh_token')) {
      window.location.replace(
        `/auth/finalizar?next=${encodeURIComponent(next)}#${hash.toString()}`,
      );
    }
  }, [pathname, router]);

  return null;
}
