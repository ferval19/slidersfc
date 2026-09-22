import { unstable_rethrow } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  Game,
  Profile,
  SliderComment,
  SliderDefinition,
  SliderScope,
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

/**
 * ¿Este nombre de usuario es el de antes de alguien? Devuelve el nombre actual.
 *
 * Sirve para que /u/<nombre viejo> y los sets que cuelgan de él no den un 404
 * después de un cambio de nombre: el enlace que alguien compartió en un grupo
 * hace dos meses sigue llevando al sitio.
 */
export async function getUsernameAfterRename(username: string): Promise<string | null> {
  return safeRead(
    'getUsernameAfterRename',
    async (supabase) => {
      const { data } = await supabase
        .from('username_history')
        .select('profiles ( username )')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      const profile = data?.profiles as { username: string } | null | undefined;
      return profile?.username ?? null;
    },
    null,
  );
}

export type VersionEntry = {
  version: number;
  note: string | null;
  createdAt: string;
  changes: { name: string; scope: SliderScope; from: number; to: number }[];
};

/**
 * El historial de un set: qué cambió en cada versión y por qué.
 *
 * Se resuelve el nombre y el ámbito del slider aquí y no en la vista, para
 * que lo que llegue a la página sea legible tal cual. La v1 no aparece: no
 * estrena nada, es el set tal como se publicó.
 */
export async function getSetHistory(setId: string): Promise<VersionEntry[]> {
  return safeRead(
    'getSetHistory',
    async (supabase) => {
      const [versions, changes] = await Promise.all([
        supabase
          .from('slider_set_versions')
          .select('version, note, created_at')
          .eq('slider_set_id', setId)
          .order('version', { ascending: false }),
        supabase
          .from('slider_set_changes')
          .select('version, from_value, to_value, slider_definitions ( name, applies_to, sort_order )')
          .eq('slider_set_id', setId),
      ]);

      type Row = {
        version: number;
        from_value: number;
        to_value: number;
        slider_definitions: {
          name: string;
          applies_to: SliderScope;
          sort_order: number;
        } | null;
      };

      const byVersion = new Map<number, Row[]>();
      for (const row of (changes.data ?? []) as unknown as Row[]) {
        const bucket = byVersion.get(row.version);
        if (bucket) bucket.push(row);
        else byVersion.set(row.version, [row]);
      }

      return (versions.data ?? []).map((version) => ({
        version: version.version,
        note: version.note,
        createdAt: version.created_at,
        changes: (byVersion.get(version.version) ?? [])
          // En el orden del menú del juego, como todo lo demás.
          .sort((a, b) => (a.slider_definitions?.sort_order ?? 0) - (b.slider_definitions?.sort_order ?? 0))
          .filter((row) => row.slider_definitions !== null)
          .map((row) => ({
            name: row.slider_definitions!.name,
            scope: row.slider_definitions!.applies_to,
            from: row.from_value,
            to: row.to_value,
          })),
      }));
    },
    [],
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

/**
 * ¿He guardado yo este set?
 *
 * No devuelve cuánta gente lo ha guardado, y no es un olvido: un número de
 * guardados al lado de un set es una nota, y la hoja de ruta descarta las
 * notas por escrito —canibalizan lo que hace distinta a esta web, que es que
 * expliques por qué 35 y no 42—. La tabla guarda lo necesario para contar el
 * día que se decida lo contrario.
 */
export async function isFavorite(setId: string, userId: string | null): Promise<boolean> {
  if (!userId) return false;

  return safeRead(
    'isFavorite',
    async (supabase) => {
      const { data } = await supabase
        .from('slider_set_favorites')
        .select('user_id')
        .eq('user_id', userId)
        .eq('slider_set_id', setId)
        .maybeSingle();
      return data !== null;
    },
    false,
  );
}

/** Los sets que ha guardado alguien, lo último primero. */
export async function getFavoriteSetsByUser(userId: string): Promise<SetListItem[]> {
  return safeRead(
    'getFavoriteSetsByUser',
    async (supabase) => {
      const { data: favorites } = await supabase
        .from('slider_set_favorites')
        .select('slider_set_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      const ids = (favorites ?? []).map((row) => row.slider_set_id);
      if (ids.length === 0) return [];

      const { data: sets } = await supabase.from('slider_sets').select(SET_LIST_SELECT).in('id', ids);

      // .in() no respeta el orden de los ids, y aquí el orden ES el dato
      // (lo último guardado, primero). RLS puede además esconder algún set
      // que se despublicó entre medias: simplemente vendrá menos de lo pedido.
      const byId = new Map(((sets ?? []) as unknown as SetListItem[]).map((set) => [set.id, set]));
      return ids.map((id) => byId.get(id)).filter((set): set is SetListItem => set !== undefined);
    },
    [],
  );
}

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
