import type { Metadata } from 'next';
import { lang } from 'next/root-params';

import { AuthHashHandler } from '@/components/auth-hash-handler';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { safeNextPath } from '@/lib/site-url';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return {
    title: getDictionary(locale).authFinalizar.metaTitle,
    robots: { index: false },
  };
}

export default async function FinalizeAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <AuthHashHandler next={safeNextPath(next)} />
    </div>
  );
}
