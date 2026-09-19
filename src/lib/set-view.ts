import { orderCategories } from '@/lib/category-order';
import { sortScopes } from '@/lib/constants';
import { groupDefinitions, type SetDetail } from '@/lib/queries';
import type { CpuBehaviour, SliderScope } from '@/lib/database.types';

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
  /** Lo que trae el juego de fábrica en este slider, si lo sabemos. */
  reference: number | null;
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
  /** Cómo se comporta la CPU en este set. */
  cpuBehaviour: CpuBehaviour;
  /**
   * Si el juego deja elegirlo. En FC26 no existe la opción, así que los
   * sliders de la CPU van siempre y no hay nada que contar.
   */
  hasCpuBehaviour: boolean;
  /**
   * Si el juego trae un preajuste de fábrica. Se deduce de los datos: cuando
   * todos los valores por defecto son iguales, es el neutro del menú y no
   * sabemos qué trae el juego, así que no se enseña una referencia falsa.
   */
  hasReference: boolean;
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

      // El de fábrica del lado del usuario, o el del primer ámbito que haya:
      // en los de comportamiento de la CPU no existe lado de usuario.
      const reference =
        byScope.get('user')?.default_value ?? slider.scopes[0]?.default_value ?? null;

      return { slug: slider.slug, name: slider.name, cells, reference };
    });

    return { category, rows };
  });

  return {
    scopes,
    cpuBehaviour: set.cpu_behaviour,
    hasCpuBehaviour: detail.game.has_cpu_behaviour,
    hasReference: new Set(definitions.map((d) => d.default_value)).size > 1,
    blocks,
    commentsByDefinition,
    generalComments,
    totalComments: comments.length,
  };
}

