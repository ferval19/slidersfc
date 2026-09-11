import { headers } from 'next/headers';

const FALLBACK_ORIGIN = 'http://localhost:3000';

/**
 * Origen público del sitio para metadatos, sitemap y robots.
 *
 * Ojo: se comprueba que no esté vacío, no sólo que esté definido. En un
 * `.env` recién copiado la variable existe con valor '', y `??` no lo
 * captura — eso hacía que `new URL('')` tumbase el layout entero.
 */
export function publicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (configured ? configured : FALLBACK_ORIGIN).replace(/\/$/, '');
}

/**
 * Origen absoluto de la petición actual. Necesario para construir los
 * redirect_to de Supabase Auth, que no aceptan rutas relativas.
 */
export async function getSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000';
  const protocol = headerList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');

  return `${protocol}://${host}`;
}

/** Evita open redirects: sólo se admiten rutas internas. */
export function safeNextPath(next: unknown): string {
  const value = typeof next === 'string' ? next : '';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return '/';
}
