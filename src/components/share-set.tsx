'use client';

import { useState } from 'react';

import { ChalkCheck, ChalkShare } from '@/components/chalk';

/**
 * Compartir un set. Usa el diálogo nativo del sistema cuando existe (móvil) y
 * en escritorio copia el enlace, que es lo que se acaba haciendo igualmente.
 * El enlace directo a X va aparte porque es donde está esta comunidad.
 */
export function ShareSet({
  url,
  title,
  gameName,
}: {
  url: string;
  title: string;
  gameName: string;
}) {
  const [copied, setCopied] = useState(false);

  const text = `${title} — sliders de ${gameName}`;

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Cancelado por el usuario: no es un error que haya que contar.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Copia el enlace:', url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={share} className="btn btn-quiet">
        {copied ? <ChalkCheck className="size-4" /> : <ChalkShare className="size-4" />}
        {copied ? '¡Enlace copiado!' : 'Compartir'}
      </button>

      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-quiet"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-3.5 fill-current">
          <path d="M18.9 2H22l-6.8 7.8L22.8 22h-6.1l-4.8-6.3L6.3 22H3.2l7.1-8.1L2.6 2h6.2l4.5 5.9L18.9 2Zm-1.1 18h1.7L7.4 3.7H5.6L17.8 20Z" />
        </svg>
        En X
      </a>
    </div>
  );
}
