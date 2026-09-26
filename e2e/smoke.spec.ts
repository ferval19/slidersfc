import { test, expect } from '@playwright/test';

/**
 * Sólo lectura: no crean cuentas ni sets. Se pueden correr contra cualquier
 * proyecto de Supabase, incluido el de producción, sin dejar basura. Sirven
 * de red mínima para no romper la navegación básica del sitio.
 */

test('la portada carga y enseña el feed', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 2, name: 'Sets recientes' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
});

test('la página de acceso enseña las tres vías', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Entrar' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Crear cuenta' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuar con X' })).toBeVisible();
});

test('la guía explica los campos de un set', async ({ page }) => {
  await page.goto('/guia');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('crear un set sin sesión redirige a login', async ({ page }) => {
  await page.goto('/sets/nuevo');

  await expect(page).toHaveURL(/\/login\?next=%2Fsets%2Fnuevo/);
});
