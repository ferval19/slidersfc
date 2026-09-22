import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';

import { Avatar } from '@/components/avatar';
import { CommentComposer, CommentList } from '@/components/comment-thread';
import { FavoriteButton } from '@/components/favorite-button';
import { SetConditions } from '@/components/set-conditions';
import { SetHistory } from '@/components/set-history';
import { SetStickyBar } from '@/components/set-sticky-bar';
import { SetOwnerActions } from '@/components/set-owner-actions';
import { ShareSet } from '@/components/share-set';
import { SliderTable } from '@/components/slider-table';
import {
  isFavorite,
  getGames,
  getSetDetail,
  getSetHistory,
  getUsernameAfterRename,
} from '@/lib/queries';
import { buildSetView } from '@/lib/set-view';
import { conditionsSummary } from '@/lib/set-conditions';
import { comparePickerPath, consolePath, profilePath, setPath } from '@/lib/paths';
import { publicSiteUrl } from '@/lib/site-url';
import { getCurrentUser } from '@/lib/supabase/server';

type Params = Promise<{ username: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { username, slug } = await params;
  const detail = await getSetDetail({ username, slug });

  if (!detail) return { title: 'Set no encontrado' };

  const author = detail.owner.display_name ?? detail.owner.username;
  const title = `${detail.set.title} — ${detail.game.name}`;
  const description =
    detail.set.description?.replace(/\s+/g, ' ').slice(0, 180) ??
    `Set de sliders de ${detail.game.name}, por ${author}.`;

  // La imagen la genera opengraph-image.tsx; Next la enlaza sola.
  return {
    title,
    description,
    alternates: { canonical: setPath(detail.owner.username, detail.set.slug) },
    openGraph: {
      title,
      description,
      type: 'article',
      url: setPath(detail.owner.username, detail.set.slug),
      authors: [author],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function SetDetailPage({ params }: { params: Params }) {
  const { username, slug } = await params;

  const [detail, user, games] = await Promise.all([
    getSetDetail({ username, slug }),
    getCurrentUser(),
    getGames(),
  ]);
  if (!detail) {
    // Igual que en el perfil: un enlace compartido con el nombre de antes
    // sigue llevando al set.
    const current = await getUsernameAfterRename(username);
    if (current) permanentRedirect(setPath(current, slug));
    notFound();
  }

  // El historial y el estado de favorito se piden con el set ya resuelto:
  // los dos necesitan su id.
  const [history, favorited] = await Promise.all([
    getSetHistory(detail.set.id),
    isFavorite(detail.set.id, user?.id ?? null),
  ]);

  const view = buildSetView(detail, user?.id ?? null);
  const isOwner = user?.id === detail.owner.id;
  const shareUrl = `${publicSiteUrl()}${setPath(detail.owner.username, detail.set.slug)}`;

  return (
    <article className="mx-auto max-w-5xl px-5 py-10">
      <header className="flex flex-col gap-4 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/juegos/${detail.game.slug}`} className="chip chip-active">
            {detail.game.slug.toUpperCase()}
          </Link>
          {detail.set.version > 1 ? (
            <span className="chip">Versión {detail.set.version}</span>
          ) : null}
          {!detail.set.is_published ? (
            <span className="chip border-ink-user/40 text-ink-user">Borrador · sólo tú lo ves</span>
          ) : null}
        </div>

        <h1 className="display text-[clamp(2.25rem,5.5vw,3.5rem)]">{detail.set.title}</h1>

        <div className="flex flex-wrap items-center gap-2.5 text-sm text-chalk-dim">
          <Avatar
            url={detail.owner.avatar_url}
            name={detail.owner.display_name ?? detail.owner.username}
            size={30}
          />
          <Link
            href={profilePath(detail.owner.username)}
            className="font-bold text-chalk hover:text-ink-user"
          >
            {detail.owner.display_name ?? detail.owner.username}
          </Link>
          {detail.owner.twitter_handle ? (
            <a
              href={`https://x.com/${detail.owner.twitter_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-chalk"
            >
              @{detail.owner.twitter_handle}
            </a>
          ) : null}
          <span>·</span>
          <span>{formatDate(detail.set.created_at)}</span>
          <span>·</span>
          <span>
            {view.totalComments} {view.totalComments === 1 ? 'comentario' : 'comentarios'}
          </span>
        </div>

        {detail.set.description ? (
          <p className="max-w-prose text-base leading-relaxed whitespace-pre-wrap text-chalk/90">
            {detail.set.description}
          </p>
        ) : null}

        <SetConditions set={detail.set} />

        {/* «Meter en la consola» es la acción principal: es para lo que se
            abre un set. Compartir va para todo el mundo y no sólo para el
            autor, porque un set se comparte más veces de las que se edita. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
          <Link
            href={consolePath(detail.owner.username, detail.set.slug)}
            className="btn btn-primary"
          >
            Meter en la consola
          </Link>

          {detail.set.is_published ? (
            <ShareSet url={shareUrl} title={detail.set.title} gameName={detail.game.name} />
          ) : null}

          {/* La pregunta que se hace quien llega aquí desde otro set no es qué
              valores tiene éste, sino en qué se diferencia del suyo. */}
          <Link
            href={comparePickerPath({
              username: detail.owner.username,
              slug: detail.set.slug ?? '',
            })}
            className="btn btn-quiet"
          >
            Comparar
          </Link>

          {/* El autor no se ve el botón: el SQL prohíbe guardarse el set
              propio, y enseñárselo sólo invitaría a un error de RLS. */}
          {!isOwner ? (
            <FavoriteButton
              setId={detail.set.id}
              pathname={setPath(detail.owner.username, detail.set.slug)}
              mine={favorited}
              loginHref={user ? undefined : `/login?next=${setPath(detail.owner.username, detail.set.slug)}`}
            />
          ) : null}

          {isOwner ? (
            <SetOwnerActions
              setId={detail.set.id}
              username={detail.owner.username}
              slug={detail.set.slug}
              isPublished={detail.set.is_published}
              otherGames={games
                .filter((game) => game.id !== detail.set.game_id)
                .map((game) => ({ slug: game.slug, name: game.name }))}
            />
          ) : null}
        </div>
      </header>

      <div className="chalk-rule" />

      {/* Aquí se viene a ver los valores, así que llegan pronto: título en un
          escalón más bajo que el de la portada y sin aire de sobra por medio. */}
      <section className="pt-6 pb-9">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="display text-3xl">Valores</h2>
          <p className="max-w-prose flex-1 text-xs text-chalk-dim">
            {view.hasReference
              ? 'La marca gris es lo que trae el juego de fábrica: lo que se separe de ella es lo que ha tocado el autor. Toca un número para comentarlo.'
              : 'Toca cualquier número para leer y dejar comentarios sobre ese valor concreto.'}
          </p>
        </div>

        <SetStickyBar
          title={detail.set.title}
          conditions={conditionsSummary(detail.set)}
          categories={view.blocks.map((block) => block.category)}
          consoleHref={consolePath(detail.owner.username, detail.set.slug)}
        />

        <SliderTable
          setId={detail.set.id}
          scopes={view.scopes}
          blocks={view.blocks}
          commentsByDefinition={view.commentsByDefinition}
          canComment={Boolean(user)}
          hasReference={view.hasReference}
          cpuBehaviour={view.cpuBehaviour}
          hasCpuBehaviour={view.hasCpuBehaviour}
        />
      </section>

      {/* El historial va entre los valores y los comentarios: primero qué es
          el set, luego cómo llegó a serlo, y después lo que dice la gente. */}
      {history.length > 0 ? (
        <>
          <div className="chalk-rule" />
          <SetHistory entries={history} />
        </>
      ) : null}

      <div className="chalk-rule" />

      <section className="py-9">
        <h2 className="display text-4xl">Sobre el set en general</h2>
        <p className="mt-1 text-xs text-chalk-dim">
          Para hablar del conjunto. Si tu comentario es sobre un valor concreto, mejor déjalo
          en su slider.
        </p>

        <div className="mt-5 flex flex-col gap-6">
          {view.generalComments.length > 0 ? (
            <CommentList comments={view.generalComments} />
          ) : (
            <p className="text-sm text-chalk-dim">Todavía no hay comentarios generales.</p>
          )}

          <CommentComposer
            setId={detail.set.id}
            canComment={Boolean(user)}
            placeholder="¿Qué tal te ha funcionado este set?"
          />
        </div>
      </section>
    </article>
  );
}
