import type { SeccionPrincipios } from '../../lib/retos/tipos';

import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

export function SeccionPrincipiosCuerpo({ seccion }: { seccion: SeccionPrincipios }) {
  return (
    <div className={styles.dna}>
      {seccion.items.map((item) => (
        <div key={item.titulo} className={styles.card}>
          {item.icono ? <Icono nombre={item.icono} /> : null}
          <h4>{item.titulo}</h4>
          <p>
            <Texto>{item.texto}</Texto>
          </p>
        </div>
      ))}
    </div>
  );
}
