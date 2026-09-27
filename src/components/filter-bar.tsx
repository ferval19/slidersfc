import Link from 'next/link';

import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';
import type { Game } from '@/lib/database.types';

/**
 * Filtro del feed: sólo el juego, porque es lo único que cambia de verdad qué
 * sliders tiene un set. Son enlaces, no estado de cliente, así que cada juego
 * tiene su propia URL indexable y compartible.
 */
export function FilterBar({
  games,
  activeGame,
  locale,
}: {
  games: Game[];
  activeGame?: string;
  locale: Locale;
}) {
  const t = getDictionary(locale).filtro;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1">{t.juego}</span>
      <Link href={localized(locale, '/')} className={`chip ${!activeGame ? 'chip-active' : ''}`}>
        {t.todos}
      </Link>
      {games.map((game) => (
        <Link
          key={game.slug}
          href={localized(locale, `/juegos/${game.slug}`)}
          className={`chip ${activeGame === game.slug ? 'chip-active' : ''}`}
        >
          {game.slug}
        </Link>
      ))}
    </div>
  );
}
