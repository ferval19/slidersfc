import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { DEFAULT_LOCALE, isLocale, LOCALES, localePath, type Locale } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionary';
import { guiaPorSlug, GUIAS_MODO_CARRERA } from '@/lib/modo-carrera';
import { publicSiteUrl } from '@/lib/site-url';
import { SHARE_CARD_SIZE } from '@/components/share-card';

/**
 * Una guía de modo carrera, servida como el HTML autónomo que es.
 *
 * Es un route handler y no una página a propósito: la guía trae su propio
 * `<html>` con su CSS global, y renderizada dentro del layout de la web los
 * dos diseños se pisarían. Se prerenderiza en el build (`generateStaticParams`
 * + `dynamicParams = false`), así que el `readFile` corre una vez al compilar
 * y no hay que preocuparse de si el fichero viaja al servidor.
 *
 * Lo único que se le añade es lo que la página no puede saber sola: la
 * canónica, las metaetiquetas para compartir, el favicon y una franja arriba
 * para volver al índice.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => GUIAS_MODO_CARRERA.map((guia) => ({ lang, slug: guia.slug })));
}

function attr(valor: string): string {
  return valor.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const guia = guiaPorSlug(slug);
  if (!guia) return new Response('Not found', { status: 404 });

  const t = getDictionary(locale).modoCarrera;
  const siteUrl = publicSiteUrl();
  // La guía está en castellano: la canónica es siempre la castellana.
  const canonica = `${siteUrl}/modo-carrera/${guia.slug}`;
  const indice = localePath(locale, '/modo-carrera');
  // La imagen de `opengraph-image.tsx`, también en su versión castellana. El
  // título lleva la marca porque `og:title` viaja solo, sin el nombre del sitio.
  const imagen = `${canonica}/opengraph-image`;
  const titulo = `${guia.titulo} · ${guia.equipo} · Modo carrera ${guia.juego}`;

  const html = await readFile(
    path.join(process.cwd(), 'src/content/modo-carrera', `${guia.slug}.html`),
    'utf8',
  );

  const cabecera = `
<meta name="description" content="${attr(guia.resumen)}">
<link rel="canonical" href="${canonica}">
<link rel="icon" href="/icon">
<link rel="apple-touch-icon" href="/apple-icon">
<meta property="og:type" content="article">
<meta property="og:site_name" content="SlidersFC">
<meta property="og:locale" content="es_ES">
<meta property="og:url" content="${canonica}">
<meta property="og:title" content="${attr(titulo)}">
<meta property="og:description" content="${attr(guia.resumen)}">
<meta property="og:image" content="${imagen}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="${SHARE_CARD_SIZE.width}">
<meta property="og:image:height" content="${SHARE_CARD_SIZE.height}">
<meta property="og:image:alt" content="${attr(titulo)}">
<meta property="article:published_time" content="${guia.publicada}">
<meta property="article:section" content="Modo carrera">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(titulo)}">
<meta name="twitter:description" content="${attr(guia.resumen)}">
<meta name="twitter:image" content="${imagen}">
<meta name="twitter:image:alt" content="${attr(titulo)}">
<style>
.sfc-vuelta{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px;background:#06170f;color:#f2efe4;font:500 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase}
.sfc-vuelta a{color:#f2efe4;text-decoration:none}
.sfc-vuelta a:hover{color:#ffd24a}
.sfc-vuelta b{color:#ffd24a;font-weight:600}
</style>
`;

  const franja = `
<div class="sfc-vuelta"><a href="${indice}">← <b>SlidersFC</b> · ${attr(t.titulo)}</a><a href="${localePath(locale, '/')}">${attr(t.verSets)}</a></div>
`;

  const pagina = html.replace('</head>', `${cabecera}</head>`).replace(/<body>/, `<body>${franja}`);

  return new Response(pagina, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
