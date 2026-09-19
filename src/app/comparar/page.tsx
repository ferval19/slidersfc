import type { Metadata } from 'next';

import { ComparePicker, type PickerOption } from '@/components/compare-picker';
import { EmptyState } from '@/components/empty-state';
import { getPublishedSets, getSetsByOwner } from '@/lib/queries';
import { getSessionProfile } from '@/lib/supabase/server';
import type { SetListItem } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Comparar dos sets',
  description:
    'Pon dos sets de sliders uno al lado del otro y mira en qué se diferencian, valor a valor.',
};

export default async function ComparePickerPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const [{ a }, published, { profile }] = await Promise.all([
    searchParams,
    getPublishedSets({ limit: 100 }),
    getSessionProfile(),
  ]);

  // Los borradores propios también: comparar contra el tuyo sin publicar es
  // justo lo que se hace mientras lo estás afinando.
  const mine = profile ? await getSetsByOwner(profile.id) : [];

  const options = toOptions([...published, ...mine]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="pb-8">
        <p className="eyebrow">Dos sets, uno al lado del otro</p>
        <h1 className="display mt-3 text-[clamp(2.75rem,8vw,4.5rem)]">Comparar</h1>
        <p className="mt-4 max-w-prose text-sm text-chalk-dim">
          La pregunta que siempre se acaba haciendo no es qué valores tiene un set, sino en qué se
          diferencia del que ya usas. Aquí sale eso: dónde coinciden, dónde no y cuánto.
        </p>
      </header>

      {options.length < 2 ? (
        <EmptyState
          title="Todavía no hay con qué comparar"
          body="Hacen falta al menos dos sets. Publica el tuyo y vuelve."
        />
      ) : (
        <ComparePicker options={options} initialA={validInitial(a, options)} />
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
