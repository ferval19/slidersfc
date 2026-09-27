import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { lang } from 'next/root-params';

import { EmptyState } from '@/components/empty-state';
import { FilterBar } from '@/components/filter-bar';
import { SetCard } from '@/components/set-card';
import { getDictionary } from '@/lib/i18n/dictionary';
import { alternates } from '@/lib/i18n/alternates';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { jsonLd } from '@/lib/json-ld';
import { localized } from '@/lib/paths';
import { getGameBySlug, getGames, getPublishedSets } from '@/lib/queries';
import { publicSiteUrl } from '@/lib/site-url';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, localeParam] = await Promise.all([params, lang()]);
  const locale = (localeParam ?? DEFAULT_LOCALE) as Locale;
  const game = await getGameBySlug(slug);
  const t = getDictionary(locale);

  if (!game) return { title: t.juegos.juegoNoEncontrado };

  return {
    title: t.set.slidersDeJuego(game.name),
    description: t.juegos.descripcion(game.name),
    alternates: alternates(locale, `/juegos/${slug}`),
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, localeParam] = await Promise.all([params, lang()]);
  const locale = (localeParam ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale);

  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [games, sets] = await Promise.all([
    getGames(),
    getPublishedSets({ gameSlug: slug, limit: 60 }),
  ]);

  const siteUrl = publicSiteUrl();
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.comun.inicio, item: `${siteUrl}${localized(locale, '/')}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.set.slidersDeJuego(game.name),
        item: `${siteUrl}${localized(locale, `/juegos/${slug}`)}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }} />
      <p className="eyebrow">{game.release_year ?? ''}</p>
      <h1 className="display mt-3 text-[clamp(2.75rem,9vw,5.5rem)]">
        {t.juegos.tituloLinea1}<br />
        <span className="text-ink-user">{game.name}</span>
      </h1>
      <p className="mt-3 text-sm text-chalk-dim">
        {sets.length} {t.juegos.setPublicado(sets.length)}
      </p>

      <div className="mt-8">
        <FilterBar games={games} activeGame={slug} locale={locale} />
      </div>

      <div className="mt-7">
        {sets.length === 0 ? (
          <EmptyState
            title={t.juegos.aunNoHaySets(game.name)}
            body={t.juegos.enCuantoAlguienPublique}
            action={{ href: localized(locale, '/sets/nuevo'), label: t.comun.publicarUnSet }}
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sets.map((set) => (
              <SetCard key={set.id} set={set} locale={locale} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
