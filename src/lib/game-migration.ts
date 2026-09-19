import type { SliderDefinition, SliderScope } from '@/lib/database.types';

/**
 * Llevar un set de un juego al siguiente.
 *
 * La mayoría de los sliders conservan su slug entre versiones, así que se
 * emparejan solos. Esto cubre los que EA renombró:
 *
 *   fc26 «Posiciones defensivas»     → fc27 «Posicionamiento de laterales»
 *   fc26 «Frecuencia de filigranas»  → fc27 «Frecuencia de filigranas»
 *
 * `cpu_tackle_aggression` de FC26 se queda fuera a propósito: FC27 lo parte en
 * entradas normales y agresivas, y elegir una de las dos sería inventar.
 *
 * Al añadir un juego, revisa esta tabla contra supabase/seed/catalog.mjs.
 */
const RENAMES: Record<string, string> = {
  defensive_positioning: 'fullback_positioning',
  cpu_flair_frequency: 'cpu_skill_move_frequency',
};

/**
 * FC26 tiene un solo lado de CPU; FC27 distingue rival y compañero. Lo que
 * venía de la CPU pasa al rival, que es el que manda en un partido.
 */
const SCOPE_MAP: Partial<Record<SliderScope, SliderScope>> = {
  cpu: 'cpu_opponent',
};

export type CopyPlan = {
  /** Valores que viajan: id de la definición destino → valor. */
  values: Map<number, number>;
  /** Sliders del set de origen que no existen en el destino. */
  dropped: string[];
  /** Sliders del destino que se quedan con lo que trae el juego. */
  untouched: number;
};

/**
 * Empareja los valores de un set con las definiciones de otro juego. No toca
 * la base de datos: devuelve el plan para que quien llame decida qué hacer.
 */
export function planCopy(
  source: { definition: SliderDefinition; value: number }[],
  target: SliderDefinition[],
): CopyPlan {
  const byKey = new Map(target.map((d) => [`${d.slug}|${d.applies_to}`, d]));

  const values = new Map<number, number>();
  const dropped: string[] = [];

  for (const { definition, value } of source) {
    const slug = RENAMES[definition.slug] ?? definition.slug;
    const scope = SCOPE_MAP[definition.applies_to] ?? definition.applies_to;

    const match = byKey.get(`${slug}|${scope}`);

    if (!match) {
      dropped.push(definition.name);
      continue;
    }

    // Respeta el rango del juego destino: FC27 no admite 0 ni 100.
    values.set(match.id, Math.min(match.max_value, Math.max(match.min_value, value)));
  }

  return { values, dropped, untouched: target.length - values.size };
}
