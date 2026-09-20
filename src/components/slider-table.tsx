'use client';

import { useState } from 'react';

import { CATEGORY_DRAWINGS } from '@/components/chalk';
import { CommentComposer, CommentList } from '@/components/comment-thread';
import { ScaleLegend, ScaleTrack } from '@/components/slider-scale';
import { categoryAnchor } from '@/components/set-sticky-bar';
import {
  categoryLabel,
  CPU_BEHAVIOURS,
  SCOPE_INK,
  SCOPE_LABELS,
  SCOPE_SHORT_LABELS,
} from '@/lib/constants';
import type { CategoryBlockView, CommentView } from '@/lib/set-view';
import type { CpuBehaviour, SliderScope } from '@/lib/database.types';

/** Nombre | escala | valores. La cabecera de columnas usa la misma rejilla. */
const ROW_GRID = 'sm:grid-cols-[minmax(8rem,13rem)_1fr_auto]';

/**
 * Ancho de cada columna de valores. Lo comparten la cabecera, los números y
 * el guion de «no aplica», que es lo que hace que todo quede en columna.
 * Da para «Usuario» y «CPU» en una línea; «CPU compañero» parte en dos.
 */
const VALUE_COL = 'w-20';

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
  hasReference = false,
  cpuBehaviour = 'custom',
  hasCpuBehaviour = false,
}: {
  setId: string;
  scopes: SliderScope[];
  blocks: CategoryBlockView[];
  commentsByDefinition: Record<string, CommentView[]>;
  canComment: boolean;
  hasReference?: boolean;
  cpuBehaviour?: CpuBehaviour;
  hasCpuBehaviour?: boolean;
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-10">
      {/* La leyenda general. Los rótulos de columna ya no van aquí: cada
          categoría lleva los suyos, para no perderlos al bajar. */}
      <div className="sm:-mt-4">
        <ScaleLegend scopes={scopes} labels={SCOPE_LABELS} withReference={hasReference} />
      </div>

      {blocks.map((block) => {
        const Drawing = CATEGORY_DRAWINGS[block.category as keyof typeof CATEGORY_DRAWINGS];

        // Con un comportamiento que no sea personalizado, estos valores están
        // guardados pero el juego no los usa: enseñarlos sería decir que este
        // set toca cosas que no toca.
        const cpuIsAutomatic =
          block.category === 'cpu_controls' && hasCpuBehaviour && cpuBehaviour !== 'custom';
        const behaviour = CPU_BEHAVIOURS.find((candidate) => candidate.value === cpuBehaviour);

        return (
          // `scroll-mt` descuenta la cabecera y la barra pegada: sin él, al
          // saltar a una categoría su título queda debajo de las dos.
          <section
            key={block.category}
            id={categoryAnchor(block.category)}
            className="scroll-mt-[calc(var(--header-h)+4.5rem)]"
          >
            <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-chalk-line pb-3">
              {Drawing ? <Drawing className="size-7 shrink-0 text-chalk-dim" /> : null}
              <h3 className="display text-2xl">{categoryLabel(block.category)}</h3>
              {block.category === 'cpu_controls' && hasCpuBehaviour && behaviour ? (
                <span className="chip chip-active ml-auto">{behaviour.label}</span>
              ) : null}
            </header>

            {cpuIsAutomatic ? (
              <p className="py-5 text-sm text-chalk-dim">{behaviour?.hint}</p>
            ) : null}

            {/* Los rótulos de columna van aquí, en cada categoría, y no una
                sola vez arriba del todo: con ciento veintinueve filas, una
                cabecera única se pierde de vista a la tercera pantalla. */}
            <div hidden={cpuIsAutomatic} className={`hidden items-end pt-3 pb-1 sm:grid ${ROW_GRID}`}>
              <span />
              <span />
              <div className="flex items-center gap-1.5">
                {block.scopes.map((scope) => (
                  <span
                    key={scope}
                    className={`${VALUE_COL} text-center font-mono text-[0.625rem] leading-tight font-semibold tracking-[0.08em] uppercase ${SCOPE_INK[scope].text}`}
                  >
                    {SCOPE_LABELS[scope]}
                  </span>
                ))}
              </div>
            </div>

            <ul hidden={cpuIsAutomatic}>
              {block.rows.map((row) => {
                const active = row.cells.find(
                  (cell) => cell.definitionId !== -1 && cell.definitionId === openId,
                );
                const marks = row.cells
                  .filter((cell) => cell.definitionId !== -1 && cell.value !== null)
                  .map((cell) => ({ scope: cell.scope, value: cell.value as number }));

                return (
                  <li key={row.slug} className="border-b border-chalk-line/60 last:border-b-0">
                    <div className={`grid items-center gap-x-5 gap-y-1 py-3 ${ROW_GRID}`}>
                      <span className="text-sm leading-tight font-semibold">{row.name}</span>

                      <ScaleTrack
                        min={0}
                        max={100}
                        marks={marks}
                        reference={hasReference ? row.reference : null}
                        className="min-w-32"
                      />

                      <div className="flex items-center gap-1.5">
                        {row.cells.map((cell) => {
                          if (cell.definitionId === -1) {
                            return (
                              <span
                                key={cell.scope}
                                className={`${VALUE_COL} text-center text-chalk-dim/40`}
                                title={`${SCOPE_LABELS[cell.scope]}: no aplica`}
                              >
                                <span className="eyebrow block text-[0.5625rem] sm:hidden">
                                  {SCOPE_SHORT_LABELS[cell.scope]}
                                </span>
                                <span className="text-sm">—</span>
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
                              className={`relative ${VALUE_COL} rounded-[2px] border py-1.5 transition-colors ${ink.text} ${
                                isOpen
                                  ? `${ink.border} bg-board-deep`
                                  : 'border-transparent hover:border-chalk-line'
                              }`}
                            >
                              <span className="eyebrow block text-[0.5625rem] sm:hidden">
                                {SCOPE_SHORT_LABELS[cell.scope]}
                              </span>
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
