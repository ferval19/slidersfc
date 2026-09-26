/**
 * Serializa datos para un `<script type="application/ld+json">`. Escapa `<`
 * para que un título o una biografía escritos por un usuario no puedan cerrar
 * la etiqueta `script` a medio JSON.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
