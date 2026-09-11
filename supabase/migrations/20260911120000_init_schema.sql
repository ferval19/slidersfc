-- SliderXI — esquema inicial
-- Fase 0 del plan de desarrollo. Todo el control de acceso vive en RLS
-- (ver 20260911120100_rls.sql), no en el backend de Next.js.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles: espejo público de auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  username       text not null unique,
  display_name   text,
  avatar_url     text,
  twitter_handle text,
  bio            text,
  created_at     timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$'),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 280)
);

-- ---------------------------------------------------------------------------
-- games: una fila por juego/versión (fc26, fc27...)
-- ---------------------------------------------------------------------------
create table public.games (
  id           serial primary key,
  slug         text not null unique,
  name         text not null,
  release_year int,
  constraint games_slug_format check (slug ~ '^[a-z0-9-]{2,32}$')
);

-- ---------------------------------------------------------------------------
-- slider_definitions: catálogo de sliders por juego.
-- `applies_to` modela la separación que introduce FC27:
--   user / cpu_opponent / cpu_teammate  (FC27)
--   user / cpu                          (FC26 y anteriores)
-- `slug` permite re-seedear y comparar el mismo slider entre juegos.
-- ---------------------------------------------------------------------------
create table public.slider_definitions (
  id            serial primary key,
  game_id       int not null references public.games (id) on delete cascade,
  category      text not null,
  applies_to    text not null,
  name          text not null,
  slug          text not null,
  min_value     int not null default 0,
  max_value     int not null default 100,
  default_value int not null default 50,
  sort_order    int not null default 0,
  constraint slider_definitions_applies_to
    check (applies_to in ('user', 'cpu', 'cpu_opponent', 'cpu_teammate')),
  constraint slider_definitions_range check (min_value < max_value),
  constraint slider_definitions_default_in_range
    check (default_value between min_value and max_value),
  unique (game_id, slug, applies_to)
);

create index slider_definitions_game_idx
  on public.slider_definitions (game_id, sort_order, applies_to);

-- ---------------------------------------------------------------------------
-- slider_sets
-- ---------------------------------------------------------------------------
create table public.slider_sets (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  game_id      int not null references public.games (id),
  title        text not null,
  description  text,
  mode         text not null,
  version      int not null default 1,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint slider_sets_title_length
    check (char_length(btrim(title)) between 3 and 120),
  constraint slider_sets_description_length
    check (description is null or char_length(description) <= 2000),
  constraint slider_sets_mode check (mode in ('carrera', 'online', 'amistoso'))
);

create index slider_sets_feed_idx
  on public.slider_sets (game_id, is_published, created_at desc);
create index slider_sets_owner_idx on public.slider_sets (owner_id);

-- ---------------------------------------------------------------------------
-- slider_set_values
-- ---------------------------------------------------------------------------
create table public.slider_set_values (
  id                   uuid primary key default gen_random_uuid(),
  slider_set_id        uuid not null references public.slider_sets (id) on delete cascade,
  slider_definition_id int not null references public.slider_definitions (id) on delete cascade,
  value                int not null,
  unique (slider_set_id, slider_definition_id)
);

create index slider_set_values_set_idx
  on public.slider_set_values (slider_set_id);

-- ---------------------------------------------------------------------------
-- slider_comments
-- slider_definition_id null = comentario general al set.
-- set_version guarda la versión del set en la que se escribió, para poder
-- marcar un comentario como "de la v1" cuando el autor revisa los valores.
-- ---------------------------------------------------------------------------
create table public.slider_comments (
  id                   uuid primary key default gen_random_uuid(),
  slider_set_id        uuid not null references public.slider_sets (id) on delete cascade,
  slider_definition_id int references public.slider_definitions (id) on delete cascade,
  author_id            uuid not null references public.profiles (id) on delete cascade,
  body                 text not null,
  set_version          int not null default 1,
  created_at           timestamptz not null default now(),
  constraint slider_comments_body_length
    check (char_length(btrim(body)) between 1 and 2000)
);

create index slider_comments_set_idx
  on public.slider_comments (slider_set_id, slider_definition_id, created_at);

-- ---------------------------------------------------------------------------
-- Integridad: un valor o comentario sólo puede apuntar a un slider del
-- mismo juego que el set. Las FK no pueden expresar esto por sí solas.
-- ---------------------------------------------------------------------------
create or replace function public.assert_definition_matches_game()
returns trigger
language plpgsql
as $$
declare
  set_game_id int;
  def_game_id int;
begin
  if new.slider_definition_id is null then
    return new;
  end if;

  select game_id into set_game_id
  from public.slider_sets
  where id = new.slider_set_id;

  select game_id into def_game_id
  from public.slider_definitions
  where id = new.slider_definition_id;

  if set_game_id is distinct from def_game_id then
    raise exception
      'El slider % no pertenece al juego del set %',
      new.slider_definition_id, new.slider_set_id;
  end if;

  return new;
end;
$$;

create trigger slider_set_values_game_check
  before insert or update on public.slider_set_values
  for each row execute function public.assert_definition_matches_game();

create trigger slider_comments_game_check
  before insert or update on public.slider_comments
  for each row execute function public.assert_definition_matches_game();

-- ---------------------------------------------------------------------------
-- Integridad: el valor debe caer dentro del rango de su definición.
-- ---------------------------------------------------------------------------
create or replace function public.assert_value_in_range()
returns trigger
language plpgsql
as $$
declare
  lo int;
  hi int;
begin
  select min_value, max_value into lo, hi
  from public.slider_definitions
  where id = new.slider_definition_id;

  if new.value < lo or new.value > hi then
    raise exception 'El valor % está fuera del rango permitido (%-%)',
      new.value, lo, hi;
  end if;

  return new;
end;
$$;

create trigger slider_set_values_range_check
  before insert or update on public.slider_set_values
  for each row execute function public.assert_value_in_range();

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger slider_sets_touch_updated_at
  before update on public.slider_sets
  for each row execute function public.touch_updated_at();
