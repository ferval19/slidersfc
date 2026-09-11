-- URLs amigables para los sets: /u/<username>/<slug>
--
-- El slug lo pone un trigger, no la aplicación, porque los sets se crean por
-- dos vías (la app y los ficheros de seed) y así ninguna puede olvidarse.
--
-- Se genera una sola vez, al insertar. Cambiar el título NO cambia el slug: un
-- enlace compartido tiene que seguir funcionando.

-- Sin extensiones: `unaccent` no está garantizado y translate() basta para
-- castellano.
create or replace function public.slugify(value text)
returns text
language sql
immutable
as $$
  select btrim(
    regexp_replace(
      regexp_replace(
        translate(
          lower(coalesce(value, '')),
          'áàäâãéèëêíìïîóòöôõúùüûñçÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ',
          'aaaaaeeeeiiiiooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC'
        ),
        '[^a-z0-9]+', '-', 'g'
      ),
      '-{2,}', '-', 'g'
    ),
    '-'
  );
$$;

alter table public.slider_sets add column if not exists slug text;

create or replace function public.assign_slider_set_slug()
returns trigger
language plpgsql
as $$
declare
  base      text;
  candidate text;
  suffix    int := 0;
begin
  if new.slug is not null and new.slug <> '' then
    return new;
  end if;

  base := left(public.slugify(new.title), 60);

  if base = '' then
    base := 'set';
  end if;

  candidate := base;

  while exists (
    select 1
    from public.slider_sets s
    where s.owner_id = new.owner_id
      and s.slug = candidate
      and s.id <> new.id
  ) loop
    suffix    := suffix + 1;
    candidate := base || '-' || suffix::text;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

create trigger slider_sets_assign_slug
  before insert or update on public.slider_sets
  for each row execute function public.assign_slider_set_slug();

-- Rellena los que ya existen: el update dispara el trigger.
update public.slider_sets set slug = null where slug is null or slug = '';

alter table public.slider_sets alter column slug set not null;

alter table public.slider_sets
  add constraint slider_sets_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

create unique index slider_sets_owner_slug_idx
  on public.slider_sets (owner_id, slug);
