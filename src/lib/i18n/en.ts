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
    publicarUnSet: 'Publish a set',
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
  portada: {
    setsRecientes: 'Recent sets',
    pizarraTitulo: 'The board is empty',
    pizarraBody:
      "No set has been published yet. If you've got values that work for you, upload them — that's exactly what this is for.",
    publicarElPrimero: 'Publish the first one',
    asiSeLeeUnSet: 'How to read a set',
    muescasComparten:
      "Marks share a track so you can read a set's shape at a glance, without comparing fifty numbers by hand. On a published set, every number opens its own comment thread.",
    laGuiaEyebrow: 'The guide',
    todoLoQueSePuedeContar:
      "Everything you can say about a set here, field by field, and why each one matters. Almost nothing is required, but the more you fill in, the more useful it is to whoever takes it.",
    temas: [
      'Difficulty, half length and camera',
      'The values and their sides',
      'CPU behaviour',
      'Value-by-value comments',
    ],
    leerLaGuia: 'Read the guide',
    publicarMiSet: 'Publish my set',
    verLosSets: (n: number) => `See the ${n} sets`,
  },
  setCard: {
    borrador: 'Draft',
    anonimo: 'Anonymous',
  },
  filtro: {
    juego: 'Game',
    todos: 'All',
  },
  juegos: {
    tituloLinea1: 'Sliders for',
    juegoNoEncontrado: 'Game not found',
    descripcion: (gameName: string) => `${gameName} slider sets published by the SlidersFC community.`,
    setPublicado: (n: number) => (n === 1 ? 'set published' : 'sets published'),
    aunNoHaySets: (gameName: string) => `No ${gameName} sets yet`,
    enCuantoAlguienPublique:
      'As soon as someone publishes the first one it will show up here, with its values by category and the community comments.',
  },
  comparar: {
    eyebrow: 'Two sets, side by side',
    intro:
      "The question you always end up asking isn't what values a set has, but how it differs from the one you already use. That's what shows up here: where they match, where they don't, and by how much.",
    sinConQueComparar: 'Nothing to compare yet',
    hacenFaltaDos: 'You need at least two sets. Publish yours and come back.',
    elPrimero: 'The first one',
    elSegundo: 'The second one',
    eligeUnSet: 'Choose a set…',
    borradorTag: '(draft)',
    ningunOtroSetDe: (gameName: string) => `There's no other ${gameName} set to compare it with yet.`,
    soloSetsDe: (gameName: string) => `Only ${gameName} sets: one game's sliders aren't another's.`,
    noSePuedenComparar: "These can't be compared",
    dosJuegosDistintos: (titleA: string, gameA: string, titleB: string, gameB: string) =>
      `"${titleA}" is from ${gameA} and "${titleB}" from ${gameB}. Each game brings its own list of sliders, so lining them up value by value wouldn't say anything. If you want to bring a set to the new game, its page has a button that copies it.`,
    elegirOtrosDos: 'Choose another two',
    controlesCpuFuera: (title: string, behaviourLower: string) =>
      `CPU controls are left out of the comparison: "${title}" has it set to ${behaviourLower}, and there the game doesn't use those values.`,
    sonElMismoSet: 'They are the same set',
    seSeparanEn: (differing: number, total: number) => `They differ on ${differing} of ${total}`,
    niUnSoloValorDistinto: 'Not a single value differs between the two.',
    enLosOtrosCoinciden: (rest: number) =>
      `The other ${rest} match. The bar between the two marks is the distance, and the number on the right says how much the second one goes up or down: green if it rises, red if it drops.`,
    compararOtrosDos: 'Compare another two',
    ordenDelJuego: 'Game order',
    porDiferencia: 'By difference',
    soloLoQueCambia: 'Only what changed',
    deFabrica: 'Factory default',
    losDosSetsIdenticos: (total: number) => `The two sets are identical across all ${total} sliders.`,
    compartirTitulo: (titleA: string, titleB: string) => `${titleA} vs ${titleB}`,
    compartirMismoSet: (titleA: string, titleB: string) =>
      `${titleA} and ${titleB} are the same set, value for value`,
    compartirDiferencia: (titleA: string, titleB: string, differing: number, total: number, gameName: string) =>
      `${titleA} vs ${titleB}: they differ on ${differing} of ${total} ${gameName} sliders`,
    comparacionNoEncontrada: 'Comparison not found',
    tituloVs: (titleA: string, titleB: string) => `${titleA} vs ${titleB}`,
    descripcionDiferencias: (gameName: string) => `How these two ${gameName} sets differ, value by value.`,
  },
  consola: {
    modoConsola: 'Console mode',
    volverAlSet: 'Back to the set',
    reiniciar: 'Reset',
    ponloEn: 'Set it to',
    comportamientoDeLaCpu: 'CPU behaviour',
    susSlidersNoHacenFalta: "Its sliders aren't needed — the game sets them on its own.",
    metidos: (completed: number, total: number) => `${completed} of ${total} entered`,
    slidersYaMetidos: 'Sliders entered so far',
  },
};

export { en };
