import { test, expect } from '@playwright/test';

import { signUpNewUser } from './helpers';

/**
 * Escriben en Supabase: cuentas nuevas. Necesitan .env.test.local con
 * "Confirm email" desactivado — ver docs/testing-e2e.md.
 */

test('crear cuenta con correo y contraseña deja la sesión iniciada', async ({ page }) => {
  await signUpNewUser(page);

  await expect(page.getByRole('link', { name: 'Nuevo set' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Entrar' })).not.toBeVisible();
});

test('contraseña incorrecta muestra el error, no entra', async ({ page }) => {
  const { email } = await signUpNewUser(page);

  await page.goto('/perfil');
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await page.waitForURL('/');

  await page.goto('/login');
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill('una-contraseña-que-no-es');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();

  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL('/login');
});

test('cerrar sesión vuelve al estado de visitante', async ({ page }) => {
  await signUpNewUser(page);

  await page.goto('/perfil');
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();

  await page.waitForURL('/');
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
});
