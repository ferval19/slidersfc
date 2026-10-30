import type { Objetivo, SeccionMercado } from '../../lib/retos/tipos';

import { Bandera, Media, textoPotencial } from './elementos';
import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

const TONO: Record<NonNullable<Objetivo['tono']>, string> = {
  rojo: styles.tagRed,
  verde: styles.tagGreen,
  ambar: styles.tagAmber,
};

export function SeccionMercadoCuerpo({ seccion }: { seccion: SeccionMercado }) {
  const { necesidades, objetivos, perfilOjeo } = seccion;

  return (
    <>
      {necesidades.length > 0 ? (
        <div className={styles.needs}>
          {necesidades.map((necesidad) => (
            <div key={necesidad} className={styles.need}>
              <Icono nombre="alerta" />
              {necesidad}
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.market}>
        {objetivos.map((objetivo) => (
          <article key={`${objetivo.nombre}-${objetivo.ventana}`} className={styles.mcard}>
            <div className={styles.mhead}>
              <Media media={objetivo.media} pos={objetivo.pos} />
              <div>
                <h4>{objetivo.nombre}</h4>
                <div className={styles.meta}>
                  {objetivo.club === null
                    ? 'Perfil por definir'
                    : objetivo.club + (objetivo.edad ? ` · ${objetivo.edad} años` : '')}
                </div>
                <div className={styles.pmeta}>
                  <Bandera pais={objetivo.pais} />
                  <span className={styles.pot}>
                    {objetivo.potencial !== null ? textoPotencial(objetivo.potencial, objetivo.media) : ''}
                  </span>
                </div>
              </div>
              <span className={objetivo.tono ? `${styles.tag} ${TONO[objetivo.tono]}` : styles.tag}>
                {objetivo.ventana}
              </span>
            </div>
            <div className={objetivo.precio === null ? `${styles.price} ${styles.none}` : styles.price}>
              {objetivo.precio ?? 'Precio sin publicar'}
            </div>
            <p>{objetivo.encaje}</p>
            <div className={styles.src}>
              Fuente: <a href={objetivo.fuente.url}>{objetivo.fuente.nombre}</a>
            </div>
          </article>
        ))}
      </div>

      {perfilOjeo ? (
        <div className={`${styles.card} ${styles.ojeo}`}>
          <Icono nombre="ojo" />
          <p>
            <b>{perfilOjeo.titulo}</b> <Texto>{perfilOjeo.texto}</Texto>
          </p>
        </div>
      ) : null}
    </>
  );
}
