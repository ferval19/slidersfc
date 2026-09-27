import type { Metadata } from 'next';
import Link from 'next/link';

import { ChalkClipboard } from '@/components/chalk';
import { Hero, pickHero } from '@/components/hero';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { SetCard } from '@/components/set-card';
import { ScaleLegend, ScaleTrack } from '@/components/slider-scale';
import { SCOPE_LABELS } from '@/lib/constants';
import { getGames, getPublishedSets } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * Muestra de cómo se lee un set. No son valores de relleno: son cuatro filas
 * reales del set «Full Manual FG v3.0», así que la separación entre el usuario
 * y la CPU es la de verdad.
 */
const SAMPLE = [
  { name: 'Velocidad', user: 33, cpu: 32 },
  { name: 'Frecuencia de desmarques', user: 85, cpu: 80 },
  { name: 'Altura de la línea', user: 50, cpu: 55 },
  { name: 'Ancho de la línea', user: 66, cpu: 75 },
];

export default async function HomePage() {
  const [games, sets, user] = await Promise.all([
    getGames(),
    getPublishedSets(),
    getCurrentUser(),
  ]);

  const newSetHref = user ? '/sets/nuevo' : '/login?next=/sets/nuevo';
  // La portada es dinámica (lee la sesión), así que esto se resuelve en cada
  // petición y cada recarga trae un hero distinto.
  const hero = pickHero();

  return (
    <div className="mx-auto max-w-6xl px-5">
      <Hero hero={hero} newSetHref={newSetHref} setCount={sets.length} />

      {/* Los sets, lo primero después del hero. Antes venían detrás de los dos
          bloques explicativos y había que bajar dos pantallas y media en el
          móvil para ver uno: en una web que va de sets publicados, eso era
          tener el contenido escondido detrás de la explicación. */}
      <section id="sets" className="scroll-mt-[var(--header-h)] pt-4 sm:pt-8">
        <div className="flex flex-col gap-5">
          <h2 className="display text-4xl">Sets recientes</h2>
          <FilterBar games={games} />
        </div>

        <div className="mt-8">
          {sets.length === 0 ? (
            <EmptyState
              title="La pizarra está en blanco"
              body="Todavía no hay ningún set publicado. Si tienes unos valores que te funcionan, súbelos: es exactamente para lo que existe esto."
              action={{
                href: newSetHref,
                label: 'Publicar el primero',
              }}
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sets.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* La tesis, en funcionamiento. Debajo del listado: quien ya ha visto
          que hay sets es quien se pregunta cómo se leen. */}
      <section className="panel mt-16 px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <h2 className="display text-2xl">Así se lee un set</h2>
          <ScaleLegend scopes={['user', 'cpu']} labels={SCOPE_LABELS} />
        </div>

        <ul className="mt-5">
          {SAMPLE.map((row) => (
            <li
              key={row.name}
              className="grid items-center gap-x-5 gap-y-1 border-b border-chalk-line/60 py-2.5 last:border-b-0 sm:grid-cols-[minmax(7rem,11rem)_1fr_auto]"
            >
              <span className="text-sm font-semibold">{row.name}</span>
              <ScaleTrack
                min={0}
                max={100}
                marks={[
                  { scope: 'user', value: row.user },
                  { scope: 'cpu', value: row.cpu },
                ]}
              />
              <span className="flex gap-4">
                <span className="value-pill w-8 text-right text-base text-ink-user">{row.user}</span>
                <span className="value-pill w-8 text-right text-base text-ink-rival">{row.cpu}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-5 max-w-prose text-sm text-chalk-dim">
          Las muescas comparten carril para leer la forma del set de un vistazo, sin
          comparar cincuenta números a mano. En un set publicado, cada número abre su
          propio hilo de comentarios.
        </p>
      </section>

      {/* La guía, al final: quien acaba de entender cómo se lee un set es
          justo quien se pregunta qué hace falta para publicar el suyo. */}
      <section className="panel mt-6 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
        <ChalkClipboard className="mx-auto size-24 shrink-0 text-chalk-dim sm:mx-0 sm:size-28" />

        <div className="min-w-0 flex-1">
          <p className="eyebrow">La guía</p>
          <h2 className="display mt-2 text-3xl">Qué lleva un set</h2>
          <p className="mt-3 max-w-prose text-sm text-chalk-dim">
            Todo lo que se puede contar de un set aquí, campo por campo, y por qué cada cosa
            importa. Casi nada es obligatorio, pero cuanto más pongas, más le sirve a quien se lo
            lleve.
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {['Dificultad, tiempos y cámara', 'Los valores y sus lados', 'Comportamiento de la CPU', 'Comentarios valor a valor'].map(
              (topic) => (
                <li key={topic} className="chip">
                  {topic}
                </li>
              ),
            )}
          </ul>

          <Link href="/guia" className="btn btn-ghost mt-6">
            Leer la guía
          </Link>
        </div>
      </section>
    </div>
  );
}
