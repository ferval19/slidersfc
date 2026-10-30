import { banderaDe } from './banderas';
import styles from './reto.module.css';

/**
 * Piezas sueltas que se repiten en la plantilla y en el mercado. Sin estado,
 * así que valen tanto en servidor como en cliente.
 */

/** La bandera de un país; si no la tenemos, nada. */
export function Bandera({ pais }: { pais: string | undefined }) {
  const bandera = banderaDe(pais);
  if (!bandera) return null;

  return (
    <span className={styles.flag} title={bandera.nombre}>
      {/* `cuerpo` es una constante de `banderas.ts` —nunca contenido de un
          reto—, por eso es seguro inyectarla. El código de país sólo sirve de
          clave de búsqueda. */}
      <svg
        viewBox="0 0 30 20"
        role="img"
        aria-label={bandera.nombre}
        dangerouslySetInnerHTML={{ __html: bandera.cuerpo }}
      />
    </span>
  );
}

/** El recuadro de la media: rojo de 85 para arriba, neutro desde 80, gris por debajo. */
export function Media({ media, pos }: { media: number | null; pos: string }) {
  // De 80 a 84 es el recuadro base: no lleva clase propia.
  const nivel = media === null ? styles.t3 : media >= 85 ? styles.t1 : media >= 80 ? '' : styles.t3;

  return (
    <div className={`${styles.rate} ${nivel}`.trim()}>
      <b>{media ?? '?'}</b>
      <span>{pos}</span>
    </div>
  );
}

/** «Potencial 88 (+7)»; el margen sólo si lo hay. */
export function textoPotencial(potencial: number, media: number | null): string {
  const margen = media !== null && potencial > media ? ` (+${potencial - media})` : '';
  return `Potencial ${potencial}${margen}`;
}
