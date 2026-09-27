import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n/locale';

/**
 * El bloque `alternates` de una página: su canónica y las dos versiones de
 * idioma.
 *
 * Va en una función y no copiado en cada página porque la regla es fácil de
 * escribir mal: `hreflang` tiene que ser **recíproco**: la castellana declara
 * a la inglesa y la inglesa a la castellana, con la misma dirección exacta. Si
 * una de las dos se despista, Google trata las dos como contenido duplicado y
 * elige ella cuál enseña.
 *
 * `x-default` apunta al castellano: es la versión original y la que tiene el
 * contenido escrito por la gente.
 *
 * `path` va SIEMPRE sin prefijo de idioma —`/guia`, no `/en/guia`—, que es
 * como lo devuelven las funciones de `paths.ts`.
 */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      es: path,
      en: localePath('en', path),
      'x-default': localePath(DEFAULT_LOCALE, path),
    },
  };
}
