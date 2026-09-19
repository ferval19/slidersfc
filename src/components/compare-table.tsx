'use client';

import { useMemo, useState } from 'react';

import { CATEGORY_DRAWINGS } from '@/components/chalk';
import { COMPARE_INK, DuoTrack } from '@/components/slider-scale';
import { categoryLabel, SCOPE_LABELS } from '@/lib/constants';
import type { CompareRow, CompareView } from '@/lib/compare';

type Props = {
  view: CompareView;
  aTitle: string;
  bTitle: string;
};

type Order = 'menu' | 'diff';

/**
 * La tabla de la comparación.
 *
 * Dos mandos, y los dos responden a la misma pregunta desde lados distintos:
 * el orden del menú sirve para ir al juego con esto delante, y el orden por
 * diferencia sirve para entender de qué va el otro set en diez segundos. Por
 * eso el segundo no es el que manda por defecto: lo primero que hace cualquiera
 * con unos sliders es sentarse a metérselos.
 */
export function CompareTable({ view, aTitle, bTitle }: Props) {
  const [order, setOrder] = useState<Order>('menu');
  const [onlyDiff, setOnlyDiff] = useState(false);

  const byDifference = useMemo(
    () => [...view.rows].sort((x, y) => y.spread - x.spread),
    [view.rows],
  );

  const keep = (row: CompareRow) => !onlyDiff || row.spread > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* La leyenda se queda pegada arriba: con sesenta y un sliders se
          baja muy lejos de ella, y aquí el color no dice el ámbito —eso va
          escrito en cada carril— sino de quién es el valor. */}
      <div className="z-20 -mx-5 flex flex-wrap sm:sticky sm:top-[var(--header-h)] items-center justify-between gap-x-6 gap-y-4 bg-board/95 px-5 py-3 backdrop-blur">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Key color={COMPARE_INK.a} label={aTitle} />
          <Key color={COMPARE_INK.b} label={bTitle} />
          {view.hasReference ? (
            <li className="flex items-center gap-2">
              <span className="h-4 w-[2px] rounded-full bg-chalk opacity-45" />
              <span className="eyebrow">De fábrica</span>
            </li>
          ) : null}
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOrder('menu')}
            className={`chip ${order === 'menu' ? 'chip-active' : ''}`}
          >
            Orden del juego
          </button>
          <button
            type="button"
            onClick={() => setOrder('diff')}
            className={`chip ${order === 'diff' ? 'chip-active' : ''}`}
          >
            Por diferencia
          </button>
          <button
            type="button"
            onClick={() => setOnlyDiff((previous) => !previous)}
            className={`chip ${onlyDiff ? 'chip-active' : ''}`}
            aria-pressed={onlyDiff}
          >
            Sólo lo que cambia
          </button>
        </div>
      </div>

      {view.differing === 0 ? (
        <p className="panel p-5 text-sm text-chalk-dim">
          Los dos sets son idénticos en los {view.total} sliders.
        </p>
      ) : null}

      {order === 'diff' ? (
        <ul>
          {byDifference.filter(keep).map((row) => (
            <Row key={row.slug} row={row} view={view} withCategory />
          ))}
        </ul>
      ) : (
        view.blocks.map((block) => {
          const rows = block.rows.filter(keep);
          if (rows.length === 0) return null;

          const Drawing = CATEGORY_DRAWINGS[block.category as keyof typeof CATEGORY_DRAWINGS];

          return (
            <div key={block.category}>
              <header className="flex items-center gap-3 border-b border-chalk-line pb-3">
                {Drawing ? <Drawing className="size-7 text-chalk-dim" /> : null}
                <h3 className="display text-2xl">{categoryLabel(block.category)}</h3>
              </header>
              <ul>
                {rows.map((row) => (
                  <Row key={row.slug} row={row} view={view} />
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Key({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="h-3.5 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="eyebrow max-w-52 truncate text-chalk">{label}</span>
    </li>
  );
}

function Row({
  row,
  view,
  withCategory = false,
}: {
  row: CompareRow;
  view: CompareView;
  withCategory?: boolean;
}) {
  const cells = row.cells.filter((cell) => cell.a !== null || cell.b !== null);

  return (
    <li className="grid gap-x-5 gap-y-1.5 border-b border-chalk-line/60 py-3 last:border-b-0 sm:grid-cols-[minmax(8rem,13rem)_1fr]">
      <div className="min-w-0">
        <span className="text-sm leading-tight font-semibold">{row.name}</span>
        {withCategory ? (
          <span className="eyebrow mt-0.5 block">{categoryLabel(row.category)}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        {cells.map((cell) => (
          <div
            key={cell.scope}
            className="grid items-center gap-x-3 sm:grid-cols-[5.5rem_1fr_auto]"
          >
            <span className="eyebrow">{SCOPE_LABELS[cell.scope]}</span>

            <DuoTrack
              min={view.min}
              max={view.max}
              a={cell.a}
              b={cell.b}
              reference={view.hasReference ? row.reference : null}
              className="min-w-32"
            />

            <div className="flex items-center gap-2">
              <span className="value-pill w-9 text-right text-sm text-ink-user">{cell.a ?? '—'}</span>
              <span className="value-pill w-9 text-right text-sm text-ink-mate">{cell.b ?? '—'}</span>
              <span
                className={`value-pill w-10 text-right text-xs ${
                  cell.delta ? 'text-chalk' : 'text-chalk-dim/50'
                }`}
              >
                {formatDelta(cell.delta)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </li>
  );
}

/** El signo va delante y en positivo también: se lee «cuánto sube el segundo». */
function formatDelta(delta: number | null) {
  if (delta === null) return '';
  if (delta === 0) return '=';
  return delta > 0 ? `+${delta}` : String(delta);
}
