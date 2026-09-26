import { ImageResponse } from 'next/og';

import { CompareCard, type CompareCardData } from '@/components/compare-card';
import { SHARE_CARD_SIZE } from '@/components/share-card';
import { buildCompareView, topDifferences } from '@/lib/compare';
import { displayFont, monoFont } from '@/lib/og-fonts';
import { createSupabaseAnonClient } from '@/lib/supabase/anon';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = 'Comparación de dos sets en SlidersFC';

/** Una hora: los valores de un set cambian poco y esto lo piden los bots. */
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ ua: string; sa: string; ub: string; sb: string }>;
}) {
  const { ua, sa, ub, sb } = await params;

  const [display, mono, data] = await Promise.all([
    displayFont(),
    monoFont(),
    loadCardData(ua, sa, ub, sb),
  ]);

  return new ImageResponse(<CompareCard data={data} />, {
    ...size,
    fonts: [
      { name: 'Display', data: display, weight: 900, style: 'normal' },
      { name: 'Plex', data: mono, weight: 500, style: 'normal' },
    ],
  });
}

type SetRow = {
  id: string;
  title: string;
  cpu_behaviour: string;
  game_id: number;
  games: { name: string; has_cpu_behaviour: boolean };
  profiles: { username: string; display_name: string | null };
};

/**
 * Sin cookies a propósito: la tarjeta la piden los bots de las redes, no una
 * sesión, y así la imagen se puede cachear.
 */
async function loadSet(
  supabase: ReturnType<typeof createSupabaseAnonClient>,
  username: string,
  slug: string,
) {
  const { data } = await supabase
    .from('slider_sets')
    .select(
      `id, title, cpu_behaviour, game_id,
       games!inner ( name, has_cpu_behaviour ),
       profiles!inner ( username, display_name )`,
    )
    .eq('slug', slug)
    .eq('profiles.username', username.toLowerCase())
    .eq('is_published', true)
    .maybeSingle();

  return data as unknown as SetRow | null;
}

async function loadCardData(
  ua: string,
  sa: string,
  ub: string,
  sb: string,
): Promise<CompareCardData> {
  const fallback: CompareCardData = {
    gameName: 'SlidersFC',
    differing: 0,
    total: 0,
    a: { title: 'Dos sets', author: '' },
    b: { title: '—', author: '' },
    rows: [],
  };

  try {
    const supabase = createSupabaseAnonClient();

    const [a, b] = await Promise.all([loadSet(supabase, ua, sa), loadSet(supabase, ub, sb)]);
    if (!a || !b) return fallback;

    // Dos juegos distintos no se pueden comparar: son listas de sliders
    // distintas. Igual que en page.tsx, sin eso ni se pide el catálogo.
    if (a.game_id !== b.game_id) return fallback;

    const [definitionsResult, valuesA, valuesB] = await Promise.all([
      supabase
        .from('slider_definitions')
        .select('*')
        .eq('game_id', a.game_id)
        .order('sort_order')
        .order('applies_to'),
      supabase.from('slider_set_values').select('slider_definition_id, value').eq('slider_set_id', a.id),
      supabase.from('slider_set_values').select('slider_definition_id, value').eq('slider_set_id', b.id),
    ]);

    const definitions = definitionsResult.data ?? [];

    // Si alguno de los dos deja la CPU en automático, sus sliders de esa
    // pestaña están guardados pero el juego no los usa: mismo filtro que
    // page.tsx, o la tarjeta contaría diferencias que no existen en el campo.
    const cpuIsComparable =
      !a.games.has_cpu_behaviour || (a.cpu_behaviour === 'custom' && b.cpu_behaviour === 'custom');
    const comparableDefinitions = cpuIsComparable
      ? definitions
      : definitions.filter((definition) => definition.category !== 'cpu_controls');

    const plain = (values: { slider_definition_id: number; value: number }[] | null) =>
      Object.fromEntries((values ?? []).map((value) => [String(value.slider_definition_id), value.value]));

    const view = buildCompareView({
      definitions: comparableDefinitions,
      a: plain(valuesA.data),
      b: plain(valuesB.data),
    });

    return {
      gameName: a.games.name,
      differing: view.differing,
      total: view.total,
      a: { title: a.title, author: a.profiles.display_name ?? a.profiles.username },
      b: { title: b.title, author: b.profiles.display_name ?? b.profiles.username },
      rows: topDifferences(view, 5),
    };
  } catch (error) {
    console.error('[slidersfc] tarjeta de comparación:', error);
    return fallback;
  }
}
