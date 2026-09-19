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
// FC27 — lista REAL, sacada de las capturas del menú del juego (acceso
// anticipado, 19/09/2026). Los nombres y el orden son los del menú.
//
// Estructura del menú:
//   Pestaña «Ajustes de tipo de partida» → cada slider con lado Usuario y CPU
//   Pestaña «Controles de la CPU»        → CPU rival y CPU de tu equipo
//
// Lo que NO está aquí, y por qué: el menú tiene cuatro sliders maestros
// («Todos los controles de error de tiro», «...de velocidad y altura»,
// y sus dos equivalentes de pase). No son valores, son atajos que cambian de
// golpe todos los de debajo — lo dice su propia descripción en el juego.
// Guardarlos en un set duplicaría información y daría pie a contradicciones.
//
// Rareza del juego: el mismo slider aparece como «Conducciones controladas en
// carrera» en el lado del usuario y «Conducciones en carrera controladas» en
// el de la CPU. Se usa la primera.
// ---------------------------------------------------------------------------

const fc27 = [
  // VELOCIDAD
  { slug: 'sprint_speed',  name: 'Velocidad',   category: 'speed' },
  { slug: 'acceleration',  name: 'Aceleración', category: 'speed' },

  // TIRO
  { slug: 'shot_error',                name: 'Error en tiros normales',              category: 'shooting' },
  { slug: 'shot_speed',                name: 'Velocidad de tiros normales',          category: 'shooting' },
  { slug: 'finesse_shot_error',        name: 'Error en tiros de calidad',            category: 'shooting' },
  { slug: 'finesse_shot_speed',        name: 'Velocidad de tiros de calidad',        category: 'shooting' },
  { slug: 'chip_shot_error',           name: 'Error en vaselina',                    category: 'shooting' },
  { slug: 'chip_shot_height',          name: 'Altura de vaselina',                   category: 'shooting' },
  { slug: 'low_driven_shot_error',     name: 'Error en tiros rasos potentes',        category: 'shooting' },
  { slug: 'low_driven_shot_speed',     name: 'Velocidad de tiros rasos potentes',    category: 'shooting' },
  { slug: 'power_shot_error',          name: 'Error en zapatazo',                    category: 'shooting' },
  { slug: 'power_shot_speed',          name: 'Velocidad de zapatazo',                category: 'shooting' },
  { slug: 'header_shot_error',         name: 'Fallo al rematar de cabeza',           category: 'shooting' },

  // PASE
  { slug: 'pass_error',                    name: 'Error en pases rasos normales',         category: 'passing' },
  { slug: 'pass_speed',                    name: 'Velocidad de pases rasos normales',     category: 'passing' },
  { slug: 'header_pass_error',             name: 'Fallo al pasar con la cabeza',          category: 'passing' },
  { slug: 'through_pass_error',            name: 'Error en pases rasos al hueco',         category: 'passing' },
  { slug: 'through_pass_speed',            name: 'Velocidad de pases rasos al hueco',     category: 'passing' },
  { slug: 'lobbed_through_pass_error',     name: 'Error en pases altos al hueco',         category: 'passing' },
  { slug: 'lobbed_through_pass_height',    name: 'Altura de pases altos al hueco',        category: 'passing' },
  { slug: 'lob_pass_error',                name: 'Error en pases altos normales',         category: 'passing' },
  { slug: 'lob_pass_height',               name: 'Altura de pases altos normales',        category: 'passing' },
  { slug: 'cross_error',                   name: 'Error en centros',                      category: 'passing' },
  { slug: 'cross_height',                  name: 'Altura de centros',                     category: 'passing' },

  // LESIONES
  { slug: 'injury_frequency', name: 'Frecuencia de lesiones', category: 'injuries' },
  { slug: 'injury_severity',  name: 'Gravedad de la lesión',  category: 'injuries' },

  // PORTERÍA
  { slug: 'goalkeeper_ability',  name: 'Habilidad de guardameta', category: 'goalkeeping' },
  { slug: 'gk_deflection_error', name: 'Error al desviar de POR', category: 'goalkeeping' },

  // POSICIÓN DEL EQUIPO
  { slug: 'marking',               name: 'Marcaje',                      category: 'positioning' },
  { slug: 'run_frequency',         name: 'Frecuencia de desmarques',     category: 'positioning' },
  { slug: 'line_height',           name: 'Altura de la línea',           category: 'positioning' },
  { slug: 'line_length',           name: 'Distancia de la línea',        category: 'positioning' },
  { slug: 'line_width',            name: 'Ancho de la línea',            category: 'positioning' },
  { slug: 'fullback_positioning',  name: 'Posicionamiento de laterales', category: 'positioning' },

  // CONTROL DEL BALÓN
  { slug: 'power_bar',                 name: 'Barra de potencia',                   category: 'ball_control', sides: 'user' },
  { slug: 'first_touch_error',         name: 'Error de control al primer toque',    category: 'ball_control' },
  { slug: 'interception_error',        name: 'Fallo al interceptar',                category: 'ball_control' },
  { slug: 'deflection_error',          name: 'Error al desviar el balón',           category: 'ball_control' },
  { slug: 'jog_dribbling',             name: 'Conducción al trote',                 category: 'ball_control' },
  { slug: 'sprint_dribbling',          name: 'Conducciones en carrera',             category: 'ball_control' },
  { slug: 'controlled_sprint_dribbling', name: 'Conducciones controladas en carrera', category: 'ball_control' },

  // DEFENSA
  { slug: 'tackle_assistance',   name: 'Asistencia en entradas',        category: 'defending' },
  { slug: 'physicality_impact',  name: 'Impacto del físico',            category: 'defending' },
  { slug: 'jockey_speed',        name: 'Velocidad de brega normal',     category: 'defending' },
  { slug: 'sprint_jockey_speed', name: 'Velocidad de brega corriendo',  category: 'defending' },

  // CONTROLES DE LA CPU — pestaña aparte, con CPU rival y CPU de tu equipo
  { slug: 'cpu_defending_aggression',       name: 'Agresividad en defensa',                category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_stand_tackle_frequency',     name: 'Frecuencia de entradas normales',       category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_slide_tackle_frequency',     name: 'Frecuencia de entradas agresivas',      category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_professional_frequency',     name: 'Frecuencia de faltas tácticas',         category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_buildup_speed',              name: 'Velocidad de creación',                 category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_shot_frequency',             name: 'Frecuencia de tiros normales',          category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_chip_shot_frequency',        name: 'Frecuencia de vaselinas',               category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_low_driven_shot_frequency',  name: 'Frecuencia de tiros rasos potentes',    category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_finesse_shot_frequency',     name: 'Frecuencia de tiros de calidad',        category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_long_shot_frequency',        name: 'Frecuencia de tiros lejanos',           category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_power_shot_frequency',       name: 'Frecuencia de zapatazos',               category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_first_touch_pass_frequency', name: 'Frecuencia de pases al primer toque',   category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_cross_frequency',            name: 'Frecuencia de centros normales',        category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_early_cross_frequency',      name: 'Frecuencia de centros anticipados',     category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_dribble_frequency',          name: 'Frecuencia de regates',                 category: 'cpu_controls', sides: 'cpu_both' },
  { slug: 'cpu_skill_move_frequency',       name: 'Frecuencia de filigranas',              category: 'cpu_controls', sides: 'cpu_both' },
];

export const slidersByGame = { fc26, fc27 };

// Orden EXACTO del menú del juego. No es estético: la gente consulta un set
// con el móvil en la mano mientras va metiendo los valores en la consola, así
// que cualquier desvío les obliga a buscar.
//
// Fuente: el documento de Full Manual FG (que se escribió recorriendo el menú)
// y el listado de fifauteam para FC27. Las dos coinciden.
//
// De aquí sale el `sort_order` de cada slider, y la aplicación ordena por ese
// campo en lugar de repetir esta lista: si estuviera en dos sitios, acabarían
// desincronizados.
export const categoryOrder = [
  'speed',
  'shooting',
  'passing',
  'injuries',
  'goalkeeping',
  'positioning',
  'ball_control',
  'defending',
  'cpu_controls',
];
