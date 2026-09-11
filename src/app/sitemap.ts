import type { MetadataRoute } from 'next';

import { getGames, getPublishedSets } from '@/lib/queries';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [games, sets] = await Promise.all([getGames(), getPublishedSets({ limit: 500 })]);

  const authors = new Set(
    sets.map((set) => set.profiles?.username).filter((username): username is string => Boolean(username)),
  );

  return [
    { url: `${siteUrl}/`, changeFrequency: 'daily', priority: 1 },
    ...games.map((game) => ({
      url: `${siteUrl}/juegos/${game.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...sets.map((set) => ({
      url: `${siteUrl}/sets/${set.id}`,
      lastModified: new Date(set.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...[...authors].map((username) => ({
      url: `${siteUrl}/u/${username}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}
