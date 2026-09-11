-- Quita `mode` de los sets.
--
-- Los sliders sólo existen en los modos offline (carrera, partida rápida,
-- torneo): online no tiene sliders. Con eso, el campo no distinguía nada útil
-- entre un set y otro, así que sobra. Si algún día hace falta separar carrera
-- de partida rápida, se añade entonces con el significado que toque.

alter table public.slider_sets drop constraint if exists slider_sets_mode;
alter table public.slider_sets drop column if exists mode;
