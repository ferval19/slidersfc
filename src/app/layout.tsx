import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

import { AuthRelay } from '@/components/auth-relay';
import { ChalkBackdrop } from '@/components/chalk-backdrop';
import { ChalkFilters } from '@/components/chalk';
import { SetupNotice } from '@/components/setup-notice';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';
import { jsonLd } from '@/lib/json-ld';
import { publicSiteUrl } from '@/lib/site-url';
import './globals.css';

const display = Big_Shoulders({ variable: '--font-big-shoulders', subsets: ['latin'] });

const sans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const mono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const siteUrl = publicSiteUrl();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b241f',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Sliders de EA SPORTS FC`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  keywords: ['sliders FC', 'sliders EA SPORTS FC', 'sliders FC 27', 'sliders FC 26', SITE_NAME],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Sliders de EA SPORTS FC`,
    description: SITE_TAGLINE,
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Sliders de EA SPORTS FC`,
    description: SITE_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * `WebSite` a nivel de sitio: no lleva `SearchAction` porque no hay búsqueda
 * (decisión de la hoja de ruta), y meter una acción que no existe sería
 * mentirle al buscador. Sirve para que Google entienda el nombre de marca
 * («SlidersFC» / «Sliders FC») y el dominio como la misma entidad.
 */
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: 'Sliders FC',
  url: siteUrl,
  description: SITE_TAGLINE,
  inLanguage: 'es',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd) }} />
        <ChalkFilters />
        <ChalkBackdrop />
        <AuthRelay />
        <SiteHeader />
        <SetupNotice />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Analítica de Vercel: sin cookies y sin datos personales, así que no
            hace falta banner de consentimiento. */}
        <Analytics />
      </body>
    </html>
  );
}
