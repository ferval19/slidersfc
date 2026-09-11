import { redirect } from 'next/navigation';

import { deriveUsername, displayNameFor } from '@/lib/username';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * «Mi perfil». Resuelve la sesión a una URL pública `/u/<username>`.
 *
 * Existe para que el enlace del header no dependa de que la fila de perfil
 * esté ahí: si falta (registro a medias, trigger que no corrió), la crea y
 * sigue. Antes, un usuario con sesión pero sin perfil veía «Entrar» en el
 * header y /login lo devolvía a la portada — sin forma de llegar a ningún
 * sitio.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/perfil');

  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) redirect(`/u/${existing.username}`);

  // Reparación: crea el perfil que falta, desambiguando el username.
  const base = deriveUsername(user);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const username = attempt === 0 ? base : `${base}${attempt}`;

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      username,
      display_name: displayNameFor(user, username),
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    });

    if (!error) redirect(`/u/${username}`);

    // 23505 = unique_violation: el username está cogido, probamos el siguiente.
    if (error.code !== '23505') {
      console.error('[slidersfc] no se pudo crear el perfil:', error);
      redirect(
        `/login?error=${encodeURIComponent('No se ha podido crear tu perfil. Vuelve a intentarlo.')}`,
      );
    }
  }

  redirect(
    `/login?error=${encodeURIComponent('No se ha podido crear tu perfil. Vuelve a intentarlo.')}`,
  );
}
