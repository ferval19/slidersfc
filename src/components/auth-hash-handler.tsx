'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/**
 * Último recurso del login: si el proyecto está en flujo implícito, Supabase
 * devuelve los tokens en el fragmento de la URL (`#access_token=...`), que el
 * navegador nunca envía al servidor. Aquí los leemos con JS y guardamos la
 * sesión en cookies para que el servidor la vea.
 */
export function AuthHashHandler({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Todo el trabajo va dentro de una función async a propósito: así el
    // setState nunca ocurre de forma sincrónica en el cuerpo del efecto.
    const run = async () => {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const hashError = params.get('error_description') ?? params.get('error');

      if (hashError) {
        if (!cancelled) setError(hashError);
        return;
      }

      if (!accessToken || !refreshToken) {
        if (!cancelled) {
          setError(
            'El enlace no traía datos de sesión. Suele pasar cuando se abre en otro navegador o cuando ya ha caducado: pide uno nuevo.',
          );
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
          if (!cancelled) setError(sessionError.message);
          return;
        }

        window.history.replaceState(null, '', window.location.pathname);
        router.replace(next);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'No se ha podido iniciar la sesión.');
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [next, router]);

  if (error) {
    return (
      <div className="card p-6">
        <p className="eyebrow">No se ha podido entrar</p>
        <p className="mt-3 text-sm text-chalk/90">{error}</p>
        <Link href="/login" className="btn btn-primary mt-5">
          Pedir otro enlace
        </Link>
      </div>
    );
  }

  return <p className="text-sm text-chalk-dim">Iniciando sesión…</p>;
}
