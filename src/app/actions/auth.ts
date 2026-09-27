'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { authErrorMessage } from '@/lib/auth-errors';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from '@/lib/i18n/locale';
import { getSiteOrigin, safeNextPath } from '@/lib/site-url';
import { isProviderEnabled } from '@/lib/supabase/providers';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AuthFormState = { error?: string; sent?: string };
export type CodeFormState = { error?: string };

/**
 * Una Server Action no es un Server Component: no puede llamar a
 * `next/root-params` para saber en qué idioma está quien la ha llamado. Así
 * que el idioma viaja en el propio formulario, con un `<input type="hidden"
 * name="locale">` puesto por el componente de cliente que lo envía — es
 * explícito, y no depende de cabeceras que un proxy o un CDN podrían no
 * conservar igual.
 */
function localeFromFormData(formData: FormData): Locale {
  const value = String(formData.get('locale') ?? '');
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Magic link por email: sin contraseñas que guardar ni recordar. */
export async function signInWithEmail(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFromFormData(formData);
  const t = getDictionary(locale).auth;
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const next = safeNextPath(formData.get('next'));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: t.escribeUnEmailValido };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await getSiteOrigin();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: authErrorMessage(error, locale) };

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
  const locale = localeFromFormData(formData);
  const t = getDictionary(locale).auth;
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const token = String(formData.get('token') ?? '').replace(/\D/g, '');
  const next = safeNextPath(formData.get('next'));

  if (!email) return { error: t.faltaElCorreoDelCodigo };
  if (token.length < 6) return { error: t.elCodigoTieneSeisDigitos };

  const supabase = await createSupabaseServerClient();

  // El tipo depende de cómo se pidió el código: `magiclink` si la cuenta ya
  // existía, `signup` si es una cuenta nueva sin confirmar, `email` en el
  // resto. Probamos los tres antes de dar el error por definitivo.
  let lastError: Parameters<typeof authErrorMessage>[0] = null;

  for (const type of ['email', 'magiclink', 'signup'] as const) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type });
    if (!error) {
      revalidatePath('/', 'layout');
      redirect(localePath(locale, next));
    }
    lastError = error;
  }

  return { error: authErrorMessage(lastError, locale) };
}

export async function signInWithTwitter(formData: FormData) {
  const locale = localeFromFormData(formData);
  const t = getDictionary(locale).auth;
  const next = safeNextPath(formData.get('next'));

  // Se comprueba antes de salir del sitio: con el proveedor desactivado,
  // Supabase responde un 400 crudo y la persona se queda sin vuelta atrás.
  if (!(await isProviderEnabled('twitter'))) {
    redirect(
      localePath(
        locale,
        `/login?error=${encodeURIComponent(t.xNoActivadoTodavia)}&next=${encodeURIComponent(next)}`,
      ),
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
    const message = error ? authErrorMessage(error, locale) : t.xNoSeHaPodidoIniciar;
    redirect(localePath(locale, `/login?error=${encodeURIComponent(message)}`));
  }

  // `data.url` es el dominio de X, no una ruta interna: no lleva prefijo de
  // idioma.
  redirect(data.url);
}

export async function signOut(locale: Locale = DEFAULT_LOCALE) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect(localePath(locale, '/'));
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

function readCredentials(formData: FormData, t: ReturnType<typeof getDictionary>['auth']) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: t.escribeUnEmailValido };
  }

  if (password.length < MIN_PASSWORD) {
    return { error: t.contrasenaMinimo(MIN_PASSWORD) };
  }

  return { email, password };
}

export async function signInWithPassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFromFormData(formData);
  const t = getDictionary(locale).auth;
  const credentials = readCredentials(formData, t);
  if ('error' in credentials) return credentials;

  const next = safeNextPath(formData.get('next'));
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) return { error: authErrorMessage(error, locale) };

  revalidatePath('/', 'layout');
  redirect(localePath(locale, next));
}

export async function signUpWithPassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFromFormData(formData);
  const t = getDictionary(locale).auth;
  const credentials = readCredentials(formData, t);
  if ('error' in credentials) return credentials;

  if (String(formData.get('password')) !== String(formData.get('password_confirm'))) {
    return { error: t.lasDosContrasenasNoCoinciden };
  }

  const next = safeNextPath(formData.get('next'));
  const supabase = await createSupabaseServerClient();
  const origin = await getSiteOrigin();

  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}` },
  });

  if (error) return { error: authErrorMessage(error, locale) };

  // Con «Confirm email» activado, Supabase no devuelve sesión: hay que
  // confirmar el correo antes. Sin él, la cuenta queda lista y se entra.
  if (!data.session) return { sent: credentials.email };

  revalidatePath('/', 'layout');
  redirect(localePath(locale, next));
}

export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFromFormData(formData);
  const t = getDictionary(locale).auth;
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: t.escribeUnEmailValido };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await getSiteOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent('/cuenta/contrasena')}`,
  });

  if (error) return { error: authErrorMessage(error, locale) };

  return { sent: email };
}

/** Cambiar la contraseña. Requiere sesión: la crea el enlace de recuperación. */
export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFromFormData(formData);
  const t = getDictionary(locale).auth;
  const password = String(formData.get('password') ?? '');

  if (password.length < MIN_PASSWORD) {
    return { error: t.contrasenaMinimo(MIN_PASSWORD) };
  }

  if (password !== String(formData.get('password_confirm'))) {
    return { error: t.lasDosContrasenasNoCoinciden };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error, locale) };

  revalidatePath('/', 'layout');
  redirect(localePath(locale, '/perfil'));
}
