// Catálogo de sliders — fuente única de verdad para el seed.
//
// Cada juego tiene su lista: FC27 no es FC26 con más columnas, es otra lista.
// Para cambiarlo: edita este fichero, `npm run seed:build`, y vuelve a aplicar
// supabase/seed/01_catalog.sql. El SQL generado borra los sliders que ya no
// estén aquí, así que renombrar un slug es seguro.
//
// `default` es lo que trae el juego de fábrica en ese slider, y es contra lo
// que la ficha de un set dibuja la muesca gris: sirve para ver de un vistazo
// qué ha tocado cada quien. `defaults` es la versión por ámbito, para los de
// comportamiento de la CPU, que difieren entre rival y compañero.
// En FC26 no los tenemos, así que se quedan en el neutro del menú.
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
    // FC27 deja elegir el comportamiento de la CPU (táctico / dinámico /
    // personalizado). FC26 no: allí los sliders de CPU van siempre.
    hasCpuBehaviour: true },
  {
    slug: 'fc26',
    name: 'EA SPORTS FC 26',
    release_year: 2025,
    scopes: { user: 'user', cpu: 'cpu' },
    range: { min: 0, max: 100, default: 50 } },
];

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// `nameEn` — DE DÓNDE SALE, QUE NO ES LO MISMO QUE `name`
//
// `name` está LEÍDO del menú del juego. `nameEn` está DERIVADO: el slug ya era
// el nombre inglés en minúsculas —quien montó este catálogo lo sacó de ahí—,
// así que se ha des-slugificado y contrastado con el castellano. No se ha
// mirado el juego en inglés.
//
// Para la mayoría da igual: `sprint_speed` es «Sprint Speed» en todos los FIFA
// desde hace quince años. Donde SÍ importa es en lo que FC27 estrena y no
// tiene precedente —los cuatro «(general)», los tipos de tiro y de pase, la
// conducción y la brega—. Ésos están marcados en docs/plan-ingles.md como
// pendientes de una mirada al menú en inglés.
//
// Regla que no cambia: el día que se mire el juego, manda el juego.
// ---------------------------------------------------------------------------

// FC26 — lista real, del documento de Full Manual FG (v3.0, 07/12/2025).
// A los de posicionamiento se les quita el prefijo «Posicionamiento:» del
// menú, porque la cabecera de la categoría ya lo dice.
// ---------------------------------------------------------------------------

