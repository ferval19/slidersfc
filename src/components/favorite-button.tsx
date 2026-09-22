'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

import { setFavorite } from '@/app/actions/favorites';
import { ChalkStar } from '@/components/chalk';

/**
 * Guardar el set de otro. No enseña cuánta gente lo ha guardado a propósito:
 * un contador convierte un marcador en una nota, y aquí la nota es lo que
 * escribes debajo de cada valor.
 */
export function FavoriteButton({
  setId,
  pathname,
  mine,
  loginHref,
}: {
  setId: string;
  pathname: string;
  mine: boolean;
  /** Si viene, no hay sesión: el botón es un enlace al login. */
  loginHref?: string;
}) {
  const [saved, setSaved] = useState(mine);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (loginHref) {
    return (
      <Link href={loginHref} className="btn btn-quiet">
        <ChalkStar className="size-4" />
        Guardar
      </Link>
    );
  }

  const toggle = () => {
    const next = !saved;

    // Optimista a propósito: una estrella que tarda un viaje de servidor en
    // encenderse parece rota. Si el servidor dice que no, se deshace.
    setSaved(next);
    setError(null);

    startTransition(async () => {
      const result = await setFavorite(setId, next, pathname);
      if (result.error) {
        setSaved(!next);
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        aria-pressed={saved}
        className="btn btn-quiet"
      >
        <ChalkStar className="size-4" filled={saved} />
        {saved ? 'Guardado' : 'Guardar'}
      </button>
      {error ? <span className="text-sm text-ink-rival">{error}</span> : null}
    </div>
  );
}
