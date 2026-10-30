'use client';

import { useState } from 'react';

import type { Jugador, Plan } from '../../lib/retos/tipos';

import { Icono } from './iconos';
import styles from './reto.module.css';
import { Texto } from './texto';

type Ficha = Pick<Jugador, 'id' | 'nombre' | 'corto' | 'pos'>;

/** Dónde estuvo por última vez cada jugador: de ahí parte la animación al volver. */
type Ultimo = { x: number; y: number; rol: string };

/** Los roles largos no caben bajo la ficha del campo. */
function rolCorto(rol: string): string {
  if (rol.includes('Mediocampista creador')) return 'Creador';
  return rol
    .replace(/\s*\(.*\)$/, '')
    .replace('Attacking Wingback', 'Att. Wingback')
    .replace('Ball-Playing Defender', 'Ball-Playing Def.')
    .replace('Deep-Lying Playmaker', 'Deep-Lying PM');
}

function posiciones(plan: Plan): Record<string, Ultimo> {
  return Object.fromEntries(plan.once.map((t) => [t.jugador, { x: t.x, y: t.y, rol: rolCorto(t.rol) }]));
}

/**
 * La pizarra: pestañas de plan, el campo con las fichas y la tabla de roles.
 *
 * Hay una ficha por cada jugador que aparece en algún plan, y no una por
 * plan: al cambiar de plan las fichas no se recrean, se mueven (transición de
 * `left` y `top`), y las que no juegan se apagan en su sitio. Por eso el
 * estado guarda la última posición de cada una.
 */
export function Pizarra({ planes, jugadores }: { planes: Plan[]; jugadores: Ficha[] }) {
  const [clave, setClave] = useState(planes[0]?.clave);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [ultimos, setUltimos] = useState<Record<string, Ultimo>>(() => (planes[0] ? posiciones(planes[0]) : {}));

  const plan = planes.find((p) => p.clave === clave) ?? planes[0];
  if (!plan) return null;

  const porId = new Map(jugadores.map((j) => [j.id, j]));
  const nombre = (id: string) => {
    const ficha = porId.get(id);
    return ficha ? (ficha.corto ?? ficha.nombre) : id;
  };

  // Una ficha por jugador, en orden de primera aparición.
  const ids = [...new Set(planes.flatMap((p) => p.once.map((t) => t.jugador)))];
  const titulares = new Map(plan.once.map((t) => [t.jugador, t]));

  function elegirPlan(siguiente: Plan) {
    setClave(siguiente.clave);
    setSeleccionado(null);
    setUltimos((anteriores) => ({ ...anteriores, ...posiciones(siguiente) }));
  }

  return (
    <div className={styles.pizarra}>
      <div className={styles.plans} role="tablist" aria-label="Planes tácticos">
        {planes.map((p) => (
          <button
            key={p.clave}
            type="button"
            className={styles.planBtn}
            role="tab"
            id={`reto-plan-${p.clave}`}
            aria-selected={p.clave === plan.clave}
            onClick={() => elegirPlan(p)}
          >
            <small>
              Plan {p.clave} · {p.uso}
            </small>
            <b>{p.nombre}</b>
          </button>
        ))}
      </div>

      <div className={styles.board}>
        <div className={styles.pitch} aria-label="Campo con la alineación del plan seleccionado">
          <svg className={styles.lines} viewBox="0 0 68 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <pattern id="reto-mow" width="68" height="10" patternUnits="userSpaceOnUse">
                <rect width="68" height="5" fill="rgba(255,255,255,.035)" />
              </pattern>
            </defs>
            <rect width="68" height="100" fill="url(#reto-mow)" />
            <g fill="none" stroke="rgba(255,255,255,.55)" strokeWidth=".35">
              <rect x="3" y="3" width="62" height="94" />
              <line x1="3" y1="50" x2="65" y2="50" />
              <circle cx="34" cy="50" r="8" />
              <rect x="15" y="3" width="38" height="15" />
              <rect x="25" y="3" width="18" height="5.5" />
              <rect x="15" y="82" width="38" height="15" />
              <rect x="25" y="91.5" width="18" height="5.5" />
              <path d="M27 18a8 8 0 0014 0M27 82a8 8 0 0114 0" />
            </g>
          </svg>

          {ids.map((id) => {
            const titular = titulares.get(id);
            const ultimo = ultimos[id] ?? { x: 50, y: 55, rol: '' };
            const x = titular?.x ?? ultimo.x;
            const y = titular?.y ?? ultimo.y;
            const clases = [
              styles.pl,
              porId.get(id)?.pos === 'POR' ? styles.gk : '',
              x < 22 ? styles.edgeL : '',
              x > 78 ? styles.edgeR : '',
              titular ? '' : styles.off,
              titular && seleccionado === id ? styles.sel : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={id}
                type="button"
                className={clases}
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={titular ? `${nombre(id)}, ${titular.pos}, ${titular.rol}` : nombre(id)}
                tabIndex={titular ? 0 : -1}
                onClick={() => setSeleccionado(id)}
              >
                <span className={styles.shirt} />
                <span className={styles.nm}>{nombre(id)}</span>
                <span className={styles.rl}>{titular ? rolCorto(titular.rol) : ultimo.rol}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.boardSide}>
          <div className={styles.settings}>
            <div className={styles.setting}>
              <small>Formación</small>
              <b>{plan.formacion}</b>
            </div>
            <div className={styles.setting}>
              <small>Creación de jugadas</small>
              <b>{plan.creacion}</b>
            </div>
            <div className={styles.setting}>
              <small>Enfoque defensivo</small>
              <b>{plan.enfoque}</b>
            </div>
            <div className={styles.setting}>
              <small>Altura de línea</small>
              <b>{plan.alturaLinea}</b>
            </div>
          </div>

          <div className={styles.when}>
            <Icono nombre="reloj" />
            <span>
              <Texto>{plan.cuando}</Texto>
            </span>
          </div>

          <div className={styles.tablewrap}>
            <table>
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Jugador</th>
                  <th>Rol (foco)</th>
                  <th>Tarea</th>
                </tr>
              </thead>
              <tbody className={styles.roles}>
                {plan.once.map((t) => (
                  <tr
                    key={t.jugador}
                    className={seleccionado === t.jugador ? styles.sel : undefined}
                    onClick={() => setSeleccionado(t.jugador)}
                  >
                    <td>{t.pos}</td>
                    <td>{nombre(t.jugador)}</td>
                    <td className={styles.role}>{t.rol}</td>
                    <td>{t.tarea}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={`${styles.src} ${styles.planSrc}`}>
            <Texto>{plan.fuente}</Texto>
          </p>
        </div>
      </div>
    </div>
  );
}
