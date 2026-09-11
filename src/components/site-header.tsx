import Link from 'next/link';

import { Avatar } from '@/components/avatar';
import { Logo } from '@/components/logo';
import { SITE_BYLINE } from '@/lib/constants';
import { getGames } from '@/lib/queries';
import { getSessionProfile } from '@/lib/supabase/server';

export async function SiteHeader() {
  const [session, games] = await Promise.all([
    getSessionProfile(),
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

          {/* Se decide con la SESIÓN, no con el perfil: si la fila de perfil
              falta, /perfil la repara. Antes se mostraba «Entrar» a alguien
              que ya estaba dentro. */}
          {session.user ? (
            <>
              <Link href="/sets/nuevo" className="btn btn-primary ml-2">
                <span className="sm:hidden">Nuevo</span>
                <span className="hidden sm:inline">Nuevo set</span>
              </Link>
              <Link
                href="/perfil"
                className="ml-1 flex items-center gap-2 px-1.5 py-1 transition-colors hover:text-ink-user"
                title="Mi perfil"
              >
                <Avatar
                  url={session.profile?.avatar_url}
                  name={session.profile?.display_name ?? session.profile?.username ?? session.user.email}
                  size={26}
                />
                <span className="eyebrow max-w-24 truncate text-chalk">
                  {session.profile?.username ?? 'Mi perfil'}
                </span>
              </Link>
            </>
          ) : (
            <Link href="/login?next=/perfil" className="btn btn-ghost ml-2">
              Entrar
            </Link>
          )}
        </nav>
      </div>
      <div className="chalk-rule" />
    </header>
  );
}
