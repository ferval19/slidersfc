import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { SetCard } from '@/components/set-card';
import { isMode } from '@/lib/constants';
import { getGameBySlug, getGames, getPublishedSets } from '@/lib/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) return { title: 'Juego no encontrado' };

  return {
    title: `Sliders de ${game.name}`,
    description: `Sets de sliders de ${game.name} publicados por la comunidad de SliderXI.`,
  };
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ modo?: string }>;
}) {
  const { slug } = await params;
  const { modo } = await searchParams;
  const activeMode = isMode(modo) ? modo : undefined;

  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [games, sets] = await Promise.all([
    getGames(),
    getPublishedSets({ gameSlug: slug, mode: activeMode, limit: 60 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow">{game.release_year ?? ''}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Sliders de {game.name}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {sets.length} {sets.length === 1 ? 'set publicado' : 'sets publicados'}
      </p>

      <div className="mt-8">
        <FilterBar games={games} activeGame={slug} activeMode={activeMode} />
      </div>

      <div className="mt-7">
        {sets.length === 0 ? (
          <EmptyState
            title={`Aún no hay sets de ${game.name}`}
            body="En cuanto alguien publique el primero aparecerá aquí, con sus valores por categoría y los comentarios de la comunidad."
            action={{ href: '/sets/nuevo', label: 'Publicar un set' }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sets.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
