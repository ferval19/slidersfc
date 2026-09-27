'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LOCALES, switchLocalePath, type Locale } from '@/lib/i18n/locale';

/**
 * ES / EN, en el pie. No va en la cabecera porque ésa ya está llena y el
 * idioma es algo que se busca, no algo con lo que se tropieza.
 *
 * `usePathname()` da la ruta actual con su prefijo si lo lleva, y
 * `switchLocalePath` la traduce al otro idioma manteniendo la misma página.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center gap-1.5">
      {LOCALES.map((candidate) => (
        <Link
          key={candidate}
          href={switchLocalePath(candidate, pathname)}
          aria-current={candidate === locale ? 'true' : undefined}
          className={`chip ${candidate === locale ? 'chip-active' : ''}`}
        >
          {candidate.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
