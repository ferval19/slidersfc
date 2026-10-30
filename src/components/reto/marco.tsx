import type { ReactNode } from 'react';

import type { Cabecera } from '../../lib/retos/tipos';

import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

/**
 * El envoltorio común de cada sección: la caja, la columna central y la
 * cabecera numerada. El número y el ancla los pone el orden (ver `reto.tsx`),
 * no el contenido; `alt` alterna el fondo blanco y el de papel.
 */
export function Marco({
  id,
  numero,
  alt,
  cabecera,
  children,
}: {
  id: string;
  numero: string;
  alt: boolean;
  cabecera: Cabecera;
  children: ReactNode;
}) {
  return (
    <section id={id} className={alt ? `${styles.seccion} ${styles.alt}` : styles.seccion}>
      <div className={styles.wrap}>
        <div className={styles.shead}>
          <span className={styles.snum}>{numero}</span>
          <h2>
            <Icono nombre={cabecera.icono} />
            {cabecera.titulo}
          </h2>
          {cabecera.entradilla ? (
            <p>
              <Texto>{cabecera.entradilla}</Texto>
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
