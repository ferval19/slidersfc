import type { Metadata } from 'next';

import { LoginForm } from '@/components/login-form';
import { safeNextPath } from '@/lib/site-url';
import { getCurrentUser } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Entra en SlidersFC con tu cuenta de X o con tu email.',
};

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
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
        Entra y publica tus sliders
      </h1>
      <p className="mt-3 text-sm text-muted">
        Necesitas una cuenta para crear sets y comentar los de los demás. Leer es libre.
      </p>

      {params.error ? (
        <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {params.error}
        </p>
      ) : null}

      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
