'use client';

import { useActionState, useMemo, useState } from 'react';

import type { SetFormState } from '@/app/actions/sets';
import { categoryLabel, MODES, SCOPE_LABELS, sortCategories, sortScopes } from '@/lib/constants';
import type { Game, SetMode, SliderDefinition, SliderScope } from '@/lib/database.types';

type Props = {
  action: (state: SetFormState, formData: FormData) => Promise<SetFormState>;
  games: Game[];
  definitionsByGame: Record<string, SliderDefinition[]>;
  initial?: {
    gameId: number;
    title: string;
    description: string;
    mode: SetMode;
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

  const resetToDefaults = () => setValues(defaultsFor(definitions));

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="game_id" value={gameId} />
      {Object.entries(values).map(([definitionId, value]) => (
        <input key={definitionId} type="hidden" name={`v_${definitionId}`} value={value} />
      ))}

      {/* Metadatos del set */}
      <section className="card flex flex-col gap-5 p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="eyebrow">Título</span>
            <input
              name="title"
              required
              minLength={3}
              maxLength={120}
              defaultValue={initial?.title}
              placeholder="Full Manual · Leyenda · 6 min"
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
              <span className="text-xs text-muted">
                El juego no se puede cambiar después de crear el set.
              </span>
            ) : null}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="eyebrow">Modo</span>
            <select name="mode" defaultValue={initial?.mode ?? 'carrera'} className="field">
              {MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label} — {mode.hint}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="eyebrow">Descripción</span>
            <textarea
              name="description"
              rows={4}
              maxLength={2000}
              defaultValue={initial?.description}
              placeholder="Dificultad, duración de los tiempos, controles, y qué buscas con estos valores."
              className="field resize-y"
            />
          </label>
        </div>
      </section>

      {/* Valores */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Valores</h2>
            <p className="mt-1 text-xs text-muted">
              {definitions.length} sliders · rellena sólo lo que cambies, el resto se queda en
              su valor por defecto.
            </p>
          </div>
          <button type="button" onClick={resetToDefaults} className="btn btn-quiet">
            Restablecer
          </button>
        </div>

        {blocks.map((block) => (
          <div key={block.category} className="card overflow-hidden">
            <header className="border-b border-line px-5 py-3">
              <h3 className="text-sm font-bold tracking-wide uppercase">
                {categoryLabel(block.category)}
              </h3>
            </header>

            <div className="overflow-x-auto">
              <div className="min-w-[22rem]">
                <div
                  className="grid items-center gap-2 border-b border-line/70 px-5 py-2"
                  style={{ gridTemplateColumns: gridColumns(scopes.length) }}
                >
                  <span className="eyebrow">Slider</span>
                  {scopes.map((scope) => (
                    <span key={scope} className="eyebrow text-center">
                      {SCOPE_LABELS[scope]}
                    </span>
                  ))}
                </div>

                {block.rows.map((row) => (
                  <div
                    key={row.slug}
                    className="grid items-center gap-2 border-b border-line/40 px-5 py-2 last:border-b-0"
                    style={{ gridTemplateColumns: gridColumns(scopes.length) }}
                  >
                    <span className="truncate text-sm font-medium" title={row.name}>
                      {row.name}
                    </span>

                    {scopes.map((scope) => {
                      const definition = row.byScope[scope];

                      if (!definition) {
                        return (
                          <span key={scope} className="text-center text-sm text-line-strong">
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
                          className="field value-pill px-2 py-1.5 text-center"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {state.error ? (
        <p className="rounded-lg border border-flare/40 bg-flare/10 px-3 py-2 text-sm text-flare" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-line bg-void/95 px-5 py-4 backdrop-blur">
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
        <p className="text-xs text-muted">
          Un borrador sólo lo ves tú hasta que lo publiques.
        </p>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

function gridColumns(scopeCount: number) {
  return `minmax(9rem, 1fr) repeat(${scopeCount}, minmax(4.5rem, 6rem))`;
}

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
