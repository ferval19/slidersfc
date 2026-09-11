import Link from 'next/link';

import { PitchDiagram } from '@/components/chalk';
import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { SetCard } from '@/components/set-card';
import { ScaleLegend, ScaleTrack } from '@/components/slider-scale';
import { SCOPE_LABELS } from '@/lib/constants';
import { getGames, getPublishedSets } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

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

  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="grid items-center gap-10 pt-12 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-16">
        <div>
          <p className="eyebrow">EA Sports FC 27 y FC 26 · by Full Manual FG</p>

          <h1 className="display mt-5 text-[clamp(3.25rem,11vw,6.5rem)]">
            Publica tus sliders
            <br />
            y que te discutan
            <br />
            <span className="text-ink-user">cada valor</span>
          </h1>

          <p className="mt-7 max-w-prose text-base text-chalk-dim sm:text-lg">
            Un set no se explica con una captura de pantalla. Aquí cada valor lleva su
            propio hilo: por qué 35 y no 42, con qué dificultad, y a quién le funciona.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={user ? '/sets/nuevo' : '/login?next=/sets/nuevo'}
              className="btn btn-primary"
            >
              Publicar mi set
            </Link>
            <Link href="#sets" className="btn btn-ghost">
              Ver los sets
            </Link>
          </div>
        </div>

        <PitchDiagram className="mx-auto w-full max-w-[19rem] lg:max-w-none" />
      </section>

      {/* La tesis, en funcionamiento */}
      <section className="panel px-5 py-6 sm:px-7">
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

      {/* Feed */}
      <section id="sets" className="pt-16">
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
                href: user ? '/sets/nuevo' : '/login?next=/sets/nuevo',
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
    </div>
  );
}
