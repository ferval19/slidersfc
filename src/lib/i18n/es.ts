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
    seElPrimero:
      'Nadie ha comentado este set todavía. Toca cualquier número y sé el primero en decir por qué.',
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
  login: {
    metaTitle: 'Entrar',
    metaDescription: 'Entra en SlidersFC con tu cuenta de X o con tu email.',
    heading: 'Entra y publica tus sliders',
    subheading: 'Necesitas una cuenta para publicar sets y comentar los de los demás. Leer es libre.',
    continuarConX: 'Continuar con X',
    oConTuCorreo: 'o con tu correo',
    pestanaEntrar: 'Entrar',
    pestanaCrear: 'Crear cuenta',
    correo: 'Correo',
    correoPlaceholder: 'tu@email.com',
    contrasena: 'Contraseña',
    contrasenaPlaceholderMinimo: 'Mínimo 8 caracteres',
    repiteLaContrasena: 'Repite la contraseña',
    prefieroEnlacePorCorreo: 'Prefiero un enlace por correo',
    olvidasteTuContrasena: '¿Olvidaste tu contraseña?',
    unMomento: 'Un momento…',
    crearMiCuenta: 'Crear mi cuenta',
    entrar: 'Entrar',
    enviando: 'Enviando…',
    enviarmeUnEnlace: 'Enviarme un enlace',
    volverALaContrasena: 'Volver a la contraseña',
    revisaTuCorreo: 'Revisa tu correo',
    confirmaTuCuenta: 'Confirma tu cuenta',
    teLoHemosEnviado: 'Te lo hemos enviado',
    confirmandoBodyInicio: 'Tu cuenta está creada. Abre el enlace que te hemos mandado a ',
    confirmandoBodyFin: ' para poder entrar.',
    noConfirmandoBodyInicio: 'A ',
    noConfirmandoBodyFin: '. Abre el enlace en este mismo navegador y entrarás directo.',
    elEnlaceNoFunciona: '¿El enlace no funciona?',
    ayudaCodigo:
      'Escribe aquí el código de 6 dígitos del correo. Funciona desde cualquier navegador o dispositivo, y no se gasta si tu gestor de correo abre el enlace por su cuenta.',
    codigo: 'Código',
    comprobando: 'Comprobando…',
    entrarConElCodigo: 'Entrar con el código',
  },
  recuperar: {
    metaTitle: 'Recuperar contraseña',
    heading: '¿Contraseña olvidada?',
    subheading: 'Escribe tu correo y te mandamos un enlace para ponerte una nueva.',
    enviado: 'Enviado',
    miraTuCorreo: 'Mira tu correo',
    siHayUnaCuentaConInicio: 'Si hay una cuenta con ',
    siHayUnaCuentaConFin: ', te llega un enlace para poner una contraseña nueva.',
    volverAEntrar: 'Volver a entrar',
    correo: 'Correo',
    correoPlaceholder: 'tu@email.com',
    enviando: 'Enviando…',
    mandarmeElEnlace: 'Mandarme el enlace',
  },
  cuentaContrasena: {
    metaTitle: 'Nueva contraseña',
    heading: 'Pon una contraseña nueva',
    subheading: 'A partir de ahora entrarás con ella. Mínimo 8 caracteres.',
    contrasenaNueva: 'Contraseña nueva',
    contrasenaNuevaPlaceholder: 'Mínimo 8 caracteres',
    repitela: 'Repítela',
    guardando: 'Guardando…',
    guardarYEntrar: 'Guardar y entrar',
  },
  authFinalizar: {
    metaTitle: 'Entrando',
    iniciandoSesion: 'Iniciando sesión…',
    noSeHaPodidoEntrar: 'No se ha podido entrar',
    pedirOtroEnlace: 'Pedir otro enlace',
    enlaceSinDatosDeSesion:
      'El enlace no traía datos de sesión. Suele pasar cuando se abre en otro navegador o cuando ya ha caducado: pide uno nuevo.',
  },
  perfil: {
    perfilNoEncontrado: 'Perfil no encontrado',
    editarPerfil: 'Editar perfil',
    setPublicado: (n: number): string => (n === 1 ? 'set publicado' : 'sets publicados'),
    aunNoHasPublicadoNada: 'Aún no has publicado nada',
    esteUsuarioNoTieneSetsPublicos: 'Este usuario no tiene sets públicos',
    creaTuPrimerSet:
      'Crea tu primer set con los valores que usas de verdad. Es lo que hace que alguien vuelva a tu perfil.',
    cuandoPubliqueUnSet: 'Cuando publique un set aparecerá aquí.',
    crearMiPrimerSet: 'Crear mi primer set',
    borradores: 'Borradores',
    soloLosVesTu: 'sólo los ves tú',
    favoritos: 'Favoritos',
    aunNoHasGuardadoNada: 'Aún no has guardado nada',
    cuandoVeasUnSet:
      'Cuando veas un set que te sirva de verdad, guárdalo desde su ficha. Aquí es donde vuelves a encontrarlo.',
    verLaPortada: 'Ver la portada',
  },
  notFound: {
    error404: 'Error 404',
    estoNoExiste: 'Esto no existe',
    body: 'El set puede haberse borrado, o ser un borrador que sólo ve su autor.',
    volverAlFeed: 'Volver al feed',
  },
  signOut: {
    saliendo: 'Saliendo…',
    cerrarSesion: 'Cerrar sesión',
  },
  auth: {
    escribeUnEmailValido: 'Escribe un email válido.',
    contrasenaMinimo: (n: number) => `La contraseña debe tener al menos ${n} caracteres.`,
    lasDosContrasenasNoCoinciden: 'Las dos contraseñas no coinciden.',
    faltaElCorreoDelCodigo: 'Falta el correo al que se envió el código.',
    elCodigoTieneSeisDigitos: 'El código tiene 6 dígitos.',
    xNoActivadoTodavia: 'El acceso con X no está activado todavía. Entra con tu correo mientras tanto.',
    xNoSeHaPodidoIniciar: 'No se ha podido iniciar el acceso con X.',
  },
  authErrores: {
    // Enlaces y códigos
    otpExpired: 'El enlace o el código ya se había usado o ha caducado. Son de un solo uso: pide uno nuevo.',
    otpDisabled: 'El acceso por correo está desactivado en el proyecto.',
    flowStateExpired: 'El proceso de acceso ha caducado. Empieza otra vez desde el principio.',
    flowStateNotFound:
      'No encontramos el proceso de acceso. Abre el enlace en el mismo navegador donde lo pediste, o usa el código de 6 dígitos.',

    // Límites
    overEmailSendRateLimit:
      'Se han enviado demasiados correos seguidos. Espera unos minutos antes de pedir otro enlace.',
    overRequestRateLimit: 'Demasiados intentos seguidos. Espera un momento y vuelve a probar.',
    overSmsSendRateLimit: 'Demasiados envíos seguidos. Espera un momento.',

    // Cuenta
    emailNotConfirmed: 'Tienes que confirmar tu correo antes de entrar.',
    emailAddressInvalid: 'Ese correo no es válido.',
    emailAddressNotAuthorized: 'Ese correo no está autorizado en este proyecto.',
    userNotFound: 'No hay ninguna cuenta con ese correo.',
    userBanned: 'Esta cuenta está bloqueada.',
    signupDisabled: 'El registro está cerrado en este momento.',
    invalidCredentials: 'Correo o contraseña incorrectos.',
    weakPassword: 'La contraseña es demasiado corta o demasiado fácil de adivinar.',
    userAlreadyExists: 'Ya existe una cuenta con ese correo. Entra en vez de crearla.',
    samePassword: 'La contraseña nueva es la misma que la anterior.',
    sessionNotFound: 'Tu sesión ha caducado. Pide otro enlace para cambiar la contraseña.',
    providerEmailNeedsVerification: 'Verifica el correo de tu cuenta antes de entrar.',

    // Proveedores
    providerDisabled: 'Ese proveedor de acceso está desactivado en el proyecto.',
    oauthProviderNotSupported: 'Ese proveedor de acceso no está disponible.',

    // Genéricos
    accessDenied: 'Se ha denegado el acceso. Pide un enlace nuevo e inténtalo otra vez.',
    invalidRequest: 'La petición de acceso venía incompleta. Pide un enlace nuevo.',
    validationFailed: 'Los datos del acceso no son válidos. Pide un enlace nuevo.',
    badJson: 'La respuesta del servidor de acceso no era válida.',
    badJwt: 'Tu sesión no es válida. Vuelve a entrar.',
    sessionExpired: 'Tu sesión ha caducado. Vuelve a entrar.',
    requestTimeout: 'El servidor de acceso ha tardado demasiado. Inténtalo otra vez.',
    captchaFailed: 'No se ha podido verificar el captcha.',
    serverError: 'El servidor de acceso ha fallado. Inténtalo de nuevo en un momento.',

    fallback: 'No se ha podido completar el acceso. Pide un enlace nuevo e inténtalo otra vez.',

    // Sólo llegan como texto, sin código (ver BY_TEXT en auth-errors.ts)
    pkceSoloMismoNavegador:
      'Ese enlace sólo funciona en el navegador desde el que lo pediste. Ábrelo ahí, o usa el código de 6 dígitos.',
    enlaceCorreoCaducado:
      'El enlace del correo ya se había usado o ha caducado. Son de un solo uso: pide uno nuevo.',
    codigoYaNoVale: 'El código ya no vale. Pide uno nuevo.',
    procesoAccesoCaducadoEmpiezaOtraVez: 'El proceso de acceso ha caducado. Empieza otra vez.',
    contrasenaMinimoOcho: 'La contraseña debe tener al menos 8 caracteres.',
    errorDeRed: 'No se ha podido conectar con el servidor de acceso. Comprueba tu conexión.',

    esperarSegundos: (seconds: number) =>
      `Por seguridad hay que esperar ${seconds} segundo${seconds === 1 ? '' : 's'} antes de pedir otro enlace.`,
  },
};
