import { isSupabaseConfigured } from '@/lib/supabase/env';

/**
 * Aviso de primera instalación. Sin las variables de Supabase la app arranca
 * pero no puede leer ni escribir nada, y un feed vacío no explica por qué.
 */
export function SetupNotice() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="border-b border-ink-user/30 bg-ink-user/10">
      <div className="mx-auto max-w-6xl px-5 py-3 text-sm">
        <p className="font-bold text-ink-user">Supabase no está configurado</p>
        <p className="mt-1 text-chalk/80">
          Rellena{' '}
          <code className="font-mono text-xs text-chalk">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
          <code className="font-mono text-xs text-chalk">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{' '}
          en <code className="font-mono text-xs text-chalk">.env.local</code> y aplica los
          ficheros de <code className="font-mono text-xs text-chalk">supabase/</code>. Hasta
          entonces no hay datos que mostrar (ver README).
        </p>
      </div>
    </div>
  );
}
