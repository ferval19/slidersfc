import type { MetadataRoute } from 'next';

import { setPath, profilePath } from '@/lib/paths';
import { publicSiteUrl } from '@/lib/site-url';
import { createSupabaseAnonClient } from '@/lib/supabase/anon';

const siteUrl = publicSiteUrl();

export const revalidate = 3600;

/**
 * Usa el cliente anónimo a propósito: sin `cookies()` la ruta se puede cachear
 * y revalidar cada hora, en vez de regenerarse en cada petición de un bot.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/guia`, changeFrequency: 'monthly', priority: 0.6 },
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
    ...games.map((game) => ({
      url: `${siteUrl}/juegos/${game.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...sets
      .filter((set) => set.profiles)
      .map((set) => ({
        url: `${siteUrl}${setPath(set.profiles!.username, set.slug)}`,
        lastModified: new Date(set.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ...[...authors].map((username) => ({
      url: `${siteUrl}${profilePath(username)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}
