'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LOCALES, switchLocalePath, type Locale } from '@/lib/i18n/locale';

/**
 * ES · EN, pegado al logotipo.
 *
 * Estuvo en el pie y se subió el 27/09: el idioma no es sólo un interruptor,
 * es **el rótulo de la versión que estás viendo**, y eso tiene que verse sin
 * bajar hasta el final. La cabecera está pegada arriba, así que desde aquí se
 * ve y se alcanza siempre.
 *
 * **No lleva bandera, y es deliberado.** Una bandera es un país, no un
 * idioma: la de España le dice a un mexicano o a un argentino que ésta es «la
 * versión de España», y la mitad larga de esta comunidad no está en España.
 * Además los emoji de bandera no se dibujan en Windows —salen dos letras en
 * una caja—, así que en muchos escritorios acabarías viendo justo esto pero
 * mal hecho. Y una bandera a color sería el único elemento a color de una web
 * que es tiza sobre pizarra.
 *
 * `usePathname()` da la ruta actual con su prefijo si lo lleva, y
 * `switchLocalePath` la traduce al otro idioma manteniendo la misma página:
 * cambiar de idioma no te devuelve a la portada.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className="flex shrink-0 items-center gap-px rounded-[2px] border border-chalk-line"
    >
      {LOCALES.map((candidate) => (
        <Link
          key={candidate}
          href={switchLocalePath(candidate, pathname)}
          aria-current={candidate === locale ? 'true' : undefined}
          className={`eyebrow px-1.5 py-1.5 transition-colors ${
            candidate === locale
              ? 'bg-board-raised text-chalk'
              : 'text-chalk-dim hover:text-chalk'
          }`}
        >
          {candidate.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
