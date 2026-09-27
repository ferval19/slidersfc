import Link from 'next/link';

import { Avatar } from '@/components/avatar';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/locale';
import { localized, resolveSetPath } from '@/lib/paths';
import type { SetListItem } from '@/lib/queries';

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

export function SetCard({ set, locale }: { set: SetListItem; locale: Locale }) {
  const t = getDictionary(locale);
  const comments = set.comment_count?.[0]?.count ?? 0;
  const author = set.profiles;

  return (
    <li className="panel panel-hover">
      <Link
        href={localized(locale, resolveSetPath(set, author?.username))}
        className="flex h-full flex-col gap-3 p-5"
      >
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-ink-user uppercase">
            {set.games?.slug ?? 'fc'}
          </span>
          {set.version > 1 ? <span className="eyebrow">v{set.version}</span> : null}
          {!set.is_published ? (
            <span className="eyebrow text-ink-rival">{t.setCard.borrador}</span>
          ) : null}
        </p>

        <h3 className="display text-[1.75rem] leading-[0.95]">{set.title}</h3>

        {set.description ? (
          <p className="line-clamp-2 text-sm text-chalk-dim">{set.description}</p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-3">
          <Avatar url={author?.avatar_url} name={author?.display_name ?? author?.username} size={22} />
          <span className="truncate text-xs font-semibold">
            {author?.display_name ?? author?.username ?? t.setCard.anonimo}
          </span>
          <span className="eyebrow ml-auto shrink-0">
            {comments > 0 ? `${comments} ${t.set.comentarios(comments)}` : formatDate(set.created_at, locale)}
          </span>
        </div>
      </Link>
    </li>
  );
}
