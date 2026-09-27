import { ImageResponse } from 'next/og';

import { ShareCard, SHARE_CARD_SIZE, type ShareCardData } from '@/components/share-card';
import { SCOPE_ORDER } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/locale';
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

/**
 * El idioma sale de `params`, no de `next/root-params`. Una imagen de
 * OpenGraph es un Route Handler, y ahí root-params todavía no funciona: Next
 * lanza en ejecución, con el `build` en verde. Como `[lang]` es un segmento de
 * la ruta, el idioma ya viene en los parámetros y no hace falta nada más.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; username: string; slug: string }>;
}) {
  const { lang: localeParam, username, slug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const [display, mono, data] = await Promise.all([
    displayFont(),
    monoFont(),
    loadCardData(username, slug, locale),
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
async function loadCardData(username: string, slug: string, locale: Locale): Promise<ShareCardData> {
  const t = getDictionary(locale);
  const fallback: ShareCardData = {
    title: 'Sliders de EA Sports FC',
    gameName: 'SlidersFC',
    authorName: 'La comunidad',
    authorHandle: '',
    slidersLabel: '0 sliders',
    commentsLabel: null,
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

    const sliderCount = new Set(all.map((item) => item.slider_definitions.slug)).size;
    const commentCount = comments.count ?? 0;

    return {
      title: row.title,
      gameName: row.games.name,
      authorName: row.profiles.display_name ?? row.profiles.username,
      authorHandle: row.profiles.twitter_handle ?? '',
      slidersLabel: `${sliderCount} sliders`,
      commentsLabel: commentCount > 0 ? `${commentCount} ${t.set.comentarios(commentCount)}` : null,
      rows,
    };
  } catch (error) {
    console.error('[slidersfc] tarjeta de OpenGraph:', error);
    return fallback;
  }
}
