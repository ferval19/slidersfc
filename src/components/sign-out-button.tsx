'use client';

import { useTransition } from 'react';

import { signOut } from '@/app/actions/auth';
import { ChalkExit } from '@/components/chalk';
import { useI18n } from '@/components/i18n-provider';

export function SignOutButton() {
  const { locale, t } = useI18n();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-ghost"
      disabled={pending}
      // No hay `<form>` aquí — se llama directo, sin FormData — así que el
      // idioma viaja como argumento normal en vez de como campo oculto.
      onClick={() => startTransition(async () => void (await signOut(locale)))}
    >
      <ChalkExit className="size-4" />
      {pending ? t.signOut.saliendo : t.signOut.cerrarSesion}
    </button>
  );
}
