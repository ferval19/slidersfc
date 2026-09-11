import Link from 'next/link';

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
    <div className="card flex flex-col items-start gap-3 p-8">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="max-w-prose text-sm text-muted">{body}</p>
      {action ? (
        <Link href={action.href} className="btn btn-primary mt-1">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
