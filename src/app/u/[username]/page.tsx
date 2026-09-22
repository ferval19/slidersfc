import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';

import { Avatar } from '@/components/avatar';
import { EmptyState } from '@/components/empty-state';
import { SetCard } from '@/components/set-card';
import { SignOutButton } from '@/components/sign-out-button';
import {
  getFavoriteSetsByUser,
  getProfileByUsername,
  getSetsByOwner,
  getUsernameAfterRename,
} from '@/lib/queries';
import { editProfilePath, profilePath } from '@/lib/paths';
import { getCurrentUser } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) return { title: 'Perfil no encontrado' };

  const name = profile.display_name ?? profile.username;

  return {
    title: `${name} (@${profile.username})`,
    description: profile.bio ?? `Sets de sliders publicados por ${name} en SlidersFC.`,
    openGraph: {
      title: `${name} en SlidersFC`,
      description: profile.bio ?? `Sets de sliders publicados por ${name}.`,
      type: 'profile',
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await getProfileByUsername(username);

  if (!profile) {
    // Puede ser el nombre de antes de alguien: los enlaces que ya circulan no
    // tienen por qué morir porque se haya cambiado el nombre.
    const current = await getUsernameAfterRename(username);
    if (current) permanentRedirect(profilePath(current));
    notFound();
  }

  const [sets, favorites, user] = await Promise.all([
    getSetsByOwner(profile.id),
    getFavoriteSetsByUser(profile.id),
    getCurrentUser(),
  ]);
  const isMe = user?.id === profile.id;

  const published = sets.filter((set) => set.is_published);
  const drafts = sets.filter((set) => !set.is_published);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="flex flex-wrap items-start gap-5 pb-8">
        <Avatar url={profile.avatar_url} name={profile.display_name ?? profile.username} size={64} />

        <div className="min-w-0 flex-1">
          <h1 className="display text-[clamp(2.25rem,6vw,3.5rem)]">
            {profile.display_name ?? profile.username}
          </h1>
          <p className="mt-1 text-sm text-chalk-dim">
            @{profile.username}
            {profile.twitter_handle ? (
              <>
                {' · '}
                <a
                  href={`https://x.com/${profile.twitter_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-chalk"
                >
                  X: @{profile.twitter_handle}
                </a>
              </>
            ) : null}
            {profile.youtube_url ? (
              <>
                {' · '}
                <a
                  href={profile.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-chalk"
                >
                  YouTube: {profile.youtube_url.replace('https://www.youtube.com/', '')}
                </a>
              </>
            ) : null}
          </p>
          {profile.bio ? <p className="mt-3 max-w-prose text-sm text-chalk/90">{profile.bio}</p> : null}
        </div>

        {isMe ? (
          <div className="flex flex-wrap items-center gap-2">
            <Link href={editProfilePath()} className="btn btn-quiet">
              Editar perfil
            </Link>
            <SignOutButton />
          </div>
        ) : null}
      </header>

      <section className="py-8">
        <h2 className="display text-3xl">
          {published.length} {published.length === 1 ? 'set publicado' : 'sets publicados'}
        </h2>

        <div className="mt-5">
          {published.length === 0 ? (
            <EmptyState
              title={isMe ? 'Aún no has publicado nada' : 'Este usuario no tiene sets públicos'}
              body={
                isMe
                  ? 'Crea tu primer set con los valores que usas de verdad. Es lo que hace que alguien vuelva a tu perfil.'
                  : 'Cuando publique un set aparecerá aquí.'
              }
              action={isMe ? { href: '/sets/nuevo', label: 'Crear mi primer set' } : undefined}
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {isMe && drafts.length > 0 ? (
        <>
          <div className="chalk-rule" />
          <section className="py-9">
            <h2 className="display text-3xl">
              Borradores <span className="text-chalk-dim">· sólo los ves tú</span>
            </h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {drafts.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </ul>
          </section>
        </>
      ) : null}

      {/* En el perfil propio, vacío invita a guardar; en el de otro no se
          pinta nada: no hace falta anunciar que alguien no ha guardado nada. */}
      {favorites.length > 0 || isMe ? (
        <>
          <div className="chalk-rule" />
          <section className="py-9">
            <h2 className="display text-3xl">
              Favoritos <span className="text-chalk-dim">· {favorites.length}</span>
            </h2>

            <div className="mt-5">
              {favorites.length === 0 ? (
                <EmptyState
                  title="Aún no has guardado nada"
                  body="Cuando veas un set que te sirva de verdad, guárdalo desde su ficha. Aquí es donde vuelves a encontrarlo."
                  action={{ href: '/', label: 'Ver la portada' }}
                />
              ) : (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((set) => (
                    <SetCard key={set.id} set={set} />
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
