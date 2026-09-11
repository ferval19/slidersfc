import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { safeNextPath } from '@/lib/site-url';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Vuelta de cualquier flujo de Supabase Auth. Hay tres formas posibles de
 * volver y conviene aceptar las tres, porque cuál llega depende de la
 * plantilla de email y de la configuración del proyecto:
 *
 *  1. `?code=...`        — flujo PKCE. Es lo que manda la plantilla de email
 *                          por defecto (`{{ .ConfirmationURL }}`) y también
 *                          el OAuth de X.
 *  2. `?token_hash=&type=` — plantilla personalizada con `{{ .TokenHash }}`.
 *                          Es la forma recomendada: no depende de que el
 *                          enlace se abra en el mismo navegador que lo pidió.
 *  3. `#access_token=...`  — flujo implícito. El fragmento no llega al
 *                          servidor, así que eso lo resuelve el cliente.
 */
export async function handleAuthCallback(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get('next'));

  const fail = (message: string) =>
    NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`);

  const providerError = searchParams.get('error_description') ?? searchParams.get('error');
  if (providerError) return fail(providerError);

  const supabase = await createSupabaseServerClient();

  const code = searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail(error.message);
    return NextResponse.redirect(`${origin}${next}`);
  }

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return fail(error.message);
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Puede ser flujo implícito: los tokens vendrían en el fragmento de la URL,
  // que el navegador no envía. Lo pasamos a una página que lo lea con JS.
  return NextResponse.redirect(`${origin}/auth/finalizar?next=${encodeURIComponent(next)}`);
}
