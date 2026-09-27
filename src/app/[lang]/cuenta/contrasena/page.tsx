import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { lang } from 'next/root-params';

import { NewPasswordForm } from '@/components/password-forms';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n/locale';
import { getCurrentUser } from '@/lib/supabase/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return {
    title: getDictionary(locale).cuentaContrasena.metaTitle,
    // Igual que /recuperar: gestión de cuenta, sin `alternates`.
    robots: { index: false },
  };
}

export default async function NewPasswordPage() {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).cuentaContrasena;

  // El enlace de recuperación crea sesión al pasar por /auth/confirm. Sin
  // sesión no hay nada que cambiar.
  const user = await getCurrentUser();
  if (!user) redirect(localePath(locale, '/recuperar'));

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="eyebrow">SlidersFC</p>
      <h1 className="display mt-3 text-5xl">{t.heading}</h1>
      <p className="mt-4 text-sm text-chalk-dim">{t.subheading}</p>

      <div className="mt-8">
        <NewPasswordForm />
      </div>
    </div>
  );
}
