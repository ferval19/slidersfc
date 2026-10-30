'use client';

import { useEffect, useRef, useState } from 'react';

import { Icono } from './iconos';
import styles from './reto.module.css';

type Estado = 'reposo' | 'copiado' | 'fallo';

const ROTULO: Record<Estado, string> = {
  reposo: 'Copiar',
  copiado: 'Copiado',
  // Sin permiso para el portapapeles (o sin HTTPS) no hay nada que hacer: se
  // le pide a la persona que lo seleccione ella.
  fallo: 'Selecciónalo',
};

/**
 * Botón que copia un código al portapapeles y avisa en el propio botón.
 * Vuelve a «Copiar» a los dos segundos, haya salido bien o no.
 *
 * `variante`: `desafio` es el botón con icono de la tarjeta del desafío;
 * `codigo` es el chiquito rojo que va dentro de la etiqueta de un código de
 * táctica.
 */
export function BotonCopiar({
  texto,
  variante,
}: {
  texto: string;
  variante: 'desafio' | 'codigo';
}) {
  const [estado, setEstado] = useState<Estado>('reposo');
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setEstado('copiado');
    } catch {
      setEstado('fallo');
    }
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setEstado('reposo'), 2000);
  }

  if (variante === 'codigo') {
    return (
      <button type="button" className={styles.copy} onClick={copiar}>
        {ROTULO[estado]}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={styles.copiarDesafio}
      data-ok={estado === 'copiado' ? '' : undefined}
      onClick={copiar}
    >
      <Icono nombre="copiar" />
      <span>{ROTULO[estado]}</span>
    </button>
  );
}
