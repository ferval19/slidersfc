/**
 * Los ficheros de SQL del proyecto y, sobre todo, EN QUÉ ORDEN van.
 *
 * Vive aparte porque lo necesitan dos pruebas distintas (`test-sql.mjs` y
 * `test-backup.mjs`). Cuando cada una tenía su propia copia de la lista, una
 * migración nueva entraba en un sitio y no en el otro, y la prueba que no se
 * enteraba fallaba con un error que no decía nada.
 *
 * El catálogo va EN MEDIO, no al final: las migraciones de antes crean las
 * columnas que el catálogo escribe (`has_cpu_behaviour` es la última), y las
 * de después trabajan sobre datos que ya tienen que estar. Es el mismo orden
 * que documenta supabase/README.md.
 */

export const MIGRATIONS_ANTES = [
  'supabase/migrations/20260911120000_init_schema.sql',
  'supabase/migrations/20260911120100_rls.sql',
  'supabase/migrations/20260911120200_profiles_trigger.sql',
  'supabase/migrations/20260920100000_cpu_behaviour.sql',
];

export const CATALOG = 'supabase/seed/01_catalog.sql';

export const MIGRATIONS_DESPUES = [
  'supabase/migrations/20260912090000_drop_mode.sql',
  'supabase/migrations/20260912140000_set_slugs.sql',
  'supabase/migrations/20260919160000_username_history.sql',
  'supabase/migrations/20260919180000_profile_youtube.sql',
  'supabase/migrations/20260920140000_set_conditions.sql',
  'supabase/migrations/20260920180000_set_versions.sql',
];

export const STARTER_SET = 'supabase/seed/02_set_full_manual_fg.sql';
export const FC27_SET = 'supabase/seed/03_set_fc27_realista.sql';
