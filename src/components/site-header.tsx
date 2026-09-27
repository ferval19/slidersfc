import Link from 'next/link';
import { lang } from 'next/root-params';

import { Avatar } from '@/components/avatar';
import { Logo } from '@/components/logo';
import { SITE_BYLINE } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';
import { getSessionProfile } from '@/lib/supabase/server';

export async function SiteHeader() {
  const [session, localeParam] = await Promise.all([getSessionProfile(), lang()]);
  const locale = (localeParam ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).header;

  return (
    <header className="sticky top-0 z-30 bg-board/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Link href={localized(locale, '/')} className="flex items-baseline gap-2.5">
          <Logo />
          <span className="eyebrow hidden sm:inline">{SITE_BYLINE}</span>
        </Link>

        {/* Se decide con la SESIÓN, no con el perfil: si la fila de perfil
            falta, /perfil la repara. Antes se mostraba «Entrar» a alguien que
            ya estaba dentro. */}
        <nav className="ml-auto flex items-center gap-1">
          {session.user ? (
            <>
              <Link href={localized(locale, '/sets/nuevo')} className="btn btn-primary">
                <span className="sm:hidden">{t.nuevoCorto}</span>
                <span className="hidden sm:inline">{t.nuevoSet}</span>
              </Link>
              <Link
                href={localized(locale, '/perfil')}
                className="ml-1 flex items-center gap-2 px-1.5 py-1 transition-colors hover:text-ink-user"
                title={t.miPerfil}
              >
                <Avatar
                  url={session.profile?.avatar_url}
                  name={
                    session.profile?.display_name ??
                    session.profile?.username ??
                    session.user.email
                  }
                  size={26}
                />
                <span className="eyebrow max-w-24 truncate text-chalk">
                  {session.profile?.username ?? t.miPerfil}
                </span>
              </Link>
            </>
          ) : (
            <Link href={localized(locale, '/login?next=/perfil')} className="btn btn-ghost">
              {t.entrar}
            </Link>
          )}
        </nav>
      </div>
      <div className="chalk-rule" />
    </header>
  );
}
