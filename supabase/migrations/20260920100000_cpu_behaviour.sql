-- ---------------------------------------------------------------------------
-- Comportamiento de la CPU.
--
-- FC27 deja elegir cómo se comporta la CPU: «táctico» y «dinámico» los ajusta
-- el juego solo según los equipos, y «personalizado» es el único en el que los
-- sliders de esa pestaña significan algo. En el menú del juego aparece como
-- AI behaviour.
--
-- Dos columnas:
--
-- `games.has_cpu_behaviour` — no todos los juegos lo tienen. FC26 tiene sus
--   sliders de CPU sin selector, así que enseñarle uno sería mentir. Se
--   rellena desde el catálogo (`supabase/seed/catalog.mjs`).
--
-- `slider_sets.cpu_behaviour` — los sets que ya existen se quedan en
--   'custom' a propósito, que es lo que enseñan hoy: ponerles 'tactical'
--   escondería unos valores que su autor sí puso. El valor por defecto para
--   los sets NUEVOS sí es 'tactical', que es lo que trae el juego.
-- ---------------------------------------------------------------------------

alter table public.games
  add column if not exists has_cpu_behaviour boolean not null default false;

alter table public.slider_sets
  add column if not exists cpu_behaviour text not null default 'custom';

alter table public.slider_sets
  drop constraint if exists slider_sets_cpu_behaviour;

alter table public.slider_sets
  add constraint slider_sets_cpu_behaviour
  check (cpu_behaviour in ('custom', 'tactical', 'dynamic'));

-- Lo de arriba rellena lo que ya había; esto manda en lo que venga.
alter table public.slider_sets
  alter column cpu_behaviour set default 'tactical';
