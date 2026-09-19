-- ---------------------------------------------------------------------------
-- Historial de nombres de usuario.
--
-- El nombre de usuario está en la URL de todo lo que alguien comparte
-- (/u/<usuario>/<set>). Sin esto, cambiarlo rompe en silencio cada enlace que
-- ya circula por ahí, que es justo lo que hace que nadie se atreva a
-- cambiarlo. Con esto, el nombre viejo sigue llevando al sitio correcto.
--
-- Nadie escribe aquí desde la aplicación: lo lleva el trigger de abajo.
-- ---------------------------------------------------------------------------

create table public.username_history (
  username    text primary key,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  released_at timestamptz not null default now()
);

create index username_history_profile_id_idx on public.username_history (profile_id);

alter table public.username_history enable row level security;

-- Lectura pública: /u/<nombre viejo> la consulta sin sesión para redirigir.
create policy "username_history_select_public"
  on public.username_history for select
  using (true);

-- A propósito no hay políticas de escritura: sólo escribe el trigger, que es
-- security definer.

create or replace function public.record_username_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.username is distinct from old.username then
    -- El nombre que se acaba de coger deja de ser alias de nadie. Va primero:
    -- si alguien libera un nombre y otro lo toma, manda quien lo tiene ahora.
    delete from public.username_history where username = new.username;

    insert into public.username_history (username, profile_id)
    values (old.username, new.id)
    on conflict (username) do update
      set profile_id = excluded.profile_id, released_at = now();
  end if;

  return new;
end;
$$;

create trigger profiles_record_username_change
  after update of username on public.profiles
  for each row execute function public.record_username_change();
