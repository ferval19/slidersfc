import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { lang } from 'next/root-params';

import { ConsoleMode } from '@/components/console-mode';
import { getDictionary } from '@/lib/i18n/dictionary';
import { getSetDetail } from '@/lib/queries';
import { buildSetView } from '@/lib/set-view';
import { conditionsSummary } from '@/lib/set-conditions';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { localized, setPath } from '@/lib/paths';

type Params = Promise<{ username: string; slug: string }>;

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  return {
    title: getDictionary(locale).consola.modoConsola,
    // Es una vista de uso, no de lectura: indexarla competiría con la del set.
    // Sin `alternates`: no se indexa, así que no necesita `hreflang`.
    robots: { index: false },
  };
}

export default async function ConsolePage({ params }: { params: Params }) {
  const { username, slug } = await params;
  const detail = await getSetDetail({ username, slug });
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;

  if (!detail) notFound();

  const view = buildSetView(detail, null, locale);

  return (
    <ConsoleMode
      setId={detail.set.id}
      title={detail.set.title}
      setHref={localized(locale, setPath(detail.owner.username, detail.set.slug))}
      scopes={view.scopes}
      blocks={view.blocks}
      cpuBehaviour={view.cpuBehaviour}
      hasCpuBehaviour={view.hasCpuBehaviour}
      conditions={conditionsSummary(detail.set)}
    />
  );
}
