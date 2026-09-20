'use client';

import { useEffect, useState } from 'react';

/** Prefijo de los anclas. Lo comparten la tabla, la barra y la hoja. */
export const categoryAnchor = (category: string) => `cat-${category}`;

/**
 * Qué categoría se está mirando.
 *
 * El margen superior descuenta la cabecera del sitio y la barra pegada, y el
 * inferior deja fuera el 70% de abajo: así se marca la que de verdad está
 * arriba y no la que asoma por el pie de la pantalla.
 *
 * Vive aparte porque lo usan la barra de escritorio y la hoja del móvil, y
 * porque en este proyecto ya se ha pagado dos veces tener la misma lógica
 * escrita en dos sitios.
 */
export function useActiveCategory(categories: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(categoryAnchor(category)))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (onScreen.length > 0) setActive(onScreen[0].target.id.replace(/^cat-/, ''));
      },
      { rootMargin: '-130px 0px -70% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [categories]);

  return active;
}
