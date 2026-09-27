import { ImageResponse } from 'next/og';

import { BrandCard, SHARE_CARD_SIZE } from '@/components/share-card';
import { SITE_TAGLINE } from '@/lib/constants';
import { displayFont, monoFont } from '@/lib/og-fonts';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = 'SlidersFC — sliders de EA SPORTS FC';

/**
 * Imagen por defecto de toda la web. Next la usa en cualquier ruta que no
 * tenga la suya, así que cubre portada, juegos y perfiles; las fichas de set
 * siguen generando la suya con sus valores.
 */
export default async function Image() {
  const [display, mono] = await Promise.all([displayFont(), monoFont()]);

  return new ImageResponse(<BrandCard subtitle={SITE_TAGLINE} />, {
    ...size,
    fonts: [
      { name: 'Display', data: display, weight: 900, style: 'normal' },
      { name: 'Plex', data: mono, weight: 500, style: 'normal' },
    ],
  });
}
