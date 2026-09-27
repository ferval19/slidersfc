import type { Metadata } from 'next';
import { lang } from 'next/root-params';

import { LoginForm } from '@/components/login-form';
import { alternates } from '@/lib/i18n/alternates';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n/locale';
import { safeNextPath } from '@/lib/site-url';
import { getCurrentUser } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).login;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternates(locale, '/login'),
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const [params, localeParam] = await Promise.all([searchParams, lang()]);
  const locale = (localeParam ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).login;
  const next = safeNextPath(params.next);
  const user = await getCurrentUser();

  if (user) redirect(localePath(locale, next));

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="eyebrow">SlidersFC</p>
      <h1 className="display mt-3 text-5xl">{t.heading}</h1>
      <p className="mt-3 text-sm text-chalk-dim">{t.subheading}</p>

      {params.error ? (
        <p className="mt-6 rounded-lg border border-ink-rival/40 bg-ink-rival/10 px-3 py-2 text-sm text-ink-rival" role="alert">
          {params.error}
        </p>
      ) : null}

      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
