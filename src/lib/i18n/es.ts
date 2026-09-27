/**
 * El diccionario en castellano. Es la referencia: `en.ts` se tipa contra
 * la forma de este objeto (`Dictionary` en `dictionary.ts`), así que si aquí
 * falta una clave que `en.ts` sí tiene, TypeScript avisa igual — pero el caso
 * que de verdad importa es al revés, y de ese se encarga `en.ts`.
 *
 * Un nivel de anidamiento por zona: la cabecera, el pie, la ficha de un set
 * (y todo lo que cuelga de ella — tabla, comentarios, historial...) y lo
 * compartido entre zonas. Las claves van en castellano, como el resto del
 * proyecto.
 */
export const es = {
  header: {
    nuevoSet: 'Nuevo set',
    nuevoCorto: 'Nuevo',
    miPerfil: 'Mi perfil',
    entrar: 'Entrar',
  },
  footer: {
    queLlevaUnSet: 'Qué lleva un set',
    disclaimer: 'Proyecto de comunidad. Sin relación con EA SPORTS ni con Electronic Arts Inc.',
    idioma: 'Idioma',
    cambiarIdioma: 'Cambiar idioma',
  },
  comun: {
    cerrar: 'Cerrar',
    inicio: 'Inicio',
    usuarioBorrado: 'Usuario borrado',
    haceDias: (n: number) => `hace ${n} ${n === 1 ? 'día' : 'días'}`,
    entra: 'Entra',
    enviando: 'Enviando…',
  },
  set: {
    noEncontrado: 'Set no encontrado',
    version: (n: number) => `Versión ${n}`,
    borrador: 'Borrador · sólo tú lo ves',
    meterEnConsola: 'Meter en la consola',
    comparar: 'Comparar',
    valores: 'Valores',
    ayudaValoresConReferencia:
      'La marca gris es lo que trae el juego de fábrica: lo que se separe de ella es lo que ha tocado el autor. Toca un número para comentarlo.',
    ayudaValoresSinReferencia: 'Toca cualquier número para leer y dejar comentarios sobre ese valor concreto.',
    sobreElSet: 'Sobre el set en general',
    sobreElSetAyuda:
      'Para hablar del conjunto. Si tu comentario es sobre un valor concreto, mejor déjalo en su slider.',
    sinComentariosGenerales: 'Todavía no hay comentarios generales.',
    placeholderComentarioGeneral: '¿Qué tal te ha funcionado este set?',
    comentarios: (n: number): string => (n === 1 ? 'comentario' : 'comentarios'),
    slidersDeJuego: (game: string) => `Sliders de ${game}`,
    indice: 'Índice ▾',
    irAOtraCategoria: (label: string) => `${label} — ir a otra categoría`,
    noAplica: (scopeLabel: string) => `${scopeLabel}: no aplica`,
    verComentarios: (rowName: string, scopeLabel: string) => `${rowName} · ${scopeLabel} — comentarios`,
    sinComentariosValor: 'Nadie ha comentado este valor todavía.',
    placeholderComentarioValor: (value: number | string, name: string) => `¿Por qué ${value} en ${name}?`,
    deLaVersion: (n: number) => `de la v${n}`,
    paraComentar: 'para comentar.',
    comentarBoton: 'Comentar',
    altura: (n: number) => `altura ${n}`,
    zoom: (n: number) => `zoom ${n}`,
    dificultad: 'Dificultad',
    tiempos: 'Tiempos',
    minutos: (n: number | string) => `${n} minutos`,
    camara: 'Cámara',
    comoHaCambiado: 'Cómo ha cambiado',
    historial: 'Historial',
    valorTocado: (n: number) => `${n} ${n === 1 ? 'valor tocado' : 'valores tocados'}`,
    enlaceCopiado: '¡Enlace copiado!',
    compartir: 'Compartir',
    enX: 'En X',
    copiaElEnlace: 'Copia el enlace:',
    guardar: 'Guardar',
    guardado: 'Guardado',
    soloTu: 'Sólo tú',
    editar: 'Editar',
    pasarABorrador: 'Pasar a borrador',
    publicar: 'Publicar',
    copiarValoresTitle: (gameName: string) =>
      `Copia los valores que existan en ${gameName} y deja el resto como los trae el juego`,
    llevarA: (gameSlugUpper: string) => `Llevar a ${gameSlugUpper}`,
    confirmarBorrado: '¿Borrar este set? Se borrarán también sus valores y comentarios.',
    borrar: 'Borrar',
    categoriasDelSet: 'Categorías del set',
    consola: 'Consola',
    irA: 'Ir a',
    marcasTocadas: (n: number) => `${n} tocado${n === 1 ? '' : 's'}`,
  },
};
