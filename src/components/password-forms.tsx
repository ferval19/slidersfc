'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import {
  requestPasswordReset,
  updatePassword,
  type AuthFormState,
} from '@/app/actions/auth';
import { useI18n } from '@/components/i18n-provider';
import { localized } from '@/lib/paths';

const initialState: AuthFormState = {};

export function PasswordResetRequest() {
  const { locale, t } = useI18n();
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.sent) {
    return (
      <div className="panel p-6">
        <p className="eyebrow">{t.recuperar.enviado}</p>
        <h2 className="display mt-2 text-3xl">{t.recuperar.miraTuCorreo}</h2>
        <p className="mt-3 text-sm text-chalk-dim">
          {t.recuperar.siHayUnaCuentaConInicio}
          <span className="text-chalk">{state.sent}</span>
          {t.recuperar.siHayUnaCuentaConFin}
        </p>
        <Link href={localized(locale, '/login')} className="btn btn-quiet mt-5">
          {t.recuperar.volverAEntrar}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {/* El idioma viaja en el formulario: la Server Action que lo recibe no
          puede preguntarlo por su cuenta (no hay `root-params` fuera de un
          Server Component). */}
      <input type="hidden" name="locale" value={locale} />

      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">{t.recuperar.correo}</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t.recuperar.correoPlaceholder}
          className="field"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-ink-rival" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? t.recuperar.enviando : t.recuperar.mandarmeElEnlace}
      </button>

      <Link
        href={localized(locale, '/login')}
        className="self-start text-xs text-chalk-dim underline-offset-4 hover:text-chalk hover:underline"
      >
        {t.recuperar.volverAEntrar}
      </Link>
    </form>
  );
}

export function NewPasswordForm() {
  const { locale, t } = useI18n();
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="locale" value={locale} />

      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">{t.cuentaContrasena.contrasenaNueva}</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={t.cuentaContrasena.contrasenaNuevaPlaceholder}
          className="field"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">{t.cuentaContrasena.repitela}</span>
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
        {pending ? t.cuentaContrasena.guardando : t.cuentaContrasena.guardarYEntrar}
      </button>
    </form>
  );
}
