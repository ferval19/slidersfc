import Link from 'next/link';
import { lang } from 'next/root-params';

import { EmptyBoardDrawing } from '@/components/chalk';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';

export default async function NotFound() {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).notFound;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <EmptyBoardDrawing className="w-52" />
      <p className="eyebrow mt-8">{t.error404}</p>
      <h1 className="display mt-3 text-6xl">{t.estoNoExiste}</h1>
      <p className="mt-5 text-sm text-chalk-dim">{t.body}</p>
      <Link href={localized(locale, '/')} className="btn btn-primary mt-9">
        {t.volverAlFeed}
      </Link>
    </div>
  );
}
