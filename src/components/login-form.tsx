'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';

import {
  signInWithEmail,
  signInWithPassword,
  signInWithTwitter,
  signUpWithPassword,
  verifyEmailCode,
  type AuthFormState,
  type CodeFormState,
} from '@/app/actions/auth';

const initialState: AuthFormState = {};
const initialCodeState: CodeFormState = {};

type Mode = 'entrar' | 'crear' | 'enlace';

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>('entrar');

  return (
    <div className="flex flex-col gap-6">
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
        <span className="h-px flex-1 bg-chalk-line" />
        <span className="eyebrow">o con tu correo</span>
        <span className="h-px flex-1 bg-chalk-line" />
      </div>

      {mode === 'enlace' ? (
        <MagicLinkForm next={next} onBack={() => setMode('entrar')} />
      ) : (
        <PasswordForm
          key={mode}
          mode={mode}
          next={next}
          onModeChange={setMode}
        />
      )}
    </div>
  );
}

/** Entrar o crear cuenta con correo y contraseña. */
function PasswordForm({
  mode,
  next,
  onModeChange,
}: {
  mode: 'entrar' | 'crear';
  next: string;
  onModeChange: (mode: Mode) => void;
}) {
  const creating = mode === 'crear';
  const [state, formAction, pending] = useActionState(
    creating ? signUpWithPassword : signInWithPassword,
    initialState,
  );

  // Cuenta creada pero Supabase pide confirmar el correo antes de entrar.
  if (state.sent) return <SentPanel email={state.sent} next={next} confirming />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2" role="tablist">
        {(['entrar', 'crear'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={mode === option}
            onClick={() => onModeChange(option)}
            className={`chip flex-1 justify-center py-2 ${mode === option ? 'chip-active' : ''}`}
          >
            {option === 'entrar' ? 'Entrar' : 'Crear cuenta'}
          </button>
        ))}
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />

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

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">Contraseña</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete={creating ? 'new-password' : 'current-password'}
            placeholder={creating ? 'Mínimo 8 caracteres' : ''}
            className="field"
          />
        </label>

        {creating ? (
          <label className="flex flex-col gap-1.5">
            <span className="eyebrow">Repite la contraseña</span>
            <input
              type="password"
              name="password_confirm"
              required
              minLength={8}
              autoComplete="new-password"
              className="field"
            />
          </label>
        ) : null}

        {state.error ? (
          <p className="text-sm text-ink-rival" role="alert">
            {state.error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary mt-1" disabled={pending}>
          {pending ? 'Un momento…' : creating ? 'Crear mi cuenta' : 'Entrar'}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-chalk-dim">
        <button
          type="button"
          onClick={() => onModeChange('enlace')}
          className="font-semibold text-chalk-dim underline-offset-4 hover:text-chalk hover:underline"
        >
          Prefiero un enlace por correo
        </button>
        {!creating ? (
          <Link href="/recuperar" className="underline-offset-4 hover:text-chalk hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Enlace mágico, sin contraseña. */
function MagicLinkForm({ next, onBack }: { next: string; onBack: () => void }) {
  const [state, formAction, pending] = useActionState(signInWithEmail, initialState);

  if (state.sent) return <SentPanel email={state.sent} next={next} />;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />

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
        {pending ? 'Enviando…' : 'Enviarme un enlace'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="self-start text-xs font-semibold text-chalk-dim underline-offset-4 hover:text-chalk hover:underline"
      >
        Volver a la contraseña
      </button>
    </form>
  );
}

/**
 * Después de mandar el correo. Se ofrecen las dos vías a la vez porque el
 * enlace se rompe con facilidad — los escáneres de correo lo abren antes que
 * la persona y consumen el token — y el código escrito a mano no.
 */
export function SentPanel({
  email,
  next,
  confirming = false,
}: {
  email: string;
  next: string;
  confirming?: boolean;
}) {
  const [state, formAction, pending] = useActionState(verifyEmailCode, initialCodeState);

  return (
    <div className="flex flex-col gap-6">
      <div className="panel p-6">
        <p className="eyebrow">Revisa tu correo</p>
        <h2 className="display mt-2 text-3xl">
          {confirming ? 'Confirma tu cuenta' : 'Te lo hemos enviado'}
        </h2>
        <p className="mt-3 text-sm text-chalk-dim">
          {confirming
            ? 'Tu cuenta está creada. Abre el enlace que te hemos mandado a '
            : 'A '}
          <span className="text-chalk">{email}</span>
          {confirming ? ' para poder entrar.' : '. Abre el enlace en este mismo navegador y entrarás directo.'}
        </p>
      </div>

      <form action={formAction} className="panel flex flex-col gap-3 p-6">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="next" value={next} />

        <p className="eyebrow">¿El enlace no funciona?</p>
        <p className="text-sm text-chalk-dim">
          Escribe aquí el código de 6 dígitos del correo. Funciona desde cualquier
          navegador o dispositivo, y no se gasta si tu gestor de correo abre el enlace
          por su cuenta.
        </p>

        <label className="mt-1 flex flex-col gap-1.5">
          <span className="eyebrow">Código</span>
          <input
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="000000"
            className="field value-pill max-w-40 text-center text-xl tracking-[0.3em]"
          />
        </label>

        {state.error ? (
          <p className="text-sm text-ink-rival" role="alert">
            {state.error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary mt-1 self-start" disabled={pending}>
          {pending ? 'Comprobando…' : 'Entrar con el código'}
        </button>
      </form>
    </div>
  );
}
