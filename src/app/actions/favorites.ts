'use server';

import { revalidatePath } from 'next/cache';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export type FavoriteResult = { ok?: boolean; error?: string };

/** Idempotente a propósito: se pide el estado que quieres, no un cambio. */
export async function setFavorite(
  setId: string,
  favorite: boolean,
  pathname: string,
): Promise<FavoriteResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Tienes que iniciar sesión para guardar sets.' };

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
