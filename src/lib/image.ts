/**
 * Preparar una foto de perfil en el navegador antes de subirla.
 *
 * Se recorta al cuadrado por el centro y se reduce a 512 px. Importa más de lo
 * que parece: casi todo el mundo elige una foto del móvil, de 3 o 4 MB, que
 * tarda en subir con datos y luego pesa en cada página donde sale el avatar.
 * Reducida, la misma foto son unas decenas de kilobytes.
 *
 * Sólo funciona en el navegador (usa canvas), así que vive aparte de la
 * validación, que la comparten cliente y servidor.
 */

export const AVATAR_SIZE = 512;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
/** Antes de reducir. Lo que se sube pesa mucho menos. */
export const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

export async function prepareAvatar(file: File): Promise<Blob> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('La foto tiene que ser JPG, PNG o WEBP.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('La foto pesa demasiado. Prueba con uno más ligero.');
  }

  const bitmap = await createImageBitmap(file);

  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se ha podido procesar la foto.');

    // Fondo de pizarra: si la imagen trae transparencia, el JPEG la rellenaría
    // de negro.
    context.fillStyle = '#12342c';
    context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    context.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85),
    );
    if (!blob) throw new Error('No se ha podido procesar la foto.');

    return blob;
  } finally {
    bitmap.close();
  }
}
