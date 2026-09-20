import { ChalkClipboard } from '@/components/chalk';
import { SCOPE_LABELS } from '@/lib/constants';
import type { VersionEntry } from '@/lib/queries';

/**
 * Cómo ha ido cambiando un set.
 *
 * Un set no es una lista de números: es alguien afinando algo durante una
 * temporada. Leer «v3: bajé la velocidad dos puntos, los contragolpes eran
 * imposibles de defender» vale más que ver dos cifras.
 *
 * Se enseña el cambio y no la foto de cada versión, que es lo que se guarda.
 * La v1 no sale: no estrena nada, es el set tal como se publicó.
 */
export function SetHistory({ entries }: { entries: VersionEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="py-9">
      <header className="flex items-center gap-3">
        <ChalkClipboard className="size-8 shrink-0 text-chalk-dim" />
        <div>
          <p className="eyebrow">Cómo ha cambiado</p>
          <h2 className="display text-3xl">Historial</h2>
        </div>
      </header>

      <ol className="mt-6 flex flex-col gap-6">
        {entries.map((entry) => (
          <li key={entry.version} className="border-b border-chalk-line/60 pb-6 last:border-b-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display text-2xl text-ink-user">v{entry.version}</span>
              <span className="eyebrow">{formatDate(entry.createdAt)}</span>
              <span className="eyebrow ml-auto">
                {entry.changes.length}{' '}
                {entry.changes.length === 1 ? 'valor tocado' : 'valores tocados'}
              </span>
            </div>

            {entry.note ? (
              <p className="mt-3 max-w-prose text-sm leading-relaxed whitespace-pre-line text-chalk/90">
                {entry.note}
              </p>
            ) : null}

            {entry.changes.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-1.5">
                {entry.changes.map((change) => {
                  const delta = change.to - change.from;

                  return (
                    <li
                      key={`${change.name}-${change.scope}`}
                      // La cuarta columna va vacía a propósito: sin ella, el
                      // hueco sobrante se reparte entre las de los valores y
                      // el delta se va al otro extremo de la fila.
                      className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-0.5 text-sm sm:grid-cols-[minmax(8rem,16rem)_7rem_3rem_1fr]"
                    >
                      <span className="col-span-2 leading-tight sm:col-span-1">
                        {change.name}
                        <span className="eyebrow ml-2">{SCOPE_LABELS[change.scope]}</span>
                      </span>

                      <span className="value-pill text-chalk-dim">
                        {change.from} <span className="text-chalk-dim/60">→</span>{' '}
                        <span className="text-chalk">{change.to}</span>
                      </span>

                      <span
                        className={`value-pill text-xs ${
                          delta > 0 ? 'text-delta-up' : 'text-delta-down'
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
