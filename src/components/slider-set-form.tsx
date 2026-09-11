'use client';

import { useActionState, useMemo, useState } from 'react';

import type { SetFormState } from '@/app/actions/sets';
import { CATEGORY_DRAWINGS } from '@/components/chalk';
import { ScaleLegend, ScaleTrack } from '@/components/slider-scale';
import {
  categoryLabel,
  SCOPE_INK,
  SCOPE_LABELS,
  sortCategories,
  sortScopes,
} from '@/lib/constants';
import type { Game, SliderDefinition, SliderScope } from '@/lib/database.types';

type Props = {
  action: (state: SetFormState, formData: FormData) => Promise<SetFormState>;
  games: Game[];
  definitionsByGame: Record<string, SliderDefinition[]>;
  initial?: {
    gameId: number;
    title: string;
    description: string;
    isPublished: boolean;
    values: Record<string, number>;
  };
  /** En edición el juego no se puede cambiar: los valores cuelgan de él. */
  lockGame?: boolean;
  submitLabel?: string;
};

const initialState: SetFormState = {};

export function SliderSetForm({
  action,
  games,
  definitionsByGame,
  initial,
  lockGame = false,
  submitLabel = 'Publicar set',
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [gameId, setGameId] = useState<number>(initial?.gameId ?? games[0]?.id ?? 0);
  const [values, setValues] = useState<Record<string, number>>(() => {
    if (initial) return initial.values;
    return defaultsFor(definitionsByGame[String(games[0]?.id ?? '')] ?? []);
  });

  const definitions = useMemo(
    () => definitionsByGame[String(gameId)] ?? [],
    [definitionsByGame, gameId],
  );

  const { scopes, blocks } = useMemo(() => buildBlocks(definitions), [definitions]);

  const changeGame = (nextGameId: number) => {
    setGameId(nextGameId);
    setValues(defaultsFor(definitionsByGame[String(nextGameId)] ?? []));
  };

  const setValue = (definitionId: number, raw: string, min: number, max: number) => {
    const parsed = Number(raw);
    const next = Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : min;
    setValues((previous) => ({ ...previous, [String(definitionId)]: next }));
  };

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <input type="hidden" name="game_id" value={gameId} />
      {Object.entries(values).map(([definitionId, value]) => (
        <input key={definitionId} type="hidden" name={`v_${definitionId}`} value={value} />
      ))}

      {/* Metadatos del set */}
      <section className="panel flex flex-col gap-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="eyebrow">Título</span>
            <input
              name="title"
              required
              minLength={3}
              maxLength={120}
              defaultValue={initial?.title}
              placeholder="Full manual · Leyenda · 8 min"
              className="field"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="eyebrow">Juego</span>
            <select
              value={gameId}
              onChange={(event) => changeGame(Number(event.target.value))}
              disabled={lockGame}
              className="field disabled:opacity-60"
            >
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
            {lockGame ? (
              <span className="text-xs text-chalk-dim">
                El juego no se puede cambiar después de crear el set.
              </span>
            ) : null}
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="eyebrow">Descripción</span>
            <textarea
              name="description"
              rows={5}
              maxLength={2000}
              defaultValue={initial?.description}
              placeholder="Dificultad, duración de los tiempos, cámara y controles. Sin eso, tus valores no significan lo mismo para quien los copie."
              className="field resize-y"
            />
          </label>
        </div>
      </section>

      {/* Valores */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <h2 className="display text-4xl">Valores</h2>
            <p className="mt-2 text-xs text-chalk-dim">
              {definitions.length} sliders. Lo que no toques se queda en su valor por defecto.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <ScaleLegend scopes={scopes} labels={SCOPE_LABELS} />
            <button
              type="button"
              onClick={() => setValues(defaultsFor(definitions))}
              className="btn btn-quiet"
            >
              Restablecer
            </button>
          </div>
        </div>

        {blocks.map((block) => {
          const Drawing = CATEGORY_DRAWINGS[block.category as keyof typeof CATEGORY_DRAWINGS];

          return (
            <div key={block.category}>
              <header className="flex items-center gap-3 border-b border-chalk-line pb-3">
                {Drawing ? <Drawing className="size-7 text-chalk-dim" /> : null}
                <h3 className="display text-2xl">{categoryLabel(block.category)}</h3>
              </header>

              <ul>
                {block.rows.map((row) => {
                  const marks = scopes
                    .map((scope) => {
                      const definition = row.byScope[scope];
                      if (!definition) return null;
                      return {
                        scope,
                        value: values[String(definition.id)] ?? definition.default_value,
                      };
                    })
                    .filter((mark): mark is { scope: SliderScope; value: number } => mark !== null);

                  return (
                    <li
                      key={row.slug}
                      className="grid items-center gap-x-5 gap-y-1 border-b border-chalk-line/60 py-2.5 last:border-b-0 sm:grid-cols-[minmax(8rem,14rem)_1fr_auto]"
                    >
                      <span className="text-sm leading-tight font-semibold">{row.name}</span>

                      <ScaleTrack min={0} max={100} marks={marks} className="min-w-32" />

                      <div className="flex items-center gap-1.5">
                        {scopes.map((scope) => {
                          const definition = row.byScope[scope];

                          if (!definition) {
                            return (
                              <span
                                key={scope}
                                className="w-14 text-center text-sm text-chalk-dim/40"
                                title={`${SCOPE_LABELS[scope]}: no aplica`}
                              >
                                —
                              </span>
                            );
                          }

                          return (
                            <input
                              key={scope}
                              type="number"
                              inputMode="numeric"
                              min={definition.min_value}
                              max={definition.max_value}
                              value={values[String(definition.id)] ?? definition.default_value}
                              onChange={(event) =>
                                setValue(
                                  definition.id,
                                  event.target.value,
                                  definition.min_value,
                                  definition.max_value,
                                )
                              }
                              aria-label={`${row.name} — ${SCOPE_LABELS[scope]}`}
                              className={`field value-pill w-14 px-1 py-1.5 text-center ${SCOPE_INK[scope].text}`}
                            />
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      {state.error ? (
        <p
          className="border border-ink-rival/50 bg-ink-rival/10 px-3 py-2.5 text-sm text-ink-rival"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 bg-board/95 px-5 py-4 backdrop-blur">
        <button
          type="submit"
          name="intent"
          value="publish"
          className="btn btn-primary"
          disabled={pending}
        >
          {pending ? 'Guardando…' : submitLabel}
        </button>
        {!initial?.isPublished ? (
          <button
            type="submit"
            name="intent"
            value="draft"
            className="btn btn-ghost"
            disabled={pending}
          >
            Guardar borrador
          </button>
        ) : null}
        <p className="text-xs text-chalk-dim">Un borrador sólo lo ves tú hasta que lo publiques.</p>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

function defaultsFor(definitions: SliderDefinition[]) {
  const values: Record<string, number> = {};
  for (const definition of definitions) {
    values[String(definition.id)] = definition.default_value;
  }
  return values;
}

type FormRow = {
  slug: string;
  name: string;
  byScope: Partial<Record<SliderScope, SliderDefinition>>;
};

function buildBlocks(definitions: SliderDefinition[]) {
  const scopes = sortScopes([...new Set(definitions.map((d) => d.applies_to))]);
  const byCategory = new Map<string, Map<string, FormRow>>();

  for (const definition of definitions) {
    if (!byCategory.has(definition.category)) byCategory.set(definition.category, new Map());
    const rows = byCategory.get(definition.category)!;

    if (!rows.has(definition.slug)) {
      rows.set(definition.slug, { slug: definition.slug, name: definition.name, byScope: {} });
    }
    rows.get(definition.slug)!.byScope[definition.applies_to] = definition;
  }

  const blocks = sortCategories([...byCategory.keys()]).map((category) => ({
    category,
    rows: [...byCategory.get(category)!.values()],
  }));

  return { scopes, blocks };
}
