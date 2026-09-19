"use client";

import { memo, useActionState, useCallback, useMemo, useState } from "react";

import type { SetFormState } from "@/app/actions/sets";
import {
  CATEGORY_DRAWINGS,
  ChalkCamera,
  ChalkShield,
  ChalkStopwatch,
} from "@/components/chalk";
import { ImportPanel } from "@/components/import-panel";
import { SliderControl } from "@/components/slider-control";
import { ScaleLegend } from "@/components/slider-scale";
import {
  categoryLabel,
  CPU_BEHAVIOURS,
  SCOPE_INK,
  SCOPE_LABELS,
  sortScopes,
} from "@/lib/constants";
import { orderCategories } from "@/lib/category-order";
import { DIFFICULTIES } from "@/lib/set-conditions";
import type {
  CpuBehaviour,
  Game,
  SliderDefinition,
  SliderScope,
} from "@/lib/database.types";

type Props = {
  action: (state: SetFormState, formData: FormData) => Promise<SetFormState>;
  games: Game[];
  definitionsByGame: Record<string, SliderDefinition[]>;
  initial?: {
    gameId: number;
    title: string;
    description: string;
    isPublished: boolean;
    cpuBehaviour: CpuBehaviour;
    difficulty: string;
    halfLength: string;
    camera: string;
    cameraHeight: string;
    cameraZoom: string;
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
  submitLabel = "Publicar set",
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [gameId, setGameId] = useState<number>(
    initial?.gameId ?? games[0]?.id ?? 0,
  );
  const [folded, setFolded] = useState<ReadonlySet<string>>(new Set());
  const [cpuBehaviour, setCpuBehaviour] = useState<CpuBehaviour>(
    initial?.cpuBehaviour ?? "tactical",
  );
  const [values, setValues] = useState<Record<string, number>>(() => {
    if (initial) return initial.values;
    return defaultsFor(definitionsByGame[String(games[0]?.id ?? "")] ?? []);
  });

  const definitions = useMemo(
    () => definitionsByGame[String(gameId)] ?? [],
    [definitionsByGame, gameId],
  );

  const { scopes, blocks } = useMemo(
    () => buildBlocks(definitions),
    [definitions],
  );

  /**
   * Si el juego trae preajuste de fábrica. Cuando todos los valores por
   * defecto son iguales es el neutro del menú, y dibujar una referencia ahí
   * sería inventársela.
   */
  const hasReference = useMemo(
    () =>
      new Set(definitions.map((definition) => definition.default_value)).size >
      1,
    [definitions],
  );

  const game = games.find((candidate) => candidate.id === gameId);
  // FC26 no tiene selector: allí los sliders de CPU van siempre.
  const hasCpuBehaviour = game?.has_cpu_behaviour ?? false;
  const cpuIsCustom = !hasCpuBehaviour || cpuBehaviour === "custom";

  const changeGame = (nextGameId: number) => {
    setGameId(nextGameId);
    setValues(defaultsFor(definitionsByGame[String(nextGameId)] ?? []));
  };

  // Estable a propósito: es lo que permite que `SliderRow` esté memorizada y
  // que arrastrar un regulador no repinte los otros ciento veintiuno.
  const setValue = useCallback((definitionId: number, next: number) => {
    setValues((previous) => ({ ...previous, [String(definitionId)]: next }));
  }, []);

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <input type="hidden" name="game_id" value={gameId} />
      <input
        type="hidden"
        name="cpu_behaviour"
        value={hasCpuBehaviour ? cpuBehaviour : "custom"}
      />

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
              placeholder="Cómo se comporta el partido con estos valores, y qué controles usas. Lo de la dificultad, los tiempos y la cámara va aquí abajo."
              className="field resize-y"
            />
          </label>
        </div>

        <div className="chalk-rule" />

        {/* Las condiciones en las que se probó. Son opcionales, pero son lo
            que separa «unos valores» de «unos valores que puedes reproducir»:
            los mismos sliders en otra dificultad no dan el mismo partido. */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="eyebrow">Cómo lo juegas</p>
            <p className="mt-1.5 text-xs text-chalk-dim">
              Opcional, pero es lo que hace que tus valores signifiquen lo mismo
              para quien los copie.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow flex items-center gap-2">
                <ChalkShield className="size-5 text-chalk-dim" />
                Dificultad
              </span>
              <select
                name="difficulty"
                defaultValue={initial?.difficulty ?? ""}
                className="field"
              >
                <option value="">Sin especificar</option>
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="eyebrow flex items-center gap-2">
                <ChalkStopwatch className="size-5 text-chalk-dim" />
                Duración de cada tiempo
              </span>
              <input
                name="half_length"
                defaultValue={initial?.halfLength}
                placeholder="8"
                inputMode="numeric"
                className="field font-mono"
              />
              <span className="text-xs text-chalk-dim">
                En minutos. Si juegas con un rango, ponlo: 7-8.
              </span>
            </label>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="eyebrow flex items-center gap-2">
                <ChalkCamera className="size-5 text-chalk-dim" />
                Cámara
              </span>
              {/* En el móvil la altura y el zoom van juntos en una línea: son dos
                  cifras cortas y apiladas quedaban desparejadas. */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  name="camera"
                  defaultValue={initial?.camera}
                  list="camaras"
                  maxLength={40}
                  placeholder="EA Sports"
                  aria-label="Cámara"
                  className="field sm:flex-1"
                />
                <datalist id="camaras">
                  <option value="EA Sports" />
                  <option value="Tradicional" />
                </datalist>

                <div className="flex gap-3">
                  <label className="flex flex-1 items-center gap-2 sm:flex-none">
                    <span className="eyebrow shrink-0">Altura</span>
                    <input
                      name="camera_height"
                      defaultValue={initial?.cameraHeight}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={20}
                      placeholder="0"
                      className="field value-pill w-16 px-1 text-center"
                    />
                  </label>

                  <label className="flex flex-1 items-center gap-2 sm:flex-none">
                    <span className="eyebrow shrink-0">Zoom</span>
                    <input
                      name="camera_zoom"
                      defaultValue={initial?.cameraZoom}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={20}
                      placeholder="0"
                      className="field value-pill w-16 px-1 text-center"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <h2 className="display text-4xl">Valores</h2>
            <p className="mt-2 text-xs text-chalk-dim">
              {definitions.length} sliders. Lo que no toques se queda en su
              valor por defecto.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <ScaleLegend scopes={scopes} labels={SCOPE_LABELS} />
            <button
              type="button"
              onClick={() =>
                setFolded((previous) =>
                  previous.size === blocks.length
                    ? new Set()
                    : new Set(blocks.map((block) => block.category)),
                )
              }
              className="btn btn-quiet"
            >
              {folded.size === blocks.length ? "Desplegar todo" : "Plegar todo"}
            </button>
            <button
              type="button"
              onClick={() => setValues(defaultsFor(definitions))}
              className="btn btn-quiet"
            >
              Restablecer
            </button>
          </div>
        </div>

        <ImportPanel
          definitions={definitions}
          onApply={(imported) =>
            setValues((previous) => ({ ...previous, ...imported }))
          }
        />

        {blocks.map((block) => {
          const Drawing =
            CATEGORY_DRAWINGS[block.category as keyof typeof CATEGORY_DRAWINGS];
          const isFolded = folded.has(block.category);

          return (
            <div key={block.category}>
              <button
                type="button"
                onClick={() =>
                  setFolded((previous) => {
                    const next = new Set(previous);
                    if (!next.delete(block.category)) next.add(block.category);
                    return next;
                  })
                }
                aria-expanded={!isFolded}
                className="flex w-full items-center gap-3 border-b border-chalk-line pb-3 text-left transition-colors hover:text-ink-user"
              >
                {Drawing ? (
                  <Drawing className="size-7 shrink-0 text-chalk-dim" />
                ) : null}
                <h3 className="display text-2xl">
                  {categoryLabel(block.category)}
                </h3>
                <span className="eyebrow ml-auto">{block.rows.length}</span>
                <span
                  aria-hidden
                  className={`text-xs transition-transform ${isFolded ? "" : "rotate-90"}`}
                >
                  ▶
                </span>
              </button>

              {block.category === "cpu_controls" && hasCpuBehaviour ? (
                <div
                  hidden={isFolded}
                  className="border-b border-chalk-line/60 py-4"
                >
                  <p className="text-sm text-chalk-dim">
                    Cómo se comporta la CPU. Los sliders de abajo sólo se usan
                    en «Personalizado»; en los otros dos los ajusta el juego
                    según los equipos.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CPU_BEHAVIOURS.map((behaviour) => (
                      <button
                        key={behaviour.value}
                        type="button"
                        onClick={() => setCpuBehaviour(behaviour.value)}
                        aria-pressed={cpuBehaviour === behaviour.value}
                        className={`chip ${cpuBehaviour === behaviour.value ? "chip-active" : ""}`}
                      >
                        {behaviour.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2.5 text-xs text-chalk-dim">
                    {
                      CPU_BEHAVIOURS.find(
                        (behaviour) => behaviour.value === cpuBehaviour,
                      )?.hint
                    }
                  </p>
                </div>
              ) : null}

              {/* Plegar (o elegir un comportamiento que no sea personalizado)
                  esconde, no desmonta: un regulador desmontado deja de enviarse
                  con el formulario y su valor se perdería. Así, si se vuelve a
                  «Personalizado», los valores siguen donde estaban. */}
              <ul
                hidden={
                  isFolded ||
                  (block.category === "cpu_controls" && !cpuIsCustom)
                }
              >
                {block.rows.map((row) => (
                  <SliderRow
                    key={row.slug}
                    row={row}
                    scopes={scopes}
                    values={values}
                    hasReference={hasReference}
                    onChange={setValue}
                  />
                ))}
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
          {pending ? "Guardando…" : submitLabel}
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
        <p className="text-xs text-chalk-dim">
          Un borrador sólo lo ves tú hasta que lo publiques.
        </p>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

/**
 * Una fila memorizada.
 *
 * El comparador mira sólo los valores de ESTA fila. Sin él, arrastrar un
 * regulador repintaría los ciento veintidós del formulario en cada píxel del
 * gesto, y en un móvil eso se nota.
 */
const SliderRow = memo(
  function SliderRow({
    row,
    scopes,
    values,
    hasReference,
    onChange,
  }: {
    row: FormRow;
    scopes: SliderScope[];
    values: Record<string, number>;
    hasReference: boolean;
    onChange: (definitionId: number, value: number) => void;
  }) {
    return (
      <li className="grid gap-x-6 gap-y-1.5 border-b border-chalk-line/60 py-3.5 last:border-b-0 sm:grid-cols-[minmax(8rem,12rem)_1fr]">
        <span className="pt-1 text-sm leading-tight font-semibold">
          {row.name}
        </span>

        <div className="flex flex-col gap-1.5">
          {scopes.map((scope) => {
            const definition = row.byScope[scope];
            if (!definition) return null;

            return (
              <SliderControl
                key={scope}
                name={`v_${definition.id}`}
                label={SCOPE_LABELS[scope]}
                ariaLabel={`${row.name} — ${SCOPE_LABELS[scope]}`}
                value={
                  values[String(definition.id)] ?? definition.default_value
                }
                min={definition.min_value}
                max={definition.max_value}
                reference={hasReference ? definition.default_value : null}
                ink={SCOPE_INK[scope].hex}
                onChange={(next) => onChange(definition.id, next)}
              />
            );
          })}
        </div>
      </li>
    );
  },
  (previous, next) =>
    previous.row === next.row &&
    previous.scopes === next.scopes &&
    previous.hasReference === next.hasReference &&
    previous.onChange === next.onChange &&
    Object.values(previous.row.byScope).every(
      (definition) =>
        previous.values[String(definition.id)] ===
        next.values[String(definition.id)],
    ),
);

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
    if (!byCategory.has(definition.category))
      byCategory.set(definition.category, new Map());
    const rows = byCategory.get(definition.category)!;

    if (!rows.has(definition.slug)) {
      rows.set(definition.slug, {
        slug: definition.slug,
        name: definition.name,
        byScope: {},
      });
    }
    rows.get(definition.slug)!.byScope[definition.applies_to] = definition;
  }

  const blocks = orderCategories(definitions, [...byCategory.keys()]).map(
    (category) => ({
      category,
      rows: [...byCategory.get(category)!.values()],
    }),
  );

  return { scopes, blocks };
}
