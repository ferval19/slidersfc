-- Set de inicio: «Full Manual FG v3.0» para FC26.
--
-- Origen: documento público de Full Manual FG («Sliders - Full Manual FG»,
-- versión 3.0 del 07/12/2025). El autor original de los valores es
-- @Shinogoblin en X, y el crédito va en la descripción del set.
--
-- Requisito: el usuario ferval19@gmail.com tiene que haberse registrado ya
-- (entrar una vez con el magic link). No creamos filas en auth.users a mano:
-- el dueño de las cuentas es Supabase Auth, no este script.
--
-- Todo va en un único bloque `do` a propósito: el editor SQL de Supabase
-- ejecuta cada sentencia en su propia transacción, así que una tabla temporal
-- no sobrevive de una sentencia a la siguiente. Un bloque `do` es atómico —
-- si algo falla, no queda nada a medias.
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

  select id into target_game from public.games where slug = 'fc26';

  if target_game is null then
    raise exception 'Falta el juego fc26. Aplica primero supabase/seed/01_catalog.sql.';
  end if;

  -- Perfil del autor
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

  -- El set. Se reutiliza si ya existe con el mismo título y dueño, para no
  -- duplicarlo al reejecutar.
  select id into target_set
  from public.slider_sets
  where owner_id = target_user
    and game_id = target_game
    and title = 'Full Manual FG v3.0';

  if target_set is null then
    insert into public.slider_sets (owner_id, game_id, title, description, is_published)
    values (
      target_user,
      target_game,
      'Full Manual FG v3.0',
      concat_ws(
        E'\n',
        'Sliders y configuración para jugar íntegramente con controles manuales y offline, en Modo Carrera o Partida Rápida.',
        '',
        'Todo el crédito de estos valores es de @Shinogoblin en X, que es el verdadero artífice de este set.',
        '',
        'CONFIGURACIÓN',
        '· Dificultad: Clase Mundial / Leyenda',
        '· Tiempo: 7-8 minutos',
        '· Cámara: EA Sports (altura 0, zoom 0) o Tradicional (altura 10, zoom 0)',
        '· Tipo de jugabilidad: Personalizada',
        '· Funciones de autenticidad: activado',
        '· Efecto del viento: bajo',
        '· Efectos del clima: desactivado',
        '',
        'Los controles de la CPU son una recomendación para probar jugando en Dinámico.',
        '',
        'Versión 3.0 — 07/12/2025'
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

  -- Los valores, escritos una sola vez. La misma consulta inserta lo que
  -- encaja con el catálogo y recoge lo que no, para poder abortar: mejor
  -- fallar que publicar un set al que le faltan valores en silencio.
  with incoming (slug, applies_to, value) as (
    values
      -- Velocidad
      ('sprint_speed'::text, 'user'::text, 33::int), ('sprint_speed', 'cpu', 32),
      ('acceleration', 'user', 46), ('acceleration', 'cpu', 45),
      -- Tiro
      ('shot_error',        'user', 80), ('shot_error',        'cpu', 80),
      ('shot_speed',        'user', 48), ('shot_speed',        'cpu', 48),
      ('header_shot_error', 'user', 32), ('header_shot_error', 'cpu', 32),
      -- Pase
      ('pass_error',        'user', 62), ('pass_error',        'cpu', 62),
      ('pass_speed',        'user', 30), ('pass_speed',        'cpu', 30),
      ('header_pass_error', 'user', 95), ('header_pass_error', 'cpu', 95),
      -- Control de balón
      ('power_bar',          'user', 48),
      ('first_touch_error',  'user', 92), ('first_touch_error',  'cpu', 92),
      ('interception_error', 'user', 95), ('interception_error', 'cpu', 95),
      ('deflection_error',   'user', 95), ('deflection_error',   'cpu', 95),
      -- Defensa
      ('tackle_assistance', 'user', 10), ('tackle_assistance', 'cpu', 10),
      -- Portería
      ('goalkeeper_ability', 'user', 48), ('goalkeeper_ability', 'cpu', 48),
      -- Posición del equipo
      ('marking',               'user', 50), ('marking',               'cpu', 50),
      ('run_frequency',         'user', 85), ('run_frequency',         'cpu', 80),
      ('line_height',           'user', 50), ('line_height',           'cpu', 55),
      ('line_length',           'user', 32), ('line_length',           'cpu', 32),
      ('line_width',            'user', 66), ('line_width',            'cpu', 75),
      ('defensive_positioning', 'user', 95), ('defensive_positioning', 'cpu', 95),
      -- Lesiones
      ('injury_frequency', 'user', 60), ('injury_frequency', 'cpu', 60),
      ('injury_severity',  'user', 25), ('injury_severity',  'cpu', 25),
      -- Controles de la CPU (recomendación para probar en Dinámico)
      ('cpu_tackle_aggression',          'cpu', 51),
      ('cpu_buildup_speed',              'cpu', 45),
      ('cpu_shot_frequency',             'cpu', 90),
      ('cpu_first_touch_pass_frequency', 'cpu', 20),
      ('cpu_cross_frequency',            'cpu', 46),
      ('cpu_dribble_frequency',          'cpu', 26),
      ('cpu_flair_frequency',            'cpu', 1)
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
      'Estos sliders no están en el catálogo de fc26: %. Vuelve a aplicar supabase/seed/01_catalog.sql.',
      missing;
  end if;

  raise notice 'Set «Full Manual FG v3.0» listo (%). % valores escritos.', target_set, written;
end;
$$;
