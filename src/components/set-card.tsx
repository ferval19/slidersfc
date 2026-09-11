import Link from 'next/link';

import { Avatar } from '@/components/avatar';
import { MODE_LABELS } from '@/lib/constants';
import type { SetListItem } from '@/lib/queries';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function SetCard({ set }: { set: SetListItem }) {
  const comments = set.comment_count?.[0]?.count ?? 0;
  const author = set.profiles;

  return (
    <Link href={`/sets/${set.id}`} className="card card-hover flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip chip-active">{set.games?.slug.toUpperCase() ?? 'FC'}</span>
        <span className="chip">{MODE_LABELS[set.mode]}</span>
        {set.version > 1 ? <span className="chip">v{set.version}</span> : null}
        {!set.is_published ? (
          <span className="chip border-warn/40 text-warn">Borrador</span>
        ) : null}
      </div>

      <h3 className="text-lg leading-snug font-bold">{set.title}</h3>

      {set.description ? (
        <p className="line-clamp-2 text-sm text-muted">{set.description}</p>
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted">
        <Avatar url={author?.avatar_url} name={author?.display_name ?? author?.username} size={24} />
        <span className="font-semibold text-chalk">
          {author?.display_name ?? author?.username ?? 'Anónimo'}
        </span>
        <span>·</span>
        <span>{formatDate(set.created_at)}</span>
        <span className="ml-auto font-semibold">
          {comments} {comments === 1 ? 'comentario' : 'comentarios'}
        </span>
      </div>
    </Link>
  );
}
