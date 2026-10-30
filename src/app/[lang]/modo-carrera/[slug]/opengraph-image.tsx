import { ImageResponse } from 'next/og';

import { GuiaShareCard } from '@/components/guia-share-card';
import { SHARE_CARD_SIZE } from '@/components/share-card';
import { displayFont, monoFont } from '@/lib/og-fonts';
import { guiaPorSlug } from '@/lib/modo-carrera';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = 'Guía de modo carrera — SlidersFC';

/**
 * La imagen para compartir de cada guía. La guía es un route handler y no una
 * página, así que Next no enlaza esta imagen solo: las etiquetas `og:image`
 * las escribe a mano `route.ts`, apuntando aquí.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guia = guiaPorSlug(slug);
  if (!guia) return new Response('Not found', { status: 404 });

  const [display, mono] = await Promise.all([displayFont(), monoFont()]);

  return new ImageResponse(<GuiaShareCard guia={guia} />, {
    ...size,
    fonts: [
      { name: 'Display', data: display, weight: 900, style: 'normal' },
      { name: 'Plex', data: mono, weight: 500, style: 'normal' },
    ],
  });
}
