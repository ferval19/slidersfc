# Base de datos

## Orden de aplicación

```
migrations/20260911120000_init_schema.sql
migrations/20260911120100_rls.sql
migrations/20260911120200_profiles_trigger.sql
seed/01_catalog.sql
seed/02_set_full_manual_fg.sql
```

`02_set_full_manual_fg.sql` carga el set de inicio «Full Manual FG v3.0» para
FC26, con los valores del documento público de Full Manual FG (v3.0,
07/12/2025; los valores son de @Shinogoblin en X, y el crédito va en la
descripción del set).

**Requisito**: ese fichero busca al usuario por email
(`ferval19@gmail.com`) en `auth.users`, así que hay que haber entrado una vez
en la app con ese correo antes de aplicarlo. No crea cuentas a mano: de eso se
encarga Supabase Auth. Si el usuario no existe, falla con un mensaje claro en
lugar de dejar el set a medias.

Con la CLI de Supabase:

```bash
supabase link --project-ref <ref>
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seed/01_catalog.sql
```

Sin CLI: pega cada fichero en el SQL Editor del dashboard, en ese orden.

## Catálogo de sliders

`seed/catalog.mjs` es la fuente de verdad. Para cambiarlo:

1. Edita `seed/catalog.mjs` (añade o quita sliders, ajusta rangos y defaults).
2. `npm run seed:build`
3. Vuelve a aplicar `seed/01_catalog.sql` — es idempotente (`on conflict do update`).

La lista de **FC26 es la real**: sale del documento de Full Manual FG, con sus
nombres en español y sus 29 sliders (incluidos los de cabeza, interceptación,
desvío, asistencia en entradas y los siete controles de la CPU).

> **Pendiente de verificar para FC27**: se usa la misma lista que FC26, con el
> desdoble user / cpu_opponent / cpu_teammate. Cuando salga el juego habrá que
> contrastarla y añadir lo que cambie.

El SQL generado **sí borra** los sliders de un juego que ya no estén en
`catalog.mjs`, para que renombrar un slug no deje filas huérfanas en la UI. Ojo:
borrar un slider se lleva en cascada sus valores y comentarios.
