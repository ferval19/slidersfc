-- SlidersFC — creación automática de perfil al registrarse (Fase 1)
-- Deriva el username del handle de X si el login fue por OAuth, o del email.
-- Desambigua añadiendo un sufijo numérico si ya existe.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw       text;
  base      text;
  candidate text;
  suffix    int := 0;
begin
  raw := coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'preferred_username',
    split_part(coalesce(new.email, ''), '@', 1),
    ''
  );

  base := regexp_replace(lower(raw), '[^a-z0-9_]', '', 'g');

  if char_length(base) < 3 then
    base := 'player';
  end if;

  base      := left(base, 20);
  candidate := base;

  while exists (select 1 from public.profiles p where p.username = candidate) loop
    suffix    := suffix + 1;
    candidate := base || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name, avatar_url, twitter_handle)
  values (
    new.id,
    candidate,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      candidate
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'user_name'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
