import type { Metadata } from 'next';
import Link from 'next/link';
import { lang } from 'next/root-params';

import { ChalkFormation } from '@/components/chalk';
import { fondoCamiseta } from '@/components/reto/camiseta';
import { alternates } from '@/lib/i18n/alternates';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';
import { retosOrdenados } from '@/lib/retos';
import type { Reto } from '@/lib/retos/tipos';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).modoCarrera;

  return {
    title: t.titulo,
    description: t.metaDescription,
    alternates: alternates(locale, '/modo-carrera'),
    openGraph: { title: t.titulo, description: t.metaDescription },
  };
}

export default async function ModoCarreraPage() {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).modoCarrera;
  const retos = retosOrdenados();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <header className="flex flex-col gap-6 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display mt-3 text-[clamp(2.75rem,8vw,4.5rem)]">{t.titulo}</h1>
          <p className="mt-5 max-w-prose text-base text-chalk-dim">{t.intro}</p>
          {locale !== 'es' ? <p className="mt-2 text-sm text-chalk-dim">{t.soloCastellano}</p> : null}
        </div>
        <ChalkFormation className="hidden w-28 shrink-0 text-chalk-dim sm:block" />
      </header>

      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow">{t.guias(retos.length)}</span>
      </div>
      <div className="chalk-rule mt-3" />

      <ol className="mt-8 flex flex-col gap-5">
        {retos.map((reto, i) => (
          <li key={reto.slug}>
            <TarjetaReto reto={reto} numero={retos.length - i} locale={locale} leer={t.leerGuia} />
          </li>
        ))}
      </ol>

      <div className="chalk-rule mt-12" />
      <div className="pt-8">
        <Link href={localized(locale, '/')} className="btn btn-ghost">
          {t.verSets}
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function TarjetaReto({
  reto,
  numero,
  locale,
  leer,
}: {
  reto: Reto;
  numero: number;
  locale: Locale;
  leer: string;
}) {
  const fecha = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(reto.publicada),
  );

  return (
    <Link
      href={localePath(locale, `/modo-carrera/${reto.slug}`)}
      className="panel panel-hover group grid overflow-hidden sm:grid-cols-[5.5rem_1fr]"
    >
      {/* La camiseta del club: la única concesión de color en la pizarra. */}
      <div
        aria-hidden="true"
        className="relative h-3 sm:h-auto"
        style={{ backgroundImage: fondoCamiseta(reto.tema.camiseta, 10) }}
      >
        <span className="absolute inset-0 hidden items-center justify-center sm:flex">
          <span className="value-pill bg-board-deep px-2 py-1 text-lg text-chalk">
            {String(numero).padStart(2, '0')}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-3 p-6 sm:p-7">
        <p className="eyebrow">
          {reto.equipo} · {reto.juego}
        </p>
        <h2 className="display text-[clamp(2rem,5vw,3rem)] transition-colors group-hover:text-ink-user">
          {reto.titulo}
        </h2>
        <p className="max-w-prose text-sm leading-relaxed text-chalk-dim">{reto.resumen}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <span className="flex flex-wrap gap-2">
            <span className="chip chip-tight">{reto.temporadas}</span>
            <span className="chip chip-tight">{fecha}</span>
          </span>
          <span className="eyebrow text-ink-user">{leer} →</span>
        </div>
      </div>
    </Link>
  );
}
