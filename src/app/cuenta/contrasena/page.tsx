import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { NewPasswordForm } from '@/components/password-forms';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Nueva contraseña',
  robots: { index: false },
};

export default async function NewPasswordPage() {
  // El enlace de recuperación crea sesión al pasar por /auth/confirm. Sin
  // sesión no hay nada que cambiar.
  const user = await getCurrentUser();
  if (!user) redirect('/recuperar');

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="eyebrow">SlidersFC</p>
      <h1 className="display mt-3 text-5xl">Pon una contraseña nueva</h1>
      <p className="mt-4 text-sm text-chalk-dim">
        A partir de ahora entrarás con ella. Mínimo 8 caracteres.
      </p>

      <div className="mt-8">
        <NewPasswordForm />
      </div>
    </div>
  );
}
