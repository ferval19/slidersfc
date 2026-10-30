import type { Movimiento, SeccionContexto } from '../../lib/retos/tipos';

import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

const TIPO: Record<Movimiento['tipo'], { rotulo: string; clase: string }> = {
  llega: { rotulo: 'Llega', clase: styles.pillIn },
  cedido: { rotulo: 'Cedido', clase: styles.pillIn },
  sale: { rotulo: 'Sale', clase: styles.pillOut },
};

export function SeccionContextoCuerpo({ seccion }: { seccion: SeccionContexto }) {
  const { hitos, movimientos, notas } = seccion;

  return (
    <>
      <div className={styles.timelineMini}>
        {hitos.map((hito) => (
          <div key={hito.titulo} className={styles.tm}>
            <span className={styles.d}>{hito.fecha}</span>
            <b>{hito.titulo}</b>
            <p>
              <Texto>{hito.texto}</Texto>
            </p>
          </div>
        ))}
      </div>

      {movimientos || notas ? (
        <div className={`${styles.grid2} ${styles.contextoGrid}`}>
          {movimientos ? (
            <div>
              <h3>{movimientos.titulo}</h3>
              <div className={styles.tablewrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Jugador</th>
                      <th>Movimiento</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.filas.map((fila) => (
                      <tr key={fila.jugador}>
                        <td>
                          <b>{fila.jugador}</b>
                        </td>
                        <td className={TIPO[fila.tipo].clase}>{TIPO[fila.tipo].rotulo}</td>
                        <td>{fila.detalle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {notas ? (
            <div className={styles.notas}>
              {notas.map((nota) => (
                <div key={nota.titulo} className={styles.card}>
                  <h4>
                    {nota.icono ? <Icono nombre={nota.icono} /> : null}
                    {nota.titulo}
                  </h4>
                  <p>
                    <Texto>{nota.texto}</Texto>
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
