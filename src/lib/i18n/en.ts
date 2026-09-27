import type { Dictionary } from '@/lib/i18n/dictionary';

/**
 * El inglés. Se declara `const en: Dictionary` a propósito: si falta una
 * clave, o si una función lleva otra forma de parámetros que la de `es.ts`,
 * TypeScript no compila. Es la red que evita que este fichero se quede
 * atrás según crezca el castellano.
 *
 * Traducido con criterio, no palabra por palabra: mismo tono directo, sin
 * signos de exclamación.
 */
const en: Dictionary = {
  header: {
    nuevoSet: 'New set',
    nuevoCorto: 'New',
    miPerfil: 'My profile',
    entrar: 'Sign in',
  },
  footer: {
    queLlevaUnSet: 'What goes into a set',
    disclaimer: 'A community project. Not affiliated with EA SPORTS or Electronic Arts Inc.',
    idioma: 'Language',
    cambiarIdioma: 'Switch language',
  },
  comun: {
    cerrar: 'Close',
    inicio: 'Home',
    usuarioBorrado: 'Deleted user',
    haceDias: (n: number) => `${n} day${n === 1 ? '' : 's'} ago`,
    entra: 'Sign in',
    enviando: 'Sending…',
  },
  set: {
    noEncontrado: 'Set not found',
    version: (n: number) => `Version ${n}`,
    borrador: 'Draft · only you can see it',
    meterEnConsola: 'Open in console',
    comparar: 'Compare',
    valores: 'Values',
    ayudaValoresConReferencia:
      'The gray mark is the game\'s factory preset — anything that strays from it is what the author changed. Tap a number to comment on it.',
    ayudaValoresSinReferencia: 'Tap any number to read and leave comments on that particular value.',
    sobreElSet: 'About the set',
    sobreElSetAyuda:
      'For talking about the set as a whole. If your comment is about one specific value, leave it on that slider instead.',
    sinComentariosGenerales: 'No general comments yet.',
    placeholderComentarioGeneral: 'How has this set worked for you?',
    comentarios: (n: number) => (n === 1 ? 'comment' : 'comments'),
    slidersDeJuego: (game: string) => `${game} sliders`,
    indice: 'Index ▾',
    irAOtraCategoria: (label: string) => `${label} — jump to another category`,
    noAplica: (scopeLabel: string) => `${scopeLabel}: not used`,
    verComentarios: (rowName: string, scopeLabel: string) => `${rowName} · ${scopeLabel} — comments`,
    sinComentariosValor: 'Nobody has commented on this value yet.',
    placeholderComentarioValor: (value: number | string, name: string) => `Why ${value} on ${name}?`,
    deLaVersion: (n: number) => `from v${n}`,
    paraComentar: 'to comment.',
    comentarBoton: 'Post',
    altura: (n: number) => `height ${n}`,
    zoom: (n: number) => `zoom ${n}`,
    dificultad: 'Difficulty',
    tiempos: 'Half length',
    minutos: (n: number | string) => `${n} minutes`,
    camara: 'Camera',
    comoHaCambiado: 'How it changed',
    historial: 'History',
    valorTocado: (n: number) => `${n} value${n === 1 ? '' : 's'} changed`,
    enlaceCopiado: 'Link copied',
    compartir: 'Share',
    enX: 'On X',
    copiaElEnlace: 'Copy this link:',
    guardar: 'Save',
    guardado: 'Saved',
    soloTu: 'Only you',
    editar: 'Edit',
    pasarABorrador: 'Move to draft',
    publicar: 'Publish',
    copiarValoresTitle: (gameName: string) =>
      `Copies the values that exist in ${gameName} and leaves the rest as the game default`,
    llevarA: (gameSlugUpper: string) => `Copy to ${gameSlugUpper}`,
    confirmarBorrado: 'Delete this set? Its values and comments will be deleted too.',
    borrar: 'Delete',
    categoriasDelSet: 'Categories in this set',
    consola: 'Console',
    irA: 'Jump to',
    marcasTocadas: (n: number) => `${n} changed`,
  },
};

export { en };
