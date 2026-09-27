import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { authErrorFrom, authErrorMessage } from '@/lib/auth-errors';
import { DEFAULT_LOCALE, isLocale, localePath } from '@/lib/i18n/locale';
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
 *
 * Un Route Handler tampoco puede usar `next/root-params`: aquí vive bajo
 * `app/[lang]/`, así que el idioma llega por los `params` de la ruta, que sí
 * le llegan al handler.
 */
export async function handleAuthCallback(
  request: NextRequest,
  params: Promise<{ lang?: string }>,
) {
  const { searchParams, origin } = request.nextUrl;
  const langParam = (await params).lang ?? '';
  const locale = isLocale(langParam) ? langParam : DEFAULT_LOCALE;
  const next = safeNextPath(searchParams.get('next'));

  const fail = (message: string) =>
    NextResponse.redirect(`${origin}${localePath(locale, `/login?error=${encodeURIComponent(message)}`)}`);

  const providerError = authErrorFrom(searchParams, locale);
  if (providerError) return fail(providerError);

  const supabase = await createSupabaseServerClient();

  const code = searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail(authErrorMessage(error, locale));
    return NextResponse.redirect(`${origin}${localePath(locale, next)}`);
  }

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return fail(authErrorMessage(error, locale));
    return NextResponse.redirect(`${origin}${localePath(locale, next)}`);
  }

  // Puede ser flujo implícito: los tokens vendrían en el fragmento de la URL,
  // que el navegador no envía. Lo pasamos a una página que lo lea con JS.
  return NextResponse.redirect(
    `${origin}${localePath(locale, `/auth/finalizar?next=${encodeURIComponent(next)}`)}`,
  );
}
