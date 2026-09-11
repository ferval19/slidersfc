'use client';

import { useState } from 'react';

import { CommentComposer, CommentList } from '@/components/comment-thread';
import { categoryLabel, SCOPE_LABELS } from '@/lib/constants';
import type { CategoryBlockView, CommentView } from '@/lib/set-view';
import type { SliderScope } from '@/lib/database.types';

/**
 * Tabla de valores del set. Cada celda (slider × ámbito) es un botón que abre
 * su propio hilo de comentarios: esto es el diferenciador del producto, así que
 * el comentario vive pegado al número del que habla, no en un hilo aparte.
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

  const columns = `minmax(9rem, 1fr) repeat(${scopes.length}, minmax(5.5rem, 7rem))`;

  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block) => (
        <section key={block.category} className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <h3 className="text-sm font-bold tracking-wide uppercase">
              {categoryLabel(block.category)}
            </h3>
          </header>

          <div className="overflow-x-auto">
            <div className="min-w-[22rem]">
              {/* Cabecera de ámbitos */}
              <div
                className="grid items-center gap-2 border-b border-line/70 px-5 py-2"
                style={{ gridTemplateColumns: columns }}
              >
                <span className="eyebrow">Slider</span>
                {scopes.map((scope) => (
                  <span key={scope} className="eyebrow text-center">
                    {SCOPE_LABELS[scope]}
                  </span>
                ))}
              </div>

              {block.rows.map((row) => {
                const openCell = row.cells.find(
                  (cell) => cell.definitionId !== -1 && cell.definitionId === openId,
                );

                return (
                  <div key={row.slug} className="border-b border-line/40 last:border-b-0">
                    <div
                      className="grid items-center gap-2 px-5 py-2.5"
                      style={{ gridTemplateColumns: columns }}
                    >
                      <span className="truncate text-sm font-medium" title={row.name}>
                        {row.name}
                      </span>

                      {row.cells.map((cell) => {
                        if (cell.definitionId === -1) {
                          return (
                            <span
                              key={cell.scope}
                              className="text-center text-sm text-line-strong"
                              aria-label="No aplica"
                            >
                              —
                            </span>
                          );
                        }

                        const isOpen = openId === cell.definitionId;

                        return (
                          <button
                            key={cell.scope}
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : cell.definitionId)}
                            aria-expanded={isOpen}
                            title={`${row.name} · ${SCOPE_LABELS[cell.scope]} — comentarios`}
                            className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 transition-colors ${
                              isOpen
                                ? 'border-accent bg-accent/10'
                                : 'border-line bg-raised hover:border-line-strong'
                            }`}
                          >
                            <span className="value-pill">
                              {cell.value ?? '–'}
                            </span>
                            {cell.commentCount > 0 ? (
                              <span className="rounded-full bg-signal/15 px-1.5 text-[0.625rem] font-bold text-signal">
                                {cell.commentCount}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {openCell ? (
                      <div className="border-t border-line/60 bg-void/50 px-5 py-4">
                        <p className="eyebrow mb-3">
                          {row.name} · {SCOPE_LABELS[openCell.scope]}
                        </p>

                        <div className="flex flex-col gap-4">
                          {(commentsByDefinition[String(openCell.definitionId)] ?? []).length > 0 ? (
                            <CommentList
                              comments={commentsByDefinition[String(openCell.definitionId)] ?? []}
                            />
                          ) : (
                            <p className="text-sm text-muted">
                              Nadie ha comentado este valor todavía.
                            </p>
                          )}

                          <CommentComposer
                            setId={setId}
                            definitionId={openCell.definitionId}
                            canComment={canComment}
                            compact
                            placeholder={`¿Por qué ${openCell.value ?? '—'} en ${row.name}?`}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
