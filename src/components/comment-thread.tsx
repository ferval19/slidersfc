'use client';

import { usePathname } from 'next/navigation';
import { useActionState, useEffect, useRef } from 'react';

import { Avatar } from '@/components/avatar';
import { useI18n } from '@/components/i18n-provider';
import { postComment, type CommentFormState } from '@/app/actions/comments';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/locale';
import type { CommentView } from '@/lib/set-view';
import Link from 'next/link';

const initialState: CommentFormState = {};

function relativeDate(iso: string, locale: Locale, t: Dictionary['comun']) {
  const date = new Date(iso);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);

  if (diffDays === 0) {
    return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (diffDays < 7) return t.haceDias(diffDays);
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short' });
}

export function CommentList({ comments }: { comments: CommentView[] }) {
  const { locale, t } = useI18n();

  if (comments.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {comments.map((comment) => (
        <li key={comment.id} className="flex gap-2.5">
          <Avatar
            url={comment.author.avatarUrl}
            name={comment.author.displayName ?? comment.author.username}
            size={26}
          />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              {comment.author.username ? (
                <Link
                  href={`/u/${comment.author.username}`}
                  className="font-bold text-chalk hover:text-ink-user"
                >
                  {comment.author.displayName ?? comment.author.username}
                </Link>
              ) : (
                <span className="font-bold text-chalk">{t.comun.usuarioBorrado}</span>
              )}
              <span className="text-chalk-dim">{relativeDate(comment.createdAt, locale, t.comun)}</span>
              {comment.isStale ? (
                <span className="eyebrow text-ink-user">{t.set.deLaVersion(comment.setVersion)}</span>
              ) : null}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-chalk/90">{comment.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CommentComposer({
  setId,
  definitionId,
  placeholder,
  canComment,
  compact = false,
}: {
  setId: string;
  definitionId?: number;
  placeholder: string;
  canComment: boolean;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(postComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  if (!canComment) {
    return (
      <p className="text-xs text-chalk-dim">
        <Link
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="font-semibold text-ink-user hover:underline"
        >
          {t.comun.entra}
        </Link>{' '}
        {t.set.paraComentar}
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="slider_set_id" value={setId} />
      <input
        type="hidden"
        name="slider_definition_id"
        value={definitionId === undefined ? '' : definitionId}
      />
      <textarea
        name="body"
        required
        rows={compact ? 2 : 3}
        maxLength={2000}
        placeholder={placeholder}
        className="field resize-y"
      />
      {state.error ? (
        <p className="text-xs text-ink-rival" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? t.comun.enviando : t.set.comentarBoton}
        </button>
      </div>
    </form>
  );
}
