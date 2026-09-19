'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { planCopy } from '@/lib/game-migration';
import { editSetPath, setPath } from '@/lib/paths';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { SliderDefinition } from '@/lib/database.types';

export type SetFormState = { error?: string };

const VALUE_PREFIX = 'v_';

type ParsedForm = {
  title: string;
  description: string | null;
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
      is_published: parsed.publish,
    })
    .select('id, slug, profiles!inner ( username )')
    .single();

  if (setError || !set) {
    return { error: setError?.message ?? 'No se ha podido crear el set.' };
  }

  const created = set as unknown as { id: string; slug: string; profiles: { username: string } };

  const { error: valuesError } = await supabase.from('slider_set_values').insert(
    [...parsed.values].map(([slider_definition_id, value]) => ({
      slider_set_id: created.id,
      slider_definition_id,
      value,
    })),
  );

  if (valuesError) {
    // Sin valores el set no sirve de nada: lo deshacemos para no dejar basura.
    await supabase.from('slider_sets').delete().eq('id', created.id);
    return { error: valuesError.message };
  }

  const path = setPath(created.profiles.username, created.slug);
  revalidatePath('/');
  revalidatePath(path);
  redirect(path);
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
    .select('id, owner_id, game_id, version, is_published, slug, profiles!inner ( username )')
    .eq('id', setId)
    .maybeSingle();

  if (!existing) return { error: 'Este set ya no existe.' };

  const target = existing as unknown as typeof existing & { slug: string; profiles: { username: string } };
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

  const path = setPath(target.profiles.username, target.slug);
  revalidatePath(path);
  revalidatePath('/');
  redirect(path);
}

async function setPublished(setId: string, isPublished: boolean) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('slider_sets')
    .update({ is_published: isPublished })
    .eq('id', setId)
    .select('slug, profiles!inner ( username )')
    .single();

  if (error) throw new Error(error.message);

  const updated = data as unknown as { slug: string; profiles: { username: string } };

  revalidatePath(setPath(updated.profiles.username, updated.slug));
  revalidatePath('/');
}

export async function publishSet(setId: string) {
  await setPublished(setId, true);
}

export async function unpublishSet(setId: string) {
  await setPublished(setId, false);
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

/**
 * Copia un set a otro juego: al salir una versión nueva, nadie quiere volver a
 * meter treinta valores a mano.
 *
 * Crea un BORRADOR y lleva a editarlo. Lo que no existe en el juego destino se
 * queda fuera, y lo que el destino tiene de más arranca con lo que trae el
 * juego de fábrica. Nada se publica sin que el autor lo vea.
 */
export async function copySetToGame(setId: string, targetGameSlug: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: source } = await supabase
    .from('slider_sets')
    .select('id, owner_id, title, description, game_id')
    .eq('id', setId)
    .maybeSingle();

  if (!source) throw new Error('Este set ya no existe.');
  if (source.owner_id !== user.id) throw new Error('Sólo el autor puede copiar su set.');

  const { data: targetGame } = await supabase
    .from('games')
    .select('id, name')
    .eq('slug', targetGameSlug)
    .maybeSingle();

  if (!targetGame) throw new Error('Ese juego no existe.');
  if (targetGame.id === source.game_id) throw new Error('El set ya es de ese juego.');

  const [{ data: values }, { data: targetDefinitions }] = await Promise.all([
    supabase
      .from('slider_set_values')
      .select('value, slider_definitions!inner (*)')
      .eq('slider_set_id', setId),
    supabase.from('slider_definitions').select('*').eq('game_id', targetGame.id),
  ]);

  const plan = planCopy(
    ((values ?? []) as unknown as { value: number; slider_definitions: SliderDefinition }[]).map(
      (row) => ({ definition: row.slider_definitions, value: row.value }),
    ),
    targetDefinitions ?? [],
  );

  if (plan.values.size === 0) {
    throw new Error('Ningún valor de este set encaja en ese juego.');
  }

  const { data: created, error: createError } = await supabase
    .from('slider_sets')
    .insert({
      owner_id: user.id,
      game_id: targetGame.id,
      title: `${source.title} (${targetGame.name})`,
      description: source.description,
      is_published: false,
    })
    .select('id, slug, profiles!inner ( username )')
    .single();

  if (createError || !created) {
    throw new Error(createError?.message ?? 'No se ha podido crear la copia.');
  }

  const copy = created as unknown as { id: string; slug: string; profiles: { username: string } };

  const { error: valuesError } = await supabase.from('slider_set_values').insert(
    [...plan.values].map(([slider_definition_id, value]) => ({
      slider_set_id: copy.id,
      slider_definition_id,
      value,
    })),
  );

  if (valuesError) {
    await supabase.from('slider_sets').delete().eq('id', copy.id);
    throw new Error(valuesError.message);
  }

  revalidatePath('/');
  redirect(editSetPath(copy.profiles.username, copy.slug));
}
