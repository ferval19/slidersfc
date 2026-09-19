-- ---------------------------------------------------------------------------
-- Almacén de avatares.
--
-- Va aparte de supabase/migrations/ porque no es esquema de la aplicación
-- sino configuración de Supabase Storage, y `npm run test:sql` (PGlite) no
-- tiene el esquema `storage` con el que probarlo. Se aplica una vez, pegándolo
-- en el editor SQL del panel. Es idempotente: se puede volver a ejecutar.
--
-- La foto se recorta y se reduce a 512 px en el navegador antes de subir, así
-- que 1 MB sobra de largo.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública: el avatar sale en la cabecera, en las fichas y en los
-- comentarios, también para quien no ha entrado.
drop policy if exists "avatars_select_public" on storage.objects;
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Escritura sólo dentro de la carpeta propia: avatars/<id de usuario>/…
-- Sin esto, cualquiera con sesión podría sobrescribir la foto de otro.
drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
