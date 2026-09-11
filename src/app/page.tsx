import Link from 'next/link';

import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { SetCard } from '@/components/set-card';
import { isMode } from '@/lib/constants';
import { getGames, getPublishedSets } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string }>;
}) {
  const params = await searchParams;
  const activeMode = isMode(params.modo) ? params.modo : undefined;

  const [games, sets, user] = await Promise.all([
    getGames(),
    getPublishedSets({ mode: activeMode }),
    getCurrentUser(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="border-b border-line py-14 sm:py-20">
        <p className="eyebrow">Sliders de EA SPORTS FC · by Full Manual FG</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
          Los sliders que hacen que el juego
          <span className="text-accent"> se sienta bien</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
          Publica tu set, explica por qué cada valor está donde está, y deja que la
          comunidad comente <span className="text-chalk">slider a slider</span> en lugar
          de pelearse en un hilo de mil respuestas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={user ? '/sets/nuevo' : '/login?next=/sets/nuevo'} className="btn btn-primary">
            Publicar mi set
          </Link>
          <Link href="#sets" className="btn btn-ghost">
            Ver sets de la comunidad
          </Link>
        </div>
      </section>

      {/* Feed */}
      <section id="sets" className="py-10">
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-bold tracking-tight">Sets recientes</h2>
          <FilterBar games={games} activeMode={activeMode} />
        </div>

        <div className="mt-7">
          {sets.length === 0 ? (
            <EmptyState
              title="Todavía no hay sets aquí"
              body="Nadie ha publicado un set con estos filtros. Si tienes unos sliders que te funcionan, sé el primero — es literalmente para lo que existe esto."
              action={{ href: user ? '/sets/nuevo' : '/login?next=/sets/nuevo', label: 'Crear el primero' }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sets.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
