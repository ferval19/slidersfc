import type { Jugador, Plan, SeccionPlantilla } from '../../lib/retos/tipos';

import { Plantilla } from './plantilla';
import styles from './reto.module.css';
import { Texto } from './texto';

/** Un decimal y con coma, como se escribe en castellano. */
const decimal = (valor: number) => valor.toFixed(1).replace('.', ',');

const media = (valores: number[]) => valores.reduce((total, valor) => total + valor, 0) / valores.length;

/**
 * Las cifras de la cabecera de la plantilla, calculadas de los propios datos:
 * la media del once del primer plan, la de toda la plantilla, el mejor del
 * equipo (y el mejor de campo, que si no el portero se lo lleva siempre) y el
 * que más puede crecer. Con empate gana el primero de la lista.
 */
export function calcularKpis(
  jugadores: Jugador[],
  primerPlan: Plan | undefined,
  notaMejor: string | undefined,
): { valor: string; texto: string }[] {
  if (jugadores.length === 0) return [];

  const porId = new Map(jugadores.map((jugador) => [jugador.id, jugador]));
  const once = (primerPlan?.once ?? []).flatMap((titular) => porId.get(titular.jugador) ?? []);
  const corto = (jugador: Jugador) => jugador.corto ?? jugador.nombre;

  const mejor = jugadores.reduce((a, b) => (b.media > a.media ? b : a));
  const mejorDeCampo = jugadores.filter((j) => j.pos !== 'POR').reduce<Jugador | undefined>(
    (a, b) => (a && a.media >= b.media ? a : b),
    undefined,
  );
  const crecimiento = (jugador: Jugador) => jugador.potencial - jugador.media;
  const masMargen = jugadores.reduce((a, b) => (crecimiento(b) > crecimiento(a) ? b : a));

  const textoMejor =
    notaMejor ??
    (mejorDeCampo && mejorDeCampo.id !== mejor.id
      ? `${corto(mejor)}, el mejor del equipo; ${corto(mejorDeCampo)} (${mejorDeCampo.media}) el mejor de campo`
      : `${corto(mejor)}, el mejor del equipo`);

  return [
    ...(once.length > 0
      ? [{ valor: decimal(media(once.map((j) => j.media))), texto: `media del once del Plan ${primerPlan?.clave}` }]
      : []),
    { valor: decimal(media(jugadores.map((j) => j.media))), texto: `media de los ${jugadores.length} de la plantilla` },
    { valor: String(mejor.media), texto: textoMejor },
    {
      valor: `+${crecimiento(masMargen)}`,
      texto: `${masMargen.nombre}: el que más puede crecer (${masMargen.media} → ${masMargen.potencial})`,
    },
  ];
}

export function SeccionPlantillaCuerpo({
  seccion,
  primerPlan,
}: {
  seccion: SeccionPlantilla;
  primerPlan: Plan | undefined;
}) {
  const kpis = calcularKpis(seccion.jugadores, primerPlan, seccion.notaMejor);

  return (
    <>
      <div className={styles.squadKpis}>
        {kpis.map((kpi) => (
          <div key={kpi.texto} className={styles.skpi}>
            <b>{kpi.valor}</b>
            <span>{kpi.texto}</span>
          </div>
        ))}
      </div>

      <Plantilla jugadores={seccion.jugadores} />

      {seccion.cedidos ? (
        <p className={styles.loans}>
          <Texto>{seccion.cedidos}</Texto>
        </p>
      ) : null}
      {seccion.fuente ? (
        <p className={styles.src}>
          <Texto>{seccion.fuente}</Texto>
        </p>
      ) : null}
    </>
  );
}
