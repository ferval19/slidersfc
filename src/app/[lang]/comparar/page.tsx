import type { Metadata } from 'next';
import { lang } from 'next/root-params';

import { ComparePicker, type PickerOption } from '@/components/compare-picker';
import { EmptyState } from '@/components/empty-state';
import { getDictionary } from '@/lib/i18n/dictionary';
import { alternates } from '@/lib/i18n/alternates';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { getPublishedSets, getSetsByOwner } from '@/lib/queries';
import { getSessionProfile } from '@/lib/supabase/server';
import type { SetListItem } from '@/lib/queries';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return {
    title: 'Comparar dos sets',
    description:
      'Pon dos sets de sliders uno al lado del otro y mira en qué se diferencian, valor a valor.',
    // Canónica sin el `?a=`: es un selector, no contenido — todas las
    // combinaciones de selección deben consolidar en la misma URL.
    alternates: alternates(locale, '/comparar'),
  };
}

export default async function ComparePickerPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const [{ a }, published, { profile }, localeParam] = await Promise.all([
    searchParams,
    getPublishedSets({ limit: 100 }),
    getSessionProfile(),
    lang(),
  ]);
  const locale = (localeParam ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).comparar;

  // Los borradores propios también: comparar contra el tuyo sin publicar es
  // justo lo que se hace mientras lo estás afinando.
  const mine = profile ? await getSetsByOwner(profile.id) : [];

  const options = toOptions([...published, ...mine]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="pb-8">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="display mt-3 text-[clamp(2.75rem,8vw,4.5rem)]">
          {getDictionary(locale).set.comparar}
        </h1>
        <p className="mt-4 max-w-prose text-sm text-chalk-dim">{t.intro}</p>
      </header>

      {options.length < 2 ? (
        <EmptyState title={t.sinConQueComparar} body={t.hacenFaltaDos} />
      ) : (
        <ComparePicker options={options} initialA={validInitial(a, options)} locale={locale} />
      )}
    </div>
  );
}

function toOptions(sets: SetListItem[]): PickerOption[] {
  const byValue = new Map<string, PickerOption>();

  for (const set of sets) {
    const owner = set.profiles?.username;
    if (!owner || !set.slug || !set.games) continue;

    const value = `${owner}/${set.slug}`;
    // Los propios publicados salen en las dos listas: gana el primero.
    if (byValue.has(value)) continue;

    byValue.set(value, {
      value,
      title: set.title,
      owner,
      gameSlug: set.games.slug,
      gameName: set.games.name,
      isDraft: !set.is_published,
    });
  }

  return [...byValue.values()];
}

/** Sólo se preselecciona lo que existe: si no, el selector se queda en blanco. */
function validInitial(a: string | undefined, options: PickerOption[]) {
  if (!a) return '';
  return options.some((option) => option.value === a) ? a : '';
}
