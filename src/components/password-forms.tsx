'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import {
  requestPasswordReset,
  updatePassword,
  type AuthFormState,
} from '@/app/actions/auth';

const initialState: AuthFormState = {};

export function PasswordResetRequest() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.sent) {
    return (
      <div className="panel p-6">
        <p className="eyebrow">Enviado</p>
        <h2 className="display mt-2 text-3xl">Mira tu correo</h2>
        <p className="mt-3 text-sm text-chalk-dim">
          Si hay una cuenta con <span className="text-chalk">{state.sent}</span>, te llega un
          enlace para poner una contraseña nueva.
        </p>
        <Link href="/login" className="btn btn-quiet mt-5">
          Volver a entrar
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">Correo</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className="field"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-ink-rival" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Enviando…' : 'Mandarme el enlace'}
      </button>

      <Link
        href="/login"
        className="self-start text-xs text-chalk-dim underline-offset-4 hover:text-chalk hover:underline"
      >
        Volver a entrar
      </Link>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">Contraseña nueva</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          className="field"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">Repítela</span>
        <input
          type="password"
          name="password_confirm"
          required
          minLength={8}
          autoComplete="new-password"
          className="field"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-ink-rival" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary mt-1" disabled={pending}>
        {pending ? 'Guardando…' : 'Guardar y entrar'}
      </button>
    </form>
  );
}
