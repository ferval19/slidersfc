import Link from 'next/link';

import { MODES } from '@/lib/constants';
import type { Game } from '@/lib/database.types';

/**
 * Filtros del feed. Son enlaces, no estado de cliente: cada combinación tiene
 * su propia URL compartible y el servidor hace el trabajo.
 *
 * El juego vive en la ruta (/ o /juegos/fc27) y el modo en la query (?modo=),
 * para que las páginas de juego sean indexables por sí mismas.
 */
export function FilterBar({
  games,
  activeGame,
  activeMode,
}: {
  games: Game[];
  activeGame?: string;
  activeMode?: string;
}) {
  const withMode = (path: string, mode?: string) =>
    mode ? `${path}?modo=${mode}` : path;

  const currentPath = activeGame ? `/juegos/${activeGame}` : '/';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">Juego</span>
        <Link href={withMode('/', activeMode)} className={`chip ${!activeGame ? 'chip-active' : ''}`}>
          Todos
        </Link>
        {games.map((game) => (
          <Link
            key={game.slug}
            href={withMode(`/juegos/${game.slug}`, activeMode)}
            className={`chip ${activeGame === game.slug ? 'chip-active' : ''}`}
          >
            {game.slug.toUpperCase()}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">Modo</span>
        <Link href={currentPath} className={`chip ${!activeMode ? 'chip-active' : ''}`}>
          Todos
        </Link>
        {MODES.map((mode) => (
          <Link
            key={mode.value}
            href={withMode(currentPath, mode.value)}
            className={`chip ${activeMode === mode.value ? 'chip-active' : ''}`}
          >
            {mode.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
