import { SCOPE_INK } from '@/lib/constants';
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

      {/* Muescas de los valores */}
      {marks.map((mark) => (
        <span
          key={mark.scope}
          className="absolute top-1/2 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${position(mark.value)}%`,
            height: 19,
            backgroundColor: SCOPE_INK[mark.scope].hex,
          }}
        />
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
