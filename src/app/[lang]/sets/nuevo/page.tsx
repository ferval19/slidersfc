import type { Metadata } from 'next';
import { lang } from 'next/root-params';
import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/empty-state';
import { SliderSetForm } from '@/components/slider-set-form';
import { createSet } from '@/app/actions/sets';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';
import { getDefinitionsByGame, getGames } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).nuevoSet;

  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function NewSetPage() {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).nuevoSet;

  const user = await getCurrentUser();
  if (!user) redirect(localized(locale, `/login?next=${encodeURIComponent('/sets/nuevo')}`));

  const [games, definitionsByGame] = await Promise.all([getGames(), getDefinitionsByGame()]);

  if (games.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <EmptyState title={t.faltaCatalogoTitulo} body={t.faltaCatalogoBody} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="display mt-3 text-[clamp(2.5rem,8vw,4.5rem)]">{t.titulo}</h1>
      <p className="mt-3 max-w-prose text-sm text-chalk-dim">{t.intro}</p>

      <div className="mt-8">
        <SliderSetForm action={createSet} games={games} definitionsByGame={definitionsByGame} />
      </div>
    </div>
  );
}
