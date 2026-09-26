# Tests end-to-end — Playwright

> Léelo antes de tocar `e2e/` o `playwright.config.ts`. La auditoría que lo
> justifica y el porqué de cada decisión están aquí para no repetirlos en
> cada PR.

## Auditoría: qué había y qué faltaba

Antes de esto, la prueba de la aplicación era: `npm test` (SQL contra
PGlite, importador, perfil, comparación, condiciones y copia de seguridad —
todo lógica **sin** navegador) y `npm run build` como único que ve el
límite cliente/servidor. Nada ejercitaba un navegador real, ni Server
Actions con formularios de verdad, ni RLS desde fuera de un script.

Next 16 sólo trae guía para Vitest (unit, componentes síncronos) en
`node_modules/next/dist/docs/01-app/02-guides/testing/`; no hay guía de
Playwright empaquetada porque no es específico de Next — es donde encaja un
E2E real: formularios que son Server Actions, sesión con cookies de
Supabase, y RLS que sólo se ve completo con el navegador de por medio.

**El hallazgo que manda todo lo demás:** `.env.local` de este árbol apunta
al proyecto de Supabase de **producción** (confirmado, no una suposición).
Un test que crea cuentas o sets no puede escribir ahí. Eso descarta
cualquier configuración que reutilice `.env.local` sin más, y es la razón
de la Fase 0.

## Fase 0 — el proyecto de Supabase de test (obligatorio, una vez)

