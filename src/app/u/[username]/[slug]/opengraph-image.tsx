import { ImageResponse } from 'next/og';

import { ShareCard, SHARE_CARD_SIZE, type ShareCardData } from '@/components/share-card';
import { SCOPE_ORDER } from '@/lib/constants';
import { displayFont, monoFont } from '@/lib/og-fonts';
import { createSupabaseAnonClient } from '@/lib/supabase/anon';
import type { SliderScope } from '@/lib/database.types';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = 'Set de sliders en SlidersFC';

/** Una hora: los valores de un set cambian poco y esto lo piden los bots. */
export const revalidate = 3600;

/** Sliders que mejor resumen un set de un vistazo. */
const HIGHLIGHTS = ['sprint_speed', 'acceleration', 'shot_error', 'pass_error', 'line_width'];

export default async function Image({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  const [display, mono, data] = await Promise.all([
    displayFont(),
    monoFont(),
    loadCardData(username, slug),
  ]);

  return new ImageResponse(<ShareCard data={data} />, {
    ...size,
    fonts: [
      { name: 'Display', data: display, weight: 900, style: 'normal' },
      { name: 'Plex', data: mono, weight: 500, style: 'normal' },
    ],
  });
}

/**
 * Sin cookies a propósito: la tarjeta la piden los bots de las redes, no una
 * sesión, y así la imagen se puede cachear.
 */
async function loadCardData(username: string, slug: string): Promise<ShareCardData> {
  const fallback: ShareCardData = {
    title: 'Sliders de EA Sports FC',
    gameName: 'SlidersFC',
    authorName: 'La comunidad',
    authorHandle: '',
    sliderCount: 0,
    commentCount: 0,
    rows: [],
  };

  try {
    const supabase = createSupabaseAnonClient();

    const { data: set } = await supabase
      .from('slider_sets')
      .select(
        `id, title,
         games!inner ( name ),
         profiles!inner ( username, display_name, twitter_handle )`,
      )
      .eq('slug', slug)
      .eq('profiles.username', username.toLowerCase())
      .eq('is_published', true)
      .maybeSingle();

    if (!set) return fallback;

    const row = set as unknown as {
      id: string;
      title: string;
      games: { name: string };
      profiles: { username: string; display_name: string | null; twitter_handle: string | null };
    };

    const [values, comments] = await Promise.all([
      supabase
        .from('slider_set_values')
        .select('value, slider_definitions!inner ( name, slug, applies_to )')
        .eq('slider_set_id', row.id),
      supabase
        .from('slider_comments')
        .select('id', { count: 'exact', head: true })
        .eq('slider_set_id', row.id),
    ]);

    const all = (values.data ?? []) as unknown as {
      value: number;
      slider_definitions: { name: string; slug: string; applies_to: SliderScope };
    }[];

    // Una fila por slider destacado, con las muescas de todos sus ámbitos.
    const rows = HIGHLIGHTS.map((highlight) => {
      const matches = all
        .filter((item) => item.slider_definitions.slug === highlight)
        .sort(
          (a, b) =>
            SCOPE_ORDER.indexOf(a.slider_definitions.applies_to) -
            SCOPE_ORDER.indexOf(b.slider_definitions.applies_to),
        );

      if (matches.length === 0) return null;

      return {
        name: matches[0].slider_definitions.name,
        marks: matches.map((item) => ({
          scope: item.slider_definitions.applies_to,
          value: item.value,
        })),
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      title: row.title,
      gameName: row.games.name,
      authorName: row.profiles.display_name ?? row.profiles.username,
      authorHandle: row.profiles.twitter_handle ?? '',
      sliderCount: new Set(all.map((item) => item.slider_definitions.slug)).size,
      commentCount: comments.count ?? 0,
      rows,
    };
  } catch (error) {
    console.error('[slidersfc] tarjeta de OpenGraph:', error);
    return fallback;
  }
}
