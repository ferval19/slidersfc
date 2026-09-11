import Link from 'next/link';

import { EmptyBoardDrawing } from '@/components/chalk';

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="panel flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:gap-9 sm:p-9">
      <EmptyBoardDrawing className="w-40 shrink-0" />

      <div className="flex flex-col items-start gap-3">
        <h2 className="display text-3xl">{title}</h2>
        <p className="max-w-prose text-sm text-chalk-dim">{body}</p>
        {action ? (
          <Link href={action.href} className="btn btn-primary mt-1">
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