const fc26 = [
  { slug: 'sprint_speed',            name: 'Velocidad', nameEn: 'Sprint Speed',                        category: 'speed' },
  { slug: 'acceleration',            name: 'Aceleración', nameEn: 'Acceleration',                      category: 'speed' },

  { slug: 'shot_error',              name: 'Fallo al tirar', nameEn: 'Shot Error',                   category: 'shooting' },
  { slug: 'shot_speed',              name: 'Velocidad de tiro', nameEn: 'Shot Speed',                category: 'shooting' },
  { slug: 'header_shot_error',       name: 'Fallo al rematar de cabeza', nameEn: 'Header Shot Error',       category: 'shooting' },

  { slug: 'pass_error',              name: 'Fallo al pasar', nameEn: 'Pass Error',                   category: 'passing' },
  { slug: 'pass_speed',              name: 'Velocidad del pase', nameEn: 'Pass Speed',               category: 'passing' },
  { slug: 'header_pass_error',       name: 'Fallo al pasar de cabeza', nameEn: 'Header Pass Error',         category: 'passing' },

  { slug: 'power_bar',               name: 'Barra de potencia', nameEn: 'Power Bar',                category: 'ball_control', sides: 'user' },
  { slug: 'first_touch_error',       name: 'Error de control al primer toque', nameEn: 'First Touch Control Error', category: 'ball_control' },
  { slug: 'interception_error',      name: 'Fallo al interceptar', nameEn: 'Interception Error',             category: 'ball_control' },
  { slug: 'deflection_error',        name: 'Fallo al desviar el balón', nameEn: 'Deflection Error',        category: 'ball_control' },

  { slug: 'tackle_assistance',       name: 'Asistencia en entradas', nameEn: 'Tackle Assistance',           category: 'defending' },

  { slug: 'goalkeeper_ability',      name: 'Habilidad del guardameta', nameEn: 'Goalkeeper Ability',         category: 'goalkeeping' },

  { slug: 'marking',                 name: 'Marcaje', nameEn: 'Marking',                          category: 'positioning' },
  { slug: 'run_frequency',           name: 'Frecuencia de desmarques', nameEn: 'Run Frequency',         category: 'positioning' },
  { slug: 'line_height',             name: 'Altura de la línea', nameEn: 'Line Height',               category: 'positioning' },
  { slug: 'line_length',             name: 'Distancia de la línea', nameEn: 'Line Length',            category: 'positioning' },
  { slug: 'line_width',              name: 'Ancho de la línea', nameEn: 'Line Width',                category: 'positioning' },
  { slug: 'defensive_positioning',   name: 'Posiciones defensivas', nameEn: 'Defensive Positioning',            category: 'positioning' },

  { slug: 'injury_frequency',        name: 'Frecuencia de lesiones', nameEn: 'Injury Frequency',           category: 'injuries' },
  { slug: 'injury_severity',         name: 'Gravedad de la lesión', nameEn: 'Injury Severity',            category: 'injuries' },

  { slug: 'cpu_tackle_aggression',          name: 'Agresividad en las entradas', nameEn: 'Tackle Aggression',          category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_buildup_speed',              name: 'Velocidad de creación', nameEn: 'Build-Up Speed',                category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_shot_frequency',             name: 'Frecuencia de tiros', nameEn: 'Shot Frequency',                  category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_first_touch_pass_frequency', name: 'Frecuencia de pases al primer toque', nameEn: 'First Touch Pass Frequency',  category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_cross_frequency',            name: 'Frecuencia de centros', nameEn: 'Cross Frequency',                category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_dribble_frequency',          name: 'Frecuencia de regates', nameEn: 'Dribble Frequency',                category: 'cpu_controls', sides: 'cpu' },
  { slug: 'cpu_flair_frequency',            name: 'Frecuencia de filigranas', nameEn: 'Flair Frequency',             category: 'cpu_controls', sides: 'cpu' },
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
  { slug: 'sprint_speed',  name: 'Velocidad', nameEn: 'Sprint Speed',   category: 'speed', default: 35 },
  { slug: 'acceleration',  name: 'Aceleración', nameEn: 'Acceleration', category: 'speed', default: 48 },

  // TIRO
  // Los cuatro maestros. Escalan el grupo entero: el juego pide dejarlos en 50
  // y tocar sólo los de cada tipo de tiro o de pase. Son los mismos que en
  // FC26 eran los únicos que había, antes de que EA los desdoblara por tipo.
  //
  // OJO: los nombres en español están reconstruidos a partir de la tarjeta de
  // @WilsdorfAndreas y de cómo se llamaban en FC26; no se han leído del menú.
  // Si en el juego se llaman de otra forma, se corrigen aquí y se regenera.
  { slug: 'master_shot_error',         name: 'Error de tiro (general)', nameEn: 'Shot Error (Master)',              category: 'shooting', default: 50 },
  { slug: 'master_shot_speed',         name: 'Velocidad y altura de tiro (general)', nameEn: 'Shot Speed & Height (Master)', category: 'shooting', default: 50 },

  { slug: 'shot_error',                name: 'Error en tiros normales', nameEn: 'Normal Shot Error',              category: 'shooting', default: 52 },
  { slug: 'shot_speed',                name: 'Velocidad de tiros normales', nameEn: 'Normal Shot Speed',          category: 'shooting', default: 48 },
  { slug: 'finesse_shot_error',        name: 'Error en tiros de calidad', nameEn: 'Finesse Shot Error',            category: 'shooting', default: 55 },
  { slug: 'finesse_shot_speed',        name: 'Velocidad de tiros de calidad', nameEn: 'Finesse Shot Speed',        category: 'shooting', default: 45 },
  { slug: 'chip_shot_error',           name: 'Error en vaselina', nameEn: 'Chip Shot Error',                    category: 'shooting', default: 60 },
  { slug: 'chip_shot_height',          name: 'Altura de vaselina', nameEn: 'Chip Shot Height',                   category: 'shooting', default: 48 },
  { slug: 'low_driven_shot_error',     name: 'Error en tiros rasos potentes', nameEn: 'Low Driven Shot Error',        category: 'shooting', default: 60 },
  { slug: 'low_driven_shot_speed',     name: 'Velocidad de tiros rasos potentes', nameEn: 'Low Driven Shot Speed',    category: 'shooting', default: 48 },
  { slug: 'power_shot_error',          name: 'Error en zapatazo', nameEn: 'Power Shot Error',                    category: 'shooting', default: 55 },
  { slug: 'power_shot_speed',          name: 'Velocidad de zapatazo', nameEn: 'Power Shot Speed',                category: 'shooting', default: 48 },
  { slug: 'header_shot_error',         name: 'Fallo al rematar de cabeza', nameEn: 'Header Shot Error',           category: 'shooting', default: 40 },

  // PASE
  { slug: 'master_pass_error',             name: 'Error de pase (general)', nameEn: 'Pass Error (Master)',               category: 'passing', default: 50 },
  { slug: 'master_pass_speed',             name: 'Velocidad y altura de pase (general)', nameEn: 'Pass Speed & Height (Master)',  category: 'passing', default: 50 },

  { slug: 'pass_error',                    name: 'Error en pases rasos normales', nameEn: 'Normal Ground Pass Error',         category: 'passing', default: 55 },
  { slug: 'pass_speed',                    name: 'Velocidad de pases rasos normales', nameEn: 'Normal Ground Pass Speed',     category: 'passing', default: 45 },
  { slug: 'header_pass_error',             name: 'Fallo al pasar con la cabeza', nameEn: 'Header Pass Error',          category: 'passing', default: 60 },
  { slug: 'through_pass_error',            name: 'Error en pases rasos al hueco', nameEn: 'Ground Through Pass Error',         category: 'passing', default: 55 },
  { slug: 'through_pass_speed',            name: 'Velocidad de pases rasos al hueco', nameEn: 'Ground Through Pass Speed',     category: 'passing', default: 38 },
  { slug: 'lobbed_through_pass_error',     name: 'Error en pases altos al hueco', nameEn: 'Lobbed Through Pass Error',         category: 'passing', default: 55 },
  { slug: 'lobbed_through_pass_height',    name: 'Altura de pases altos al hueco', nameEn: 'Lobbed Through Pass Height',        category: 'passing', default: 35 },
  { slug: 'lob_pass_error',                name: 'Error en pases altos normales', nameEn: 'Normal Lob Pass Error',         category: 'passing', default: 55 },
  { slug: 'lob_pass_height',               name: 'Altura de pases altos normales', nameEn: 'Normal Lob Pass Height',        category: 'passing', default: 35 },
  { slug: 'cross_error',                   name: 'Error en centros', nameEn: 'Cross Error',                      category: 'passing', default: 60 },
  { slug: 'cross_height',                  name: 'Altura de centros', nameEn: 'Cross Height',                     category: 'passing', default: 55 },

  // LESIONES
  { slug: 'injury_frequency', name: 'Frecuencia de lesiones', nameEn: 'Injury Frequency', category: 'injuries', default: 75 },
  { slug: 'injury_severity',  name: 'Gravedad de la lesión', nameEn: 'Injury Severity',  category: 'injuries', default: 30 },

  // PORTERÍA
  { slug: 'goalkeeper_ability',  name: 'Habilidad de guardameta', nameEn: 'Goalkeeper Ability', category: 'goalkeeping', default: 50 },
  { slug: 'gk_deflection_error', name: 'Error al desviar de POR', nameEn: 'GK Deflection Error', category: 'goalkeeping', default: 99 },

  // POSICIÓN DEL EQUIPO
  { slug: 'marking',               name: 'Marcaje', nameEn: 'Marking',                      category: 'positioning', default: 65 },
  { slug: 'run_frequency',         name: 'Frecuencia de desmarques', nameEn: 'Run Frequency',     category: 'positioning', default: 45 },
  { slug: 'line_height',           name: 'Altura de la línea', nameEn: 'Line Height',           category: 'positioning', default: 65 },
  { slug: 'line_length',           name: 'Distancia de la línea', nameEn: 'Line Length',        category: 'positioning', default: 35 },
  { slug: 'line_width',            name: 'Ancho de la línea', nameEn: 'Line Width',            category: 'positioning', default: 50 },
  { slug: 'fullback_positioning',  name: 'Posicionamiento de laterales', nameEn: 'Fullback Positioning', category: 'positioning', default: 80 },

  // CONTROL DEL BALÓN
  { slug: 'power_bar',                 name: 'Barra de potencia', nameEn: 'Power Bar',                   category: 'ball_control', sides: 'user', default: 50 },
  { slug: 'first_touch_error',         name: 'Error de control al primer toque', nameEn: 'First Touch Control Error',    category: 'ball_control', default: 85 },
  { slug: 'interception_error',        name: 'Fallo al interceptar', nameEn: 'Interception Error',                category: 'ball_control', default: 90 },
  { slug: 'deflection_error',          name: 'Error al desviar el balón', nameEn: 'Deflection Error',           category: 'ball_control', default: 99 },
  { slug: 'jog_dribbling',             name: 'Conducción al trote', nameEn: 'Jog Dribbling',                 category: 'ball_control', default: 50 },
  { slug: 'sprint_dribbling',          name: 'Conducciones en carrera', nameEn: 'Sprint Dribbling',             category: 'ball_control', default: 50 },
  { slug: 'controlled_sprint_dribbling', name: 'Conducciones controladas en carrera', nameEn: 'Controlled Sprint Dribbling', category: 'ball_control', default: 50 },

  // DEFENSA
  { slug: 'tackle_assistance',   name: 'Asistencia en entradas', nameEn: 'Tackle Assistance',        category: 'defending', default: 40 },
  { slug: 'physicality_impact',  name: 'Impacto del físico', nameEn: 'Physicality Impact',            category: 'defending', default: 99 },
  { slug: 'jockey_speed',        name: 'Velocidad de brega normal', nameEn: 'Normal Jockey Speed',     category: 'defending', default: 50 },
  { slug: 'sprint_jockey_speed', name: 'Velocidad de brega corriendo', nameEn: 'Sprint Jockey Speed',  category: 'defending', default: 50 },

  // CONTROLES DE LA CPU — pestaña aparte, con CPU rival y CPU de tu equipo
  { slug: 'cpu_defending_aggression',       name: 'Agresividad en defensa', nameEn: 'Defending Aggression',                category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 62, cpu_teammate: 68 } },
  { slug: 'cpu_stand_tackle_frequency',     name: 'Frecuencia de entradas normales', nameEn: 'Standing Tackle Frequency',       category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 75, cpu_teammate: 75 } },
  { slug: 'cpu_slide_tackle_frequency',     name: 'Frecuencia de entradas agresivas', nameEn: 'Slide Tackle Frequency',      category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 55, cpu_teammate: 57 } },
  { slug: 'cpu_professional_frequency',     name: 'Frecuencia de faltas tácticas', nameEn: 'Professional Foul Frequency',         category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 47, cpu_teammate: 55 } },
  { slug: 'cpu_buildup_speed',              name: 'Velocidad de creación', nameEn: 'Build-Up Speed',                 category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 98, cpu_teammate: 89 } },
  { slug: 'cpu_shot_frequency',             name: 'Frecuencia de tiros normales', nameEn: 'Normal Shot Frequency',          category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 53, cpu_teammate: 39 } },
  { slug: 'cpu_chip_shot_frequency',        name: 'Frecuencia de vaselinas', nameEn: 'Chip Shot Frequency',               category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 59, cpu_teammate: 53 } },
  { slug: 'cpu_low_driven_shot_frequency',  name: 'Frecuencia de tiros rasos potentes', nameEn: 'Low Driven Shot Frequency',    category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 56, cpu_teammate: 46 } },
  { slug: 'cpu_finesse_shot_frequency',     name: 'Frecuencia de tiros de calidad', nameEn: 'Finesse Shot Frequency',        category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 53, cpu_teammate: 38 } },
  { slug: 'cpu_long_shot_frequency',        name: 'Frecuencia de tiros lejanos', nameEn: 'Long Shot Frequency',           category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 54, cpu_teammate: 40 } },
  { slug: 'cpu_power_shot_frequency',       name: 'Frecuencia de zapatazos', nameEn: 'Power Shot Frequency',               category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 56, cpu_teammate: 46 } },
  { slug: 'cpu_first_touch_pass_frequency', name: 'Frecuencia de pases al primer toque', nameEn: 'First Touch Pass Frequency',   category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 50, cpu_teammate: 60 } },
  { slug: 'cpu_cross_frequency',            name: 'Frecuencia de centros normales', nameEn: 'Normal Cross Frequency',        category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 50, cpu_teammate: 50 } },
  { slug: 'cpu_early_cross_frequency',      name: 'Frecuencia de centros anticipados', nameEn: 'Early Cross Frequency',     category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 50, cpu_teammate: 50 } },
  { slug: 'cpu_dribble_frequency',          name: 'Frecuencia de regates', nameEn: 'Dribble Frequency',                 category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 50, cpu_teammate: 50 } },
  { slug: 'cpu_skill_move_frequency',       name: 'Frecuencia de filigranas', nameEn: 'Skill Move Frequency',              category: 'cpu_controls', sides: 'cpu_both', defaults: { cpu_opponent: 50, cpu_teammate: 65 } },
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
