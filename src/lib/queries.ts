import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  Game,
  Profile,
  SetMode,
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
 * (outage, proyecto pausado, variables mal puestas en un deploy nuevo).
 * El feed se queda vacío y se registra el error en el log del servidor.
 */
async function safeRead<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error(`[sliderxi] ${label} falló:`, error);
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
    async () => {
      const supabase = await createSupabaseServerClient();
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
    async () => {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.from('games').select('*').eq('slug', slug).maybeSingle();
      return data ?? null;
    },
    null,
  );
}

/** Feed público. `gameSlug` y `mode` son filtros opcionales. */
export async function getPublishedSets(options: {
  gameSlug?: string;
  mode?: SetMode;
  limit?: number;
} = {}): Promise<SetListItem[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from('slider_sets')
    .select(SET_LIST_SELECT)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(options.limit ?? 30);

  if (options.gameSlug) {
    const game = await getGameBySlug(options.gameSlug);
    if (!game) return [];
    query = query.eq('game_id', game.id);
  }

  if (options.mode) {
    query = query.eq('mode', options.mode);
  }

  return safeRead(
    'getPublishedSets',
    async () => {
      const { data } = await query;
      return (data ?? []) as unknown as SetListItem[];
    },
    [],
  );
}

/** Sets de un usuario. RLS ya oculta los borradores a terceros. */
export async function getSetsByOwner(ownerId: string): Promise<SetListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('slider_sets')
    .select(SET_LIST_SELECT)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  return (data ?? []) as unknown as SetListItem[];
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .maybeSingle();
  return data ?? null;
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

/**
 * Todo lo que necesita la página de detalle de un set, en una sola función.
 * Devuelve null si el set no existe o RLS no deja verlo.
 */
export async function getSetDetail(setId: string): Promise<SetDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data: set } = await supabase
    .from('slider_sets')
    .select(
      `*,
       games ( * ),
       profiles ( id, username, display_name, avatar_url, twitter_handle )`,
    )
    .eq('id', setId)
    .maybeSingle();

  if (!set) return null;

  const row = set as unknown as SliderSet & {
    games: Game | null;
    profiles: SetDetail['owner'] | null;
  };

  if (!row.games || !row.profiles) return null;

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
}

/** Definiciones de sliders de un juego, para el formulario de creación. */
export async function getDefinitionsForGame(gameId: number): Promise<SliderDefinition[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('slider_definitions')
    .select('*')
    .eq('game_id', gameId)
    .order('sort_order')
    .order('applies_to');
  return data ?? [];
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

/** Todas las definiciones, agrupadas por game_id, para el formulario. */
export async function getDefinitionsByGame(): Promise<Record<string, SliderDefinition[]>> {
  const supabase = await createSupabaseServerClient();
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
}
