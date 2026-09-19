'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { AVATAR_BUCKET, avatarFolder, avatarPublicPrefix } from '@/lib/avatar-storage';
import { profilePath } from '@/lib/paths';
import { validateProfile } from '@/lib/profile';
import { supabaseEnv } from '@/lib/supabase/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ProfileFormState = { error?: string };

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/cuenta/perfil');

  // Se relee el perfil en vez de fiarse del formulario: la foto que ya estaba
  // guardada puede ser externa (la de X) y tiene que poder pasar tal cual.
  const { data: current } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  const parsed = validateProfile(
    {
      username: String(formData.get('username') ?? ''),
      displayName: String(formData.get('display_name') ?? ''),
      bio: String(formData.get('bio') ?? ''),
      twitterHandle: String(formData.get('twitter_handle') ?? ''),
      youtubeUrl: String(formData.get('youtube_url') ?? ''),
      avatarUrl: String(formData.get('avatar_url') ?? ''),
    },
    {
      avatarPrefix: avatarPublicPrefix(supabaseEnv().url),
      currentAvatarUrl: current?.avatar_url ?? null,
    },
  );

  if ('error' in parsed) return { error: parsed.error };

  const { fields } = parsed;

  const { error } = await supabase.from('profiles').update(fields).eq('id', user.id);

  if (error) {
    // 23505 = unique_violation. Es el único error que la persona puede
    // arreglar por su cuenta, así que se explica; el resto se registra.
    if (error.code === '23505') {
      return { error: `«${fields.username}» ya está cogido. Prueba con otro.` };
    }
    console.error('[slidersfc] updateProfile falló:', error);
    return { error: 'No se ha podido guardar el perfil. Vuelve a intentarlo.' };
  }

  await removeOldAvatars(supabase, user.id, fields.avatar_url);

  // El nombre y la foto salen en la cabecera y en todas las fichas de sets.
  revalidatePath('/', 'layout');

  redirect(profilePath(fields.username));
}

/**
 * Borra las fotos anteriores del usuario. Va después de guardar y nunca hace
 * fallar la operación: si se queda un fichero suelto, no se ve en ningún sitio
 * y ocupa unos kilobytes; perder el perfil guardado por un borrado sí se nota.
 */
async function removeOldAvatars(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  keep: string | null,
) {
  try {
    const folder = avatarFolder(userId);
    const { data: files } = await supabase.storage.from(AVATAR_BUCKET).list(folder);
    if (!files?.length) return;

    const stale = files
      .map((file) => `${folder}/${file.name}`)
      .filter((path) => !keep?.endsWith(`/${path}`));

    if (stale.length > 0) await supabase.storage.from(AVATAR_BUCKET).remove(stale);
  } catch (error) {
    console.error('[slidersfc] no se pudieron borrar los avatares antiguos:', error);
  }
}
