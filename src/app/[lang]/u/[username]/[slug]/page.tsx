import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { lang } from 'next/root-params';

import { Avatar } from '@/components/avatar';
import { ChalkCommentedValue, ChalkPad, ChalkScales } from '@/components/chalk';
import { CommentComposer, CommentList } from '@/components/comment-thread';
import { FavoriteButton } from '@/components/favorite-button';
import { SetConditions } from '@/components/set-conditions';
import { SetHistory } from '@/components/set-history';
import { SetStickyBar } from '@/components/set-sticky-bar';
import { SetOwnerActions } from '@/components/set-owner-actions';
import { ShareButton } from '@/components/share-button';
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
import { getDictionary } from '@/lib/i18n/dictionary';
import { alternates } from '@/lib/i18n/alternates';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { jsonLd } from '@/lib/json-ld';
import { comparePickerPath, consolePath, localized, profilePath, setPath } from '@/lib/paths';
import { publicSiteUrl } from '@/lib/site-url';
import { getCurrentUser } from '@/lib/supabase/server';

type Params = Promise<{ username: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { username, slug } = await params;
  const [detail, locale] = await Promise.all([
    getSetDetail({ username, slug }),
    lang() as Promise<Locale | undefined>,
  ]);

  if (!detail) return { title: 'Set no encontrado' };

  const author = detail.owner.display_name ?? detail.owner.username;
  const title = `${detail.set.title} — ${detail.game.name}`;
  const description =
    detail.set.description?.replace(/\s+/g, ' ').slice(0, 180) ??
    `Set de sliders de ${detail.game.name}, por ${author}.`;
  const resolvedLocale = (locale ?? DEFAULT_LOCALE) as Locale;
  const path = localized(resolvedLocale, setPath(detail.owner.username, detail.set.slug));

  // La imagen la genera opengraph-image.tsx; Next la enlaza sola.
  return {
    title,
    description,
    alternates: alternates(resolvedLocale, setPath(detail.owner.username, detail.set.slug)),
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      authors: [author],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function SetDetailPage({ params }: { params: Params }) {
  const { username, slug } = await params;

  const [detail, user, games, localeParam] = await Promise.all([
    getSetDetail({ username, slug }),
    getCurrentUser(),
    getGames(),
    lang(),
  ]);
  const locale = (localeParam ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale);
  if (!detail) {
    // Igual que en el perfil: un enlace compartido con el nombre de antes
    // sigue llevando al set.
    const current = await getUsernameAfterRename(username);
    if (current) permanentRedirect(localized(locale, setPath(current, slug)));
    notFound();
  }

  // El historial y el estado de favorito se piden con el set ya resuelto:
  // los dos necesitan su id.
  const [history, favorited] = await Promise.all([
    getSetHistory(detail.set.id, locale),
    isFavorite(detail.set.id, user?.id ?? null),
  ]);

  const view = buildSetView(detail, user?.id ?? null, locale);
  const isOwner = user?.id === detail.owner.id;
  const siteUrl = publicSiteUrl();
  const shareUrl = `${siteUrl}${localized(locale, setPath(detail.owner.username, detail.set.slug))}`;
  const authorName = detail.owner.display_name ?? detail.owner.username;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.comun.inicio, item: `${siteUrl}${localized(locale, '/')}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.set.slidersDeJuego(detail.game.name),
        item: `${siteUrl}${localized(locale, `/juegos/${detail.game.slug}`)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: authorName,
        item: `${siteUrl}${localized(locale, profilePath(detail.owner.username))}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: detail.set.title,
        item: shareUrl,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-5xl px-5 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }} />
      <header className="flex flex-col gap-4 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={localized(locale, `/juegos/${detail.game.slug}`)} className="chip chip-active">
            {detail.game.slug.toUpperCase()}
          </Link>
          {detail.set.version > 1 ? (
            <span className="chip">{t.set.version(detail.set.version)}</span>
          ) : null}
          {!detail.set.is_published ? (
            <span className="chip border-ink-user/40 text-ink-user">{t.set.borrador}</span>
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
            href={localized(locale, profilePath(detail.owner.username))}
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
          <span>{formatDate(detail.set.created_at, locale)}</span>
          {/* Sólo si hay alguno. Un «0 comentarios» en el tercer renglón de la
              ficha es la prueba social al revés: antes de invitar a nadie a
              hablar, la página anunciaba que aquí no habla nadie. */}
          {view.totalComments > 0 ? (
            <>
              <span>·</span>
              <span>
                {view.totalComments} {t.set.comentarios(view.totalComments)}
              </span>
            </>
          ) : null}
        </div>

        {detail.set.description ? (
          <p className="max-w-prose text-base leading-relaxed whitespace-pre-wrap text-chalk/90">
            {detail.set.description}
          </p>
        ) : null}

        <SetConditions set={detail.set} />

        {/* Dos escalones, no ocho botones iguales. Arriba, lo que hace
            cualquiera con el set —meterlo en la consola es a lo que se viene,
            y compartir se usa más veces que editar—. Debajo, y sólo si es
            tuyo, lo que se le hace al set. */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={localized(locale, consolePath(detail.owner.username, detail.set.slug))}
              className="btn btn-primary"
            >
              <ChalkPad className="size-4" />
              {t.set.meterEnConsola}
            </Link>

            {detail.set.is_published ? (
              <ShareButton
                url={shareUrl}
                title={detail.set.title}
                text={`${detail.set.title} — sliders de ${detail.game.name}`}
              />
            ) : null}

            {/* La pregunta que se hace quien llega aquí desde otro set no es
                qué valores tiene éste, sino en qué se diferencia del suyo. */}
            <Link
              href={localized(
                locale,
                comparePickerPath({
                  username: detail.owner.username,
                  slug: detail.set.slug ?? '',
                }),
              )}
              className="btn btn-quiet"
            >
              <ChalkScales className="size-4" />
              {t.set.comparar}
            </Link>

            {/* El autor no se ve el botón: el SQL prohíbe guardarse el set
                propio, y enseñárselo sólo invitaría a un error de RLS. */}
            {!isOwner ? (
              <FavoriteButton
                setId={detail.set.id}
                pathname={localized(locale, setPath(detail.owner.username, detail.set.slug))}
                mine={favorited}
                loginHref={
                  user
                    ? undefined
                    : localized(locale, `/login?next=${setPath(detail.owner.username, detail.set.slug)}`)
                }
              />
            ) : null}
          </div>

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
          <h2 className="display text-3xl">{t.set.valores}</h2>
          <p className="max-w-prose flex-1 text-xs text-chalk-dim">
            {view.hasReference ? t.set.ayudaValoresConReferencia : t.set.ayudaValoresSinReferencia}
          </p>
        </div>

        {/* Un set sin comentarios no enseña por ningún lado que se pueda
            comentar: la señal —el numerito sobre el valor— sólo aparece
            cuando ya hay alguno. Arranque en frío de manual, y el primero
            tenía que adivinarlo. */}
        {view.totalComments === 0 ? (
          <p className="panel mt-5 flex items-center gap-3 px-4 py-3 text-sm text-chalk/90">
            <ChalkCommentedValue className="size-9 shrink-0 text-chalk-dim" />
            {t.set.seElPrimero}
          </p>
        ) : null}

        <SetStickyBar
          title={detail.set.title}
          conditions={conditionsSummary(detail.set)}
          categories={view.blocks.map((block) => block.category)}
          consoleHref={localized(locale, consolePath(detail.owner.username, detail.set.slug))}
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
        <h2 className="display text-4xl">{t.set.sobreElSet}</h2>
        <p className="mt-1 text-xs text-chalk-dim">{t.set.sobreElSetAyuda}</p>

        <div className="mt-5 flex flex-col gap-6">
          {view.generalComments.length > 0 ? (
            <CommentList comments={view.generalComments} />
          ) : (
            <p className="text-sm text-chalk-dim">{t.set.sinComentariosGenerales}</p>
          )}

          <CommentComposer
            setId={detail.set.id}
            canComment={Boolean(user)}
            placeholder={t.set.placeholderComentarioGeneral}
          />
        </div>
      </section>
    </article>
  );
}
