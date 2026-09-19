import { headers } from 'next/headers';

const FALLBACK_ORIGIN = 'http://localhost:3000';

/**
 * Origen público del sitio para metadatos, sitemap y robots.
 *
 * El orden importa y sale de un fallo real: al compartir un set por WhatsApp
 * no salía la imagen, porque sin `NEXT_PUBLIC_SITE_URL` esto devolvía
 * localhost y el `og:image` apuntaba al ordenador de quien lo publicó.
 *
 * Por eso ahora Vercel entra en la cadena: sus variables están puestas solas,
 * así que en producción funciona aunque nadie configure nada. La variable
 * explícita sigue mandando, para dominios propios.
 *
 * Ojo también con las cadenas vacías: en un `.env` recién copiado la variable
 * existe con valor '', y `??` no lo captura — eso llegó a tumbar el layout
 * entero con `new URL('')`.
 */
export function publicSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  // Dominio estable del proyecto en Vercel, antes que el de cada despliegue.
  const vercel =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

  return FALLBACK_ORIGIN;
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
