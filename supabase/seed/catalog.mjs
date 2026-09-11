// Catálogo de sliders — fuente única de verdad para el seed (Fase 2 del plan).
//
// ⚠️ REVISAR ANTES DE LANZAR: esta lista es el conjunto canónico de sliders de
// gameplay de EA SPORTS FC (estable desde FC24) con el desdoble
// user / cpu_opponent / cpu_teammate que introduce FC27. Si tu documento
// `fc27-catalogo-sliders.md` añade sliders nuevos (p. ej. "Finesse Shot Error"),
// añádelos aquí y vuelve a ejecutar `npm run seed:build`. Nada más hay que
// tocar: el SQL se regenera y es idempotente.
//
// applies_to:
//   FC27 y posteriores -> user, cpu_opponent, cpu_teammate
//   FC26 y anteriores  -> user, cpu

export const games = [
  { slug: 'fc27', name: 'EA SPORTS FC 27', release_year: 2026, scopes: ['user', 'cpu_opponent', 'cpu_teammate'] },
  { slug: 'fc26', name: 'EA SPORTS FC 26', release_year: 2025, scopes: ['user', 'cpu'] },
];

// userOnly: el slider existe una sola vez, en el lado del jugador.
export const sliders = [
  { slug: 'sprint_speed',              name: 'Sprint Speed',                      category: 'speed' },
  { slug: 'acceleration',              name: 'Acceleration',                      category: 'speed' },

  { slug: 'shot_error',                name: 'Shot Error',                        category: 'shooting' },
  { slug: 'shot_speed',                name: 'Shot Speed',                        category: 'shooting' },
  { slug: 'power_bar',                 name: 'Power Bar',                         category: 'shooting', userOnly: true },

  { slug: 'pass_error',                name: 'Pass Error',                        category: 'passing' },
  { slug: 'pass_speed',                name: 'Pass Speed',                        category: 'passing' },

  { slug: 'first_touch_control_error', name: 'First Touch Control Error',         category: 'ball_control' },

  { slug: 'goalkeeper_ability',        name: 'Goalkeeper Ability',                category: 'goalkeeping' },

  { slug: 'marking',                   name: 'Positioning: Marking',              category: 'positioning' },
  { slug: 'run_frequency',             name: 'Positioning: Run Frequency',        category: 'positioning' },
  { slug: 'line_height',               name: 'Positioning: Line Height',          category: 'positioning' },
  { slug: 'line_length',               name: 'Positioning: Line Length',          category: 'positioning' },
  { slug: 'line_width',                name: 'Positioning: Line Width',           category: 'positioning' },
  { slug: 'fullback_positioning',      name: 'Positioning: Fullback Positioning', category: 'positioning' },

  { slug: 'injury_frequency',          name: 'Injury Frequency',                  category: 'injuries' },
  { slug: 'injury_severity',           name: 'Injury Severity',                   category: 'injuries' },
];

// Orden en el que se pintan las categorías en la UI y en el formulario.
export const categoryOrder = [
  'speed',
  'shooting',
  'passing',
  'ball_control',
  'goalkeeping',
  'positioning',
  'injuries',
];

export const DEFAULTS = { min: 0, max: 100, default: 50 };
