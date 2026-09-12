import type { Metadata } from 'next';

import { PasswordResetRequest } from '@/components/password-forms';

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  robots: { index: false },
};

export default function RecoverPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="eyebrow">SlidersFC</p>
      <h1 className="display mt-3 text-5xl">¿Contraseña olvidada?</h1>
      <p className="mt-4 text-sm text-chalk-dim">
        Escribe tu correo y te mandamos un enlace para ponerte una nueva.
      </p>

      <div className="mt-8">
        <PasswordResetRequest />
      </div>
    </div>
  );
}
