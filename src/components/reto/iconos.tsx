import type { ReactNode } from 'react';

import type { Icono as NombreIcono } from '../../lib/retos/tipos';

import styles from './reto.module.css';

/** Los iconos del juego más el que sólo usa la plantilla (copiar). */
export type IconoId = NombreIcono | 'copiar';

/**
 * Los trazos de cada símbolo, en una cuadrícula de 24 × 24. Se dibujan una vez
 * en `<IconosSprite />` y el resto de la página los llama con `<use>`.
 */
const SIMBOLOS: Record<IconoId, ReactNode> = {
  pizarra: (
    <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16M3 12h4M17 12h4"/><circle cx="12" cy="12" r="2.5"/></>
  ),
  play: (
    <><path d="M8 5l11 7-11 7z"/></>
  ),
  calendario: (
    <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>
  ),
  adn: (
    <><path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12"/><path d="M8.5 7h7M8.5 17h7M10 12h4"/></>
  ),
  camiseta: (
    <><path d="M8 3l-5 3 2 5 3-1v11h8V10l3 1 2-5-5-3c-.5 2-2 3-4 3s-3.5-1-4-3z"/></>
  ),
  traspaso: (
    <><path d="M4 8h14l-4-4M20 16H6l4 4"/></>
  ),
  libro: (
    <><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5M8 7h7"/></>
  ),
  reglas: (
    <><path d="M9 4h10v16H5V8z"/><path d="M9 4v4H5M9 13l2 2 4-4"/></>
  ),
  enlace: (
    <><path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1"/><path d="M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/></>
  ),
  trofeo: (
    <><path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M12 14v4M8 21h8M9 18h6"/></>
  ),
  silbato: (
    <><circle cx="9" cy="14" r="5"/><path d="M12 10l8-4v4l-6 2M9 14h.01"/></>
  ),
  escudo: (
    <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></>
  ),
  rayo: (
    <><path d="M13 3L5 14h6l-1 7 8-11h-6z"/></>
  ),
  flechas: (
    <><path d="M5 12h14M15 8l4 4-4 4M9 8L5 12l4 4"/></>
  ),
  diana: (
    <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6"/></>
  ),
  cambio: (
    <><path d="M7 4v14l-3-3M17 20V6l3 3"/></>
  ),
  bandera: (
    <><path d="M5 21V4h11l-2 4 2 4H5"/></>
  ),
  ojo: (
    <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>
  ),
  reloj: (
    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>
  ),
  grupo: (
    <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 016 5"/></>
  ),
  pluma: (
    <><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/></>
  ),
  brote: (
    <><path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 14c0-4 3-6 7-6 0 4-3 6-7 6z"/></>
  ),
  moneda: (
    <><circle cx="12" cy="12" r="9"/><path d="M15 9a3 3 0 00-3-1.5c-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2A3.3 3.3 0 019 15M12 6v1.5M12 16.5V18"/></>
  ),
  alerta: (
    <><path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5h.01"/></>
  ),
  mando: (
    <><path d="M6 8h12a4 4 0 014 4v2a3 3 0 01-5.2 2L15 14H9l-1.8 2A3 3 0 012 14v-2a4 4 0 014-4z"/><path d="M7 11v3M5.5 12.5h3M16 12h.01M18 13.5h.01"/></>
  ),
  copiar: (
    <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></>
  ),
  charla: (
    <><path d="M4 5h16v11H9l-5 4z"/></>
  ),
};

const PREFIJO = 'reto-i-';

/** El sprite. Va una sola vez, al principio del reto. */
export function IconosSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {(Object.keys(SIMBOLOS) as IconoId[]).map((nombre) => (
          <symbol key={nombre} id={PREFIJO + nombre} viewBox="0 0 24 24">
            {SIMBOLOS[nombre]}
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

export function Icono({ nombre, className }: { nombre: IconoId; className?: string }) {
  return (
    <svg className={className ? `${styles.icon} ${className}` : styles.icon} aria-hidden="true">
      <use href={`#${PREFIJO}${nombre}`} />
    </svg>
  );
}
