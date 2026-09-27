import type { Metadata } from 'next';
import { lang } from 'next/root-params';
import { notFound, redirect } from 'next/navigation';

import { SliderSetForm } from '@/components/slider-set-form';
import { updateSet } from '@/app/actions/sets';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { editSetPath, localized, setPath } from '@/lib/paths';
import { getDefinitionsByGame, getGames, getSetDetail } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).editarSet;

  return { title: t.metaTitle, robots: { index: false } };
}

export default async function EditSetPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const [{ username, slug }, localeParam] = await Promise.all([params, lang()]);
  const locale = (localeParam ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).editarSet;

  const user = await getCurrentUser();

  if (!user) {
    redirect(localized(locale, `/login?next=${encodeURIComponent(editSetPath(username, slug))}`));
  }

  const detail = await getSetDetail({ username, slug });
  if (!detail) notFound();
  if (detail.owner.id !== user.id) redirect(localized(locale, setPath(username, slug)));

  const [games, definitionsByGame] = await Promise.all([getGames(), getDefinitionsByGame()]);

  const values: Record<string, number> = {};
  for (const definition of detail.definitions) {
    values[String(definition.id)] = detail.values.get(definition.id) ?? definition.default_value;
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="display mt-3 text-[clamp(2.25rem,7vw,4rem)]">{detail.set.title}</h1>
      {detail.set.is_published ? (
        <p className="mt-3 max-w-prose text-sm text-chalk-dim">
          {t.yaPublicado(detail.set.version + 1, detail.set.version)}
        </p>
      ) : null}

      <div className="mt-8">
        <SliderSetForm
          action={updateSet.bind(null, detail.set.id)}
          games={games}
          definitionsByGame={definitionsByGame}
          lockGame
          initial={{
            gameId: detail.set.game_id,
            title: detail.set.title,
            description: detail.set.description ?? '',
            isPublished: detail.set.is_published,
        cpuBehaviour: detail.set.cpu_behaviour,
        difficulty: detail.set.difficulty ?? '',
        halfLength: detail.set.half_length ?? '',
        camera: detail.set.camera ?? '',
        cameraHeight: detail.set.camera_height === null ? '' : String(detail.set.camera_height),
        cameraZoom: detail.set.camera_zoom === null ? '' : String(detail.set.camera_zoom),
            values,
          }}
        />
      </div>
    </div>
  );
}
