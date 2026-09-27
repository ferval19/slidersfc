import { ImageResponse } from 'next/og';

import { BrandCard, SHARE_CARD_SIZE } from '@/components/share-card';
import { siteTagline } from '@/lib/constants';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/locale';
import { displayFont, monoFont } from '@/lib/og-fonts';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = 'SlidersFC — sliders de EA SPORTS FC';

/**
 * Imagen por defecto de toda la web. Next la usa en cualquier ruta que no
 * tenga la suya, así que cubre portada, juegos y perfiles; las fichas de set
 * siguen generando la suya con sus valores.
 *
 * El idioma sale de `params`, no de `next/root-params`. Ver el comentario
 * igual en `u/[username]/[slug]/opengraph-image.tsx`: esto es un Route
 * Handler y ahí root-params todavía no funciona.
 */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const [display, mono] = await Promise.all([displayFont(), monoFont()]);

  return new ImageResponse(<BrandCard subtitle={siteTagline(locale)} />, {
    ...size,
    fonts: [
      { name: 'Display', data: display, weight: 900, style: 'normal' },
      { name: 'Plex', data: mono, weight: 500, style: 'normal' },
    ],
  });
}
