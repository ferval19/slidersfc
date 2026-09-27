import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { SliderSetForm } from '@/components/slider-set-form';
import { updateSet } from '@/app/actions/sets';
import { editSetPath, setPath } from '@/lib/paths';
import { getDefinitionsByGame, getGames, getSetDetail } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Editar set',
  robots: { index: false },
};

export default async function EditSetPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const user = await getCurrentUser();

  if (!user) redirect(`/login?next=${encodeURIComponent(editSetPath(username, slug))}`);

  const detail = await getSetDetail({ username, slug });
  if (!detail) notFound();
  if (detail.owner.id !== user.id) redirect(setPath(username, slug));

  const [games, definitionsByGame] = await Promise.all([getGames(), getDefinitionsByGame()]);

  const values: Record<string, number> = {};
  for (const definition of detail.definitions) {
    values[String(definition.id)] = detail.values.get(definition.id) ?? definition.default_value;
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="eyebrow">Editar set</p>
      <h1 className="display mt-3 text-[clamp(2.25rem,7vw,4rem)]">{detail.set.title}</h1>
      {detail.set.is_published ? (
        <p className="mt-3 max-w-prose text-sm text-chalk-dim">
          Este set ya está publicado. Si cambias algún valor, la versión pasará a v
          {detail.set.version + 1} y los comentarios anteriores quedarán marcados como
          &laquo;de la v{detail.set.version}&raquo;. La dirección del set no cambia.
        </p>
      ) : null}

      <div className="mt-8">
        <SliderSetForm
          action={updateSet.bind(null, detail.set.id)}
          games={games}
          definitionsByGame={definitionsByGame}
          lockGame
          submitLabel={detail.set.is_published ? 'Guardar cambios' : 'Publicar set'}
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
