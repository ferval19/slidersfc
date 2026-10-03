import type { MetadataRoute } from 'next';

import { DEFAULT_LOCALE, LOCALES, localePath } from '@/lib/i18n/locale';
import { setPath, profilePath } from '@/lib/paths';
import { publicSiteUrl } from '@/lib/site-url';
import { createSupabaseAnonClient } from '@/lib/supabase/anon';

const siteUrl = publicSiteUrl();

export const revalidate = 3600;

/**
 * Una entrada por idioma, y cada una declarando a la otra.
 *
 * El `languages` de aquí es el mismo `hreflang` que llevan las páginas, pero
 * en el sitemap: Google pide que vayan en los dos sitios o en ninguno. Faltaba
 * entero —el sitemap sólo traía el castellano— así que la mitad inglesa de la
 * web no se estaba ofreciendo a nadie.
 */
function enDosIdiomas(
  path: string,
  resto: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'>,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${siteUrl}${localePath(locale, path)}`]),
  );

  return LOCALES.map((locale) => ({
    ...resto,
    url: `${siteUrl}${localePath(locale, path)}`,
    alternates: { languages: { ...languages, 'x-default': `${siteUrl}${localePath(DEFAULT_LOCALE, path)}` } },
  }));
}

/**
 * Usa el cliente anónimo a propósito: sin `cookies()` la ruta se puede cachear
 * y revalidar cada hora, en vez de regenerarse en cada petición de un bot.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    ...enDosIdiomas('/', { changeFrequency: 'daily', priority: 1 }),
    ...enDosIdiomas('/guia', { changeFrequency: 'monthly', priority: 0.6 }),
  ];

  let games: { slug: string }[] = [];
  let sets: { slug: string; updated_at: string; profiles: { username: string } | null }[] = [];

  try {
    const supabase = createSupabaseAnonClient();

    const [gamesResult, setsResult] = await Promise.all([
      supabase.from('games').select('slug'),
      supabase
        .from('slider_sets')
        .select('slug, updated_at, profiles!inner ( username )')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(500),
    ]);

    games = gamesResult.data ?? [];
    sets = (setsResult.data ?? []) as unknown as typeof sets;
  } catch (error) {
    console.error('[slidersfc] sitemap falló:', error);
    return home;
  }

  const authors = new Set(
    sets
      .map((set) => set.profiles?.username)
      .filter((username): username is string => Boolean(username)),
  );

  return [
    ...home,
    ...games.flatMap((game) =>
      enDosIdiomas(`/juegos/${game.slug}`, { changeFrequency: 'daily', priority: 0.8 }),
    ),
    ...sets
      .filter((set) => set.profiles)
      .flatMap((set) =>
        enDosIdiomas(setPath(set.profiles!.username, set.slug), {
          lastModified: new Date(set.updated_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        }),
      ),
    ...[...authors].flatMap((username) =>
      enDosIdiomas(profilePath(username), { changeFrequency: 'weekly', priority: 0.5 }),
    ),
  ];
}
