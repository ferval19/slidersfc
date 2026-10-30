import { ImageResponse } from 'next/og';

import { RetoShareCard } from '@/components/reto-share-card';
import { SHARE_CARD_SIZE } from '@/components/share-card';
import { displayFont, monoFont } from '@/lib/og-fonts';
import { retoPorSlug } from '@/lib/retos';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = 'Reto de modo carrera — SlidersFC';

/**
 * La imagen para compartir de cada reto. Ojo: Next **no** la enlaza sola aquí.
 * Por convención la enlazaría con el prefijo de idioma (`/en/…/opengraph-image`),
 * y la canónica del reto es siempre la castellana; así que `page.tsx` declara
 * `openGraph.images` a mano, apuntando a la ruta sin prefijo.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reto = retoPorSlug(slug);
  if (!reto) return new Response('Not found', { status: 404 });

  const [display, mono] = await Promise.all([displayFont(), monoFont()]);

  return new ImageResponse(<RetoShareCard reto={reto} />, {
    ...size,
    fonts: [
      { name: 'Display', data: display, weight: 900, style: 'normal' },
      { name: 'Plex', data: mono, weight: 500, style: 'normal' },
    ],
  });
}
