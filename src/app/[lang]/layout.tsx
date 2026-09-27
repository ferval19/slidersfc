import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

import { AuthRelay } from '@/components/auth-relay';
import { ChalkBackdrop } from '@/components/chalk-backdrop';
import { ChalkFilters } from '@/components/chalk';
import { I18nProvider } from '@/components/i18n-provider';
import { SetupNotice } from '@/components/setup-notice';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_NAME, siteTagline, siteTitle } from '@/lib/constants';
import { lang } from 'next/root-params';

import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { jsonLd } from '@/lib/json-ld';
import { publicSiteUrl } from '@/lib/site-url';
import '../globals.css';

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

/** El código de idioma que espera Open Graph, no el de nuestras rutas. */
const OG_LOCALE: Record<Locale, string> = { es: 'es_ES', en: 'en_US' };

/**
 * Antes era una constante: con el idioma fijo bastaba. Ahora `openGraph.locale`
 * depende de la ruta, así que tiene que ser función — lo mismo que ya obliga
 * `RootLayout` a ser `async` para leer `lang()`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle(locale),
      template: `%s · ${SITE_NAME}`,
    },
    description: siteTagline(locale),
    keywords: ['sliders FC', 'sliders EA SPORTS FC', 'sliders FC 27', 'sliders FC 26', SITE_NAME],
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: SITE_NAME,
      title: siteTitle(locale),
      description: siteTagline(locale),
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle(locale),
      description: siteTagline(locale),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * `WebSite` a nivel de sitio: no lleva `SearchAction` porque no hay búsqueda
 * (decisión de la hoja de ruta), y meter una acción que no existe sería
 * mentirle al buscador. Sirve para que Google entienda el nombre de marca
 * («SlidersFC» / «Sliders FC») y el dominio como la misma entidad.
 */
function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Sliders FC',
    url: siteUrl,
    description: siteTagline(locale),
    inLanguage: locale,
  };
}

/**
 * El idioma sale de `next/root-params` y no de las props. `[lang]` es un
 * parámetro de raíz, y eso deja leerlo desde cualquier Server Component sin
 * ir pasándolo de padre a hijo por sesenta ficheros.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd(locale)) }}
        />
        <ChalkFilters />
        <ChalkBackdrop />
        <AuthRelay />
        <SiteHeader />
        <SetupNotice />
        <I18nProvider locale={locale}>
          <main className="flex-1">{children}</main>
        </I18nProvider>
        <SiteFooter />
        {/* Analítica de Vercel: sin cookies y sin datos personales, así que no
            hace falta banner de consentimiento. */}
        <Analytics />
      </body>
    </html>
  );
}
