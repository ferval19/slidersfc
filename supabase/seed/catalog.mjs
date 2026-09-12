// Catálogo de sliders — fuente única de verdad para el seed.
//
// Cada juego tiene su lista: FC27 no es FC26 con más columnas, es otra lista.
// Para cambiarlo: edita este fichero, `npm run seed:build`, y vuelve a aplicar
// supabase/seed/01_catalog.sql. El SQL generado borra los sliders que ya no
// estén aquí, así que renombrar un slug es seguro.
//
// `sides` dice en qué lados existe cada slider:
//   both      usuario + CPU (por defecto)
//   user      sólo usuario (p. ej. la barra de potencia)
//   cpu       sólo CPU
//   cpu_both  CPU rival y CPU compañero, sin lado de usuario
//
// FC26: los lados son usuario / CPU.
// FC27: los de jugabilidad son usuario / CPU rival; el desdoble rival vs.
//       compañero es sólo para los de comportamiento de la CPU.

export const games = [
  {
    slug: 'fc27',
    name: 'EA SPORTS FC 27',
    release_year: 2026,
    scopes: { user: 'user', cpu: 'cpu_opponent', cpuTeammate: 'cpu_teammate' },
    // FC27 documenta 1-99.
    range: { min: 1, max: 99, default: 50 },
  },
  {
    slug: 'fc26',
    name: 'EA SPORTS FC 26',
    release_year: 2025,
    scopes: { user: 'user', cpu: 'cpu' },
    range: { min: 0, max: 100, default: 50 },
  },
];

// ---------------------------------------------------------------------------
// FC26 — lista real, del documento de Full Manual FG (v3.0, 07/12/2025).
// A los de posicionamiento se les quita el prefijo «Posicionamiento:» del
// menú, porque la cabecera de la categoría ya lo dice.
// ---------------------------------------------------------------------------

const fc26 = [
  { slug: 'sprint_speed',            name: 'Velocidad',                        category: 'speed' },
  { slug: 'acceleration',            name: 'Aceleración',                      category: 'speed' },

  { slug: 'shot_error',              name: 'Fallo al tirar',                   category: 'shooting' },
  { slug: 'shot_speed',              name: 'Velocidad de tiro',                category: 'shooting' },
  { slug: 'header_shot_error',       name: 'Fallo al rematar de cabeza',       category: 'shooting' },

  { slug: 'pass_error',              name: 'Fallo al pasar',                   category: 'passing' },
  { slug: 'pass_speed',              name: 'Velocidad del pase',               category: 'passing' },
  { slug: 'header_pass_error',       name: 'Fallo al pasar de cabeza',         category: 'passing' },

  { slug: 'power_bar',               name: 'Barra de potencia',                category: 'ball_control', sides: 'user' },
  { slug: 'first_touch_error',       name: 'Error de control al primer toque', category: 'ball_control' },
  { slug: 'interception_error',      name: 'Fallo al interceptar',             category: 'ball_control' },
  { slug: 'deflection_error',        name: 'Fallo al desviar el balón',        category: 'ball_control' },

  { slug: 'tackle_assistance',       name: 'Asistencia en entradas',           category: 'defending' },

  { slug: 'goalkeeper_ability',      name: 'Habilidad del guardameta',         category: 'goalkeeping' },

  { slug: 'marking',                 name: 'Marcaje',                          category: 'positioning' },
  { slug: 'run_frequency',           name: 'Frecuencia de desmarques',         category: 'positioning' },
  { slug: 'line_height',             name: 'Altura de la línea',               category: 'positioning' },
  { slug: 'line_length',             name: 'Distancia de la línea',            category: 'positioning' },
  { slug: 'line_width',              name: 'Ancho de la línea',                category: 'positioning' },
  { slug: 'defensive_positioning',   name: 'Posiciones defensivas',            category: 'positioning' },

  { slug: 'injury_frequency',        name: 'Frecuencia de lesiones',           category: 'injuries' },
  { slug: 'injury_severity',         name: 'Gravedad de la lesión',            category: 'injuries' },

  { slug: 'cpu_tackle_aggression',          name: 'Agresividad en las entradas',          category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_buildup_speed',              name: 'Velocidad de creación',                category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_shot_frequency',             name: 'Frecuencia de tiros',                  category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_first_touch_pass_frequency', name: 'Frecuencia de pases al primer toque',  category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_cross_frequency',            name: 'Frecuencia de centros',                category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_dribble_frequency',          name: 'Frecuencia de regates',                category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_flair_frequency',            name: 'Frecuencia de filigranas',             category: 'cpu_controls', sides: 'cpu' },
];

