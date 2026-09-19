'use client';

import Link from 'next/link';
import { useTransition } from 'react';

import { copySetToGame, deleteSet, publishSet, unpublishSet } from '@/app/actions/sets';
import { editSetPath } from '@/lib/paths';

export function SetOwnerActions({
  setId,
  username,
  slug,
  isPublished,
  otherGames = [],
}: {
  setId: string;
  username: string;
  slug: string;
  isPublished: boolean;
  /** Juegos a los que se puede llevar este set. */
  otherGames?: { slug: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={editSetPath(username, slug)} className="btn btn-quiet">
        Editar
      </Link>

      <button
        type="button"
        className="btn btn-ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            if (isPublished) {
              await unpublishSet(setId);
            } else {
              await publishSet(setId);
            }
          })
        }
      >
        {isPublished ? 'Pasar a borrador' : 'Publicar'}
      </button>

      {/* Al salir una versión nueva, nadie quiere volver a meter treinta
          valores a mano. Crea un borrador y lleva a revisarlo. */}
      {otherGames.map((game) => (
        <button
          key={game.slug}
          type="button"
          className="btn btn-quiet"
          disabled={pending}
          onClick={() => startTransition(async () => void (await copySetToGame(setId, game.slug)))}
          title={`Copia los valores que existan en ${game.name} y deja el resto como los trae el juego`}
        >
          Llevar a {game.slug.toUpperCase()}
        </button>
      ))}

      <button
        type="button"
        className="btn btn-ghost text-ink-rival"
        disabled={pending}
        onClick={() => {
          if (!confirm('¿Borrar este set? Se borrarán también sus valores y comentarios.')) return;
          startTransition(async () => {
            await deleteSet(setId);
          });
        }}
      >
        Borrar
      </button>
    </div>
  );
}
