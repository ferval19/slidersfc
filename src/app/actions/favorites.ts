'use server';

import { revalidatePath } from 'next/cache';

import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type FavoriteResult = { ok?: boolean; error?: string };

/**
 * Idempotente a propósito: se pide el estado que quieres, no un cambio.
 *
 * No es una Server Action de `<form>`, así que el idioma llega como
 * argumento — igual que `signOut` en `app/actions/auth.ts`.
 */
export async function setFavorite(
  setId: string,
  favorite: boolean,
  pathname: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<FavoriteResult> {
  const t = getDictionary(locale).favoritoErrores;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: t.iniciarSesion };

  if (favorite) {
    const { error } = await supabase
      .from('slider_set_favorites')
      .insert({ slider_set_id: setId, user_id: user.id });

    // Clave duplicada: ya estaba guardado, así que el resultado que pedía
    // quien llamó ya es cierto.
    if (error && error.code !== '23505') return { error: error.message };
  } else {
    const { error } = await supabase
      .from('slider_set_favorites')
      .delete()
      .eq('slider_set_id', setId)
      .eq('user_id', user.id);

    if (error) return { error: error.message };
  }

  revalidatePath(pathname);
  return { ok: true };
}
