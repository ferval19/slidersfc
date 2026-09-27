import Link from 'next/link';
import { lang } from 'next/root-params';

import { SITE_BYLINE, SITE_NAME } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';

export async function SiteFooter() {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).footer;

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
          <Link
            href={localized(locale, '/guia')}
            className="eyebrow text-chalk underline underline-offset-4 hover:text-ink-user"
          >
            {t.queLlevaUnSet}
          </Link>
        </div>
        <p className="max-w-sm text-xs text-chalk-dim">{t.disclaimer}</p>
      </div>
    </footer>
  );
}
