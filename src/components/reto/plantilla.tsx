'use client';

import { useState } from 'react';

import type { Jugador, Linea } from '../../lib/retos/tipos';

import { Bandera, Media, textoPotencial } from './elementos';
import { Icono } from './iconos';
import styles from './reto.module.css';

type Filtro = 'todos' | Linea;
type Orden = 'linea' | 'media' | 'potencial';

const FILTROS: { clave: Filtro; rotulo: string }[] = [
  { clave: 'todos', rotulo: 'Todos' },
  { clave: 'POR', rotulo: 'Porteros' },
  { clave: 'DEF', rotulo: 'Defensas' },
  { clave: 'MED', rotulo: 'Medios' },
  { clave: 'DEL', rotulo: 'Ataque' },
];

const ORDENES: { clave: Orden; rotulo: string }[] = [
  { clave: 'linea', rotulo: 'Por línea' },
  { clave: 'media', rotulo: 'Por media' },
  { clave: 'potencial', rotulo: 'Por potencial' },
];

const ORDEN_LINEA: Record<Linea, number> = { POR: 0, DEF: 1, MED: 2, DEL: 3 };

/**
 * Filtro por línea, orden y la rejilla de fichas. Es de cliente sólo por eso:
 * la lista llega entera desde el servidor y aquí se filtra y se ordena.
 * `Array.sort` es estable, así que «por línea» respeta el orden del reto
 * dentro de cada línea.
 */
export function Plantilla({ jugadores }: { jugadores: Jugador[] }) {
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [orden, setOrden] = useState<Orden>('linea');

  const visibles = jugadores
    .filter((jugador) => filtro === 'todos' || jugador.linea === filtro)
    .sort((a, b) => {
      if (orden === 'media') return b.media - a.media || b.potencial - a.potencial;
      if (orden === 'potencial') return b.potencial - a.potencial || b.media - a.media;
      return ORDEN_LINEA[a.linea] - ORDEN_LINEA[b.linea];
    });

  return (
    <>
      <div className={styles.squadTop}>
        <div className={styles.filters} role="group" aria-label="Filtrar por línea">
          {FILTROS.map(({ clave, rotulo }) => (
            <button
              key={clave}
              type="button"
              className={styles.chip}
              aria-pressed={filtro === clave}
              onClick={() => setFiltro(clave)}
            >
              {rotulo}
            </button>
          ))}
        </div>
        <div className={styles.sortbox} role="group" aria-label="Ordenar">
          Ordenar
          {ORDENES.map(({ clave, rotulo }) => (
            <button
              key={clave}
              type="button"
              className={styles.chip}
              aria-pressed={orden === clave}
              onClick={() => setOrden(clave)}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.squad}>
        {visibles.map((jugador) => (
          <article
            key={jugador.id}
            className={styles.pcard}
            aria-label={`${jugador.nombre}, media ${jugador.media}, potencial ${jugador.potencial}`}
          >
            <Media media={jugador.media} pos={jugador.pos} />
            <div>
              <h4>{jugador.nombre}</h4>
              <div className={styles.pmeta}>
                <Bandera pais={jugador.pais} />
                <span>{jugador.edad} años</span>
                <span className={styles.pot}>{textoPotencial(jugador.potencial, jugador.media)}</span>
              </div>
              <p>{jugador.historia}</p>
              <div className={styles.dec}>
                <Icono nombre="diana" />
                <span>{jugador.decision}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
