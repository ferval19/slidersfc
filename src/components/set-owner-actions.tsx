'use client';

import Link from 'next/link';
import { useTransition } from 'react';

import { deleteSet, publishSet, unpublishSet } from '@/app/actions/sets';

export function SetOwnerActions({
  setId,
  isPublished,
}: {
  setId: string;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/sets/${setId}/editar`} className="btn btn-quiet">
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
