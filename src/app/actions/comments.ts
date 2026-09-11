'use server';

import { revalidatePath } from 'next/cache';

import { setPath } from '@/lib/paths';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type CommentFormState = { error?: string; ok?: boolean };

/**
 * Publica un comentario. `slider_definition_id` vacío = comentario general
 * al set; con valor = comentario anclado a ese slider concreto.
 */
export async function postComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const setId = String(formData.get('slider_set_id') ?? '');
  const body = String(formData.get('body') ?? '').trim();
  const rawDefinition = String(formData.get('slider_definition_id') ?? '');

  if (!setId) return { error: 'Falta el set al que comentar.' };
  if (body.length === 0) return { error: 'Escribe algo antes de enviar.' };
  if (body.length > 2000) return { error: 'El comentario no puede pasar de 2000 caracteres.' };

  const definitionId = rawDefinition === '' ? null : Number(rawDefinition);
  if (definitionId !== null && !Number.isInteger(definitionId)) {
    return { error: 'Slider no válido.' };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Tienes que iniciar sesión para comentar.' };

  // Guardamos la versión del set vigente, para poder marcar después los
  // comentarios que hablaban de valores ya cambiados.
  const { data: set } = await supabase
    .from('slider_sets')
    .select('version, slug, profiles!inner ( username )')
    .eq('id', setId)
    .maybeSingle();

  if (!set) return { error: 'Este set ya no existe.' };

  const target = set as unknown as { version: number; slug: string; profiles: { username: string } };

  const { error } = await supabase.from('slider_comments').insert({
    slider_set_id: setId,
    slider_definition_id: definitionId,
    author_id: user.id,
    body,
    set_version: target.version,
  });

  if (error) return { error: error.message };

  revalidatePath(setPath(target.profiles.username, target.slug));
  return { ok: true };
}

export async function deleteComment(commentId: string, setPathname: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('slider_comments').delete().eq('id', commentId);

  if (error) throw new Error(error.message);

  revalidatePath(setPathname);
}
