import { sortScopes } from '@/lib/constants';
import { groupDefinitions, type SetDetail } from '@/lib/queries';
import type { SliderScope } from '@/lib/database.types';

/**
 * Convierte el detalle de un set (con Maps y filas de Postgres) en una
 * estructura plana y serializable que se pueda pasar a Client Components.
 */

export type CellView = {
  definitionId: number;
  scope: SliderScope;
  value: number | null;
  commentCount: number;
};

export type SliderRowView = {
  slug: string;
  name: string;
  cells: CellView[];
};

export type CategoryBlockView = {
  category: string;
  rows: SliderRowView[];
};

export type CommentView = {
  id: string;
  body: string;
  createdAt: string;
  setVersion: number;
  isStale: boolean;
  isMine: boolean;
  author: {
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type SetView = {
  scopes: SliderScope[];
  blocks: CategoryBlockView[];
  commentsByDefinition: Record<string, CommentView[]>;
  generalComments: CommentView[];
  totalComments: number;
};

export const GENERAL_KEY = 'general';

export function buildSetView(detail: SetDetail, currentUserId: string | null): SetView {
  const { definitions, values, comments, set } = detail;

  const scopes = sortScopes([
    ...new Set(definitions.map((definition) => definition.applies_to)),
  ]);

  const commentsByDefinition: Record<string, CommentView[]> = {};
  const generalComments: CommentView[] = [];

  for (const comment of comments) {
    const view: CommentView = {
      id: comment.id,
      body: comment.body,
      createdAt: comment.created_at,
      setVersion: comment.set_version,
      isStale: comment.set_version < set.version,
      isMine: currentUserId !== null && comment.author_id === currentUserId,
      author: {
        username: comment.profiles?.username ?? null,
        displayName: comment.profiles?.display_name ?? null,
        avatarUrl: comment.profiles?.avatar_url ?? null,
      },
    };

    if (comment.slider_definition_id === null) {
      generalComments.push(view);
    } else {
      const key = String(comment.slider_definition_id);
      (commentsByDefinition[key] ??= []).push(view);
    }
  }

  const grouped = groupDefinitions(definitions);

  // El orden de las categorías sale del `sort_order` del catálogo, que es el
  // del menú del juego: la gente va metiendo los valores mientras consulta.
  const blocks: CategoryBlockView[] = orderCategories(definitions, [...grouped.keys()]).map((category) => {
    const sliders = grouped.get(category)!;

    const rows: SliderRowView[] = [...sliders.values()].map((slider) => {
      const byScope = new Map(slider.scopes.map((definition) => [definition.applies_to, definition]));

      const cells: CellView[] = scopes.map((scope) => {
        const definition = byScope.get(scope);
        if (!definition) {
          return { definitionId: -1, scope, value: null, commentCount: 0 };
        }
        return {
          definitionId: definition.id,
          scope,
          value: values.get(definition.id) ?? null,
          commentCount: commentsByDefinition[String(definition.id)]?.length ?? 0,
        };
      });

      return { slug: slider.slug, name: slider.name, cells };
    });

    return { category, rows };
  });

  return {
    scopes,
    blocks,
    commentsByDefinition,
    generalComments,
    totalComments: comments.length,
  };
}

/**
 * Ordena las categorías por el `sort_order` más bajo de sus sliders, que es
 * como están en el menú del juego. Antes había una lista fija repetida en la
 * aplicación, que podía desviarse del catálogo sin que se notara.
 */
export function orderCategories(
  definitions: { category: string; sort_order: number }[],
  categories: string[],
) {
  const first = new Map<string, number>();

  for (const definition of definitions) {
    const current = first.get(definition.category);
    if (current === undefined || definition.sort_order < current) {
      first.set(definition.category, definition.sort_order);
    }
  }

  return [...categories].sort(
    (a, b) => (first.get(a) ?? Number.MAX_SAFE_INTEGER) - (first.get(b) ?? Number.MAX_SAFE_INTEGER),
  );
}
