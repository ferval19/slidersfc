-- ---------------------------------------------------------------------------
-- El nombre inglés de cada slider.
--
-- Va en una columna y no en una tabla aparte porque no es una traducción
-- suelta: es **el otro nombre del mismo slider**, el que trae el juego cuando
-- lo pones en inglés. Una fila de `slider_definitions` es un slider en un
-- juego y un ámbito; su nombre en los dos idiomas pertenece ahí.
--
-- Se admite nulo a propósito. Un slider sin nombre inglés enseña el castellano
-- —que es feo pero se entiende— en vez de un hueco. Y así esta migración se
-- puede aplicar antes de que el catálogo traiga los nombres, sin romper nada.
--
-- Ojo con lo que NO es esto: `name` está leído del menú del juego; `name_en`
-- está derivado de los slugs. La diferencia está explicada en
-- supabase/seed/catalog.mjs y no debería perderse de vista.
-- ---------------------------------------------------------------------------

alter table public.slider_definitions
  add column if not exists name_en text;

comment on column public.slider_definitions.name_en is
  'Nombre del slider en el menú del juego en inglés. Nulo = se enseña el castellano.';
