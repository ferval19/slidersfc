/**
 * Los idiomas de la web, y el que manda cuando no se dice nada.
 *
 * El castellano vive en la raíz (`/u/pepe/su-set`) y el inglés bajo `/en`.
 * No es capricho: los enlaces en castellano llevan semanas circulando por X y
 * por grupos, y moverlos a `/es` los habría roto todos. El prefijo sólo lo
 * lleva el idioma que llega después.
 */
export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Antepone el prefijo del idioma a un camino interno. El castellano se queda
 * como está, porque vive en la raíz.
 *
 * Todo enlace de la web pasa por aquí. Si uno se escapa, quien navega en
 * inglés vuelve al castellano sin enterarse de por qué.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** El mismo camino en el otro idioma, para el selector y para `hreflang`. */
export function switchLocalePath(locale: Locale, pathWithPrefix: string): string {
  const sinPrefijo = pathWithPrefix.replace(/^\/en(?=\/|$)/, '') || '/';
  return localePath(locale, sinPrefijo);
}

/** El nombre del slider en el idioma que toca. Sin inglés, el castellano: feo pero se entiende. */
export function sliderName(d: { name: string; name_en: string | null }, locale: Locale): string {
  if (locale === 'en' && d.name_en) return d.name_en;
  return d.name;
}
