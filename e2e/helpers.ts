import { expect, type Page } from '@playwright/test';

/**
 * Crea una cuenta nueva por la UI (no hay ruta de API: todo son Server
 * Actions) y deja `page` en la sesión ya iniciada.
 *
 * Requiere que el proyecto de Supabase de `.env.test.local` tenga
 * desactivado «Confirm email» (Authentication → Providers → Email): si no,
 * `signUpWithPassword` no devuelve sesión y esto falla con un mensaje claro
 * en vez de quedarse colgado.
 */
export async function signUpNewUser(page: Page, next = '/') {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `e2e-${unique}@example.com`;
  const password = `Test-${unique}!`;

  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByRole('tab', { name: 'Crear cuenta' }).click();
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill(password);
  await page.getByLabel('Repite la contraseña').fill(password);
  await page.getByRole('button', { name: 'Crear mi cuenta' }).click();

  await expect(
    page.getByText('Confirma tu cuenta'),
    'La cuenta se ha creado pero pide confirmar el correo: desactiva "Confirm email" ' +
      'en Authentication → Providers → Email del proyecto de Supabase de .env.test.local.',
  ).not.toBeVisible({ timeout: 5000 });

  await page.waitForURL((url) => url.pathname === next, { timeout: 10_000 });

  return { email, password };
}
