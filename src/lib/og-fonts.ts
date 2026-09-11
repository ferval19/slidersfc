import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Fuentes para las imágenes que se generan en el servidor (favicon y tarjetas
 * de OpenGraph). Van como fichero en el repo, no descargadas en caliente: así
 * no hay una petición de red en el camino crítico ni un modo de fallo nuevo.
 *
 * Se leen de `public/` a propósito. `fetch(new URL(..., import.meta.url))` no
 * funciona al prerenderizar con Turbopack (fetch sobre file: no está
 * implementado), y `public/` es lo único que se despliega siempre tal cual.
 *
 * Big Shoulders e IBM Plex Mono son OFL 1.1, que permite redistribuirlas.
 */

const fontPath = (file: string) => join(process.cwd(), 'public', 'fonts', file);

export function displayFont() {
  return readFile(fontPath('big-shoulders-900.ttf'));
}

export function monoFont() {
  return readFile(fontPath('plex-mono-500.ttf'));
}
