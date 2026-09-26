import { test, expect } from '@playwright/test';

import { signUpNewUser } from './helpers';

/**
 * El comentario anclado a un slider concreto es el diferencial de
 * SlidersFC frente a pegar una lista de números — ver codemap.md. Este
 * test cubre que otra persona (no el autor) puede comentar un valor
 * cualquiera del set y que el comentario aparece en su hilo.
 */

test('otra persona puede comentar un slider del set publicado', async ({ page, browser }) => {
  await signUpNewUser(page);

  const title = `Set para comentar ${Date.now()}`;
  await page.goto('/sets/nuevo');
  await page.getByLabel('Título').fill(title);
  await page.getByRole('button', { name: 'Publicar set' }).click();
  await page.waitForURL(/\/u\/[^/]+\/[^/]+$/);
  const setUrl = page.url();

  const commenterContext = await browser.newContext();
  const commenterPage = await commenterContext.newPage();
  await signUpNewUser(commenterPage);
  await commenterPage.goto(setUrl);

  // Cualquier celda de valor abre su propio hilo de comentarios.
  const firstValueCell = commenterPage.getByRole('button', { name: /— comentarios$/ }).first();
  await firstValueCell.click();

  const body = `¿Por qué este valor? — comentario de prueba ${Date.now()}`;
  await commenterPage.getByPlaceholder(/¿Por qué/).fill(body);
  await commenterPage.getByRole('button', { name: 'Comentar' }).click();

  await expect(commenterPage.getByText(body)).toBeVisible();

  await commenterContext.close();
});
