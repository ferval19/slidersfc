/**
 * Los roles y enfoques de FC 27, del nombre inglés al castellano del juego.
 *
 * Los datos de un reto guardan el rol en inglés —«False 9 (Attack)»—, que es
 * como lo dan los vídeos y las guías de donde salen, y aquí se traduce al
 * pintarlo. Así el fichero del reto se puede contrastar con la fuente sin
 * pasar por la traducción, y si la traducción cambia, cambia en un sitio.
 *
 * Los nombres en castellano son los de FutMind para FC 27
 * (futmind.com/es/roles), que copia los del juego. De ahí el género: el
 * juego los da en femenino casi siempre («Falsa 9», «Carrilera», «Pivote
 * organizadora») y en masculino unos pocos («Extremo», «Interior»). No se
 * «corrige»: lo que importa es que coincida con lo que se lee en el menú.
 *
 * `null` = sin nombre en castellano contrastado. Son los cuatro roles que
 * FC 27 estrena y tres enfoques: ninguna fuente pública los da todavía en
 * castellano, y uno inventado no se encontraría en el menú. Se pintan en
 * inglés hasta que alguien los lea en el juego.
 *
 * Módulo puro, sin imports: lo carga tal cual `scripts/test-retos.mjs`.
 */

type Nombre = { es: string | null; corto?: string };

export const ROLES: Record<string, Nombre> = {
  Goalkeeper: { es: 'Guardameta' },
  'Sweeper Keeper': { es: 'Guardameta líbera' },
  'Ball-Playing Keeper': { es: null },
  Defender: { es: 'Defensa' },
  'Ball-Playing Defender': { es: 'Defensa con toque' },
  Stopper: { es: 'Marcadora' },
  'Wide Back': { es: null },
  Fullback: { es: 'Lateral' },
  Falseback: { es: 'Lateral invertida', corto: 'Lat. invertida' },
  Wingback: { es: 'Carrilera' },
  'Attacking Wingback': { es: 'Carrilera ofensiva', corto: 'Carrilera of.' },
  'Inverted Wingback': { es: null },
  Holding: { es: 'Contención' },
  'Deep-Lying Playmaker': { es: 'Pivote organizadora', corto: 'Pivote org.' },
  'Centre-Half': { es: 'Centrocampista' },
  'Wide Half': { es: null },
  'Box Crasher': { es: null },
  'Box-to-Box': { es: 'Todocampista' },
  Playmaker: { es: 'Organizadora' },
  'Half-Winger': { es: 'Interior' },
  'Shadow Striker': { es: 'Segunda punta' },
  'Classic 10': { es: null },
  Winger: { es: 'Extremo' },
  'Wide Midfielder': { es: 'Centrocampista abierta', corto: 'Centroc. abierta' },
  'Inside Forward': { es: 'Extremo interior' },
  'Wide Playmaker': { es: 'Organizadora abierta', corto: 'Org. abierta' },
  'Target Forward': { es: 'Punta de referencia', corto: 'Punta ref.' },
  'Advanced Forward': { es: 'Delantera móvil' },
  Poacher: { es: 'Cazagoles' },
  'False 9': { es: 'Falsa 9' },
  // No es un rol de FC 27: el nombre que da el vídeo de SesqueT (de FC 26),
  // ya en castellano. Se respeta porque la guía lo cita así.
  '«Mediocampista creador»': { es: 'Mediocampista creador', corto: 'Creador' },
};

export const ENFOQUES: Record<string, string | null> = {
  Balanced: 'Equilibrado',
  Defend: 'Defensivo',
  Attack: 'Ofensivo',
  'Build-Up': 'Creativo',
  Roaming: 'Movimiento libre',
  Wide: 'Abierto',
  Complete: 'Completo',
  Support: null,
  'Ball-Winning': null,
  Aggressive: null,
  Versatile: null,
};

export type RolTraducido = {
  /** El nombre para la tabla: en castellano si lo hay, si no el inglés. */
  nombre: string;
  /** Para la ficha del campo, donde no cabe un nombre largo. */
  corto: string;
  enfoque: string | null;
  /** Tal como viene en los datos, para quien juega en inglés. */
  original: string;
  /** `false` si alguna parte se ha quedado en inglés o no se ha reconocido. */
  completo: boolean;
};

/**
 * «False 9 (Attack)» → Falsa 9 · Ofensivo. Lo que no está en el catálogo
 * —un rol que el vídeo ya daba en castellano, como «Mediocampista
 * creador»— se devuelve tal cual, sin comillas angulares.
 */
export function traducirRol(rol: string): RolTraducido {
  const [, base = rol, foco] = rol.match(/^(.*?)\s*(?:\((.*)\))?$/) ?? [];
  // «Ball Winning» y «Ball-Winning» aparecen escritos de las dos formas.
  const claveFoco = foco?.replace('Ball Winning', 'Ball-Winning');
  const entrada = ROLES[base.trim()];
  const nombre = entrada?.es ?? base.replace(/[«»]/g, '').trim();
  const enfoque = claveFoco === undefined ? null : (ENFOQUES[claveFoco] ?? foco ?? null);

  return {
    nombre,
    corto: entrada?.es ? (entrada.corto ?? entrada.es) : nombre,
    enfoque,
    original: rol,
    completo: Boolean(entrada?.es) && (claveFoco === undefined || Boolean(ENFOQUES[claveFoco])),
  };
}
