import { SCOPE_INK, sortScopes } from '@/lib/constants';
import type { SliderScope } from '@/lib/database.types';

export type ScaleMark = { scope: SliderScope; value: number };

/** Los dos rotuladores de una comparación: A y B. */
export const COMPARE_INK = { a: '#ffd24a', b: '#7fe0c8' } as const;

function positionIn(min: number, max: number) {
  const span = max - min || 1;
  return (value: number) => Math.min(100, Math.max(0, ((value - min) / span) * 100));
}

/**
 * El carril con sus marcas cada 25 y, detrás de todo, lo que trae el juego de
 * fábrica. Lo comparten los tres sitios donde se dibuja una escala: la ficha
 * de un set, la comparación y el regulador que se arrastra al crear un set.
 * Cuando esto estaba copiado, era cuestión de tiempo que uno se desviara.
 *
 * Va siempre dentro de un contenedor `relative`.
 */
export function ScaleRail({
  min,
  max,
  reference,
}: {
  min: number;
  max: number;
  reference?: number | null;
}) {
  const position = positionIn(min, max);

  return (
    <>
      <div className="chalk-rule absolute inset-x-0 top-1/2 -translate-y-1/2" />

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

      {reference !== null && reference !== undefined ? (
        <span
          className="absolute top-1/2 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chalk"
          style={{ left: `${position(reference)}%`, height: 29, opacity: 0.45 }}
        />
      ) : null}
    </>
  );
}

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
  reference,
  className = '',
}: {
  min: number;
  max: number;
  marks: ScaleMark[];
  /**
   * Lo que trae el juego de fábrica en este slider. Se pinta como una marca
   * fina y apagada, más alta que las muescas, para que cuando el valor
   * coincida se vea asomar por arriba y por abajo: eso es «sin tocar».
   */
  reference?: number | null;
  className?: string;
}) {
  const position = positionIn(min, max);

  return (
    <div className={`relative h-7 ${className}`} aria-hidden>
      <ScaleRail min={min} max={max} reference={reference} />

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

/**
 * El regulador de una comparación: las dos muescas y, entre ellas, el hueco
 * dibujado.
 *
 * El color cambia de significado a propósito. En la ficha de un set dice el
 * ámbito (usuario / CPU); aquí dice **de quién es el valor**, porque es lo
 * único que se está preguntando. El ámbito se rotula fuera, a la izquierda de
 * cada carril, en vez de pelearse por el mismo canal.
 *
 * El segmento entre las dos es la pieza que hace el trabajo: se lee la
 * distancia antes que los números.
 */
export function DuoTrack({
  min,
  max,
  a,
  b,
  reference,
  className = '',
}: {
  min: number;
  max: number;
  a: number | null;
  b: number | null;
  reference?: number | null;
  className?: string;
}) {
  const position = positionIn(min, max);

  if (a === null && b === null) {
    return (
      <div className={`relative h-7 ${className}`} aria-hidden>
        <ScaleRail min={min} max={max} reference={reference} />
      </div>
    );
  }

  const left = a !== null && b !== null ? Math.min(position(a), position(b)) : null;
  const right = a !== null && b !== null ? Math.max(position(a), position(b)) : null;
  const same = a !== null && b !== null && a === b;

  return (
    <div className={`relative h-7 ${className}`} aria-hidden>
      <ScaleRail min={min} max={max} reference={reference} />

      {/* El hueco. Se pinta debajo de las muescas para que no les coma el
          borde cuando la diferencia es de uno o dos puntos. */}
      {left !== null && right !== null && !same ? (
        <span
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-chalk/35"
          style={{ left: `${left}%`, width: `${right - left}%` }}
        />
      ) : null}

      {/* Si coinciden, una sola muesca partida en dos: no hay nada que
          discutir en ese slider y se ve de un vistazo. */}
      {same ? (
        <span
          className="absolute top-1/2 flex w-[3px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-full"
          style={{ left: `${position(a)}%`, height: 19 }}
        >
          <span className="flex-1" style={{ backgroundColor: COMPARE_INK.a }} />
          <span className="flex-1" style={{ backgroundColor: COMPARE_INK.b }} />
        </span>
      ) : (
        <>
          {a !== null ? (
            <span
              className="absolute top-1/2 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${position(a)}%`, height: 19, backgroundColor: COMPARE_INK.a }}
            />
          ) : null}
          {b !== null ? (
            <span
              className="absolute top-1/2 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${position(b)}%`, height: 19, backgroundColor: COMPARE_INK.b }}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

/** Leyenda de rotuladores. Va una vez por tabla, no una vez por fila. */
export function ScaleLegend({
  scopes,
  labels,
  withReference = false,
}: {
  scopes: SliderScope[];
  labels: Record<SliderScope, string>;
  withReference?: boolean;
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

      {withReference ? (
        <li className="flex items-center gap-2">
          <span className="h-4 w-[2px] rounded-full bg-chalk opacity-45" />
          <span className="eyebrow">De fábrica</span>
        </li>
      ) : null}
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
