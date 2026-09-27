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
  setForm: {
    titulo: 'Título',
    tituloPlaceholder: 'Full manual · Leyenda · 8 min',
    juego: 'Juego',
    juegoNoSePuedeCambiar: 'El juego no se puede cambiar después de crear el set.',
    descripcion: 'Descripción',
    descripcionPlaceholder:
      'Cómo se comporta el partido con estos valores, y qué controles usas. Lo de la dificultad, los tiempos y la cámara va aquí abajo.',
    comoLoJuegas: 'Cómo lo juegas',
    comoLoJuegasAyuda:
      'Opcional, pero es lo que hace que tus valores signifiquen lo mismo para quien los copie.',
    dificultad: 'Dificultad',
    sinEspecificar: 'Sin especificar',
    duracionDeCadaTiempo: 'Duración de cada tiempo',
    duracionPlaceholder: '8',
    duracionAyuda: 'En minutos. Si juegas con un rango, ponlo: 7-8.',
    camara: 'Cámara',
    camaraPlaceholder: 'Co-op',
    altura: 'Altura',
    zoom: 'Zoom',
    valores: 'Valores',
    slidersSinTocar: (n: number) => `${n} sliders. Lo que no toques se queda en su valor por defecto.`,
    desplegarTodo: 'Desplegar todo',
    plegarTodo: 'Plegar todo',
    restablecer: 'Restablecer',
    comportamientoCpuAyuda:
      'Cómo se comporta la CPU. Los sliders de abajo sólo se usan en «Personalizado»; en los otros dos los ajusta el juego según los equipos.',
    queHasCambiado: 'Qué has cambiado',
    queHasCambiadoPlaceholder:
      'Bajé la velocidad dos puntos: los contragolpes eran imposibles de defender.',
    queHasCambiadoAyuda:
      'Opcional. Si tocas algún valor, esto queda en el historial del set junto a lo que has cambiado. Es lo que convierte una lista de números en algo que se entiende.',
    guardando: 'Guardando…',
    guardarBorrador: 'Guardar borrador',
    borradorSoloTuLoVes: 'Un borrador sólo lo ves tú hasta que lo publiques.',
    publicarSet: 'Publicar set',
    guardarCambios: 'Guardar cambios',
  },
  importPanel: {
    pegarUnSetEscrito: 'Pegar un set escrito',
    cerrar: 'Cerrar',
    ayuda:
      'De Notion, de un mensaje, de donde sea. Un slider por línea, con su nombre y uno o dos valores. Si sólo pones un valor, va a los dos lados.',
    placeholder: 'Velocidad\t35\t35\nAceleración\t48\t50\nMarcaje: usuario 65, CPU 70',
    textoDelSet: 'Texto del set',
    reconocidos: (total: number) => `de ${total} sliders reconocidos.`,
    sinReconocer: 'Sin reconocer',
    yLineasMas: (n: number) => `y ${n} línea(s) más.`,
    valoresFueraDeRango: (n: number) =>
      `${n} ${n === 1 ? 'valor estaba' : 'valores estaban'} fuera del rango del juego y se ${n === 1 ? 'ha' : 'han'} recortado.`,
    rellenarConEsto: 'Rellenar con esto',
    vaciar: 'Vaciar',
    loQueNoSeReconozca: 'Lo que no se reconozca se queda como está. Puedes retocarlo después.',
  },
  sliderControl: {
    valorAria: (ariaLabel: string) => `${ariaLabel} (valor)`,
    unoMenos: (ariaLabel: string) => `${ariaLabel}: uno menos`,
    unoMas: (ariaLabel: string) => `${ariaLabel}: uno más`,
  },
  nuevoSet: {
    metaTitle: 'Nuevo set',
    metaDescription: 'Publica tu set de sliders en SlidersFC.',
    faltaCatalogoTitulo: 'Falta el catálogo de sliders',
    faltaCatalogoBody:
      'No hay juegos en la base de datos. Aplica los ficheros de supabase/seed antes de crear sets.',
    eyebrow: 'Nuevo set',
    titulo: 'Publica tus sliders',
    intro:
      'Cuenta en la descripción con qué dificultad y duración de tiempos juegas: sin eso, los valores no significan lo mismo para quien los copie.',
  },
  editarSet: {
    metaTitle: 'Editar set',
    eyebrow: 'Editar set',
    yaPublicado: (nextVersion: number, currentVersion: number) =>
      `Este set ya está publicado. Si cambias algún valor, la versión pasará a v${nextVersion} y los comentarios anteriores quedarán marcados como «de la v${currentVersion}». La dirección del set no cambia.`,
  },
  perfilForm: {
    asiTeVeran: 'Así te verán',
    cambiarLaFoto: 'Cambiar la foto',
    cambiar: 'Cambiar',
    quitar: 'Quitar',
    sinBiografia: 'Sin biografía. Lo que escribas abajo sale aquí.',
    ayudaFoto:
      'Pincha en la foto para cambiarla. Se recorta en cuadrado y se guarda a 512 px: JPG, PNG o WEBP.',
    nombre: 'Nombre',
    nombrePlaceholder: 'Full Manual FG',
    nombreAyuda: 'Como quieres que te llamen. Si lo dejas vacío, sale tu nombre de usuario.',
    nombreDeUsuario: 'Nombre de usuario',
    usernamePlaceholder: 'fullmanualfg',
    renombradoAyuda:
      'Cambia la dirección de tu perfil y la de todos tus sets. Los enlaces que ya hayas compartido seguirán funcionando: llevarán a la nueva.',
    usernameAyuda: 'Minúsculas, números y guión bajo. Es lo que aparece en la dirección de tus sets.',
    biografia: 'Biografía',
    biografiaPlaceholder:
      'Cómo juegas: dificultad, duración de los tiempos, cámara, mando o teclado. Es lo que da sentido a tus valores.',
    cuentaDeX: 'Cuenta de X',
    twitterPlaceholder: 'FullManualFG',
    twitterAyuda: 'Puedes pegar el enlace entero; se queda con el nombre.',
    canalDeYoutube: 'Canal de YouTube',
    youtubePlaceholder: '@FullManualFG',
    youtubeAyudaMalo: 'Eso no parece un canal. Pega el enlace de tu canal, o tu @nombre.',
    youtubeAyudaNormal:
      'Tu @nombre o el enlace del canal. El de un vídeo no vale: tiene que ser el canal.',
    guardando: 'Guardando…',
    guardarPerfil: 'Guardar perfil',
    cancelar: 'Cancelar',
    faltaAlmacen: 'Falta crear el almacén de avatares en Supabase (supabase/storage/01_avatars.sql).',
    fotoDemasiadoGrande: 'La foto pesa demasiado incluso reducida. Prueba con otra.',
    sinPermiso: 'No tienes permiso para subir la foto. Vuelve a entrar e inténtalo otra vez.',
    noSeHaPodidoSubir: 'No se ha podido subir la foto.',
  },
  cuentaPerfil: {
    metaTitle: 'Editar perfil',
    eyebrow: 'Tu ficha',
    titulo: 'Editar perfil',
    intro:
      'Quien abre un set tuyo quiere saber quién lo firma y cómo juega. Es lo que separa unos valores sueltos de unos valores en los que fiarse.',
  },
  perfilErrores: {
    usernameCorto: 'El nombre de usuario necesita al menos 3 caracteres.',
    usernameInvalido: (max: number) =>
      `El nombre de usuario sólo admite letras sin acentos, números y guión bajo, y como mucho ${max} caracteres.`,
    nombreLargo: (max: number) => `El nombre no puede pasar de ${max} caracteres.`,
    biografiaLarga: (max: number) => `La biografía no puede pasar de ${max} caracteres.`,
    twitterInvalido: (max: number) =>
      `La cuenta de X sólo admite letras, números y guión bajo (${max} como mucho).`,
    youtubeNoSeReconoce: 'El canal de YouTube no se reconoce. Pega el enlace de tu canal o tu @nombre.',
    youtubeDemasiadoLargo: 'El enlace del canal es demasiado largo.',
    fotoDesdeAqui: 'La foto tiene que subirse desde aquí.',
  },

  setAccionesErrores: {
    tituloLongitud: 'El título debe tener entre 3 y 120 caracteres.',
    descripcionLongitud: 'La descripción no puede pasar de 2000 caracteres.',
    elegirJuegoValido: 'Elige un juego válido.',
    notaLongitud: 'La nota del cambio no puede pasar de 500 caracteres.',
    sinValores: 'No se han recibido valores de sliders.',
    sliderFueraDeCatalogo: 'Hay un slider que no pertenece al juego seleccionado. Recarga la página.',
    valorFueraDeRango: (name: string, min: number, max: number) =>
      `"${name}" debe estar entre ${min} y ${max}.`,
    iniciarSesionParaCrear: 'Tienes que iniciar sesión para crear un set.',
    noCreado: 'No se ha podido crear el set.',
    iniciarSesion: 'Tienes que iniciar sesión.',
    setNoExiste: 'Este set ya no existe.',
    soloAutorEdita: 'Sólo el autor puede editar este set.',
    juegoNoSePuedeCambiar: 'No se puede cambiar el juego de un set ya creado.',
    noCopiaCreada: 'No se ha podido crear la copia.',
    soloAutorCopia: 'Sólo el autor puede copiar su set.',
    juegoNoExiste: 'Ese juego no existe.',
    yaEsDeEseJuego: 'El set ya es de ese juego.',
    ningunValorEncaja: 'Ningún valor de este set encaja en ese juego.',
  },
  comentarioErrores: {
    faltaSet: 'Falta el set al que comentar.',
    escribeAlgo: 'Escribe algo antes de enviar.',
    longitudMaxima: 'El comentario no puede pasar de 2000 caracteres.',
    sliderNoValido: 'Slider no válido.',
    iniciarSesion: 'Tienes que iniciar sesión para comentar.',
    setNoExiste: 'Este set ya no existe.',
  },
  favoritoErrores: {
    iniciarSesion: 'Tienes que iniciar sesión para guardar sets.',
  },
  guia: {
    metaTitle: 'Qué lleva un set',
    metaDescription:
      'Todo lo que se puede contar de un set de sliders en SlidersFC, campo por campo, y por qué cada cosa importa.',
    ogTitle: 'Qué lleva un set — SlidersFC',
    ogDescription: 'Campo por campo, qué se puede contar de un set de sliders y por qué importa.',
    titulo: 'Qué lleva un set',
    intro:
      'Un set de sliders son unos números, y unos números solos no le sirven a nadie. Esto es todo lo que se puede contar de un set aquí, campo por campo, y por qué cada cosa importa. Casi nada es obligatorio: cuanto más pongas, más útil le resulta a quien se lo lleve.',
    obligatorio: 'Obligatorio',
    loBasicoTitulo: 'Lo básico',
    tituloNombre: 'Título',
    tituloBodyInicio:
      'Lo que se ve en la lista y lo que se comparte. Es lo único que se pide de verdad, junto con el juego. Un buen título ya dice a quién va dirigido: ',
    tituloEjemplo: '«Full manual · Leyenda · 8 min»',
    tituloBodyFin: ' se entiende sin abrirlo.',
    juegoNombre: 'Juego',
    juegoBody:
      'FC 27 o FC 26. No se puede cambiar después de crear el set, porque los valores cuelgan de la lista de sliders de ese juego y no son la misma lista. Si quieres llevarte un set al juego nuevo, en su ficha hay un botón que lo copia y empareja lo que encaja.',
    descripcionNombre: 'Descripción',
    descripcionBody:
      'Para qué sirve el set y cómo se comporta el partido con él. También los controles que usas: manual o asistido cambia el resultado tanto como cualquier slider.',
    borradorPublicadoNombre: 'Borrador o publicado',
    borradorPublicadoBody:
      'Un borrador sólo lo ves tú. Sirve para ir afinando sin que nadie lo vea a medias, y para compararlo con otro mientras lo trabajas.',
    comoLoJuegasTitulo: 'Cómo lo juegas',
    opcionalPeroFalta: 'Opcional, pero es lo que más falta hace',
    comoLoJuegasIntro:
      'Los mismos valores en otra dificultad no dan el mismo partido. Sin esto, quien copie tu set no sabe si le va a funcionar.',
    dificultadNombre: 'Dificultad',
    dificultadBodyInicio: 'Las seis del juego: ',
    dificultadBodyFin:
      '. Es lo que más cambia el comportamiento de la CPU, muy por encima de cualquier slider suelto.',
    duracionNombre: 'Duración de cada tiempo',
    duracionBodyInicio:
      'En minutos. Se puede poner un rango si juegas con uno —',
    duracionCodigo: '7-8',
    duracionBodyFin:
      '— porque mucha gente no usa siempre el mismo. La duración manda en el ritmo: unos valores afinados a 6 minutos se desmontan a 15.',
    camaraNombre: 'Cámara',
    camaraBodyInicio:
      'El nombre y, si los ajustas, su altura y su zoom —las dos van de 0 a 20—. El campo sugiere las del juego (',
    camaraBodyFin:
      '…) pero admite cualquier cosa, porque cada menú las llama a su manera. Lo único que se pide es que si pones altura o zoom digas de qué cámara, porque unos números sueltos no dicen nada.',
    losValoresTitulo: 'Los valores',
    elGruesoDelSet: 'El grueso del set',
    losValoresIntro:
      'FC 27 trae 65 sliders y FC 26, 29. Salen en el orden exacto del menú del juego, para que puedas ir metiéndolos mientras los consultas.',
    asiSeLee: 'Así se lee',
    notaMarcaGris:
      'La marca gris es lo que trae el juego de fábrica. Cuando tu muesca la tapa, ese slider está sin tocar; cuando se separa, ahí has metido mano. En la primera fila coinciden los tres.',
    ladosNombre: 'Lados',
    ladosBody:
      'Casi todos los sliders van por duplicado: lo que se aplica a tu equipo y lo que se aplica a la CPU. Alguno es sólo tuyo, como la barra de potencia, y sale con un guion en el lado de la CPU.',
    maestrosNombre: 'Los cuatro maestros',
    maestrosBody:
      'En FC 27, encima de los tiros y de los pases hay cuatro reguladores que escalan el grupo entero. El juego pide dejarlos en 50 y tocar sólo los de cada tipo — si los mueves, tus valores no significan lo mismo en otra consola, así que van guardados como cualquier otro.',
    pegarNombre: 'Pegar un set escrito',
    pegarBody:
      'En vez de teclear 129 valores, se puede pegar el texto tal como lo tengas: una tabla de Notion, un mensaje, una lista con viñetas. Antes de aplicar nada se ve qué ha entendido y qué líneas no ha reconocido.',
    soloFc27: 'Sólo FC 27',
    comportamientoCpuIntro:
      'FC 27 deja elegir cómo se comporta la CPU, y sólo en uno de los tres modos sirven de algo los sliders de esa pestaña.',
    comportamientoCpuOutro:
      'Si eliges táctico o dinámico, esos dieciséis sliders desaparecen de la ficha: enseñarlos sería decir que tu set toca cosas que no toca. Tus valores no se borran — vuelven al poner personalizado.',
    loQueAportaTitulo: 'Lo que aporta la gente',
    despuesDePublicar: 'Después de publicar',
    comentariosValorNombre: 'Comentarios valor a valor',
    comentariosValorBody:
      'Cada número abre su propio hilo. Es la razón de ser de esto: no «me gusta tu set», sino «ese 35 de velocidad a mí se me queda corto con equipos de segunda». El comentario vive pegado a la muesca de la que habla.',
    comentariosGeneralesNombre: 'Comentarios generales',
    comentariosGeneralesBody: 'Para lo que no va de un valor concreto, debajo del todo.',
    versionesNombre: 'Versiones',
    versionesBody:
      'Si cambias valores de un set ya publicado, los comentarios anteriores se marcan como de la versión antigua. Nadie queda respondiendo a unos números que ya no están.',
    loQueSaleSoloTitulo: 'Lo que sale solo',
    noHayQueRellenarlo: 'No hay que rellenarlo',
    direccionNombre: 'La dirección',
    direccionCodigo: '/u/tu-nombre/el-titulo-del-set',
    direccionBodyFin:
      ', generada del título. No cambia aunque cambies el título después, para que un enlace compartido no se rompa. Y si cambias tu nombre de usuario, el antiguo sigue llevando al sitio.',
    imagenNombre: 'La imagen para compartir',
    imagenBody:
      'Al pegar el enlace en WhatsApp o en X sale una tarjeta con los valores dibujados, no un recuadro vacío. Se genera sola con el contenido del set.',
    verLosQueHay: 'Ver los que hay',
    sampleVelocidad: 'Velocidad',
    sampleErrorTiros: 'Error en tiros de calidad',
    sampleAlturaLinea: 'Altura de la línea',
  },
};
