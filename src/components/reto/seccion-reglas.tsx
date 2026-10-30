import type { SeccionReglas } from '../../lib/retos/tipos';

import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

export function SeccionReglasCuerpo({ seccion }: { seccion: SeccionReglas }) {
  return (
    <div className={styles.rules}>
      {seccion.items.map((regla) => (
        <div key={regla.titulo} className={styles.rule}>
          <div className={styles.ic}>
            <Icono nombre={regla.icono} />
          </div>
          <h4>{regla.titulo}</h4>
          <p>
            <Texto>{regla.texto}</Texto>
          </p>
        </div>
      ))}
    </div>
  );
}
