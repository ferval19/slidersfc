'use client';

import Link from 'next/link';
import { useTransition } from 'react';

import { copySetToGame, deleteSet, publishSet, unpublishSet } from '@/app/actions/sets';
import { ChalkCarry, ChalkEraser, ChalkEye, ChalkPiece } from '@/components/chalk';
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
    /* Un escalón por debajo de la fila de arriba, y a propósito: aquello es lo
       que hace cualquiera con el set, y esto es lo que sólo puede hacerle su
       dueño. El rótulo lo dice en dos palabras y ahorra explicarlo. */
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1">Sólo tú</span>

      <Link href={editSetPath(username, slug)} className="btn btn-quiet btn-sm">
        <ChalkPiece className="size-3.5" />
        Editar
      </Link>

      <button
        type="button"
        className="btn btn-ghost btn-sm"
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
        <ChalkEye className="size-3.5" crossed={isPublished} />
        {isPublished ? 'Pasar a borrador' : 'Publicar'}
      </button>

      {/* Al salir una versión nueva, nadie quiere volver a meter treinta
          valores a mano. Crea un borrador y lleva a revisarlo. */}
      {otherGames.map((game) => (
        <button
          key={game.slug}
          type="button"
          className="btn btn-quiet btn-sm"
          disabled={pending}
          onClick={() => startTransition(async () => void (await copySetToGame(setId, game.slug)))}
          title={`Copia los valores que existan en ${game.name} y deja el resto como los trae el juego`}
        >
          <ChalkCarry className="size-3.5" />
          Llevar a {game.slug.toUpperCase()}
        </button>
      ))}

      {/* Separado por una línea de las tres anteriores. Borrar no se deshace,
          y estaba a un dedo de Editar, del mismo tamaño y en la misma fila. */}
      <span className="ml-1 border-l border-chalk-line pl-3">
        <button
          type="button"
          className="btn btn-ghost btn-sm text-ink-rival"
          disabled={pending}
          onClick={() => {
            if (!confirm('¿Borrar este set? Se borrarán también sus valores y comentarios.')) return;
            startTransition(async () => {
              await deleteSet(setId);
            });
          }}
        >
          <ChalkEraser className="size-3.5" />
          Borrar
        </button>
      </span>
    </div>
  );
}
