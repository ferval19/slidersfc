'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { CATEGORY_DRAWINGS } from '@/components/chalk';
import { categoryLabel, CPU_BEHAVIOURS, SCOPE_INK, SCOPE_LABELS } from '@/lib/constants';
import type { CategoryBlockView } from '@/lib/set-view';
import type { CpuBehaviour, SliderScope } from '@/lib/database.types';

/**
 * Modo consola: para tener el móvil en la mano mientras se meten los valores
 * en el menú del juego.
 *
 * Todo lo que hay aquí responde a ese momento concreto:
 *  · una sola columna, en el orden del menú, sin nada que distraiga
 *  · números enormes, legibles a un brazo de distancia
 *  · una marca por slider, para no perder el sitio al levantar la vista
 *  · el progreso se guarda en el navegador: si se bloquea el móvil o te vas,
 *    sigues donde estabas
 *  · se pide no apagar la pantalla, que es la pega real de hacer esto a mano
 */
export function ConsoleMode({
  setId,
  title,
  setHref,
  scopes,
  blocks,
  cpuBehaviour = 'custom',
  hasCpuBehaviour = false,
}: {
  setId: string;
  title: string;
  setHref: string;
  scopes: SliderScope[];
  blocks: CategoryBlockView[];
  cpuBehaviour?: CpuBehaviour;
  hasCpuBehaviour?: boolean;
}) {
  const storageKey = `slidersfc:consola:${setId}`;

  const [done, setDone] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  /**
   * Con la CPU en automático sus sliders no se tocan en el menú, así que la
   * lista no los lleva: sería mandar a alguien a teclear dieciséis valores que
   * el juego no va a usar. En su lugar queda un paso, el de poner el selector.
   */
  const automatic = hasCpuBehaviour && cpuBehaviour !== 'custom';
  const behaviour = CPU_BEHAVIOURS.find((candidate) => candidate.value === cpuBehaviour);

  const steps = useMemo(
    () => (automatic ? blocks.filter((block) => block.category !== 'cpu_controls') : blocks),
    [blocks, automatic],
  );

  const total = useMemo(
    () => steps.reduce((count, block) => count + block.rows.length, 0) + (automatic ? 1 : 0),
    [steps, automatic],
  );

  // El progreso se lee después del primer render a propósito: en el servidor
  // no hay localStorage y leerlo durante el render rompería la hidratación.
  // Va dentro de una función async para que el setState no ocurra de forma
  // sincrónica en el cuerpo del efecto.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      let saved: string[] = [];
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) saved = JSON.parse(raw) as string[];
      } catch {
        // Navegador sin almacenamiento o en privado: se empieza de cero.
      }

      if (cancelled) return;
      if (saved.length > 0) setDone(new Set(saved));
      setLoaded(true);
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...done]));
    } catch {
      // Si no se puede guardar, el modo sigue sirviendo dentro de la sesión.
    }
  }, [done, loaded, storageKey]);

  useWakeLock();

  const toggle = useCallback((slug: string) => {
    setDone((previous) => {
      const next = new Set(previous);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const completed = done.size;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const valueSize = scopes.length > 2 ? 'text-3xl' : 'text-4xl';

  return (
    <div className="mx-auto max-w-xl pb-28">
      <header className="flex items-center gap-3 px-5 py-3">
        <Link href={setHref} className="btn btn-quiet shrink-0 px-3 py-2" title="Volver al set">
          ←
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</p>
      </header>

      {steps.map((block) => {
        const Drawing = CATEGORY_DRAWINGS[block.category as keyof typeof CATEGORY_DRAWINGS];

        return (
          <section key={block.category} className="mt-8">
            <header className="flex items-center gap-2.5 px-5 pb-2">
              {Drawing ? <Drawing className="size-6 text-chalk-dim" /> : null}
              <h2 className="display text-2xl">{categoryLabel(block.category)}</h2>
            </header>

            <ul>
              {block.rows.map((row) => {
                const isDone = done.has(row.slug);

                return (
                  <li key={row.slug}>
                    <button
                      type="button"
                      onClick={() => toggle(row.slug)}
                      aria-pressed={isDone}
                      className={`flex w-full items-center gap-4 border-b border-chalk-line/60 px-5 py-4 text-left transition-opacity ${
                        isDone ? 'opacity-35' : ''
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-snug font-semibold">
                          {row.name}
                        </span>

                        <span className="mt-2 flex items-end gap-6">
                          {row.cells.map((cell) => (
                            <span key={cell.scope} className="flex flex-col">
                              <span className="eyebrow text-[0.625rem]">
                                {SCOPE_LABELS[cell.scope]}
                              </span>
                              <span
                                className={`value-pill ${valueSize} leading-none`}
                                style={{
                                  color:
                                    cell.value === null
                                      ? undefined
                                      : SCOPE_INK[cell.scope].hex,
                                }}
                              >
                                {cell.value ?? '—'}
                              </span>
                            </span>
                          ))}
                        </span>
                      </span>

                      {/* Marca de tiza: dibujada, no un emoji */}
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border ${
                          isDone ? 'border-ink-user' : 'border-chalk-line'
                        }`}
                      >
                        {isDone ? (
                          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                            <path
                              d="M5 13 L10 18 L19 6"
                              className="chalk-stroke"
                              stroke="#ffd24a"
                              strokeWidth="2.6"
                            />
                          </svg>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {automatic && behaviour ? (
        <section className="mt-8">
          <header className="flex items-center gap-2.5 px-5 pb-2">
            <h2 className="display text-2xl">{categoryLabel('cpu_controls')}</h2>
          </header>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => toggle('cpu_behaviour')}
                aria-pressed={done.has('cpu_behaviour')}
                className={`flex w-full items-center gap-4 border-b border-chalk-line/60 px-5 py-4 text-left transition-opacity ${
                  done.has('cpu_behaviour') ? 'opacity-35' : ''
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug font-semibold">
                    Comportamiento de la CPU
                  </span>
                  <span className="mt-2 flex flex-col">
                    <span className="eyebrow text-[0.625rem]">Ponlo en</span>
                    <span className={`value-pill ${valueSize} leading-none text-ink-user`}>
                      {behaviour.label}
                    </span>
                  </span>
                  <span className="mt-2 block text-xs text-chalk-dim">
                    Sus sliders no hacen falta: el juego los ajusta solo.
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </section>
      ) : null}


      {/* El progreso va abajo: al alcance del pulgar con el móvil en la mano,
          y así no se pelea con la cabecera del sitio, que también es fija y
          queda por encima. */}
      <div className="fixed inset-x-0 bottom-0 z-20 bg-board/95 backdrop-blur">
        <div className="chalk-rule" />
        <div className="mx-auto flex max-w-xl items-center gap-4 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-chalk/15"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Sliders ya metidos"
            >
              <div
                className="h-full rounded-full bg-ink-user transition-[width] duration-200"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="eyebrow mt-1.5">
              {completed} de {total} metidos
            </p>
          </div>

          {completed > 0 ? (
            <button
              type="button"
              onClick={() => setDone(new Set())}
              className="btn btn-ghost shrink-0 px-3 py-2 text-[0.625rem]"
            >
              Reiniciar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Mantiene la pantalla encendida mientras dura el modo consola. Meter treinta
 * valores a mano lleva su rato y que se apague el móvil a mitad es justo la
 * molestia que hace abandonar.
 *
 * El navegador suelta el bloqueo al ocultar la pestaña, así que se vuelve a
 * pedir al volver. Donde no existe la API, no pasa nada.
 */
function useWakeLock() {
  useEffect(() => {
    type Sentinel = { release: () => Promise<void>; released: boolean };
    const wakeLock = (
      navigator as Navigator & {
        wakeLock?: { request: (type: 'screen') => Promise<Sentinel> };
      }
    ).wakeLock;

    if (!wakeLock) return;

    let sentinel: Sentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const next = await wakeLock.request('screen');
        if (cancelled) {
          void next.release();
          return;
        }
        sentinel = next;
      } catch {
        // El navegador puede negarlo (batería baja, permisos). Sin drama.
      }
    };

    void acquire();
    document.addEventListener('visibilitychange', acquire);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', acquire);
      if (sentinel && !sentinel.released) void sentinel.release();
    };
  }, []);
}
