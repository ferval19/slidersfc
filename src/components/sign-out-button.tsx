'use client';

import { useTransition } from 'react';

import { signOut } from '@/app/actions/auth';

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-ghost"
      disabled={pending}
      onClick={() => startTransition(async () => void (await signOut()))}
    >
      {pending ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}
