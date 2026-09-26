import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

/**
 * `NODE_ENV=test` hace que Next.js cargue `.env.test(.local)` y NO cargue
 * `.env.local` (comportamiento nativo, ver "Test Environment Variables" en
 * la guía de variables de entorno de Next). Así los tests nunca pueden
 * acabar escribiendo por accidente en el Supabase de `.env.local` — que en
 * este proyecto es el de producción.
 *
 * Falta crear `.env.test.local` con un proyecto de Supabase dedicado a
 * tests. Ver docs/testing-e2e.md.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NODE_ENV: 'test' },
    stdout: 'pipe',
  },
});
