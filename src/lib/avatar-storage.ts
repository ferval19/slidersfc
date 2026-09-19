/**
 * Dónde viven los avatares. Módulo sin dependencias para que lo compartan el
 * formulario (sube la foto desde el navegador) y la acción de servidor
 * (comprueba que la URL guardada es de aquí y borra la anterior).
 *
 * La carpeta es el id del usuario porque la política de Storage se apoya en
 * ella: `(storage.foldername(name))[1] = auth.uid()`. Cambiar este formato sin
 * cambiar supabase/storage/01_avatars.sql deja a todo el mundo sin poder subir.
 */

export const AVATAR_BUCKET = 'avatars';

/** Prefijo público de las fotos de este proyecto. */
export function avatarPublicPrefix(supabaseUrl: string) {
  return `${supabaseUrl}/storage/v1/object/public/${AVATAR_BUCKET}/`;
}

export function avatarFolder(userId: string) {
  return userId;
}

/** Un nombre nuevo en cada subida: así ninguna caché sirve la foto anterior. */
export function avatarObjectPath(userId: string) {
  return `${avatarFolder(userId)}/${Date.now()}.jpg`;
}
