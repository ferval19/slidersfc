'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useI18n } from '@/components/i18n-provider';
import { authErrorFrom, authErrorMessage } from '@/lib/auth-errors';
import { localized } from '@/lib/paths';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/**
 * Último recurso del login: si el proyecto está en flujo implícito, Supabase
 * devuelve los tokens en el fragmento de la URL (`#access_token=...`), que el
 * navegador nunca envía al servidor. Aquí los leemos con JS y guardamos la
 * sesión en cookies para que el servidor la vea.
 */
export function AuthHashHandler({ next }: { next: string }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Todo el trabajo va dentro de una función async a propósito: así el
    // setState nunca ocurre de forma sincrónica en el cuerpo del efecto.
    const run = async () => {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const hashError = authErrorFrom(params, locale);

      if (hashError) {
        if (!cancelled) setError(hashError);
        return;
      }

      if (!accessToken || !refreshToken) {
        if (!cancelled) {
          setError(t.authFinalizar.enlaceSinDatosDeSesion);
        }
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          if (!cancelled) setError(authErrorMessage(sessionError, locale));
          return;
        }

        window.history.replaceState(null, '', window.location.pathname);
        router.replace(next);
      } catch (cause) {
        if (!cancelled) {
          setError(
            authErrorMessage(cause instanceof Error ? { message: cause.message } : null, locale),
          );
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [next, router, locale, t]);

  if (error) {
    return (
      <div className="panel p-6">
        <p className="eyebrow">{t.authFinalizar.noSeHaPodidoEntrar}</p>
        <p className="mt-3 text-sm text-chalk/90">{error}</p>
        <Link href={localized(locale, '/login')} className="btn btn-primary mt-5">
          {t.authFinalizar.pedirOtroEnlace}
        </Link>
      </div>
    );
  }

  return <p className="text-sm text-chalk-dim">{t.authFinalizar.iniciandoSesion}</p>;
}
