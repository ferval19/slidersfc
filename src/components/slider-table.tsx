'use client';

import { useState } from 'react';

import { CATEGORY_DRAWINGS } from '@/components/chalk';
import { CommentComposer, CommentList } from '@/components/comment-thread';
import { ScaleLegend, ScaleTrack } from '@/components/slider-scale';
import { categoryLabel, SCOPE_INK, SCOPE_LABELS } from '@/lib/constants';
import type { CategoryBlockView, CommentView } from '@/lib/set-view';
import type { SliderScope } from '@/lib/database.types';

/**
 * Los valores del set. Cada fila es un slider: nombre, la escala con las
 * muescas de todos los ámbitos, y los números — que son los que abren su hilo
 * de comentarios. El comentario vive pegado al valor del que habla.
 */
export function SliderTable({
  setId,
  scopes,
  blocks,
  commentsByDefinition,
  canComment,
}: {
  setId: string;
  scopes: SliderScope[];
  blocks: CategoryBlockView[];
  commentsByDefinition: Record<string, CommentView[]>;
  canComment: boolean;
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-10">
      <ScaleLegend scopes={scopes} labels={SCOPE_LABELS} />

      {blocks.map((block) => {
        const Drawing = CATEGORY_DRAWINGS[block.category as keyof typeof CATEGORY_DRAWINGS];

        return (
          <section key={block.category}>
            <header className="flex items-center gap-3 border-b border-chalk-line pb-3">
              {Drawing ? <Drawing className="size-7 text-chalk-dim" /> : null}
              <h3 className="display text-2xl">{categoryLabel(block.category)}</h3>
              <span className="eyebrow ml-auto">
                {block.rows.length} {block.rows.length === 1 ? 'slider' : 'sliders'}
              </span>
            </header>

            <ul>
              {block.rows.map((row) => {
                const active = row.cells.find(
                  (cell) => cell.definitionId !== -1 && cell.definitionId === openId,
                );
                const marks = row.cells
                  .filter((cell) => cell.definitionId !== -1 && cell.value !== null)
                  .map((cell) => ({ scope: cell.scope, value: cell.value as number }));

                return (
                  <li key={row.slug} className="border-b border-chalk-line/60 last:border-b-0">
                    <div className="grid items-center gap-x-5 gap-y-1 py-3 sm:grid-cols-[minmax(8rem,14rem)_1fr_auto]">
                      <span className="text-sm leading-tight font-semibold">{row.name}</span>

                      <ScaleTrack min={0} max={100} marks={marks} className="min-w-32" />

                      <div className="flex items-center gap-1.5">
                        {row.cells.map((cell) => {
                          if (cell.definitionId === -1) {
                            return (
                              <span
                                key={cell.scope}
                                className="w-12 text-center text-sm text-chalk-dim/40"
                                title={`${SCOPE_LABELS[cell.scope]}: no aplica`}
                              >
                                —
                              </span>
                            );
                          }

                          const isOpen = openId === cell.definitionId;
                          const ink = SCOPE_INK[cell.scope];

                          return (
                            <button
                              key={cell.scope}
                              type="button"
                              onClick={() => setOpenId(isOpen ? null : cell.definitionId)}
                              aria-expanded={isOpen}
                              title={`${row.name} · ${SCOPE_LABELS[cell.scope]} — comentarios`}
                              className={`relative w-12 rounded-[2px] border py-1.5 transition-colors ${ink.text} ${
                                isOpen
                                  ? `${ink.border} bg-board-deep`
                                  : 'border-transparent hover:border-chalk-line'
                              }`}
                            >
                              <span className="value-pill text-base">{cell.value ?? '–'}</span>
                              {cell.commentCount > 0 ? (
                                <span className="absolute -top-0.5 -right-0.5 font-mono text-[0.625rem] leading-none font-semibold text-chalk">
                                  {cell.commentCount}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {active ? (
                      <div className="mb-4 border-l-2 bg-board-deep/70 px-4 py-4" style={{ borderColor: SCOPE_INK[active.scope].hex }}>
                        <p className="eyebrow mb-3">
                          {row.name} · {SCOPE_LABELS[active.scope]} · {active.value ?? '–'}
                        </p>

                        <div className="flex flex-col gap-4">
                          {(commentsByDefinition[String(active.definitionId)] ?? []).length > 0 ? (
                            <CommentList
                              comments={commentsByDefinition[String(active.definitionId)] ?? []}
                            />
                          ) : (
                            <p className="text-sm text-chalk-dim">
                              Nadie ha comentado este valor todavía.
                            </p>
                          )}

                          <CommentComposer
                            setId={setId}
                            definitionId={active.definitionId}
                            canComment={canComment}
                            compact
                            placeholder={`¿Por qué ${active.value ?? '—'} en ${row.name}?`}
                          />
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
