'use client';

import { useEffect } from 'react';

import { categoryAnchor } from '@/components/active-category';
import { CATEGORY_DRAWINGS } from '@/components/chalk';
import { useI18n } from '@/components/i18n-provider';
import { categoryLabel } from '@/lib/constants';

type Props = {
  categories: { category: string; count: number }[];
  active: string | null;
  open: boolean;
  onClose: () => void;
  /**
   * Cuántos sliders llevas tocados en cada categoría. Sólo lo pasa el
   * formulario; en la ficha no hay nada que tocar y se queda sin marcas.
   */
  marks?: Record<string, number>;
  /**
   * Qué hacer al elegir una categoría, si no vale con saltar a su ancla. El
   * formulario la necesita para desplegarla antes: plegada, el ancla existe
   * pero lleva a una cabecera cerrada y parece que el índice no ha hecho nada.
   */
  onSelect?: (category: string) => void;
};

/**
 * El índice de categorías del móvil.
 *
 * En vez de una franja de chips pegada arriba —que costaría sitio en todas las
 * pantallas y que además se desplaza en el eje contrario al de la página—, el
 * índice no ocupa nada en reposo y, cuando se pide, enseña las nueve a la vez
 * y en tamaño de dedo. Se abre tocando la cabecera de la categoría, que ya
 * está pegada arriba mientras la recorres.
 */
export function CategorySheet({
  categories,
  active,
  open,
  onClose,
  marks,
  onSelect,
}: Props) {
  const { t, locale } = useI18n();

  // Con la hoja abierta, el fondo no se mueve.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const go = (category: string) => {
    onClose();
    // Tras cerrar, para que el desplazamiento no compita con el bloqueo del
    // scroll del cuerpo.
    requestAnimationFrame(() => {
      if (onSelect) {
        onSelect(category);
        return;
      }
      document.getElementById(categoryAnchor(category))?.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end sm:hidden">
      <button
        type="button"
        aria-label={t.comun.cerrar}
        onClick={onClose}
        className="absolute inset-0 bg-board-deep/80"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.set.categoriasDelSet}
        className="relative max-h-[80vh] overflow-y-auto border-t border-chalk-line bg-board-raised pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
          <h2 className="display text-2xl">{t.set.irA}</h2>
          <button type="button" onClick={onClose} className="btn btn-quiet">
            {t.comun.cerrar}
          </button>
        </div>

        <ul className="pb-4">
          {categories.map(({ category, count }) => {
            const Drawing = CATEGORY_DRAWINGS[category as keyof typeof CATEGORY_DRAWINGS];
            const isActive = category === active;

            return (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => go(category)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex w-full items-center gap-3 border-b border-chalk-line/60 px-5 py-3.5 text-left ${
                    isActive ? 'text-ink-user' : ''
                  }`}
                >
                  {Drawing ? (
                    <Drawing
                      className={`size-6 shrink-0 ${isActive ? 'text-ink-user' : 'text-chalk-dim'}`}
                    />
                  ) : null}
                  <span className="display flex-1 text-xl">{categoryLabel(category, locale)}</span>
                  {marks && marks[category] > 0 ? (
                    <span className="value-pill text-xs text-ink-user">
                      {t.set.marcasTocadas(marks[category])}
                    </span>
                  ) : null}
                  <span className="eyebrow">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
