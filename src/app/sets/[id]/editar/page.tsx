import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { SliderSetForm } from '@/components/slider-set-form';
import { updateSet } from '@/app/actions/sets';
import { getDefinitionsByGame, getGames, getSetDetail } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Editar set',
  robots: { index: false },
};

export default async function EditSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect(`/login?next=/sets/${id}/editar`);

  const detail = await getSetDetail(id);
  if (!detail) notFound();
  if (detail.owner.id !== user.id) redirect(`/sets/${id}`);

  const [games, definitionsByGame] = await Promise.all([getGames(), getDefinitionsByGame()]);

  const values: Record<string, number> = {};
  for (const definition of detail.definitions) {
    values[String(definition.id)] = detail.values.get(definition.id) ?? definition.default_value;
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="eyebrow">Editar set</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{detail.set.title}</h1>
      {detail.set.is_published ? (
        <p className="mt-3 max-w-prose text-sm text-muted">
          Este set ya está publicado. Si cambias algún valor, la versión pasará a v
          {detail.set.version + 1} y los comentarios anteriores quedarán marcados como
          &laquo;de la v{detail.set.version}&raquo;.
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
            mode: detail.set.mode,
            isPublished: detail.set.is_published,
            values,
          }}
        />
      </div>
    </div>
  );
}
