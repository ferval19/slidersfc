import { SCOPE_INK, sortScopes } from '@/lib/constants';
import type { SliderScope } from '@/lib/database.types';

export type ScaleMark = { scope: SliderScope; value: number };

/**
 * El regulador: un valor no se lee como un número en una caja, sino como una
 * posición en una escala de 0 a 100. Las muescas de los distintos ámbitos
 * comparten carril a propósito — lo que interesa de un set es justo cuánto se
 * separa la CPU del usuario.
 *
 * Es sólo visualización: los controles (comentar, editar) son los números.
 */
export function ScaleTrack({
  min,
  max,
  marks,
  className = '',
}: {
  min: number;
  max: number;
  marks: ScaleMark[];
  className?: string;
}) {
  const position = (value: number) => {
    const span = max - min || 1;
    return Math.min(100, Math.max(0, ((value - min) / span) * 100));
  };

  return (
    <div className={`relative h-7 ${className}`} aria-hidden>
      {/* Carril */}
      <div className="chalk-rule absolute inset-x-0 top-1/2 -translate-y-1/2" />

      {/* Marcas cada 25 */}
      {[0, 25, 50, 75, 100].map((tick) => (
        <span
          key={tick}
          className="absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-chalk"
          style={{
            left: `${tick}%`,
            height: tick === 0 || tick === 100 ? 15 : 8,
            opacity: tick === 0 || tick === 100 ? 0.42 : 0.18,
          }}
        />
      ))}

      {/* Muescas. Los ámbitos que coinciden en el mismo valor comparten
          muesca y se reparten su altura, en vez de taparse entre ellos —
          en un set equilibrado la mayoría de valores coinciden. */}
      {groupByValue(marks).map(([value, scopes]) => (
        <span
          key={value}
          className="absolute top-1/2 flex w-[3px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-full"
          style={{ left: `${position(value)}%`, height: 19 }}
        >
          {scopes.map((scope) => (
            <span
              key={scope}
              className="flex-1"
              style={{ backgroundColor: SCOPE_INK[scope].hex }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

/** Leyenda de rotuladores. Va una vez por tabla, no una vez por fila. */
export function ScaleLegend({
  scopes,
  labels,
}: {
  scopes: SliderScope[];
  labels: Record<SliderScope, string>;
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {scopes.map((scope) => (
        <li key={scope} className="flex items-center gap-2">
          <span
            className="h-3.5 w-[3px] rounded-full"
            style={{ backgroundColor: SCOPE_INK[scope].hex }}
          />
          <span className="eyebrow">{labels[scope]}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Agrupa las muescas por valor, en orden de ámbito, para que cuando varios
 * coincidan se pinte una sola muesca repartida entre sus colores.
 */
function groupByValue(marks: ScaleMark[]): [number, SliderScope[]][] {
  const byValue = new Map<number, SliderScope[]>();

  for (const mark of marks) {
    const scopes = byValue.get(mark.value);
    if (scopes) {
      scopes.push(mark.scope);
    } else {
      byValue.set(mark.value, [mark.scope]);
    }
  }

  return [...byValue.entries()].map(([value, scopes]) => [value, sortScopes(scopes)]);
}
