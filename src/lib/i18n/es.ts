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
    publicarUnSet: 'Publicar un set',
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
  portada: {
    setsRecientes: 'Sets recientes',
    pizarraTitulo: 'La pizarra está en blanco',
    pizarraBody:
      'Todavía no hay ningún set publicado. Si tienes unos valores que te funcionan, súbelos: es exactamente para lo que existe esto.',
    publicarElPrimero: 'Publicar el primero',
    asiSeLeeUnSet: 'Así se lee un set',
    muescasComparten:
      'Las muescas comparten carril para leer la forma del set de un vistazo, sin comparar cincuenta números a mano. En un set publicado, cada número abre su propio hilo de comentarios.',
    laGuiaEyebrow: 'La guía',
    todoLoQueSePuedeContar:
      'Todo lo que se puede contar de un set aquí, campo por campo, y por qué cada cosa importa. Casi nada es obligatorio, pero cuanto más pongas, más le sirve a quien se lo lleve.',
    temas: [
      'Dificultad, tiempos y cámara',
      'Los valores y sus lados',
      'Comportamiento de la CPU',
      'Comentarios valor a valor',
    ],
    leerLaGuia: 'Leer la guía',
    publicarMiSet: 'Publicar mi set',
    verLosSets: (n: number) => `Ver los ${n} sets`,
  },
  setCard: {
    borrador: 'Borrador',
    anonimo: 'Anónimo',
  },
  filtro: {
    juego: 'Juego',
    todos: 'Todos',
  },
  juegos: {
    tituloLinea1: 'Sliders de',
    juegoNoEncontrado: 'Juego no encontrado',
    descripcion: (gameName: string) => `Sets de sliders de ${gameName} publicados por la comunidad de SlidersFC.`,
    setPublicado: (n: number): string => (n === 1 ? 'set publicado' : 'sets publicados'),
    aunNoHaySets: (gameName: string) => `Aún no hay sets de ${gameName}`,
    enCuantoAlguienPublique:
      'En cuanto alguien publique el primero aparecerá aquí, con sus valores por categoría y los comentarios de la comunidad.',
  },
  comparar: {
    eyebrow: 'Dos sets, uno al lado del otro',
    intro:
      'La pregunta que siempre se acaba haciendo no es qué valores tiene un set, sino en qué se diferencia del que ya usas. Aquí sale eso: dónde coinciden, dónde no y cuánto.',
    sinConQueComparar: 'Todavía no hay con qué comparar',
    hacenFaltaDos: 'Hacen falta al menos dos sets. Publica el tuyo y vuelve.',
    elPrimero: 'El primero',
    elSegundo: 'El segundo',
    eligeUnSet: 'Elige un set…',
    borradorTag: '(borrador)',
    ningunOtroSetDe: (gameName: string) => `Todavía no hay otro set de ${gameName} con el que compararlo.`,
    soloSetsDe: (gameName: string) => `Sólo sets de ${gameName}: los sliders de un juego no son los de otro.`,
    noSePuedenComparar: 'No se pueden comparar',
    dosJuegosDistintos: (titleA: string, gameA: string, titleB: string, gameB: string) =>
      `«${titleA}» es de ${gameA} y «${titleB}» de ${gameB}. Cada juego trae su propia lista de sliders, así que enfrentarlos valor a valor no diría nada. Si lo que quieres es llevarte un set al juego nuevo, en su ficha tienes el botón para copiarlo.`,
    elegirOtrosDos: 'Elegir otros dos',
    controlesCpuFuera: (title: string, behaviourLower: string) =>
      `Los controles de la CPU se quedan fuera de la comparación: «${title}» la lleva en ${behaviourLower}, y ahí esos valores no los usa el juego.`,
    sonElMismoSet: 'Son el mismo set',
    seSeparanEn: (differing: number, total: number) => `Se separan en ${differing} de ${total}`,
    niUnSoloValorDistinto: 'Ni un solo valor distinto entre los dos.',
    enLosOtrosCoinciden: (rest: number) =>
      `En los otros ${rest} coinciden. La barra entre las dos muescas es la distancia, y la cifra de la derecha dice cuánto sube o baja el segundo: en verde si sube, en rojo si baja.`,
    compararOtrosDos: 'Comparar otros dos',
    ordenDelJuego: 'Orden del juego',
    porDiferencia: 'Por diferencia',
    soloLoQueCambia: 'Sólo lo que cambia',
    deFabrica: 'De fábrica',
    losDosSetsIdenticos: (total: number) => `Los dos sets son idénticos en los ${total} sliders.`,
    compartirTitulo: (titleA: string, titleB: string) => `${titleA} contra ${titleB}`,
    compartirMismoSet: (titleA: string, titleB: string) =>
      `${titleA} y ${titleB} son el mismo set, valor a valor`,
    compartirDiferencia: (titleA: string, titleB: string, differing: number, total: number, gameName: string) =>
      `${titleA} contra ${titleB}: se separan en ${differing} de ${total} sliders de ${gameName}`,
    comparacionNoEncontrada: 'Comparación no encontrada',
    tituloVs: (titleA: string, titleB: string) => `${titleA} contra ${titleB}`,
    descripcionDiferencias: (gameName: string) => `En qué se diferencian estos dos sets de ${gameName}, valor a valor.`,
  },
  consola: {
    modoConsola: 'Modo consola',
    volverAlSet: 'Volver al set',
    reiniciar: 'Reiniciar',
    ponloEn: 'Ponlo en',
    comportamientoDeLaCpu: 'Comportamiento de la CPU',
    susSlidersNoHacenFalta: 'Sus sliders no hacen falta: el juego los ajusta solo.',
    metidos: (completed: number, total: number) => `${completed} de ${total} metidos`,
    slidersYaMetidos: 'Sliders ya metidos',
  },
};
