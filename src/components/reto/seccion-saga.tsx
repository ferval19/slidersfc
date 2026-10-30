import type { SeccionSaga } from '../../lib/retos/tipos';

import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

export function SeccionSagaCuerpo({ seccion }: { seccion: SeccionSaga }) {
  const { prologo, temporadas, escenas } = seccion;

  return (
    <>
      {prologo ? (
        <div className={styles.prologue}>
          {prologo.map((entrada) => (
            <div key={entrada.titulo} className={styles.card}>
              <span className={styles.d}>{entrada.fecha}</span>
              <h4>
                {entrada.icono ? <Icono nombre={entrada.icono} /> : null}
                {entrada.titulo}
              </h4>
              <p>
                <Texto>{entrada.texto}</Texto>
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.seasons}>
        {temporadas.map((temporada) => (
          <article
            key={temporada.marca}
            className={temporada.final ? `${styles.season} ${styles.final}` : styles.season}
            data-n={temporada.marca}
          >
            <span className={styles.yr}>{temporada.rotulo}</span>
            <h3>{temporada.titulo}</h3>
            <span className={styles.goal}>
              <Icono nombre="trofeo" />
              {temporada.objetivo}
            </span>
            <div className={styles.acts}>
              {temporada.actos.map((acto) => (
                <div key={acto.titulo} className={styles.act}>
                  <b>{acto.titulo}</b>
                  <p>
                    <Texto>{acto.texto}</Texto>
                  </p>
                </div>
              ))}
            </div>
            {temporada.bifurcacion ? (
              <div className={styles.fork}>
                <div className={styles.yes}>
                  <b>{temporada.bifurcacion.si.titulo}</b>
                  <Texto>{temporada.bifurcacion.si.texto}</Texto>
                </div>
                <div className={styles.no}>
                  <b>{temporada.bifurcacion.no.titulo}</b>
                  <Texto>{temporada.bifurcacion.no.texto}</Texto>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {escenas ? (
        <>
          <h3 className={`${styles.tituloSub} ${styles.tituloEscenas}`}>{escenas.titulo}</h3>
          <div className={styles.ideas}>
            {escenas.items.map((escena) => (
              <div key={escena.texto} className={styles.idea}>
                <Icono nombre={escena.icono} />
                <Texto>{escena.texto}</Texto>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
