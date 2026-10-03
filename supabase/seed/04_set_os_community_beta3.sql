-- Set de la comunidad: «OS Community Sliders · Beta 3».
--
-- NO son de Fernando. Los ha hecho @Matt10L con la comunidad de Operation
-- Sports y se publican aquí con crédito, igual que el set de @Maxi_NMQE. Los
-- valores se leyeron de la captura que publicó el 27/09/2026.
--
-- Está en inglés a propósito: el contenido que escribe la gente no se traduce,
-- y el original es inglés. Se ve igual desde / y desde /en.
--
-- Faltan 17 de los 65 sliders y no es un descuido: 16 son de comportamiento de
-- la CPU, que este set no usa porque va en Táctico/Dinámico, y el otro es la
-- barra de potencia, que la captura no llega a enseñar. Lo que no se toca se
-- queda en lo que trae el juego.
--
-- Mismo requisito y misma forma que 02 y 03: el usuario tiene que existir ya
-- en auth.users, y todo va en un único bloque `do`, que es atómico.
-- Es idempotente: se puede volver a ejecutar y sólo actualiza.

do $$
declare
  target_email constant text := 'ferval19@gmail.com';
  target_user  uuid;
  target_game  int;
  target_set   uuid;
  missing      text;
  written      bigint;
begin
  select id into target_user from auth.users where lower(email) = target_email;

  if target_user is null then
    raise exception
      'No existe ningún usuario con el email %. Entra una vez en la app con ese correo y vuelve a ejecutar este fichero.',
      target_email;
  end if;

  select id into target_game from public.games where slug = 'fc27';

  if target_game is null then
    raise exception 'Falta el juego fc27. Aplica primero supabase/seed/01_catalog.sql.';
  end if;

  select id into target_set
  from public.slider_sets
  where owner_id = target_user
    and game_id = target_game
    and slug = 'os-community-sliders-beta-3';

  if target_set is null then
    -- El slug va explícito: es la clave con la que este fichero se reencuentra
    -- con su set, así que no puede depender de cómo se llame en ese momento.
    insert into public.slider_sets (
      owner_id, game_id, title, slug, description, is_published,
      difficulty, half_length, cpu_behaviour
    )
    values (
      target_user,
      target_game,
      'OS Community Sliders · Beta 3',
      'os-community-sliders-beta-3',
      concat_ws(
        E'\n',
        'The Operation Sports community sliders for FC27, Beta 3. All credit goes to @Matt10L and the OS community, who made them and keep them up to date.',
        '',
        'It is a work in progress and the author says so outright: the values are not final. Difficulty and half-length tweaks will come once the base set settles.',
        '',
        'Tested on World Class / Legendary, 6 to 15 minute halves, with CPU sliders on Tactical or Dynamic — so the CPU behaviour tab is left alone here.',
        '',
        'Published here with credit, not claimed. Original: https://x.com/Matt10L'
      ),
      true,
      'legendary',
      '6-15',
      'tactical'
    )
    returning id into target_set;
  else
    update public.slider_sets
      set is_published = true,
          updated_at   = now()
    where id = target_set;
  end if;

  with incoming (slug, applies_to, value) as (
    values
      -- Velocidad
      ('sprint_speed'::text, 'user'::text, 32::int), ('sprint_speed', 'cpu_opponent', 31),
      ('acceleration',                'user', 48), ('acceleration',                'cpu_opponent', 47),
      -- Tiro
      ('master_shot_error',           'user', 75), ('master_shot_error',           'cpu_opponent', 75),
      ('master_shot_speed',           'user', 50), ('master_shot_speed',           'cpu_opponent', 50),
      ('shot_error',                  'user', 70), ('shot_error',                  'cpu_opponent', 70),
      ('shot_speed',                  'user', 45), ('shot_speed',                  'cpu_opponent', 45),
      ('finesse_shot_error',          'user', 65), ('finesse_shot_error',          'cpu_opponent', 65),
      ('finesse_shot_speed',          'user', 45), ('finesse_shot_speed',          'cpu_opponent', 45),
      ('chip_shot_error',             'user', 70), ('chip_shot_error',             'cpu_opponent', 70),
      ('chip_shot_height',            'user', 40), ('chip_shot_height',            'cpu_opponent', 40),
      ('low_driven_shot_error',       'user', 70), ('low_driven_shot_error',       'cpu_opponent', 70),
      ('low_driven_shot_speed',       'user', 46), ('low_driven_shot_speed',       'cpu_opponent', 46),
      ('power_shot_error',            'user', 75), ('power_shot_error',            'cpu_opponent', 75),
      ('power_shot_speed',            'user', 49), ('power_shot_speed',            'cpu_opponent', 49),
      ('header_shot_error',           'user', 65), ('header_shot_error',           'cpu_opponent', 65),
      -- Pase
      ('master_pass_error',           'user', 75), ('master_pass_error',           'cpu_opponent', 75),
      ('master_pass_speed',           'user', 50), ('master_pass_speed',           'cpu_opponent', 50),
      ('pass_error',                  'user', 55), ('pass_error',                  'cpu_opponent', 55),
      ('pass_speed',                  'user', 42), ('pass_speed',                  'cpu_opponent', 42),
      ('header_pass_error',           'user', 70), ('header_pass_error',           'cpu_opponent', 70),
      ('through_pass_error',          'user', 60), ('through_pass_error',          'cpu_opponent', 60),
      ('through_pass_speed',          'user', 48), ('through_pass_speed',          'cpu_opponent', 48),
      ('lobbed_through_pass_error',   'user', 50), ('lobbed_through_pass_error',   'cpu_opponent', 50),
      ('lobbed_through_pass_height',  'user', 35), ('lobbed_through_pass_height',  'cpu_opponent', 35),
      ('lob_pass_error',              'user', 50), ('lob_pass_error',              'cpu_opponent', 50),
      ('lob_pass_height',             'user', 50), ('lob_pass_height',             'cpu_opponent', 50),
      ('cross_error',                 'user', 60), ('cross_error',                 'cpu_opponent', 60),
      ('cross_height',                'user', 45), ('cross_height',                'cpu_opponent', 45),
      -- Lesiones
      ('injury_frequency',            'user', 75), ('injury_frequency',            'cpu_opponent', 75),
      ('injury_severity',             'user', 40), ('injury_severity',             'cpu_opponent', 40),
      -- Portería
      ('goalkeeper_ability',          'user', 38), ('goalkeeper_ability',          'cpu_opponent', 38),
      ('gk_deflection_error',         'user', 75), ('gk_deflection_error',         'cpu_opponent', 75),
      -- Posición del equipo
      ('marking',                     'user', 50), ('marking',                     'cpu_opponent', 50),
      ('run_frequency',               'user', 50), ('run_frequency',               'cpu_opponent', 50),
      ('line_height',                 'user', 50), ('line_height',                 'cpu_opponent', 50),
      ('line_length',                 'user', 48), ('line_length',                 'cpu_opponent', 48),
      ('line_width',                  'user', 45), ('line_width',                  'cpu_opponent', 45),
      ('fullback_positioning',        'user', 95), ('fullback_positioning',        'cpu_opponent', 95),
      -- Control del balón
      ('first_touch_error',           'user', 50), ('first_touch_error',           'cpu_opponent', 50),
      ('interception_error',          'user', 90), ('interception_error',          'cpu_opponent', 90),
      ('deflection_error',            'user', 90), ('deflection_error',            'cpu_opponent', 90),
      ('jog_dribbling',               'user', 52), ('jog_dribbling',               'cpu_opponent', 52),
      ('sprint_dribbling',            'user', 52), ('sprint_dribbling',            'cpu_opponent', 52),
      ('controlled_sprint_dribbling', 'user', 55), ('controlled_sprint_dribbling', 'cpu_opponent', 55),
      -- Defensa
      ('tackle_assistance',           'user', 25), ('tackle_assistance',           'cpu_opponent', 25),
      ('physicality_impact',          'user', 70), ('physicality_impact',          'cpu_opponent', 70),
      ('jockey_speed',                'user', 60), ('jockey_speed',                'cpu_opponent', 60),
      ('sprint_jockey_speed',         'user', 60), ('sprint_jockey_speed',         'cpu_opponent', 60)
  ),
  matched as (
    select i.slug, i.applies_to, i.value, d.id as definition_id
    from incoming i
    left join public.slider_definitions d
      on d.game_id = target_game
     and d.slug = i.slug
     and d.applies_to = i.applies_to
  ),
  inserted as (
    insert into public.slider_set_values (slider_set_id, slider_definition_id, value)
    select target_set, m.definition_id, m.value
    from matched m
    where m.definition_id is not null
    on conflict (slider_set_id, slider_definition_id) do update
      set value = excluded.value
    returning 1
  )
  select
    (select count(*) from inserted),
    (select string_agg(format('%s (%s)', m.slug, m.applies_to), ', ')
     from matched m
     where m.definition_id is null)
  into written, missing;

  if missing is not null then
    raise exception
      'Estos sliders no están en el catálogo de fc27: %. Vuelve a aplicar supabase/seed/01_catalog.sql.',
      missing;
  end if;

  raise notice 'Set «OS Community Sliders · Beta 3» listo (%). % valores escritos.', target_set, written;
end;
$$;