// ---------------------------------------------------------------------------
// FC27 — PRELIMINAR. Reconstruido antes del lanzamiento a partir de las Pitch
// Notes de EA (25 sliders de jugabilidad y 10 de CPU nuevos, y el desdoble
// CPU rival / CPU compañero) y del listado publicado por fifauteam.
//
// Las cuentas cuadran con lo que anuncia EA (+23 y +9 frente a FC26, contra
// +25 y +10 anunciados), así que la estructura es fiable, pero:
//
//   ⚠️ HAY QUE CONFIRMAR CON EL JUEGO DELANTE (acceso anticipado, 18/09/2026):
//      los nombres exactos del menú en español, si falta algún slider, y si
//      el rango es realmente 1-99.
//
// Los slugs son lo que no conviene cambiar después; los nombres se corrigen en
// este fichero y se regenera.
// ---------------------------------------------------------------------------

const fc27 = [
  { slug: 'sprint_speed',   name: 'Velocidad',    category: 'speed' },
  { slug: 'acceleration',   name: 'Aceleración',  category: 'speed' },

  { slug: 'shot_error',              name: 'Fallo al tirar',                   category: 'shooting' },
  { slug: 'shot_speed',              name: 'Velocidad de tiro',                category: 'shooting' },
  { slug: 'finesse_shot_error',      name: 'Fallo en tiro colocado',           category: 'shooting' },
  { slug: 'finesse_shot_speed',      name: 'Velocidad de tiro colocado',       category: 'shooting' },
  { slug: 'chip_shot_error',         name: 'Fallo en tiro por elevación',      category: 'shooting' },
  { slug: 'chip_shot_speed',         name: 'Velocidad de tiro por elevación',  category: 'shooting' },
  { slug: 'low_driven_shot_error',   name: 'Fallo en tiro raso',               category: 'shooting' },
  { slug: 'low_driven_shot_speed',   name: 'Velocidad de tiro raso',           category: 'shooting' },
  { slug: 'power_shot_error',        name: 'Fallo en disparo potente',         category: 'shooting' },
  { slug: 'power_shot_speed',        name: 'Velocidad de disparo potente',     category: 'shooting' },
  { slug: 'header_shot_error',       name: 'Fallo al rematar de cabeza',       category: 'shooting' },

  { slug: 'pass_error',                    name: 'Fallo al pasar',                          category: 'passing' },
  { slug: 'pass_speed',                    name: 'Velocidad del pase',                      category: 'passing' },
  { slug: 'header_pass_error',             name: 'Fallo al pasar de cabeza',                category: 'passing' },
  { slug: 'through_pass_error',            name: 'Fallo en pase al hueco',                  category: 'passing' },
  { slug: 'through_pass_speed',            name: 'Velocidad de pase al hueco',              category: 'passing' },
  { slug: 'lobbed_through_pass_error',     name: 'Fallo en pase bombeado al hueco',         category: 'passing' },
  { slug: 'lobbed_through_pass_speed',     name: 'Velocidad de pase bombeado al hueco',     category: 'passing' },
  { slug: 'lob_pass_error',                name: 'Fallo en pase en globo',                  category: 'passing' },
  { slug: 'lob_pass_speed',                name: 'Velocidad de pase en globo',              category: 'passing' },
  { slug: 'cross_error',                   name: 'Fallo al centrar',                        category: 'passing' },
  { slug: 'cross_height',                  name: 'Altura del centro',                       category: 'passing' },

  { slug: 'power_bar',                        name: 'Barra de potencia',                        category: 'ball_control', sides: 'user' },
  { slug: 'first_touch_error',                name: 'Error de control al primer toque',         category: 'ball_control' },
  { slug: 'interception_error',               name: 'Fallo al interceptar',                     category: 'ball_control' },
  { slug: 'deflection_error',                 name: 'Fallo al desviar el balón',                category: 'ball_control' },
  { slug: 'jog_dribbling_error',              name: 'Fallo al regatear al trote',               category: 'ball_control' },
  { slug: 'sprint_dribbling_error',           name: 'Fallo al regatear en sprint',              category: 'ball_control' },
  { slug: 'controlled_sprint_dribbling_error', name: 'Fallo al regatear en sprint controlado',  category: 'ball_control' },

  { slug: 'tackle_assistance',     name: 'Asistencia en entradas',        category: 'defending' },
  { slug: 'physicality_impact',    name: 'Impacto físico',                category: 'defending' },
  { slug: 'jockey_speed',          name: 'Velocidad de contención',       category: 'defending' },
  { slug: 'sprint_jockey_speed',   name: 'Velocidad de contención en sprint', category: 'defending' },

  { slug: 'goalkeeper_ability', name: 'Habilidad del guardameta',      category: 'goalkeeping' },
  { slug: 'gk_deflection_error', name: 'Fallo al despejar del portero', category: 'goalkeeping' },

  { slug: 'marking',               name: 'Marcaje',                  category: 'positioning' },
  { slug: 'run_frequency',         name: 'Frecuencia de desmarques', category: 'positioning' },
  { slug: 'line_height',           name: 'Altura de la línea',       category: 'positioning' },
  { slug: 'line_length',           name: 'Distancia de la línea',    category: 'positioning' },
  { slug: 'line_width',            name: 'Ancho de la línea',        category: 'positioning' },
  { slug: 'defensive_positioning', name: 'Posiciones defensivas',    category: 'positioning' },

  { slug: 'injury_frequency', name: 'Frecuencia de lesiones', category: 'injuries' },
  { slug: 'injury_severity',  name: 'Gravedad de la lesión',  category: 'injuries' },

  // Comportamiento de la CPU: aquí sí hay rival y compañero por separado.
  { slug: 'cpu_defending_aggression',       name: 'Agresividad defensiva',                 category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_stand_tackle_aggression',    name: 'Agresividad en entradas de pie',        category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_slide_tackle_aggression',    name: 'Agresividad en entradas en plancha',    category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_professional_frequency',     name: 'Frecuencia de faltas tácticas',         category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_buildup_speed',              name: 'Velocidad de creación',                 category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_shot_frequency',             name: 'Frecuencia de tiros',                   category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_chip_shot_frequency',        name: 'Frecuencia de tiros por elevación',     category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_low_driven_shot_frequency',  name: 'Frecuencia de tiros rasos',             category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_finesse_shot_frequency',     name: 'Frecuencia de tiros colocados',         category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_long_shot_frequency',        name: 'Frecuencia de tiros lejanos',           category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_power_shot_frequency',       name: 'Frecuencia de disparos potentes',       category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_first_touch_pass_frequency', name: 'Frecuencia de pases al primer toque',   category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_cross_frequency',            name: 'Frecuencia de centros',                 category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_early_cross_frequency',      name: 'Frecuencia de centros tempranos',       category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_dribble_frequency',          name: 'Frecuencia de regates',                 category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_skill_move_frequency',       name: 'Frecuencia de filigranas',              category: 'cpu_controls', sides: 'cpu_both' },
];

export const slidersByGame = { fc26, fc27 };

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
