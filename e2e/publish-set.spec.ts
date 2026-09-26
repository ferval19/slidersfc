import { test, expect, type Page } from '@playwright/test';

import { signUpNewUser } from './helpers';

/**
 * El camino de valor del producto: publicar un set y que se pueda leer.
 * Sólo se toca el título — el resto de los ~120+ sliders llega con los
 * valores por defecto del formulario, que es justo lo que hay que probar
 * (que un set se pueda publicar sin rellenar nada a mano).
 */

async function fillTitleAndSubmit(page: Page, title: string, intent: 'Publicar set' | 'Guardar borrador') {
  await page.goto('/sets/nuevo');
  await page.getByLabel('Título').fill(title);
  await page.getByRole('button', { name: intent }).click();
}

test('publicar un set lo deja visible en su ficha', async ({ page }) => {
  await signUpNewUser(page);

  const title = `Set de prueba ${Date.now()}`;
  await fillTitleAndSubmit(page, title, 'Publicar set');

  await page.waitForURL(/\/u\/[^/]+\/[^/]+$/);
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  await expect(page.getByText('Sólo tú')).toBeVisible();
});

test('un borrador no lo puede ver nadie más que su autor', async ({ page, browser }) => {
  await signUpNewUser(page);

  const title = `Borrador de prueba ${Date.now()}`;
  await fillTitleAndSubmit(page, title, 'Guardar borrador');
  await page.waitForURL(/\/u\/[^/]+\/[^/]+$/);
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();

  const draftUrl = page.url();

  const strangerContext = await browser.newContext();
  const strangerPage = await strangerContext.newPage();
  await strangerPage.goto(draftUrl);

  await expect(strangerPage.getByRole('heading', { level: 1, name: 'Esto no existe' })).toBeVisible();
  await strangerContext.close();
});
