import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RetoPagina } from '@/components/reto/reto';
import { isLocale, DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/locale';
import { retoPorSlug, retosOrdenados } from '@/lib/retos';

/**
 * Un reto de modo carrera. `generateStaticParams` + `dynamicParams = false`
 * fijan la lista: un slug que no esté en `RETOS` es 404. Pero **no** se
 * prerenderiza: el layout lee cookies (la cabecera sabe si hay sesión), así
 * que como el resto de la web se pinta en cada petición. La guía en HTML suelto
 * sí era estática; es el precio de vivir dentro de la web.
 */
export const dynamicParams = false;

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => retosOrdenados().map((reto) => ({ lang, slug: reto.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const reto = retoPorSlug(slug);
  if (!reto) return {};

  // El reto está en castellano: la canónica es siempre la castellana, también
  // desde `/en`, que enseña el mismo texto. `metadataBase` ya pone el dominio.
  // La imagen, también la castellana: la misma de `opengraph-image.tsx`, pero
  // pedida por la ruta sin prefijo de idioma.
  const imagen = `/modo-carrera/${reto.slug}/opengraph-image`;
  const titulo = `${reto.titulo} · ${reto.equipo} · Modo carrera ${reto.juego}`;

  return {
    title: reto.titulo,
    description: reto.resumen,
    alternates: { canonical: `/modo-carrera/${reto.slug}` },
    openGraph: {
      type: 'article',
      title: titulo,
      description: reto.resumen,
      url: `/modo-carrera/${reto.slug}`,
      locale: 'es_ES',
      publishedTime: reto.publicada,
      section: 'Modo carrera',
      images: [{ url: imagen, width: 1200, height: 630, alt: titulo }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: reto.resumen,
      images: [{ url: imagen, alt: titulo }],
    },
  };
}

export default async function RetoRoute({ params }: Props) {
  const { lang, slug } = await params;
  const reto = retoPorSlug(slug);
  if (!reto) notFound();

  return <RetoPagina reto={reto} locale={isLocale(lang) ? lang : DEFAULT_LOCALE} />;
}
