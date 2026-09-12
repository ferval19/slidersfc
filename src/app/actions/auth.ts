'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { authErrorMessage } from '@/lib/auth-errors';
import { getSiteOrigin, safeNextPath } from '@/lib/site-url';
import { isProviderEnabled } from '@/lib/supabase/providers';
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

  // El tipo depende de cómo se pidió el código: `magiclink` si la cuenta ya
  // existía, `signup` si es una cuenta nueva sin confirmar, `email` en el
  // resto. Probamos los tres antes de dar el error por definitivo.
  let lastError: Parameters<typeof authErrorMessage>[0] = null;

  for (const type of ['email', 'magiclink', 'signup'] as const) {
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

  // Se comprueba antes de salir del sitio: con el proveedor desactivado,
  // Supabase responde un 400 crudo y la persona se queda sin vuelta atrás.
  if (!(await isProviderEnabled('twitter'))) {
    redirect(
      `/login?error=${encodeURIComponent(
        'El acceso con X no está activado todavía. Entra con tu correo mientras tanto.',
      )}&next=${encodeURIComponent(next)}`,
    );
  }

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

// ---------------------------------------------------------------------------
// Correo y contraseña
//
// Es el camino que no depende del correo: con «Confirm email» desactivado en
// Supabase, crear la cuenta y entrar no manda ni un mensaje. El enlace mágico
// se queda como alternativa, y el correo sólo hace falta para recuperar una
// contraseña olvidada.
// ---------------------------------------------------------------------------

const MIN_PASSWORD = 8;

function readCredentials(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Escribe un email válido.' as const };
  }

  if (password.length < MIN_PASSWORD) {
    return { error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` as const };
  }

  return { email, password };
}

export async function signInWithPassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  if ('error' in credentials) return credentials;

  const next = safeNextPath(formData.get('next'));
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) return { error: authErrorMessage(error) };

  revalidatePath('/', 'layout');
  redirect(next);
}

export async function signUpWithPassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  if ('error' in credentials) return credentials;

  if (String(formData.get('password')) !== String(formData.get('password_confirm'))) {
    return { error: 'Las dos contraseñas no coinciden.' };
  }

  const next = safeNextPath(formData.get('next'));
  const supabase = await createSupabaseServerClient();
  const origin = await getSiteOrigin();

  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}` },
  });

  if (error) return { error: authErrorMessage(error) };

  // Con «Confirm email» activado, Supabase no devuelve sesión: hay que
  // confirmar el correo antes. Sin él, la cuenta queda lista y se entra.
  if (!data.session) return { sent: credentials.email };

  revalidatePath('/', 'layout');
  redirect(next);
}

export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Escribe un email válido.' };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await getSiteOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent('/cuenta/contrasena')}`,
  });

  if (error) return { error: authErrorMessage(error) };

  return { sent: email };
}

/** Cambiar la contraseña. Requiere sesión: la crea el enlace de recuperación. */
export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = String(formData.get('password') ?? '');

  if (password.length < MIN_PASSWORD) {
    return { error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` };
  }

  if (password !== String(formData.get('password_confirm'))) {
    return { error: 'Las dos contraseñas no coinciden.' };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error) };

  revalidatePath('/', 'layout');
  redirect('/perfil');
}
