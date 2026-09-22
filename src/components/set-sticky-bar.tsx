'use client';

import { useEffect, useRef, useState } from 'react';

import { categoryAnchor, useActiveCategory } from '@/components/active-category';
import { ChalkPad } from '@/components/chalk';
import { categoryShortLabel } from '@/lib/constants';

type Props = {
  title: string;
  /** Dificultad, duración y cámara, ya en frases cortas. */
  conditions: string[];
  categories: string[];
  consoleHref: string;
};

/**
 * La barra que se queda arriba al bajar por un set.
 *
 * Sólo en escritorio. En el móvil no cabe —nueve categorías no entran en 375
 * px sin convertirse en un carrusel horizontal— y además ahí ya está el modo
 * consola, que es la forma buena de recorrer un set con el móvil en la mano.
 *
 * Aparece cuando la cabecera del set se ha ido hacia arriba, no desde el
 * principio: mientras se ve el título de verdad, repetirlo es ruido.
 */
export function SetStickyBar({ title, conditions, categories, consoleHref }: Props) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const active = useActiveCategory(categories);

  /**
   * Aparecer o no, según si el testigo del final de la cabecera ha subido.
   *
   * Con un escuchador de scroll y no con IntersectionObserver: el observador
   * no despertaba de forma fiable en los saltos programáticos, y ése es justo
   * el caso de alguien que abre un enlace con ancla a una categoría. Un rAF
   * por gesto de scroll no le duele a nadie.
   */
  useEffect(() => {
    const target = sentinel.current;
    if (!target) return;

    let frame = 0;

    const check = () => {
      frame = 0;
      setVisible(target.getBoundingClientRect().top < 0);
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />

      <div
        className={`sticky top-[var(--header-h)] z-20 -mx-5 hidden border-b border-chalk-line bg-board transition-opacity duration-200 lg:block ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex items-center gap-4 px-5 py-2.5">
          <span className="min-w-0 shrink-0 basis-44">
            <span className="block truncate text-sm font-semibold">{title}</span>
            {conditions.length > 0 ? (
              <span className="eyebrow block truncate">{conditions.join(' · ')}</span>
            ) : null}
          </span>

          {/* Sin envolver: si las categorías se parten en dos líneas, la barra
              deja de ser una barra. Si no caben, se desplazan. */}
          <nav
            aria-label="Categorías del set"
            className="flex min-w-0 flex-1 flex-nowrap gap-1 overflow-x-auto"
          >
            {categories.map((category) => (
              <a
                key={category}
                href={`#${categoryAnchor(category)}`}
                className={`chip chip-tight shrink-0 ${active === category ? 'chip-active' : ''}`}
              >
                {categoryShortLabel(category)}
              </a>
            ))}
          </nav>

          {/* El mismo icono que «Meter en la consola» de arriba: aquí el
              botón se queda en una palabra, y el dibujo es lo que lo ata a la
              acción que ya ha visto quien ha bajado hasta aquí. */}
          <a href={consoleHref} className="btn btn-primary shrink-0 px-3 py-2">
            <ChalkPad className="size-4" />
            Consola
          </a>
        </div>
      </div>
    </>
  );
}
