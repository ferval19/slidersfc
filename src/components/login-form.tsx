'use client';

import { useActionState } from 'react';

import { signInWithEmail, signInWithTwitter, type AuthFormState } from '@/app/actions/auth';

const initialState: AuthFormState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signInWithEmail, initialState);

  if (state.sent) {
    return (
      <div className="card p-6">
        <p className="eyebrow">Revisa tu correo</p>
        <h2 className="mt-2 text-xl font-bold">Te hemos enviado un enlace</h2>
        <p className="mt-2 text-sm text-chalk-dim">
          Hemos mandado un enlace de acceso a <span className="text-chalk">{state.sent}</span>.
          Ábrelo en este mismo navegador y entrarás directamente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form action={signInWithTwitter}>
        <input type="hidden" name="next" value={next} />
        <button type="submit" className="btn btn-quiet w-full">
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-current">
            <path d="M18.9 2H22l-6.8 7.8L22.8 22h-6.1l-4.8-6.3L6.3 22H3.2l7.1-8.1L2.6 2h6.2l4.5 5.9L18.9 2Zm-1.1 18h1.7L7.4 3.7H5.6L17.8 20Z" />
          </svg>
          Continuar con X
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="eyebrow">o con tu email</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">Email</span>
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
          {pending ? 'Enviando…' : 'Enviarme un enlace'}
        </button>
        <p className="text-xs text-chalk-dim">
          Sin contraseñas: te llega un enlace de un solo uso a tu correo.
        </p>
      </form>
    </div>
  );
}
