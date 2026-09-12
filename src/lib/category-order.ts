/**
 * Orden de las categorías, derivado del catálogo.
 *
 * Vive en su propio módulo, sin nada del servidor, porque lo usan tanto la
 * página del set (servidor) como el formulario (cliente). Cuando estaba en
 * `set-view.ts`, importarlo desde el cliente arrastraba la cadena hasta
 * `supabase/server`, que usa `next/headers`, y rompía el build.
 */

/**
 * Ordena las categorías por el `sort_order` más bajo de sus sliders, que es el
 * del menú del juego. Antes había una lista fija repetida en la aplicación,
 * que podía desviarse del catálogo sin que se notara.
 */
export function orderCategories(
  definitions: { category: string; sort_order: number }[],
  categories: string[],
) {
  const first = new Map<string, number>();

  for (const definition of definitions) {
    const current = first.get(definition.category);
    if (current === undefined || definition.sort_order < current) {
      first.set(definition.category, definition.sort_order);
    }
  }

  return [...categories].sort(
    (a, b) => (first.get(a) ?? Number.MAX_SAFE_INTEGER) - (first.get(b) ?? Number.MAX_SAFE_INTEGER),
  );
}
