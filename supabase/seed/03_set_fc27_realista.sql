-- Set de inicio: «Jugabilidad realista de FC27».
--
-- Son los valores que el juego trae de fábrica en ese preajuste, leídos del
-- menú en el acceso anticipado (19/09/2026). Sirven de referencia: contra
-- ellos se ve de un vistazo qué ha tocado cada quien en su set.
--
-- Mismo requisito y misma forma que 02: el usuario tiene que existir ya en
-- auth.users, y todo va en un único bloque `do`, que es atómico.
--
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

  insert into public.profiles (id, username, display_name, twitter_handle, bio)
  values (
    target_user,
    'fullmanualfg',
    'Full Manual FG',
    'FullManualFG',
    'Modo carrera con controles manuales. Sliders, tácticas y partidos largos.'
  )
  on conflict (id) do update
    set username       = excluded.username,
        display_name   = excluded.display_name,
        twitter_handle = coalesce(public.profiles.twitter_handle, excluded.twitter_handle),
        bio            = coalesce(public.profiles.bio, excluded.bio);

  select id into target_set
  from public.slider_sets
  where owner_id = target_user
    and game_id = target_game
    and title = 'Jugabilidad realista de FC27';

  if target_set is null then
    insert into public.slider_sets (owner_id, game_id, title, description, is_published)
    values (
      target_user,
      target_game,
      'Jugabilidad realista de FC27',
      concat_ws(
        E'\n',
        'Los valores que EA trae de fábrica en el preajuste de jugabilidad realista de FC27, tal cual salen del menú.',
        '',
        'No es un set «bueno» ni «malo»: es el punto de partida. Sirve para ver de un vistazo qué ha tocado cada quien en el suyo, y para volver aquí cuando un cambio no acaba de funcionar.',
        '',
        'Leídos del menú del juego en el acceso anticipado, el 19 de septiembre de 2026.'
      ),
      true
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
      ('sprint_speed'::text, 'user'::text, 35::int), ('sprint_speed', 'cpu_opponent', 35),
      ('acceleration', 'user', 48), ('acceleration', 'cpu_opponent', 48),
      -- Tiro. Los dos maestros van en 50: el juego pide dejarlos ahí y tocar
      -- sólo los de cada tipo, así que 50 es su valor de fábrica.
      ('master_shot_error',     'user', 50), ('master_shot_error',     'cpu_opponent', 50),
      ('master_shot_speed',     'user', 50), ('master_shot_speed',     'cpu_opponent', 50),
      ('shot_error',            'user', 52), ('shot_error',            'cpu_opponent', 52),
      ('shot_speed',            'user', 48), ('shot_speed',            'cpu_opponent', 48),
      ('finesse_shot_error',    'user', 55), ('finesse_shot_error',    'cpu_opponent', 55),
      ('finesse_shot_speed',    'user', 45), ('finesse_shot_speed',    'cpu_opponent', 45),
      ('chip_shot_error',       'user', 60), ('chip_shot_error',       'cpu_opponent', 60),
      ('chip_shot_height',      'user', 48), ('chip_shot_height',      'cpu_opponent', 48),
      ('low_driven_shot_error', 'user', 60), ('low_driven_shot_error', 'cpu_opponent', 60),
      ('low_driven_shot_speed', 'user', 48), ('low_driven_shot_speed', 'cpu_opponent', 48),
      ('power_shot_error',      'user', 55), ('power_shot_error',      'cpu_opponent', 55),
      ('power_shot_speed',      'user', 48), ('power_shot_speed',      'cpu_opponent', 48),
      ('header_shot_error',     'user', 40), ('header_shot_error',     'cpu_opponent', 40),
      -- Pase. Mismo criterio con sus dos maestros.
      ('master_pass_error',          'user', 50), ('master_pass_error',          'cpu_opponent', 50),
      ('master_pass_speed',          'user', 50), ('master_pass_speed',          'cpu_opponent', 50),
      ('pass_error',                 'user', 55), ('pass_error',                 'cpu_opponent', 55),
      ('pass_speed',                 'user', 45), ('pass_speed',                 'cpu_opponent', 45),
      ('header_pass_error',          'user', 60), ('header_pass_error',          'cpu_opponent', 60),
      ('through_pass_error',         'user', 55), ('through_pass_error',         'cpu_opponent', 55),
      ('through_pass_speed',         'user', 38), ('through_pass_speed',         'cpu_opponent', 38),
      ('lobbed_through_pass_error',  'user', 55), ('lobbed_through_pass_error',  'cpu_opponent', 55),
      ('lobbed_through_pass_height', 'user', 35), ('lobbed_through_pass_height', 'cpu_opponent', 35),
      ('lob_pass_error',             'user', 55), ('lob_pass_error',             'cpu_opponent', 55),
      ('lob_pass_height',            'user', 35), ('lob_pass_height',            'cpu_opponent', 35),
      ('cross_error',                'user', 60), ('cross_error',                'cpu_opponent', 60),
      ('cross_height',               'user', 55), ('cross_height',               'cpu_opponent', 55),
      -- Lesiones
      ('injury_frequency', 'user', 75), ('injury_frequency', 'cpu_opponent', 75),
      ('injury_severity',  'user', 30), ('injury_severity',  'cpu_opponent', 30),
      -- Portería
      ('goalkeeper_ability',  'user', 50), ('goalkeeper_ability',  'cpu_opponent', 50),
      ('gk_deflection_error', 'user', 99), ('gk_deflection_error', 'cpu_opponent', 99),
      -- Posición del equipo
      ('marking',              'user', 65), ('marking',              'cpu_opponent', 65),
      ('run_frequency',        'user', 45), ('run_frequency',        'cpu_opponent', 45),
      ('line_height',          'user', 65), ('line_height',          'cpu_opponent', 65),
      ('line_length',          'user', 35), ('line_length',          'cpu_opponent', 35),
      ('line_width',           'user', 50), ('line_width',           'cpu_opponent', 50),
      ('fullback_positioning', 'user', 80), ('fullback_positioning', 'cpu_opponent', 80),
      -- Control del balón
      ('power_bar',                     'user', 50),
      ('first_touch_error',             'user', 85), ('first_touch_error',             'cpu_opponent', 85),
      ('interception_error',            'user', 90), ('interception_error',            'cpu_opponent', 90),
      ('deflection_error',              'user', 99), ('deflection_error',              'cpu_opponent', 99),
      ('jog_dribbling',                 'user', 50), ('jog_dribbling',                 'cpu_opponent', 50),
      ('sprint_dribbling',              'user', 50), ('sprint_dribbling',              'cpu_opponent', 50),
      ('controlled_sprint_dribbling',   'user', 50), ('controlled_sprint_dribbling',   'cpu_opponent', 50),
      -- Defensa
      ('tackle_assistance',   'user', 40), ('tackle_assistance',   'cpu_opponent', 40),
      ('physicality_impact',  'user', 99), ('physicality_impact',  'cpu_opponent', 99),
      ('jockey_speed',        'user', 50), ('jockey_speed',        'cpu_opponent', 50),
      ('sprint_jockey_speed', 'user', 50), ('sprint_jockey_speed', 'cpu_opponent', 50),
      -- Controles de la CPU — rival
      ('cpu_defending_aggression',       'cpu_opponent', 62),
      ('cpu_stand_tackle_frequency',     'cpu_opponent', 75),
      ('cpu_slide_tackle_frequency',     'cpu_opponent', 55),
      ('cpu_professional_frequency',     'cpu_opponent', 47),
      ('cpu_buildup_speed',              'cpu_opponent', 98),
      ('cpu_shot_frequency',             'cpu_opponent', 53),
      ('cpu_chip_shot_frequency',        'cpu_opponent', 59),
      ('cpu_low_driven_shot_frequency',  'cpu_opponent', 56),
      ('cpu_finesse_shot_frequency',     'cpu_opponent', 53),
      ('cpu_long_shot_frequency',        'cpu_opponent', 54),
      ('cpu_power_shot_frequency',       'cpu_opponent', 56),
      ('cpu_first_touch_pass_frequency', 'cpu_opponent', 50),
      ('cpu_cross_frequency',            'cpu_opponent', 50),
      ('cpu_early_cross_frequency',      'cpu_opponent', 50),
      ('cpu_dribble_frequency',          'cpu_opponent', 50),
      ('cpu_skill_move_frequency',       'cpu_opponent', 50),
      -- Controles de la CPU — tu equipo
      ('cpu_defending_aggression',       'cpu_teammate', 68),
      ('cpu_stand_tackle_frequency',     'cpu_teammate', 75),
      ('cpu_slide_tackle_frequency',     'cpu_teammate', 57),
      ('cpu_professional_frequency',     'cpu_teammate', 55),
      ('cpu_buildup_speed',              'cpu_teammate', 89),
      ('cpu_shot_frequency',             'cpu_teammate', 39),
      ('cpu_chip_shot_frequency',        'cpu_teammate', 53),
      ('cpu_low_driven_shot_frequency',  'cpu_teammate', 46),
      ('cpu_finesse_shot_frequency',     'cpu_teammate', 38),
      ('cpu_long_shot_frequency',        'cpu_teammate', 40),
      ('cpu_power_shot_frequency',       'cpu_teammate', 46),
      ('cpu_first_touch_pass_frequency', 'cpu_teammate', 60),
      ('cpu_cross_frequency',            'cpu_teammate', 50),
      ('cpu_early_cross_frequency',      'cpu_teammate', 50),
      ('cpu_dribble_frequency',          'cpu_teammate', 50),
      ('cpu_skill_move_frequency',       'cpu_teammate', 65)
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

  raise notice 'Set «Jugabilidad realista de FC27» listo (%). % valores escritos.', target_set, written;
end;
$$;
