import type { SeccionVideos } from '../../lib/retos/tipos';

import { BotonCopiar } from './copiar';
import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

export function SeccionVideosCuerpo({ seccion }: { seccion: SeccionVideos }) {
  const { videos, cifras, claves } = seccion;

  return (
    <>
      <div className={styles.grid2}>
        {videos.map((video) => (
          <div key={video.url} className={`${styles.card} ${styles.vid}`}>
            <div className={styles.thumb}>
              <Icono nombre="play" />
            </div>
            <div>
              <span className={video.tono === 'rojo' ? `${styles.tag} ${styles.tagRed}` : styles.tag}>
                {video.etiqueta}
              </span>
              <h4 className={styles.vidTitulo}>
                <a href={video.url}>{video.titulo}</a>
              </h4>
              <ul>
                {video.puntos.map((punto) => (
                  <li key={punto}>
                    <Texto>{punto}</Texto>
                  </li>
                ))}
              </ul>
              {video.codigoTactica ? (
                <p className={styles.vidPie}>
                  <span className={styles.code}>
                    {video.codigoTactica} <BotonCopiar texto={video.codigoTactica} variante="codigo" />
                  </span>
                </p>
              ) : null}
              {video.nota ? (
                <p className={`${styles.src} ${styles.vidPie}`}>
                  <Texto>{video.nota}</Texto>
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {cifras ? (
        <>
          <h3 className={styles.tituloSub}>{cifras.titulo}</h3>
          <div className={styles.stats}>
            {cifras.items.map((cifra) => (
              <div key={cifra.valor} className={styles.stat}>
                <b>{cifra.valor}</b>
                <span>{cifra.texto}</span>
                <div className={styles.bar} aria-hidden="true">
                  {cifra.barras.map((ancho, i) => (
                    <i key={i} style={{ width: `${ancho}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {claves ? (
        <>
          <h3 className={styles.tituloSub}>{claves.titulo}</h3>
          <div className={styles.moves}>
            {claves.items.map((clave) => (
              <div key={clave.titulo} className={styles.move}>
                <b>{clave.titulo}</b>
                <p>
                  <Texto>{clave.texto}</Texto>
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
