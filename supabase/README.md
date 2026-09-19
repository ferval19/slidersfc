# Base de datos

## Orden de aplicación

```
migrations/20260911120000_init_schema.sql
migrations/20260911120100_rls.sql
migrations/20260911120200_profiles_trigger.sql
seed/01_catalog.sql
seed/02_set_full_manual_fg.sql
seed/03_set_fc27_realista.sql
```

`02_set_full_manual_fg.sql` carga el set de inicio «Full Manual FG v3.0» para
FC26, con los valores del documento público de Full Manual FG (v3.0,
07/12/2025; los valores son de @Shinogoblin en X, y el crédito va en la
descripción del set).

`03_set_fc27_realista.sql` carga «Jugabilidad realista de FC27»: los 121
valores que el juego trae de fábrica en ese preajuste, leídos del menú en el
acceso anticipado. No es un set de nadie, es la referencia contra la que se ve
qué ha tocado cada quien.

**Requisito** (para los dos): el fichero busca al usuario por email
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

## Copia de seguridad

```bash
npm run backup
```

Deja en `copias/` (que no va al repositorio) dos ficheros:

- `slidersfc-<fecha>.json` — el volcado entero, tal cual está en las tablas.
  Es la copia de archivo.
- `slidersfc-<fecha>.sql` — el SQL con el que reponerlo. Una copia que no
  sabes reponer no es una copia.

**La clave importa.** Con `SUPABASE_SERVICE_ROLE_KEY` (panel de Supabase →
Project Settings → API) se copia todo, borradores incluidos. Sin ella se usa la
clave pública y RLS se aplica igual: la copia sólo lleva lo que vería
cualquiera. El script lo avisa por pantalla, porque una copia incompleta que se
cree completa es peor que no tener ninguna. **Esa clave no se sube al
repositorio**: ponla en `.env.local` o pásala por delante del comando.

### Reponer

En este orden:

1. Las migraciones y `supabase/seed/01_catalog.sql`.
2. Que cada persona haya entrado una vez en la aplicación, para que exista su
   cuenta en `auth.users`. Un perfil no se puede crear sin ella.
3. El `.sql` de la copia.

Los juegos y el catálogo de sliders **no** se reponen desde la copia a
propósito: son código (`supabase/seed/catalog.mjs`), y reponerlos desde un
volcado sería quedarse con una foto vieja del catálogo.

El SQL conserva el UUID de cada set y de cada comentario, así que las URLs por
id siguen valiendo. En cambio el dueño va por nombre de usuario, el juego por
slug y cada valor por (slug del slider, ámbito): los ids de `profiles` vienen de
`auth.users` y los de `games` y `slider_definitions` son series, y en otro
proyecto no coinciden.

Cada bloque `do` es atómico y se puede reejecutar. Si sólo quieres recuperar un
set, pega su bloque y nada más. Los valores se reponen enteros —es una
instantánea, no un parche— y los comentarios sólo se añaden: lo que ya esté
escrito no se pisa.

`npm run test:backup` hace el viaje de ida y vuelta contra un Postgres en
memoria: vuelca, genera el SQL, lo aplica en una base vacía y comprueba que ha
vuelto todo.
