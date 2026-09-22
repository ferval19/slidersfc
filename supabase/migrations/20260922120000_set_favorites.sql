-- ---------------------------------------------------------------------------
-- Favoritos: guardarse el set de otro.
--
-- Hasta ahora la única forma de volver a un set que te ha gustado era el
-- historial del navegador o acordarte del nombre de quien lo publicó. Esto lo
-- arregla por el lado del que LEE, que es la mayoría de la gente que entra.
--
-- Son PÚBLICOS a propósito. Un favorito aquí no es un marcador privado: es
-- decir «éste me funciona», y esa señal es justo lo que le falta a un sitio
-- con pocos sets. Quien entra en un perfil ve qué juega esa persona y qué
-- respeta. Si algún día hace falta un guardado privado, será otra cosa con
-- otro nombre, no un interruptor encima de ésta.
--
-- No se puede guardar el set propio (`owns_set`): un perfil que se
-- autorrecomienda no dice nada, y la sección de favoritos existe para enseñar
-- el trabajo de otros.
--
-- NO entra en la copia de seguridad (`scripts/backup.mjs`). Es una decisión,
-- no un olvido: reconstruir un favorito pide resolver usuario y set por
-- nombre, como ya hace con los comentarios, y ahora mismo no compensa por un
-- dato que se vuelve a marcar en dos clics. Queda apuntado en la hoja de ruta.
-- ---------------------------------------------------------------------------

create table public.slider_set_favorites (
  user_id       uuid not null references auth.users (id) on delete cascade,
  slider_set_id uuid not null references public.slider_sets (id) on delete cascade,
  created_at    timestamptz not null default now(),
  -- La clave es el par: guardar dos veces el mismo set es guardarlo una vez.
  -- Y de paso resuelve sola «¿lo tengo guardado?», que es la consulta que se
  -- hace en cada set que alguien abre.
  primary key (user_id, slider_set_id)
);

-- Para contar cuánta gente lo ha guardado sin recorrer la tabla entera.
create index slider_set_favorites_set_idx
  on public.slider_set_favorites (slider_set_id);

-- Para la sección del perfil: lo último que guardó, primero.
create index slider_set_favorites_user_idx
  on public.slider_set_favorites (user_id, created_at desc);

alter table public.slider_set_favorites enable row level security;

-- Lectura pública: es el sentido de la función. Sólo se puede llegar al set
-- desde aquí si el set en sí se deja leer, porque esa consulta pasa por las
-- políticas de slider_sets.
create policy "slider_set_favorites_select"
  on public.slider_set_favorites for select
  using (true);

-- Guardar: sólo lo tuyo, sólo un set que puedes ver, y nunca el tuyo propio.
-- `can_read_set` importa más de lo que parece: sin él se podría marcar como
-- favorito el borrador de cualquiera probando ids, y la fila resultante sería
-- pública.
create policy "slider_set_favorites_insert_own"
  on public.slider_set_favorites for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and public.can_read_set(slider_set_id)
    and not public.owns_set(slider_set_id)
  );

-- Quitar: sólo los tuyos. No hay update; un favorito no tiene nada que
-- corregir, se pone o se quita.
create policy "slider_set_favorites_delete_own"
  on public.slider_set_favorites for delete
  to authenticated
  using (user_id = (select auth.uid()));
