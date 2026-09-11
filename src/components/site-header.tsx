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
    <header className="sticky top-0 z-30 border-b border-line bg-void/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-baseline gap-2">
          <Logo />
          <span className="hidden text-[0.625rem] tracking-[0.14em] text-muted uppercase sm:inline">
            {SITE_BYLINE}
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 text-sm">
          {games.slice(0, 3).map((game) => (
            <Link
              key={game.slug}
              href={`/juegos/${game.slug}`}
              className="hidden rounded-lg px-2.5 py-1.5 font-semibold text-muted transition-colors hover:text-chalk sm:block"
            >
              {game.slug.toUpperCase()}
            </Link>
          ))}

          {profile ? (
            <>
              <Link href="/sets/nuevo" className="btn btn-primary ml-2">
                Nuevo set
              </Link>
              <Link
                href={`/u/${profile.username}`}
                className="ml-1 flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-raised"
                title={`Perfil de @${profile.username}`}
              >
                <Avatar url={profile.avatar_url} name={profile.display_name ?? profile.username} size={28} />
              </Link>
            </>
          ) : (
            <Link href="/login" className="btn btn-ghost ml-2">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
