# Base de datos

## Orden de aplicación

```
migrations/20260911120000_init_schema.sql
migrations/20260911120100_rls.sql
migrations/20260911120200_profiles_trigger.sql
seed/01_catalog.sql
```

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

> **Pendiente de verificar**: la lista actual es el conjunto canónico de sliders
> de gameplay de EA SPORTS FC (estable desde FC24), con el desdoble
> user / cpu_opponent / cpu_teammate de FC27. Contrástala con
> `fc27-catalogo-sliders.md` y añade los sliders nuevos que falten
> (p. ej. "Finesse Shot Error") antes del lanzamiento.

Borrar un slider del catálogo borra en cascada sus valores y comentarios.
Si sólo quieres dejar de mostrarlo, quítalo del `catalog.mjs` **y** bórralo a
mano; el seed nunca borra filas por sí solo.
