'use client';

import { useState } from 'react';

import { CATEGORY_DRAWINGS } from '@/components/chalk';
import { CommentComposer, CommentList } from '@/components/comment-thread';
import { useI18n } from '@/components/i18n-provider';
import { ScaleLegend, ScaleTrack } from '@/components/slider-scale';
import { categoryAnchor, useActiveCategory } from '@/components/active-category';
import { CategorySheet } from '@/components/category-sheet';
import {
  categoryLabel,
  cpuBehaviours,
  SCOPE_INK,
  scopeLabel,
  scopeLabels,
  scopeShortLabel,
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = useActiveCategory(blocks.map((block) => block.category));
  const { t, locale } = useI18n();

  return (
    <div className="flex flex-col gap-10">
      <CategorySheet
        categories={blocks.map((block) => ({
          category: block.category,
          count: block.rows.length,
        }))}
        active={active}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {/* La leyenda general. Los rótulos de columna ya no van aquí: cada
          categoría lleva los suyos, para no perderlos al bajar. */}
      <div className="sm:-mt-4">
        <ScaleLegend
          scopes={scopes}
          labels={scopeLabels(locale)}
          withReference={hasReference}
          referenceLabel={t.comparar.deFabrica}
        />
      </div>

      {blocks.map((block) => {
        const Drawing = CATEGORY_DRAWINGS[block.category as keyof typeof CATEGORY_DRAWINGS];

        // Con un comportamiento que no sea personalizado, estos valores están
        // guardados pero el juego no los usa: enseñarlos sería decir que este
        // set toca cosas que no toca.
        const cpuIsAutomatic =
          block.category === 'cpu_controls' && hasCpuBehaviour && cpuBehaviour !== 'custom';
        const behaviour = cpuBehaviours(locale).find((candidate) => candidate.value === cpuBehaviour);

        return (
          // `scroll-mt` descuenta la cabecera y la barra pegada: sin él, al
          // saltar a una categoría su título queda debajo de las dos.
          <section
            key={block.category}
            id={categoryAnchor(block.category)}
            // El margen de scroll descuenta lo que hay pegado arriba, y eso
            // cambia con el tamaño: en el móvil sólo la cabecera del sitio,
            // porque la barra de categorías es de escritorio. Con el margen
            // de escritorio, al saltar quedaba asomando la cabecera anterior.
            className="scroll-mt-[calc(var(--header-h)+0.5rem)] sm:scroll-mt-[calc(var(--header-h)+4.5rem)]"
          >
            {/* En el móvil la cabecera se queda pegada mientras recorres su
                categoría y la empuja la siguiente, como una lista del sistema:
                contesta sola «¿dónde estoy?» sin gastar un píxel de más,
                porque ese título iba a pasar por ahí de todas formas. Y
                tocándola se abre el índice. */}
            <header className="relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-chalk-line bg-board pt-2 pb-3 max-sm:sticky max-sm:top-[var(--header-h)]">
              {Drawing ? <Drawing className="size-7 shrink-0 text-chalk-dim" /> : null}
              <h3 className="display text-2xl">{categoryLabel(block.category, locale)}</h3>
              {block.category === 'cpu_controls' && hasCpuBehaviour && behaviour ? (
                <span className="chip chip-active ml-auto">{behaviour.label}</span>
              ) : null}

              <span aria-hidden className="eyebrow ml-auto sm:hidden">
                {t.set.indice}
              </span>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                aria-label={t.set.irAOtraCategoria(categoryLabel(block.category, locale))}
                className="absolute inset-0 sm:hidden"
              />
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
                    {scopeLabel(scope, locale)}
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
                                title={t.set.noAplica(scopeLabel(cell.scope, locale))}
                              >
                                <span className="eyebrow block text-[0.5625rem] sm:hidden">
                                  {scopeShortLabel(cell.scope, locale)}
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
                              title={t.set.verComentarios(row.name, scopeLabel(cell.scope, locale))}
                              className={`relative ${VALUE_COL} rounded-[2px] border py-1.5 transition-colors ${ink.text} ${
                                isOpen
                                  ? `${ink.border} bg-board-deep`
                                  // Borde tenue SIEMPRE, no sólo al pasar por
                                  // encima. En un móvil no hay hover, y ahí
                                  // estos números no tenían nada que dijera que
                                  // se pueden tocar: parecían una tabla. Y el
                                  // móvil es donde se usa esto, con la consola
                                  // delante.
                                  //
                                  // El 25% está medido, no elegido a ojo:
                                  // 2,12:1 contra la pizarra. `chalk-line` ya
                                  // es blanco al 16%, así que rebajarlo encima
                                  // dejaba el borde en 1,15:1 — presente en el
                                  // CSS y invisible en la pantalla.
                                  : 'border-chalk/25 hover:border-chalk-line'
                              }`}
                            >
                              <span className="eyebrow block text-[0.5625rem] sm:hidden">
                                {scopeShortLabel(cell.scope, locale)}
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
                          {row.name} · {scopeLabel(active.scope, locale)} · {active.value ?? '–'}
                        </p>

                        <div className="flex flex-col gap-4">
                          {(commentsByDefinition[String(active.definitionId)] ?? []).length > 0 ? (
                            <CommentList
                              comments={commentsByDefinition[String(active.definitionId)] ?? []}
                            />
                          ) : (
                            <p className="text-sm text-chalk-dim">{t.set.sinComentariosValor}</p>
                          )}

                          <CommentComposer
                            setId={setId}
                            definitionId={active.definitionId}
                            canComment={canComment}
                            compact
                            placeholder={t.set.placeholderComentarioValor(active.value ?? '—', row.name)}
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
