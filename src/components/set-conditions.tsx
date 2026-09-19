import { ChalkCamera, ChalkShield, ChalkStopwatch } from '@/components/chalk';
import { DIFFICULTIES } from '@/lib/set-conditions';
import type { SliderSet } from '@/lib/database.types';

type Props = {
  set: Pick<SliderSet, 'difficulty' | 'half_length' | 'camera' | 'camera_height' | 'camera_zoom'>;
};

/**
 * Las condiciones en las que se probó el set: dificultad, duración y cámara.
 *
 * Va arriba, junto al título, y no al final: es lo primero que necesita saber
 * quien llega — los mismos valores en otra dificultad no dan el mismo partido,
 * así que sin esto no sabes si el set te sirve.
 *
 * Si no hay ninguna, no se dibuja nada. Un hueco con «sin especificar» tres
 * veces es ruido.
 */
export function SetConditions({ set }: Props) {
  const difficulty = DIFFICULTIES.find((candidate) => candidate.value === set.difficulty);

  const camera = set.camera
    ? [
        set.camera,
        set.camera_height === null ? null : `altura ${set.camera_height}`,
        set.camera_zoom === null ? null : `zoom ${set.camera_zoom}`,
      ]
        .filter(Boolean)
        .join(' · ')
    : null;

  const items = [
    difficulty ? { icon: ChalkShield, label: 'Dificultad', value: difficulty.label } : null,
    set.half_length
      ? { icon: ChalkStopwatch, label: 'Tiempos', value: `${set.half_length} minutos` }
      : null,
    camera ? { icon: ChalkCamera, label: 'Cámara', value: camera } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <li key={item.label} className="flex items-center gap-2.5">
            <Icon className="size-7 shrink-0 text-chalk-dim" />
            <span className="flex flex-col">
              <span className="eyebrow">{item.label}</span>
              <span className="text-sm font-semibold">{item.value}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
