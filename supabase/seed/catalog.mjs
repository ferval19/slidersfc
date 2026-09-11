// Catálogo de sliders — fuente única de verdad para el seed.
//
// Los nombres van en español porque son los que aparecen en el menú del juego
// para esta comunidad. A los de posicionamiento se les quita el prefijo
// «Posicionamiento:» del menú, porque la cabecera de la categoría ya lo dice. La lista de FC26 sale del documento de Full Manual FG
// («Sliders - Full Manual FG», v3.0), así que es la real, no una aproximación.
//
// Para cambiarla: edita este fichero, `npm run seed:build`, y vuelve a aplicar
// supabase/seed/01_catalog.sql. El SQL generado también borra los sliders que
// ya no estén aquí, así que renombrar un slug es seguro.
//
// applies_to:
//   FC27 y posteriores -> user, cpu_opponent, cpu_teammate
//   FC26 y anteriores  -> user, cpu
//
// userOnly: existe una sola vez, en el lado del jugador.
// cpuOnly:  existe una sola vez, en el lado de la CPU rival.

export const games = [
  { slug: 'fc27', name: 'EA SPORTS FC 27', release_year: 2026, scopes: ['user', 'cpu_opponent', 'cpu_teammate'] },
  { slug: 'fc26', name: 'EA SPORTS FC 26', release_year: 2025, scopes: ['user', 'cpu'] },
];

export const sliders = [
  // Velocidad
  { slug: 'sprint_speed',            name: 'Velocidad',                                   category: 'speed' },
  { slug: 'acceleration',            name: 'Aceleración',                                 category: 'speed' },

  // Tiro
  { slug: 'shot_error',              name: 'Fallo al tirar',                              category: 'shooting' },
  { slug: 'shot_speed',              name: 'Velocidad de tiro',                           category: 'shooting' },
  { slug: 'header_shot_error',       name: 'Fallo al rematar de cabeza',                  category: 'shooting' },

  // Pase
  { slug: 'pass_error',              name: 'Fallo al pasar',                              category: 'passing' },
  { slug: 'pass_speed',              name: 'Velocidad del pase',                          category: 'passing' },
  { slug: 'header_pass_error',       name: 'Fallo al pasar de cabeza',                    category: 'passing' },

  // Control de balón
  { slug: 'power_bar',               name: 'Barra de potencia',                           category: 'ball_control', userOnly: true },
  { slug: 'first_touch_error',       name: 'Error de control al primer toque',            category: 'ball_control' },
  { slug: 'interception_error',      name: 'Fallo al interceptar',                        category: 'ball_control' },
  { slug: 'deflection_error',        name: 'Fallo al desviar el balón',                   category: 'ball_control' },

  // Defensa
  { slug: 'tackle_assistance',       name: 'Asistencia en entradas',                      category: 'defending' },

  // Portería
  { slug: 'goalkeeper_ability',      name: 'Habilidad del guardameta',                    category: 'goalkeeping' },

  // Posición del equipo
  { slug: 'marking',                 name: 'Marcaje',                    category: 'positioning' },
  { slug: 'run_frequency',           name: 'Frecuencia de desmarques',   category: 'positioning' },
  { slug: 'line_height',             name: 'Altura de la línea',         category: 'positioning' },
  { slug: 'line_length',             name: 'Distancia de la línea',      category: 'positioning' },
  { slug: 'line_width',              name: 'Ancho de la línea',          category: 'positioning' },
  { slug: 'defensive_positioning',   name: 'Posiciones defensivas',      category: 'positioning' },

  // Lesiones
  { slug: 'injury_frequency',        name: 'Frecuencia de lesiones',                      category: 'injuries' },
  { slug: 'injury_severity',         name: 'Gravedad de la lesión',                       category: 'injuries' },

  // Controles de la CPU — un solo valor, del lado de la CPU
  { slug: 'cpu_tackle_aggression',         name: 'Agresividad en las entradas',            category: 'cpu_controls', cpuOnly: true },
  { slug: 'cpu_buildup_speed',             name: 'Velocidad de creación',                  category: 'cpu_controls', cpuOnly: true },
  { slug: 'cpu_shot_frequency',            name: 'Frecuencia de tiros',                    category: 'cpu_controls', cpuOnly: true },
  { slug: 'cpu_first_touch_pass_frequency', name: 'Frecuencia de pases al primer toque',   category: 'cpu_controls', cpuOnly: true },
  { slug: 'cpu_cross_frequency',           name: 'Frecuencia de centros',                  category: 'cpu_controls', cpuOnly: true },
  { slug: 'cpu_dribble_frequency',         name: 'Frecuencia de regates',                  category: 'cpu_controls', cpuOnly: true },
  { slug: 'cpu_flair_frequency',           name: 'Frecuencia de filigranas',               category: 'cpu_controls', cpuOnly: true },
];

// Orden en el que se pintan las categorías en la UI y en el formulario.
export const categoryOrder = [
  'speed',
  'shooting',
  'passing',
  'ball_control',
  'defending',
  'goalkeeping',
  'positioning',
  'injuries',
  'cpu_controls',
];

export const DEFAULTS = { min: 0, max: 100, default: 50 };
