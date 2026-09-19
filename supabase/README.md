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

## Probar el SQL antes de pegarlo

```bash
npm run test:sql
```

Levanta un Postgres en memoria, aplica las migraciones y los seeds en orden y
comprueba el resultado: cuántos sliders quedan por juego, que el set de inicio
tenga sus 50 valores sin huecos, que reejecutar los seeds no duplique nada, que
los tres caminos de error aborten sin dejar el set a medias, y que RLS esté
activada en las seis tablas.

Ojo con dos cosas al escribir SQL para el editor de Supabase: ejecuta cada
sentencia en su propia transacción (así que una tabla temporal con
`on commit drop` no sobrevive a la siguiente sentencia — usa un único bloque
`do`, que es atómico), y PGlite no trae `pgcrypto`, que en Supabase sí está.

## Catálogo de sliders

`seed/catalog.mjs` es la fuente de verdad. Para cambiarlo:

1. Edita `seed/catalog.mjs` (añade o quita sliders, ajusta rangos y defaults).
2. `npm run seed:build`
3. Vuelve a aplicar `seed/01_catalog.sql` — es idempotente (`on conflict do update`).

La lista de **FC26 es la real**: sale del documento de Full Manual FG, con sus
nombres en español y sus 29 sliders (incluidos los de cabeza, interceptación,
desvío, asistencia en entradas y los siete controles de la CPU).

La de **FC27 también es real**, sacada de las capturas del menú del juego en
el acceso anticipado (19/09/2026): 61 sliders, 121 filas.

Dos cosas del menú de FC27 que conviene saber:

- Los sliders de jugabilidad viven en la pestaña «Ajustes de tipo de partida»
  con lado **Usuario** y **CPU**. El desdoble **CPU rival / CPU de tu equipo**
  está sólo en la pestaña «Controles de la CPU».
- Hay cuatro **sliders maestros** («Todos los controles de error de tiro»,
  «...de velocidad y altura», y sus dos equivalentes de pase) que **no** están
  en el catálogo: no son valores, son atajos que cambian de golpe todos los de
  debajo, y guardarlos duplicaría información.

El SQL generado **sí borra** los sliders de un juego que ya no estén en
`catalog.mjs`, para que renombrar un slug no deje filas huérfanas en la UI. Ojo:
borrar un slider se lleva en cascada sus valores y comentarios.
