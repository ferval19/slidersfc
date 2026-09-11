import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { SiteHeader } from '@/components/site-header';
import { SITE_BYLINE, SITE_NAME, SITE_TAGLINE } from '@/lib/constants';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="mt-20 border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              {SITE_NAME} <span className="text-line-strong">·</span> {SITE_BYLINE}
            </p>
            <p>
              Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
