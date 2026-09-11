'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { getSiteOrigin, safeNextPath } from '@/lib/site-url';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AuthFormState = { error?: string; sent?: string };

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

  if (error) return { error: error.message };

  return { sent: email };
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
    redirect(`/login?error=${encodeURIComponent(error?.message ?? 'No se ha podido iniciar el login con X.')}`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
