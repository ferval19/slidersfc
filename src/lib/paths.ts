/**
 * Rutas de la aplicación, en un solo sitio.
 *
 * Los sets viven en /u/<usuario>/<slug>. Se descartó /<usuario>/<slug> a
 * secas porque un espacio de nombres en la raíz choca con /login, /perfil,
 * /juegos y /auth, y obligaría a mantener una lista de nombres reservados
 * cada vez que se añade una ruta.
 */

export function profilePath(username: string) {
  return `/u/${username}`;
}

/** El formulario de editar el perfil, junto a /cuenta/contrasena. */
export function editProfilePath() {
  return '/cuenta/perfil';
}

export function setPath(username: string, slug: string) {
  return `/u/${username}/${slug}`;
}

export function editSetPath(username: string, slug: string) {
  return `/u/${username}/${slug}/editar`;
}

export function consolePath(username: string, slug: string) {
  return `/u/${username}/${slug}/consola`;
}

export type SetRef = { username: string; slug: string };

/**
 * La comparación de dos sets. Va en la ruta y no en la query para que el
 * enlace se pueda pegar en un grupo y se entienda leyéndolo: comparar dos
 * sets es justo lo que la gente comparte.
 */
export function comparePath(a: SetRef, b: SetRef) {
  return `/comparar/${a.username}/${a.slug}/${b.username}/${b.slug}`;
}

/** El selector. Con `a` deja ya elegido el primero. */
export function comparePickerPath(a?: SetRef) {
  return a ? `/comparar?a=${encodeURIComponent(`${a.username}/${a.slug}`)}` : '/comparar';
}

/**
 * Camino de un set tolerante a datos incompletos: si falta el slug o el
 * usuario (por ejemplo, con la migración de slugs sin aplicar), cae en la URL
 * por id, que sigue funcionando y redirige. Mejor un enlace feo que uno roto.
 */
export function resolveSetPath(
  set: { id: string; slug?: string | null },
  username?: string | null,
) {
  return username && set.slug ? setPath(username, set.slug) : `/sets/${set.id}`;
}
