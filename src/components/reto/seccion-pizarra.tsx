import type { Jugador, SeccionPizarra } from '../../lib/retos/tipos';

import { Icono } from './iconos';
import { Pizarra } from './pizarra';
import styles from './reto.module.css';
import { Texto } from './texto';

/**
 * `jugadores` es la plantilla del reto: la pizarra necesita sus nombres para
 * las fichas, porque los `once` sólo llevan el `id`.
 */
export function SeccionPizarraCuerpo({
  seccion,
  jugadores,
}: {
  seccion: SeccionPizarra;
  jugadores: Jugador[];
}) {
  const { planes, cambios } = seccion;

  return (
    <>
      <Pizarra
        planes={planes}
        jugadores={jugadores.map(({ id, nombre, corto, pos }) => ({ id, nombre, corto, pos }))}
      />

      {cambios ? (
        <div className={styles.subs}>
          <h3>{cambios.titulo}</h3>
          <ul>
            {cambios.items.map((cambio) => (
              <li key={cambio.titulo}>
                {cambio.icono ? <Icono nombre={cambio.icono} /> : null}
                <div>
                  <b>{cambio.titulo}</b>
                  <Texto>{cambio.texto}</Texto>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
