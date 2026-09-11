import { SITE_BYLINE, SITE_NAME } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <div className="chalk-rule" />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="eyebrow">
          {SITE_NAME} · {SITE_BYLINE}
        </p>
        <p className="max-w-sm text-xs text-chalk-dim">
          Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.
        </p>
      </div>
    </footer>
  );
}
