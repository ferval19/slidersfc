import type { Metadata } from 'next';
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

import { ChalkFilters } from '@/components/chalk';
import { SetupNotice } from '@/components/setup-notice';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Sliders de EA SPORTS FC`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  openGraph: {
    type: 'website',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ChalkFilters />
        <SiteHeader />
        <SetupNotice />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
