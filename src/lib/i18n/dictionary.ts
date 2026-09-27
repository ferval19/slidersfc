import { es } from '@/lib/i18n/es';
import { en } from '@/lib/i18n/en';
import type { Locale } from '@/lib/i18n/locale';

/** El castellano manda: es la referencia. `en.ts` se tipa contra esta forma. */
export type Dictionary = typeof import('./es').es;

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
