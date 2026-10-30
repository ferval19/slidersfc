import { RETOS } from '@/content/retos';

import type { Reto } from './tipos';

export type { Reto } from './tipos';

/** Del más reciente al más antiguo: es el orden del índice. */
export function retosOrdenados(): Reto[] {
  return [...RETOS].sort((a, b) => b.publicada.localeCompare(a.publicada));
}

export function retoPorSlug(slug: string): Reto | undefined {
  return RETOS.find((reto) => reto.slug === slug);
}
