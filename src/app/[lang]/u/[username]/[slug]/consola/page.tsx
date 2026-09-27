import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { lang } from 'next/root-params';

import { ConsoleMode } from '@/components/console-mode';
import { getSetDetail } from '@/lib/queries';
import { buildSetView } from '@/lib/set-view';
import { conditionsSummary } from '@/lib/set-conditions';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { setPath } from '@/lib/paths';

type Params = Promise<{ username: string; slug: string }>;

export const metadata: Metadata = {
  title: 'Modo consola',
  // Es una vista de uso, no de lectura: indexarla competiría con la del set.
  robots: { index: false },
};

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
      setHref={setPath(detail.owner.username, detail.set.slug)}
      scopes={view.scopes}
      blocks={view.blocks}
      cpuBehaviour={view.cpuBehaviour}
      hasCpuBehaviour={view.hasCpuBehaviour}
      conditions={conditionsSummary(detail.set)}
    />
  );
}
