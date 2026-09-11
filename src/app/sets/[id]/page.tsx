import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Avatar } from '@/components/avatar';
import { CommentComposer, CommentList } from '@/components/comment-thread';
import { SetOwnerActions } from '@/components/set-owner-actions';
import { SliderTable } from '@/components/slider-table';
import { getSetDetail } from '@/lib/queries';
import { buildSetView } from '@/lib/set-view';
import { getCurrentUser } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getSetDetail(id);

  if (!detail) return { title: 'Set no encontrado' };

  const author = detail.owner.display_name ?? detail.owner.username;
  const description =
    detail.set.description?.slice(0, 180) ??
    `Set de sliders de ${detail.game.name}, por ${author}.`;

  return {
    title: `${detail.set.title} — ${detail.game.name}`,
    description,
    openGraph: {
      title: `${detail.set.title} — ${detail.game.name}`,
      description,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: detail.set.title, description },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function SetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [detail, user] = await Promise.all([getSetDetail(id), getCurrentUser()]);
  if (!detail) notFound();

  const view = buildSetView(detail, user?.id ?? null);
  const isOwner = user?.id === detail.owner.id;

  return (
    <article className="mx-auto max-w-5xl px-5 py-10">
      <header className="flex flex-col gap-4 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/juegos/${detail.game.slug}`} className="chip chip-active">
            {detail.game.slug.toUpperCase()}
          </Link>
          {detail.set.version > 1 ? <span className="chip">Versión {detail.set.version}</span> : null}
          {!detail.set.is_published ? (
            <span className="chip border-ink-user/40 text-ink-user">Borrador · sólo tú lo ves</span>
          ) : null}
        </div>

        <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)]">{detail.set.title}</h1>

        <div className="flex flex-wrap items-center gap-2.5 text-sm text-chalk-dim">
          <Avatar
            url={detail.owner.avatar_url}
            name={detail.owner.display_name ?? detail.owner.username}
            size={30}
          />
          <Link href={`/u/${detail.owner.username}`} className="font-bold text-chalk hover:text-ink-user">
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

        {isOwner ? (
          <div className="pt-1">
            <SetOwnerActions setId={detail.set.id} isPublished={detail.set.is_published} />
          </div>
        ) : null}
      </header>

      <div className="chalk-rule" />

      <section className="py-9">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="display text-4xl">Valores</h2>
          <p className="max-w-xs text-xs text-chalk-dim">
            Toca cualquier número para leer y dejar comentarios sobre ese valor concreto.
          </p>
        </div>

        <SliderTable
          setId={detail.set.id}
          scopes={view.scopes}
          blocks={view.blocks}
          commentsByDefinition={view.commentsByDefinition}
          canComment={Boolean(user)}
        />
      </section>

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
