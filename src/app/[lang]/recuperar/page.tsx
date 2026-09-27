import type { Metadata } from 'next';
import { lang } from 'next/root-params';

import { PasswordResetRequest } from '@/components/password-forms';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return {
    title: getDictionary(locale).recuperar.metaTitle,
    // Página de gestión de cuenta, no de contenido: nada que indexar ni que
    // enseñar en el otro idioma. Por eso no lleva `alternates`.
    robots: { index: false },
  };
}

export default async function RecoverPage() {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).recuperar;

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="eyebrow">SlidersFC</p>
      <h1 className="display mt-3 text-5xl">{t.heading}</h1>
      <p className="mt-4 text-sm text-chalk-dim">{t.subheading}</p>

      <div className="mt-8">
        <PasswordResetRequest />
      </div>
    </div>
  );
}
