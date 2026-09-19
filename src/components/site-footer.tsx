import Link from 'next/link';

import { SITE_BYLINE, SITE_NAME } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <div className="chalk-rule" />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-baseline sm:justify-between">
        {/* La marca y la navegación juntas: suelto en medio, el enlace parecía
            una etiqueta más y no un sitio al que ir. */}
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <p className="eyebrow">
            {SITE_NAME} · {SITE_BYLINE}
          </p>
          <Link href="/guia" className="eyebrow text-chalk underline underline-offset-4 hover:text-ink-user">
            Qué lleva un set
          </Link>
        </div>
        <p className="max-w-sm text-xs text-chalk-dim">
          Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.
        </p>
      </div>
    </footer>
  );
}
