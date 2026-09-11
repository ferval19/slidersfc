'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { isMode } from '@/lib/constants';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { SliderDefinition } from '@/lib/database.types';

export type SetFormState = { error?: string };

const VALUE_PREFIX = 'v_';

type ParsedForm = {
  title: string;
  description: string | null;
  mode: 'carrera' | 'online' | 'amistoso';
  gameId: number;
  publish: boolean;
  values: Map<number, number>;
};

function parseForm(formData: FormData): ParsedForm | { error: string } {
  const title = String(formData.get('title') ?? '').trim();
  if (title.length < 3 || title.length > 120) {
    return { error: 'El título debe tener entre 3 y 120 caracteres.' };
  }

  const rawDescription = String(formData.get('description') ?? '').trim();
  if (rawDescription.length > 2000) {
    return { error: 'La descripción no puede pasar de 2000 caracteres.' };
  }

  const mode = formData.get('mode');
  if (!isMode(mode)) {
    return { error: 'Elige un modo de juego válido.' };
  }

  const gameId = Number(formData.get('game_id'));
  if (!Number.isInteger(gameId) || gameId <= 0) {
    return { error: 'Elige un juego válido.' };
  }

  const values = new Map<number, number>();
  for (const [key, raw] of formData.entries()) {
    if (!key.startsWith(VALUE_PREFIX)) continue;

    const definitionId = Number(key.slice(VALUE_PREFIX.length));
    const value = Number(raw);
    if (!Number.isInteger(definitionId) || !Number.isFinite(value)) continue;

    values.set(definitionId, Math.round(value));
  }

  if (values.size === 0) {
    return { error: 'No se han recibido valores de sliders.' };
  }

  return {
    title,
    description: rawDescription === '' ? null : rawDescription,
    mode,
    gameId,
    publish: formData.get('intent') === 'publish',
    values,
  };
}

/**
 * Comprueba que cada valor corresponde a un slider del juego indicado y que
 * cae dentro de su rango. La base de datos lo valida también (triggers), pero
 * así devolvemos un mensaje legible en lugar de un error de Postgres.
 */
function validateAgainstCatalog(
  values: Map<number, number>,
  definitions: SliderDefinition[],
): string | null {
  const byId = new Map(definitions.map((definition) => [definition.id, definition]));

  for (const [definitionId, value] of values) {
    const definition = byId.get(definitionId);
    if (!definition) {
      return 'Hay un slider que no pertenece al juego seleccionado. Recarga la página.';
    }
    if (value < definition.min_value || value > definition.max_value) {
      return `"${definition.name}" debe estar entre ${definition.min_value} y ${definition.max_value}.`;
    }
  }

  return null;
}

export async function createSet(
  _prevState: SetFormState,
  formData: FormData,
): Promise<SetFormState> {
  const parsed = parseForm(formData);
  if ('error' in parsed) return parsed;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Tienes que iniciar sesión para crear un set.' };

  const { data: definitions } = await supabase
    .from('slider_definitions')
    .select('*')
    .eq('game_id', parsed.gameId);

  const catalogError = validateAgainstCatalog(parsed.values, definitions ?? []);
  if (catalogError) return { error: catalogError };

  const { data: set, error: setError } = await supabase
    .from('slider_sets')
    .insert({
      owner_id: user.id,
      game_id: parsed.gameId,
      title: parsed.title,
      description: parsed.description,
      mode: parsed.mode,
      is_published: parsed.publish,
    })
    .select('id')
    .single();

  if (setError || !set) {
    return { error: setError?.message ?? 'No se ha podido crear el set.' };
  }

  const { error: valuesError } = await supabase.from('slider_set_values').insert(
    [...parsed.values].map(([slider_definition_id, value]) => ({
      slider_set_id: set.id,
      slider_definition_id,
      value,
    })),
  );

  if (valuesError) {
    // Sin valores el set no sirve de nada: lo deshacemos para no dejar basura.
    await supabase.from('slider_sets').delete().eq('id', set.id);
    return { error: valuesError.message };
  }

  revalidatePath('/');
  redirect(`/sets/${set.id}`);
}

export async function updateSet(
  setId: string,
  _prevState: SetFormState,
  formData: FormData,
): Promise<SetFormState> {
  const parsed = parseForm(formData);
  if ('error' in parsed) return parsed;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Tienes que iniciar sesión.' };

  const { data: existing } = await supabase
    .from('slider_sets')
    .select('id, owner_id, game_id, version, is_published')
    .eq('id', setId)
    .maybeSingle();

  if (!existing) return { error: 'Este set ya no existe.' };
  if (existing.owner_id !== user.id) return { error: 'Sólo el autor puede editar este set.' };
  if (existing.game_id !== parsed.gameId) {
    return { error: 'No se puede cambiar el juego de un set ya creado.' };
  }

  const { data: definitions } = await supabase
    .from('slider_definitions')
    .select('*')
    .eq('game_id', parsed.gameId);

  const catalogError = validateAgainstCatalog(parsed.values, definitions ?? []);
  if (catalogError) return { error: catalogError };

  // ¿Han cambiado los valores? Si el set ya estaba publicado, eso sube la
  // versión: los comentarios antiguos quedan marcados como "de la vN".
  const { data: currentValues } = await supabase
    .from('slider_set_values')
    .select('slider_definition_id, value')
    .eq('slider_set_id', setId);

  const current = new Map((currentValues ?? []).map((row) => [row.slider_definition_id, row.value]));
  const valuesChanged =
    current.size !== parsed.values.size ||
    [...parsed.values].some(([id, value]) => current.get(id) !== value);

  const nextVersion =
    valuesChanged && existing.is_published ? existing.version + 1 : existing.version;

  const { error: updateError } = await supabase
    .from('slider_sets')
    .update({
      title: parsed.title,
      description: parsed.description,
      mode: parsed.mode,
      is_published: parsed.publish || existing.is_published,
      version: nextVersion,
    })
    .eq('id', setId);

  if (updateError) return { error: updateError.message };

  if (valuesChanged) {
    const { error: valuesError } = await supabase.from('slider_set_values').upsert(
      [...parsed.values].map(([slider_definition_id, value]) => ({
        slider_set_id: setId,
        slider_definition_id,
        value,
      })),
      { onConflict: 'slider_set_id,slider_definition_id' },
    );

    if (valuesError) return { error: valuesError.message };
  }

  revalidatePath(`/sets/${setId}`);
  revalidatePath('/');
  redirect(`/sets/${setId}`);
}

export async function publishSet(setId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('slider_sets')
    .update({ is_published: true })
    .eq('id', setId);

  if (error) throw new Error(error.message);

  revalidatePath(`/sets/${setId}`);
  revalidatePath('/');
}

export async function unpublishSet(setId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('slider_sets')
    .update({ is_published: false })
    .eq('id', setId);

  if (error) throw new Error(error.message);

  revalidatePath(`/sets/${setId}`);
  revalidatePath('/');
}

export async function deleteSet(setId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('slider_sets').delete().eq('id', setId);
  if (error) throw new Error(error.message);

  revalidatePath('/');

  const { data: profile } = user
    ? await supabase.from('profiles').select('username').eq('id', user.id).maybeSingle()
    : { data: null };

  redirect(profile ? `/u/${profile.username}` : '/');
}
