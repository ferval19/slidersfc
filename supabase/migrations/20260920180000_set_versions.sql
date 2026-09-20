-- ---------------------------------------------------------------------------
-- Historial de versiones de un set.
--
-- `slider_sets.version` ya subía al cambiar valores de un set publicado, pero
-- sólo servía para marcar los comentarios viejos como «de la v1»: los valores
-- de antes no se guardaban en ninguna parte.
--
-- Se guarda el CAMBIO, no la foto. Lo que interesa de un set que evoluciona no
-- es cómo estaba, es qué tocó su autor y cuánto; y la foto completa de una
-- versión antigua se reconstruye desde los valores de hoy hacia atrás. Una
-- copia de los 129 valores por versión sería escribir mucho para responder
-- peor a la pregunta de verdad.
--
-- No hay políticas de UPDATE ni de DELETE a propósito: esto es un registro de
-- lo que pasó, no un texto más que mantener. Se borra solo con su set.
-- ---------------------------------------------------------------------------

create table public.slider_set_versions (
  slider_set_id uuid not null references public.slider_sets (id) on delete cascade,
  -- La versión que ESTA entrada estrena. La v1 no tiene entrada: no estrena
  -- nada, es el set tal como se publicó.
  version       int not null,
  -- «Qué has cambiado y por qué». Es la parte que da valor al historial.
  note          text,
  created_at    timestamptz not null default now(),
  primary key (slider_set_id, version),
  constraint slider_set_versions_version_positive check (version > 1),
  constraint slider_set_versions_note_length
    check (note is null or char_length(note) <= 500)
);

create table public.slider_set_changes (
  slider_set_id        uuid not null,
  version              int not null,
  slider_definition_id int not null references public.slider_definitions (id) on delete cascade,
  from_value           int not null,
  to_value             int not null,
  primary key (slider_set_id, version, slider_definition_id),
  foreign key (slider_set_id, version)
    references public.slider_set_versions (slider_set_id, version) on delete cascade,
  -- Una fila que dice que algo se quedó igual no es un cambio.
  constraint slider_set_changes_actually_changed check (from_value <> to_value)
);

create index slider_set_versions_set_idx
  on public.slider_set_versions (slider_set_id, version desc);

alter table public.slider_set_versions enable row level security;
alter table public.slider_set_changes  enable row level security;

-- Se lee si se puede leer el set: enseñar cómo has llegado a unos valores es
-- parte de lo que hace útil un set.
create policy "slider_set_versions_select"
  on public.slider_set_versions for select
  using (public.can_read_set(slider_set_id));

create policy "slider_set_versions_insert_own"
  on public.slider_set_versions for insert
  to authenticated
  with check (public.owns_set(slider_set_id));

create policy "slider_set_changes_select"
  on public.slider_set_changes for select
  using (public.can_read_set(slider_set_id));

create policy "slider_set_changes_insert_own"
  on public.slider_set_changes for insert
  to authenticated
  with check (public.owns_set(slider_set_id));
