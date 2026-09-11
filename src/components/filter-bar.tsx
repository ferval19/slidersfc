import Link from 'next/link';

import type { Game } from '@/lib/database.types';

/**
 * Filtro del feed: sólo el juego, porque es lo único que cambia de verdad qué
 * sliders tiene un set. Son enlaces, no estado de cliente, así que cada juego
 * tiene su propia URL indexable y compartible.
 */
export function FilterBar({ games, activeGame }: { games: Game[]; activeGame?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1">Juego</span>
      <Link href="/" className={`chip ${!activeGame ? 'chip-active' : ''}`}>
        Todos
      </Link>
      {games.map((game) => (
        <Link
          key={game.slug}
          href={`/juegos/${game.slug}`}
          className={`chip ${activeGame === game.slug ? 'chip-active' : ''}`}
        >
          {game.slug}
        </Link>
      ))}
    </div>
  );
}
