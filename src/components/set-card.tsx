import Link from 'next/link';

import { Avatar } from '@/components/avatar';
import type { SetListItem } from '@/lib/queries';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function SetCard({ set }: { set: SetListItem }) {
  const comments = set.comment_count?.[0]?.count ?? 0;
  const author = set.profiles;

  return (
    <li className="panel panel-hover">
      <Link href={`/sets/${set.id}`} className="flex h-full flex-col gap-3 p-5">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-ink-user uppercase">
            {set.games?.slug ?? 'fc'}
          </span>
          {set.version > 1 ? <span className="eyebrow">v{set.version}</span> : null}
          {!set.is_published ? (
            <span className="eyebrow text-ink-rival">Borrador</span>
          ) : null}
        </p>

        <h3 className="display text-[1.75rem] leading-[0.95]">{set.title}</h3>

        {set.description ? (
          <p className="line-clamp-2 text-sm text-chalk-dim">{set.description}</p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-3">
          <Avatar url={author?.avatar_url} name={author?.display_name ?? author?.username} size={22} />
          <span className="truncate text-xs font-semibold">
            {author?.display_name ?? author?.username ?? 'Anónimo'}
          </span>
          <span className="eyebrow ml-auto shrink-0">
            {comments > 0 ? `${comments} ${comments === 1 ? 'comentario' : 'comentarios'}` : formatDate(set.created_at)}
          </span>
        </div>
      </Link>
    </li>
  );
}
