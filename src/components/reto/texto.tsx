import { Fragment, type ReactNode } from 'react';

/**
 * El markdown mínimo de los retos, hecho nodos de React.
 *
 * Admite `**negrita**`, `*cursiva*` y `[texto](https://…)`, y nada más. No hay
 * `dangerouslySetInnerHTML` en ningún sitio: lo que no es una de esas tres
 * formas se pinta como texto, así que un reto que venga de fuera no puede
 * colar etiquetas. Los enlaces sólo valen con `http` o `https`; con otro
 * esquema (`javascript:`…) se pinta el rótulo sin enlace.
 *
 * Es un componente sin estado ni APIs de servidor: sirve igual desde un
 * componente de servidor que desde uno de cliente (la pizarra lo necesita).
 */

const FORMAS = /\*\*(.+?)\*\*|\*(?!\s)(.+?)(?<!\s)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function esUrlSegura(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

function nodos(texto: string, prefijo: string): ReactNode[] {
  const salida: ReactNode[] = [];
  let desde = 0;
  let n = 0;

  for (const forma of texto.matchAll(FORMAS)) {
    const inicio = forma.index ?? 0;
    if (inicio > desde) salida.push(texto.slice(desde, inicio));
    const clave = `${prefijo}-${n++}`;
    const [, negrita, cursiva, rotulo, url] = forma;

    if (negrita !== undefined) {
      salida.push(<b key={clave}>{nodos(negrita, clave)}</b>);
    } else if (cursiva !== undefined) {
      salida.push(<i key={clave}>{nodos(cursiva, clave)}</i>);
    } else if (esUrlSegura(url)) {
      salida.push(
        <a key={clave} href={url}>
          {rotulo}
        </a>,
      );
    } else {
      salida.push(rotulo);
    }
    desde = inicio + forma[0].length;
  }

  if (desde < texto.length) salida.push(texto.slice(desde));
  return salida;
}

export function Texto({ children }: { children: string }) {
  return <Fragment>{nodos(children, 't')}</Fragment>;
}
