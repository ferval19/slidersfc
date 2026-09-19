-- ---------------------------------------------------------------------------
-- El canal de YouTube en el perfil.
--
-- Guardamos la URL entera y no un identificador, porque un canal se puede
-- señalar de cuatro formas distintas (@handle, /channel/UC…, /c/… y /user/…)
-- y quedarnos sólo con el handle dejaría fuera a los canales antiguos.
--
-- El CHECK es la red de seguridad de lo que ya valida `src/lib/profile.ts`:
-- la aplicación normaliza a https://www.youtube.com/… antes de guardar.
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists youtube_url text;

alter table public.profiles
  drop constraint if exists profiles_youtube_url_format;

alter table public.profiles
  add constraint profiles_youtube_url_format
  check (
    youtube_url is null
    or (youtube_url like 'https://www.youtube.com/%' and char_length(youtube_url) <= 200)
  );
