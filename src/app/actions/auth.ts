'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { authErrorMessage } from '@/lib/auth-errors';
import { getSiteOrigin, safeNextPath } from '@/lib/site-url';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AuthFormState = { error?: string; sent?: string };
export type CodeFormState = { error?: string };

/** Magic link por email: sin contraseñas que guardar ni recordar. */
export async function signInWithEmail(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const next = safeNextPath(formData.get('next'));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Escribe un email válido.' };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await getSiteOrigin();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: authErrorMessage(error) };

  return { sent: email };
}

/**
 * Entrar con el código de 6 dígitos del correo.
 *
 * Existe porque un enlace de un solo uso es frágil: los escáneres de correo
 * de Gmail o Outlook lo abren antes que la persona y consumen el token, y con
 * PKCE sólo vale en el navegador que lo pidió. Un código escrito a mano no
 * tiene ninguno de los dos problemas.
 *
 * Requiere que la plantilla del correo incluya {{ .Token }} (ver README).
 */
export async function verifyEmailCode(
  _prevState: CodeFormState,
  formData: FormData,
): Promise<CodeFormState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const token = String(formData.get('token') ?? '').replace(/\D/g, '');
  const next = safeNextPath(formData.get('next'));

  if (!email) return { error: 'Falta el correo al que se envió el código.' };
  if (token.length < 6) return { error: 'El código tiene 6 dígitos.' };

  const supabase = await createSupabaseServerClient();

  // Según si la cuenta ya existía, Supabase espera el tipo `email` o
  // `magiclink`. Probamos los dos antes de dar el error por definitivo.
  let lastError: Parameters<typeof authErrorMessage>[0] = null;

  for (const type of ['email', 'magiclink'] as const) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type });
    if (!error) {
      revalidatePath('/', 'layout');
      redirect(next);
    }
    lastError = error;
  }

  return { error: authErrorMessage(lastError) };
}

export async function signInWithTwitter(formData: FormData) {
  const next = safeNextPath(formData.get('next'));
  const supabase = await createSupabaseServerClient();
  const origin = await getSiteOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    const message = error
      ? authErrorMessage(error)
      : 'No se ha podido iniciar el acceso con X.';
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
