-- ---------------------------------------------------------------------------
-- Las condiciones en las que se probó un set.
--
-- Unos valores sin saber la dificultad, la duración de los tiempos y la cámara
-- no significan lo mismo para quien los copia. Hasta ahora eso se pedía en la
-- descripción, en texto libre, con lo que ni se rellenaba siempre ni se podía
-- enseñar de forma consistente.
--
-- `half_length` es texto y no un entero a propósito: mucha gente juega «7 u 8
-- minutos» y obligar a un solo número les haría mentir. El CHECK lo mantiene
-- con forma de número o de rango; la aplicación lo normaliza antes de guardar.
--
-- Todo es opcional. Un set sin estos datos sigue siendo un set.
-- ---------------------------------------------------------------------------

alter table public.slider_sets
  add column if not exists difficulty    text,
  add column if not exists half_length   text,
  add column if not exists camera        text,
  add column if not exists camera_height int,
  add column if not exists camera_zoom   int;

alter table public.slider_sets drop constraint if exists slider_sets_difficulty;
alter table public.slider_sets add constraint slider_sets_difficulty
  check (
    difficulty is null
    or difficulty in ('beginner', 'semi_pro', 'professional', 'world_class', 'legendary', 'ultimate')
  );

alter table public.slider_sets drop constraint if exists slider_sets_half_length;
alter table public.slider_sets add constraint slider_sets_half_length
  check (half_length is null or half_length ~ '^[0-9]{1,2}(-[0-9]{1,2})?$');

alter table public.slider_sets drop constraint if exists slider_sets_camera;
alter table public.slider_sets add constraint slider_sets_camera
  check (camera is null or char_length(btrim(camera)) between 1 and 40);

alter table public.slider_sets drop constraint if exists slider_sets_camera_settings;
alter table public.slider_sets add constraint slider_sets_camera_settings
  check (
    (camera_height is null or camera_height between 0 and 20)
    and (camera_zoom is null or camera_zoom between 0 and 20)
    -- Unos números de cámara sin saber cuál es no dicen nada.
    and (camera is not null or (camera_height is null and camera_zoom is null))
  );
