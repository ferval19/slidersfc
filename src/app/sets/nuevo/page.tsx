import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/empty-state';
import { SliderSetForm } from '@/components/slider-set-form';
import { createSet } from '@/app/actions/sets';
import { getDefinitionsByGame, getGames } from '@/lib/queries';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Nuevo set',
  description: 'Publica tu set de sliders en SliderXI.',
};

export default async function NewSetPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/sets/nuevo');

  const [games, definitionsByGame] = await Promise.all([getGames(), getDefinitionsByGame()]);

  if (games.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <EmptyState
          title="Falta el catálogo de sliders"
          body="No hay juegos en la base de datos. Aplica los ficheros de supabase/seed antes de crear sets."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="eyebrow">Nuevo set</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Publica tus sliders</h1>
      <p className="mt-3 max-w-prose text-sm text-muted">
        Cuenta en la descripción con qué dificultad y duración de tiempos juegas: sin eso, los
        valores no significan lo mismo para quien los copie.
      </p>

      <div className="mt-8">
        <SliderSetForm
          action={createSet}
          games={games}
          definitionsByGame={definitionsByGame}
          submitLabel="Publicar set"
        />
      </div>
    </div>
  );
}
