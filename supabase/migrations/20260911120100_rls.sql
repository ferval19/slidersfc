-- SlidersFC — Row Level Security
-- Sección 4 del plan: los permisos viven aquí, no en Next.js.
-- auth.uid() se envuelve en (select auth.uid()) para que Postgres lo evalúe
-- una sola vez por consulta en lugar de una vez por fila.

alter table public.profiles            enable row level security;
alter table public.games               enable row level security;
alter table public.slider_definitions  enable row level security;
alter table public.slider_sets         enable row level security;
alter table public.slider_set_values   enable row level security;
alter table public.slider_comments     enable row level security;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- ¿Puede el usuario actual LEER este set? (publicado, o es suyo)
create or replace function public.can_read_set(target_set_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.slider_sets s
    where s.id = target_set_id
      and (s.is_published or s.owner_id = (select auth.uid()))
  );
$$;

-- ¿Es el usuario actual el DUEÑO de este set?
create or replace function public.owns_set(target_set_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.slider_sets s
    where s.id = target_set_id
      and s.owner_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles: lectura pública, escritura sólo del propio usuario
-- ---------------------------------------------------------------------------
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- El insert lo hace el trigger handle_new_user (security definer). Se permite
-- también al propio usuario por si hay que recrear su perfil.
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Catálogo: sólo lectura para todo el mundo. Se escribe con el service role
-- (ficheros de seed), nunca desde la app.
-- ---------------------------------------------------------------------------
create policy "games_select_public"
  on public.games for select
  using (true);

create policy "slider_definitions_select_public"
  on public.slider_definitions for select
  using (true);

-- ---------------------------------------------------------------------------
-- slider_sets
-- ---------------------------------------------------------------------------
create policy "slider_sets_select_published_or_own"
  on public.slider_sets for select
  using (is_published or owner_id = (select auth.uid()));

create policy "slider_sets_insert_own"
  on public.slider_sets for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "slider_sets_update_own"
  on public.slider_sets for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "slider_sets_delete_own"
  on public.slider_sets for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- slider_set_values: hereda el permiso del set
-- ---------------------------------------------------------------------------
create policy "slider_set_values_select_visible"
  on public.slider_set_values for select
  using (public.can_read_set(slider_set_id));

create policy "slider_set_values_insert_own"
  on public.slider_set_values for insert
  to authenticated
  with check (public.owns_set(slider_set_id));

create policy "slider_set_values_update_own"
  on public.slider_set_values for update
  to authenticated
  using (public.owns_set(slider_set_id))
  with check (public.owns_set(slider_set_id));

create policy "slider_set_values_delete_own"
  on public.slider_set_values for delete
  to authenticated
  using (public.owns_set(slider_set_id));

-- ---------------------------------------------------------------------------
-- slider_comments
-- Cualquier usuario autenticado comenta en sets visibles; edita y borra
-- sólo los suyos.
-- ---------------------------------------------------------------------------
create policy "slider_comments_select_visible"
  on public.slider_comments for select
  using (public.can_read_set(slider_set_id));

create policy "slider_comments_insert_authenticated"
  on public.slider_comments for insert
  to authenticated
  with check (
    author_id = (select auth.uid())
    and public.can_read_set(slider_set_id)
  );

create policy "slider_comments_update_own"
  on public.slider_comments for update
  to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy "slider_comments_delete_own"
  on public.slider_comments for delete
  to authenticated
  using (author_id = (select auth.uid()));
