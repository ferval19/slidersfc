'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type PickerOption = {
  /** `usuario/slug`, que es lo que va en la ruta. */
  value: string;
  title: string;
  owner: string;
  gameSlug: string;
  gameName: string;
  isDraft: boolean;
};

/**
 * Elegir los dos sets a comparar.
 *
 * Al elegir el primero, el segundo se queda sólo con los de su mismo juego.
 * Comparar un set de FC26 con uno de FC27 no tiene sentido —son catálogos
 * distintos, no dos versiones de la misma lista—, y es mejor que la opción no
 * exista a explicar después por qué no sale nada.
 */
export function ComparePicker({
  options,
  initialA = '',
}: {
  options: PickerOption[];
  initialA?: string;
}) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState('');

  const byValue = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  );

  const game = a ? byValue.get(a)?.gameSlug : undefined;

  const optionsB = useMemo(
    () => options.filter((option) => option.value !== a && (!game || option.gameSlug === game)),
    [options, a, game],
  );

  const ready = a !== '' && b !== '' && byValue.has(a) && byValue.has(b);

  return (
    <div className="panel flex flex-col gap-5 p-5 sm:p-6">
      <Field
        label="El primero"
        value={a}
        options={options}
        onChange={(next) => {
          setA(next);
          // Si el nuevo juego no es el del segundo, el segundo deja de valer.
          const nextGame = byValue.get(next)?.gameSlug;
          if (b && byValue.get(b)?.gameSlug !== nextGame) setB('');
        }}
      />

      <Field
        label="El segundo"
        value={b}
        options={optionsB}
        onChange={setB}
        hint={
          a && optionsB.length === 0
            ? `Todavía no hay otro set de ${byValue.get(a)?.gameName} con el que compararlo.`
            : game
              ? `Sólo sets de ${byValue.get(a)?.gameName}: los sliders de un juego no son los de otro.`
              : undefined
        }
      />

      {ready ? (
        <Link href={`/comparar/${a}/${b}`} className="btn btn-primary self-start">
          Comparar
        </Link>
      ) : (
        <button type="button" className="btn btn-primary self-start" disabled>
          Comparar
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      >
        <option value="">Elige un set…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.title} — @{option.owner}
            {option.isDraft ? ' (borrador)' : ''} · {option.gameName}
          </option>
        ))}
      </select>
      {hint ? <span className="text-xs text-chalk-dim">{hint}</span> : null}
    </label>
  );
}
