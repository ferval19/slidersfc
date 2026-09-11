import { unstable_rethrow } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  Game,
  Profile,
  SliderComment,
  SliderDefinition,
  SliderSet,
} from '@/lib/database.types';

export type SetListItem = SliderSet & {
  games: Pick<Game, 'slug' | 'name'> | null;
  profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null;
  comment_count: { count: number }[];
};

/**
 * Las lecturas públicas no deben tumbar la página si Supabase no responde
 * (outage, proyecto pausado, variables sin rellenar en un deploy nuevo).
 * La página se queda vacía y el error queda en el log del servidor.
 *
 * El cliente se crea DENTRO del try a propósito: crearlo ya lanza si faltan
 * las variables de entorno.
 */
async function safeRead<T>(
  label: string,
  read: (supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    const supabase = await createSupabaseServerClient();
    return await read(supabase);
  } catch (error) {
    // Next usa excepciones para señalar redirect(), notFound() y el paso a
    // render dinámico. Si nos las tragamos, el framework se rompe en silencio.
    unstable_rethrow(error);
    console.error(`[slidersfc] ${label} falló:`, error);
    return fallback;
  }
}

const SET_LIST_SELECT = `
  *,
  games ( slug, name ),
  profiles ( username, display_name, avatar_url ),
  comment_count:slider_comments ( count )
`;

export async function getGames(): Promise<Game[]> {
  return safeRead(
    'getGames',
    async (supabase) => {
      const { data } = await supabase
        .from('games')
        .select('*')
        .order('release_year', { ascending: false });
      return data ?? [];
    },
    [],
  );
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  return safeRead(
    'getGameBySlug',
    async (supabase) => {
      const { data } = await supabase.from('games').select('*').eq('slug', slug).maybeSingle();
      return data ?? null;
    },
    null,
  );
}

/** Feed público. `gameSlug` es un filtro opcional. */
export async function getPublishedSets(
  options: { gameSlug?: string; limit?: number } = {},
): Promise<SetListItem[]> {
  const game = options.gameSlug ? await getGameBySlug(options.gameSlug) : null;
  if (options.gameSlug && !game) return [];

  return safeRead(
    'getPublishedSets',
    async (supabase) => {
      let query = supabase
        .from('slider_sets')
        .select(SET_LIST_SELECT)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(options.limit ?? 30);

      if (game) query = query.eq('game_id', game.id);

      const { data } = await query;
      return (data ?? []) as unknown as SetListItem[];
    },
    [],
  );
}

/** Sets de un usuario. RLS ya oculta los borradores a terceros. */
export async function getSetsByOwner(ownerId: string): Promise<SetListItem[]> {
  return safeRead(
    'getSetsByOwner',
    async (supabase) => {
      const { data } = await supabase
        .from('slider_sets')
        .select(SET_LIST_SELECT)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      return (data ?? []) as unknown as SetListItem[];
    },
    [],
  );
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  return safeRead(
    'getProfileByUsername',
    async (supabase) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .maybeSingle();
      return data ?? null;
    },
    null,
  );
}

export type SetDetail = {
  set: SliderSet;
  game: Game;
  owner: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'twitter_handle'>;
  definitions: SliderDefinition[];
  values: Map<number, number>;
  comments: (SliderComment & {
    profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null;
  })[];
};

const SET_DETAIL_SELECT = `
  *,
  games ( * ),
  profiles!inner ( id, username, display_name, avatar_url, twitter_handle )
`;

/**
 * Todo lo que necesita la página de detalle de un set, en una sola función.
 * Se puede pedir por id (enlaces antiguos) o por usuario + slug (los de
 * ahora). Devuelve null si el set no existe o RLS no deja verlo.
 */
export async function getSetDetail(
  locator: { id: string } | { username: string; slug: string },
): Promise<SetDetail | null> {
  return safeRead(
    'getSetDetail',
    async (supabase) => {
      const query = supabase.from('slider_sets').select(SET_DETAIL_SELECT);

      const { data: set } =
        'id' in locator
          ? await query.eq('id', locator.id).maybeSingle()
          : await query
              .eq('slug', locator.slug)
              .eq('profiles.username', locator.username.toLowerCase())
              .maybeSingle();

      if (!set) return null;

      const row = set as unknown as SliderSet & {
        games: Game | null;
        profiles: SetDetail['owner'] | null;
      };

      if (!row.games || !row.profiles) return null;

      const setId = row.id;

      const [definitionsResult, valuesResult, commentsResult] = await Promise.all([
        supabase
          .from('slider_definitions')
          .select('*')
          .eq('game_id', row.game_id)
          .order('sort_order')
          .order('applies_to'),
        supabase.from('slider_set_values').select('*').eq('slider_set_id', setId),
        supabase
          .from('slider_comments')
          .select('*, profiles ( username, display_name, avatar_url )')
          .eq('slider_set_id', setId)
          .order('created_at', { ascending: true }),
      ]);

      const values = new Map<number, number>();
      for (const value of valuesResult.data ?? []) {
        values.set(value.slider_definition_id, value.value);
      }

      return {
        set: row,
        game: row.games,
        owner: row.profiles,
        definitions: definitionsResult.data ?? [],
        values,
        comments: (commentsResult.data ?? []) as unknown as SetDetail['comments'],
      };
    },
    null,
  );
}

/** Definiciones de sliders de un juego. */
export async function getDefinitionsForGame(gameId: number): Promise<SliderDefinition[]> {
  return safeRead(
    'getDefinitionsForGame',
    async (supabase) => {
      const { data } = await supabase
        .from('slider_definitions')
        .select('*')
        .eq('game_id', gameId)
        .order('sort_order')
        .order('applies_to');
      return data ?? [];
    },
    [],
  );
}

/** Todas las definiciones, agrupadas por game_id, para el formulario. */
export async function getDefinitionsByGame(): Promise<Record<string, SliderDefinition[]>> {
  return safeRead(
    'getDefinitionsByGame',
    async (supabase) => {
      const { data } = await supabase
        .from('slider_definitions')
        .select('*')
        .order('sort_order')
        .order('applies_to');

      const grouped: Record<string, SliderDefinition[]> = {};
      for (const definition of data ?? []) {
        (grouped[String(definition.game_id)] ??= []).push(definition);
      }
      return grouped;
    },
    {},
  );
}

/**
 * Agrupa definiciones por categoría y, dentro de cada categoría, por slider
 * (slug), de modo que la UI pueda pintar una fila por slider con una columna
 * por ámbito (Usuario / CPU rival / CPU compañero).
 */
export type GroupedSlider = {
  slug: string;
  name: string;
  scopes: SliderDefinition[];
};

export function groupDefinitions(definitions: SliderDefinition[]) {
  const byCategory = new Map<string, Map<string, GroupedSlider>>();

  for (const definition of definitions) {
    if (!byCategory.has(definition.category)) {
      byCategory.set(definition.category, new Map());
    }
    const sliders = byCategory.get(definition.category)!;

    if (!sliders.has(definition.slug)) {
      sliders.set(definition.slug, {
        slug: definition.slug,
        name: definition.name,
        scopes: [],
      });
    }
    sliders.get(definition.slug)!.scopes.push(definition);
  }

  return byCategory;
}
