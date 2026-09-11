import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Avatar } from '@/components/avatar';
import { EmptyState } from '@/components/empty-state';
import { SetCard } from '@/components/set-card';
import { SignOutButton } from '@/components/sign-out-button';
import { getProfileByUsername, getSetsByOwner } from '@/lib/queries';
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
  if (!profile) notFound();

  const [sets, user] = await Promise.all([getSetsByOwner(profile.id), getCurrentUser()]);
  const isMe = user?.id === profile.id;

  const published = sets.filter((set) => set.is_published);
  const drafts = sets.filter((set) => !set.is_published);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="flex flex-wrap items-start gap-5 border-b border-line pb-8">
        <Avatar url={profile.avatar_url} name={profile.display_name ?? profile.username} size={64} />

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {profile.display_name ?? profile.username}
          </h1>
          <p className="mt-1 text-sm text-muted">
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
          </p>
          {profile.bio ? <p className="mt-3 max-w-prose text-sm text-chalk/90">{profile.bio}</p> : null}
        </div>

        {isMe ? <SignOutButton /> : null}
      </header>

      <section className="py-8">
        <h2 className="text-lg font-bold tracking-tight">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </div>
          )}
        </div>
      </section>

      {isMe && drafts.length > 0 ? (
        <section className="border-t border-line py-8">
          <h2 className="text-lg font-bold tracking-tight">
            Borradores <span className="text-muted">· sólo los ves tú</span>
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
