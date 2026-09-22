'use client';

import { useEffect, useState } from 'react';

import { useActiveCategory } from '@/components/active-category';
import { CategorySheet } from '@/components/category-sheet';
import { categoryLabel, categoryShortLabel } from '@/lib/constants';

type Props = {
  categories: { category: string; count: number }[];
  /** Categoría → cuántos sliders has cambiado respecto a lo guardado. */
  touched: Record<string, number>;
  /** Despliega la categoría y salta a ella. Lo resuelve el formulario. */
  onGo: (category: string) => void;
};

/**
 * La barra pegada del formulario: dónde estás y cómo ir a otra categoría sin
 * recorrer los ciento veintinueve valores.
 *
 * Es prima de `SetStickyBar` —comparten anclas y el hook de categoría activa—
 * pero no es la misma, y a propósito. En la ficha se lee; aquí se edita, y
 * editando la pregunta no es sólo «dónde estoy» sino **«qué llevo tocado»**.
 * De ahí las marcas: son al formulario lo que las del modo consola son a meter
 * los valores en el mando.
 *
 * Dos formas según el ancho, no una escondida:
 *
 * - En escritorio y tableta, la fila de chips. Nueve caben desplazándose en
 *   horizontal, y verlas todas a la vez es la mitad del valor.
 * - En el móvil, un solo botón con la categoría en la que estás, que abre la
 *   misma hoja que la ficha. Nueve chips en 375 px son un carrusel que nadie
 *   desplaza, y aquí el presupuesto vertical ya está gastado: cabecera del
 *   sitio arriba y barra de guardar abajo.
 *
 * Sin testigo ni escuchador de scroll, al revés que la de la ficha. Allí la
 * barra vive al principio del documento y hay que decidir cuándo enseñarla;
 * aquí basta con colocarla donde empiezan los valores, porque `sticky` ya hace
 * exactamente eso: se fija al llegar a ella y se suelta cuando la sección se
 * acaba. Mientras escribes el título no está porque todavía no has llegado,
 * no porque nadie la esté escondiendo.
 */
export function SetFormNav({ categories, touched, onGo }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const observed = useActiveCategory(categories.map((entry) => entry.category));

  /**
   * La que acabas de pulsar, que manda sobre la observada hasta que vuelvas a
   * desplazarte tú.
   *
   * Hacen falta las dos. El observador no se despierta en los saltos
   * programáticos —lo mismo que ya pasa en la barra de la ficha—, así que sin
   * esto pulsas «Velocidad», la página salta, y el chip encendido se queda en
   * la categoría anterior hasta que mueves la rueda. Y al margen del fallo, que
   * lo pulsado se encienda al instante es lo que uno espera de un botón.
   */
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (picked === null) return;

    const clear = () => setPicked(null);
    const options = { passive: true, once: true } as const;

    window.addEventListener('wheel', clear, options);
    window.addEventListener('touchmove', clear, options);

    return () => {
      window.removeEventListener('wheel', clear);
      window.removeEventListener('touchmove', clear);
    };
  }, [picked]);

  const go = (category: string) => {
    setPicked(category);
    onGo(category);
  };

  const active = picked ?? observed;
  const activeLabel = active ? categoryLabel(active) : 'Valores';
  const totalTouched = Object.values(touched).reduce((sum, n) => sum + n, 0);

  return (
    <>
      <CategorySheet
        categories={categories}
        active={active}
        marks={touched}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={go}
      />

      <div className="sticky top-[var(--header-h)] z-20 -mx-5 border-b border-chalk-line bg-board/95 backdrop-blur">
        {/* Móvil: la categoría en la que estás, y se toca para cambiar. */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex w-full items-center gap-3 px-5 py-2.5 text-left sm:hidden"
        >
          <span className="display truncate text-xl">{activeLabel}</span>
          {totalTouched > 0 ? (
            <span className="value-pill shrink-0 text-xs text-ink-user">
              {totalTouched} tocado{totalTouched === 1 ? '' : 's'}
            </span>
          ) : null}
          <span aria-hidden className="eyebrow ml-auto shrink-0">
            Índice ▾
          </span>
        </button>

        {/* Tableta y escritorio: todas a la vez. */}
        <nav
          aria-label="Categorías del set"
          className="hidden min-w-0 flex-nowrap gap-1 overflow-x-auto px-5 py-2.5 sm:flex"
        >
          {categories.map(({ category }) => {
            const marks = touched[category] ?? 0;

            return (
              <button
                key={category}
                type="button"
                onClick={() => go(category)}
                aria-current={active === category ? 'true' : undefined}
                className={`chip chip-tight shrink-0 ${active === category ? 'chip-active' : ''}`}
              >
                {categoryShortLabel(category)}
                {/* El punto dice que ahí has cambiado algo. Es lo único que
                    esta barra tiene y la de la ficha no puede tener. */}
                {marks > 0 ? (
                  <span
                    aria-label={`${marks} ${marks === 1 ? 'valor tocado' : 'valores tocados'}`}
                    className="size-1.5 shrink-0 rounded-full bg-ink-user"
                  />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
