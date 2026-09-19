'use client';

import { useState } from 'react';

import { ScaleRail } from '@/components/slider-scale';

type Props = {
  /** `v_<id de definición>`: el formulario se envía con esto, sin espejos. */
  name: string;
  label: string;
  /** Para el lector de pantalla: «Velocidad — Usuario». */
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  /** Lo que trae el juego de fábrica, o null si no lo sabemos. */
  reference: number | null;
  /** El rotulador del ámbito, en hexadecimal (lo necesita el CSS del pulgar). */
  ink: string;
  onChange: (value: number) => void;
};

/**
 * Un valor se pone arrastrando, no tecleando.
 *
 * Es un `input type="range"` nativo vestido de tiza (ver `.slider-input` en
 * globals.css). Nativo porque así vienen gratis el teclado y el lector de
 * pantalla, y sobre todo el gesto del móvil: tocar en cualquier punto del
 * carril lleva la muesca ahí, sin tener que acertarle.
 *
 * Arrastrar es para acercarse; para clavar un 48 están los botones de −1 y +1
 * y la casilla del número. En un móvil de 375 px, cien valores caben en unos
 * trescientos píxeles: tres píxeles por unidad. Sin el paso fino esto sería
 * bonito e inservible.
 */
export function SliderControl({
  name,
  label,
  ariaLabel,
  value,
  min,
  max,
  reference,
  ink,
  onChange,
}: Props) {
  // Mientras se teclea en la casilla, manda lo tecleado: si el valor volviera
  // a rebotar desde el estado en cada pulsación, borrar para escribir otro
  // número sería imposible.
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (raw: number) => Math.min(max, Math.max(min, Math.round(raw)));

  const commit = (next: number) => {
    setDraft(null);
    onChange(clamp(next));
  };

  return (
    /*
     * Dos retículas. En el móvil, el nombre del ámbito y el número arriba y el
     * carril entero debajo, para que el arrastre tenga todo el ancho de la
     * pantalla. A partir de `sm`, todo en una línea.
     */
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1 sm:grid-cols-[4.75rem_auto_1fr_auto_auto] sm:gap-x-3">
      <span className="eyebrow col-span-2 row-start-1 sm:col-span-1 sm:col-start-1">{label}</span>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft ?? String(value)}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          const parsed = Number(raw);
          if (raw !== '' && Number.isFinite(parsed)) onChange(clamp(parsed));
        }}
        onBlur={() => setDraft(null)}
        aria-label={`${ariaLabel} (valor)`}
        className="value-pill col-start-3 row-start-1 w-14 border border-chalk-line bg-board-deep px-1 py-1 text-center text-sm sm:col-start-5"
        style={{ color: ink }}
      />

      <button
        type="button"
        className="step-btn col-start-1 row-start-2 sm:col-start-2 sm:row-start-1"
        onClick={() => commit(value - 1)}
        disabled={value <= min}
        aria-label={`${ariaLabel}: uno menos`}
      >
        −
      </button>

      <div className="relative col-start-2 row-start-2 h-11 sm:col-start-3 sm:row-start-1">
        <ScaleRail min={min} max={max} reference={reference} />
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => commit(Number(event.target.value))}
          aria-label={ariaLabel}
          className="slider-input absolute inset-0"
          style={{ '--thumb': ink } as React.CSSProperties}
        />
      </div>

      <button
        type="button"
        className="step-btn col-start-3 row-start-2 sm:col-start-4 sm:row-start-1"
        onClick={() => commit(value + 1)}
        disabled={value >= max}
        aria-label={`${ariaLabel}: uno más`}
      >
        +
      </button>
    </div>
  );
}