1. Crea un proyecto nuevo en [supabase.com](https://supabase.com) sólo para
   esto (gratis). Aplica los mismos ficheros que en el README, sección 3,
   **en el mismo orden** — es el mismo procedimiento manual que ya usas
   para producción, pegando SQL en el editor.
2. **Desactiva «Confirm email»** (*Authentication → Providers → Email*).
   Sin esto, `signUpWithPassword` no devuelve sesión — Supabase pide
   confirmar el correo antes — y los tests que crean una cuenta se quedan
   colgados. Los tests de `e2e/auth.spec.ts` fallan con un mensaje que
   apunta aquí si te olvidas.
3. Copia `.env.test.example` a `.env.test.local` (ya está en `.gitignore`,
   como cualquier `.env*.local`) y rellena `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los de ese proyecto.
4. `npx playwright install chromium` (una vez por máquina; los navegadores
   no van en el repo).

**Por qué no Supabase local (CLI + Docker) en vez de un segundo proyecto
cloud.** Sería más rápido de resetear y no gasta cuota, pero esta máquina
no tiene ni la CLI de Supabase ni Docker instalados, y el proyecto ya tiene
un procedimiento manual de aplicar SQL que funciona y está documentado. Un
segundo proyecto cloud es cero herramienta nueva. Si el volumen de tests
crece o hace falta CI, migrar a Supabase local es la siguiente mejora
natural — ver «Lo que falta» más abajo.

### Por qué esto no puede escribir en producción por accidente

`playwright.config.ts` arranca el servidor de Next con `NODE_ENV=test`. Es
un mecanismo **nativo** de Next (「Test Environment Variables」 en su guía
de variables de entorno): con `NODE_ENV=test`, Next carga
`.env.test(.local)` y **no carga `.env.local`**, a propósito, para que los
tests no dependan de lo que tenga cada máquina. No hace falta ningún script
ni convención adicional — es gratis y no se puede desactivar por error de
sintaxis en un `.env`.

Consecuencia: **todos** los tests, incluidos los que sólo leen, necesitan
`.env.test.local` — sin él, Next arranca sin Supabase configurado y
cualquier página que use sesión (todas, por el header) responde con el
error de «Faltan variables de entorno de Supabase».

## Cómo se ejecuta

```bash
npm run test:e2e       # headless, informe HTML si algo falla
npm run test:e2e:ui    # modo interactivo, para escribir/depurar un test
```

`playwright.config.ts` levanta `next dev` en el puerto 3100 (no interfiere
con un `npm run dev` que ya tengas abierto en el 3000) y lo reutiliza si ya
está arriba con `reuseExistingServer` (desactivado en CI).

## Qué cubren los primeros tests

Cuatro ficheros en `e2e/`, de menos a más riesgoso:

| Fichero | Qué prueba | Escribe en Supabase |
| --- | --- | --- |
| `smoke.spec.ts` | Portada, `/login`, `/guia` cargan; `/sets/nuevo` sin sesión redirige a login | No |
| `auth.spec.ts` | Crear cuenta con correo/contraseña deja la sesión iniciada; contraseña mala no entra; cerrar sesión vuelve a visitante | Sí: cuentas |
| `publish-set.spec.ts` | Publicar un set (sólo el título; el resto son los valores por defecto del formulario) lo deja legible en su ficha; **un borrador no lo ve nadie más que su autor** — la política de RLS más fácil de romper sin que se note | Sí: cuentas y sets |
| `comment.spec.ts` | Otra persona puede comentar un slider concreto del set — el comentario anclado por slider es el diferencial del producto (ver codemap.md) | Sí: cuentas, sets y comentarios |

`e2e/helpers.ts` tiene `signUpNewUser(page)`: registra una cuenta única por
llamada (`e2e-<timestamp>-<random>@example.com`) por la UI de `/login`, no
hay ruta de API que atajar porque todo son Server Actions. Los tests que
necesitan dos personas (`comment.spec.ts`, y el borrador de
`publish-set.spec.ts`) abren un segundo `browser.newContext()` en vez de
reutilizar la sesión.

**Se eligieron por ser lo que rompe en silencio, no lo que es fácil de
probar.** Un fallo en el importador de texto pegado ya lo pilla
`npm run test:import` sin navegador; lo que ningún test cubría era la
sesión real (cookies de Supabase de por medio) y sobre todo la política de
RLS de que un borrador es invisible — si esa política se rompe, no hay
error en pantalla, sólo un set que no debería verse y se ve.

## Qué falta (por orden de qué rompe antes)

No es negativo — es medir antes de tocar. Por orden de lo que probablemente
se rompa primero sin que se note:

1. **Comparar dos sets** (`/comparar/...`) — sólo funciona dentro del mismo
   juego, y esa restricción vive en el selector, no sólo en la ruta.
2. **Editar un set publicado y que suba de versión** — el historial
   (`slider_set_versions`) depende de que `updateSet` calcule bien el diff.
3. **Favoritos**: no poder guardarte tu propio set, y que el botón esté
   escondido al autor.
4. **Cambiar de nombre de usuario**: que `/u/<viejo>` siga redirigiendo.
5. **Modo consola** y su progreso en `localStorage`.
6. **Limpieza de datos de test.** Cada cuenta creada por `signUpNewUser`
   queda en el proyecto de test para siempre; con volumen, hace falta un
   script de limpieza (por prefijo `e2e-` en el email) o mover el entorno a
   Supabase local, que se resetea entero con `supabase db reset`.
7. **CI.** Nada de esto corre solo todavía. Añadir Playwright a un flujo de
   GitHub Actions es sencillo, pero necesita el proyecto de Supabase de
   test accesible desde CI (secretos del repo) y decidir si se ejecuta en
   cada push o sólo antes de un deploy.

## Convenciones al añadir un test

- **Selectores por rol y texto accesible** (`getByRole`, `getByLabel`,
  `getByPlaceholder`), nunca `data-testid`: la web no usa ninguno y no hace
  falta empezar — los `eyebrow`/`label` ya son el contrato con quien usa un
  lector de pantalla, y es el mismo contrato que sirve al test.
- **Cada test crea sus propios datos** (cuenta, set) en vez de depender de
  lo que haya seed en el proyecto de test. Los tests no se pisan entre sí
  aunque corran en paralelo (`fullyParallel: true`), y no hace falta
  mantener sincronizado qué seed tiene el proyecto de test con lo que
  espera cada test.
- Un test que sólo lee puede ir en `smoke.spec.ts`; uno que crea una cuenta
  o escribe algo, en su propio fichero.
