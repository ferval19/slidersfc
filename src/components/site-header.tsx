import Link from 'next/link';

import { Avatar } from '@/components/avatar';
import { Logo } from '@/components/logo';
import { SITE_BYLINE } from '@/lib/constants';
import { getCurrentProfile } from '@/lib/supabase/server';
import { getGames } from '@/lib/queries';

export async function SiteHeader() {
  const [profile, games] = await Promise.all([
    getCurrentProfile().catch(() => null),
    getGames().catch(() => []),
  ]);

  return (
    <header className="sticky top-0 z-30 bg-board/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Link href="/" className="flex items-baseline gap-2.5">
          <Logo />
          <span className="eyebrow hidden sm:inline">{SITE_BYLINE}</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          {games.slice(0, 3).map((game) => (
            <Link
              key={game.slug}
              href={`/juegos/${game.slug}`}
              className="hidden px-2.5 py-1.5 font-mono text-xs font-medium tracking-[0.12em] text-chalk-dim uppercase transition-colors hover:text-chalk sm:block"
            >
              {game.slug}
            </Link>
          ))}

          {profile ? (
            <>
              <Link href="/sets/nuevo" className="btn btn-primary ml-2">
                Nuevo set
              </Link>
              <Link
                href={`/u/${profile.username}`}
                className="ml-1 p-1"
                title={`Perfil de @${profile.username}`}
              >
                <Avatar
                  url={profile.avatar_url}
                  name={profile.display_name ?? profile.username}
                  size={28}
                />
              </Link>
            </>
          ) : (
            <Link href="/login" className="btn btn-ghost ml-2">
              Entrar
            </Link>
          )}
        </nav>
      </div>
      <div className="chalk-rule" />
    </header>
  );
}
