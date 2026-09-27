import type { Metadata } from 'next';
import { lang } from 'next/root-params';

import { LoginForm } from '@/components/login-form';
import { alternates } from '@/lib/i18n/alternates';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { safeNextPath } from '@/lib/site-url';
import { getCurrentUser } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return {
    title: 'Entrar',
    description: 'Entra en SlidersFC con tu cuenta de X o con tu email.',
    alternates: alternates(locale, '/login'),
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const user = await getCurrentUser();

  if (user) redirect(next);

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="eyebrow">SlidersFC</p>
      <h1 className="display mt-3 text-5xl">Entra y publica tus sliders</h1>
      <p className="mt-3 text-sm text-chalk-dim">
        Necesitas una cuenta para publicar sets y comentar los de los demás. Leer es
        libre.
      </p>

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
