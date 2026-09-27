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
    seElPrimero:
      'No one has commented on this set yet. Tap any number and be the first to say why.',
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
  login: {
    metaTitle: 'Sign in',
    metaDescription: 'Sign in to SlidersFC with your X account or your email.',
    heading: 'Sign in and publish your sliders',
    subheading: 'You need an account to publish sets and comment on other people\'s. Reading is free.',
    continuarConX: 'Continue with X',
    oConTuCorreo: 'or with your email',
    pestanaEntrar: 'Sign in',
    pestanaCrear: 'Create account',
    correo: 'Email',
    correoPlaceholder: 'you@email.com',
    contrasena: 'Password',
    contrasenaPlaceholderMinimo: 'At least 8 characters',
    repiteLaContrasena: 'Repeat the password',
    prefieroEnlacePorCorreo: 'I\'d rather have a link by email',
    olvidasteTuContrasena: 'Forgot your password?',
    unMomento: 'One moment…',
    crearMiCuenta: 'Create my account',
    entrar: 'Sign in',
    enviando: 'Sending…',
    enviarmeUnEnlace: 'Send me a link',
    volverALaContrasena: 'Back to the password',
    revisaTuCorreo: 'Check your email',
    confirmaTuCuenta: 'Confirm your account',
    teLoHemosEnviado: 'We\'ve sent it',
    confirmandoBodyInicio: 'Your account is created. Open the link we sent to ',
    confirmandoBodyFin: ' so you can sign in.',
    noConfirmandoBodyInicio: 'To ',
    noConfirmandoBodyFin: '. Open the link in this same browser and you\'ll go straight in.',
    elEnlaceNoFunciona: 'Link not working?',
    ayudaCodigo:
      'Type the 6-digit code from the email here. It works from any browser or device, and it doesn\'t get used up if your mail app opens the link on its own.',
    codigo: 'Code',
    comprobando: 'Checking…',
    entrarConElCodigo: 'Sign in with the code',
  },
  recuperar: {
    metaTitle: 'Recover password',
    heading: 'Forgot your password?',
    subheading: 'Type your email and we\'ll send you a link to set a new one.',
    enviado: 'Sent',
    miraTuCorreo: 'Check your email',
    siHayUnaCuentaConInicio: 'If there\'s an account with ',
    siHayUnaCuentaConFin: ', a link to set a new password will arrive.',
    volverAEntrar: 'Back to sign in',
    correo: 'Email',
    correoPlaceholder: 'you@email.com',
    enviando: 'Sending…',
    mandarmeElEnlace: 'Send me the link',
  },
  cuentaContrasena: {
    metaTitle: 'New password',
    heading: 'Set a new password',
    subheading: 'You\'ll sign in with it from now on. At least 8 characters.',
    contrasenaNueva: 'New password',
    contrasenaNuevaPlaceholder: 'At least 8 characters',
    repitela: 'Repeat it',
    guardando: 'Saving…',
    guardarYEntrar: 'Save and sign in',
  },
  authFinalizar: {
    metaTitle: 'Signing in',
    iniciandoSesion: 'Signing in…',
    noSeHaPodidoEntrar: 'Couldn\'t sign in',
    pedirOtroEnlace: 'Request another link',
    enlaceSinDatosDeSesion:
      'The link didn\'t carry any session data. This usually happens when it\'s opened in another browser, or when it has already expired: request a new one.',
  },
  perfil: {
    perfilNoEncontrado: 'Profile not found',
    editarPerfil: 'Edit profile',
    setPublicado: (n: number): string => (n === 1 ? 'set published' : 'sets published'),
    aunNoHasPublicadoNada: 'You haven\'t published anything yet',
    esteUsuarioNoTieneSetsPublicos: 'This user has no public sets',
    creaTuPrimerSet:
      'Create your first set with the values you actually use. It\'s what makes someone come back to your profile.',
    cuandoPubliqueUnSet: 'It will show up here once they publish a set.',
    crearMiPrimerSet: 'Create my first set',
    borradores: 'Drafts',
    soloLosVesTu: 'only you can see them',
    favoritos: 'Favorites',
    aunNoHasGuardadoNada: 'You haven\'t saved anything yet',
    cuandoVeasUnSet:
      'When you see a set that really works for you, save it from its page. This is where you\'ll find it again.',
    verLaPortada: 'See the front page',
  },
  notFound: {
    error404: 'Error 404',
    estoNoExiste: 'This doesn\'t exist',
    body: 'The set may have been deleted, or it could be a draft only its author can see.',
    volverAlFeed: 'Back to the feed',
  },
  signOut: {
    saliendo: 'Signing out…',
    cerrarSesion: 'Sign out',
  },
  auth: {
    escribeUnEmailValido: 'Type a valid email.',
    contrasenaMinimo: (n: number) => `The password must be at least ${n} characters.`,
    lasDosContrasenasNoCoinciden: 'The two passwords don\'t match.',
    faltaElCorreoDelCodigo: 'Missing the email the code was sent to.',
    elCodigoTieneSeisDigitos: 'The code has 6 digits.',
    xNoActivadoTodavia: 'Signing in with X isn\'t enabled yet. Sign in with your email in the meantime.',
    xNoSeHaPodidoIniciar: 'Couldn\'t start signing in with X.',
  },
  authErrores: {
    // Links and codes
    otpExpired: 'That link or code had already been used, or it expired. They\'re single-use: request a new one.',
    otpDisabled: 'Sign-in by email is disabled on this project.',
    flowStateExpired: 'The sign-in process has expired. Start again from the beginning.',
    flowStateNotFound:
      'We couldn\'t find the sign-in process. Open the link in the same browser you requested it from, or use the 6-digit code.',

    // Limits
    overEmailSendRateLimit: 'Too many emails sent in a row. Wait a few minutes before requesting another link.',
    overRequestRateLimit: 'Too many attempts in a row. Wait a moment and try again.',
    overSmsSendRateLimit: 'Too many messages sent in a row. Wait a moment.',

    // Account
    emailNotConfirmed: 'You need to confirm your email before signing in.',
    emailAddressInvalid: 'That email isn\'t valid.',
    emailAddressNotAuthorized: 'That email isn\'t authorized on this project.',
    userNotFound: 'There\'s no account with that email.',
    userBanned: 'This account is blocked.',
    signupDisabled: 'Sign-ups are closed right now.',
    invalidCredentials: 'Wrong email or password.',
    weakPassword: 'The password is too short or too easy to guess.',
    userAlreadyExists: 'An account with that email already exists. Sign in instead of creating it.',
    samePassword: 'The new password is the same as the old one.',
    sessionNotFound: 'Your session has expired. Request another link to change your password.',
    providerEmailNeedsVerification: 'Verify your account\'s email before signing in.',

    // Providers
    providerDisabled: 'That sign-in provider is disabled on this project.',
    oauthProviderNotSupported: 'That sign-in provider isn\'t available.',

    // Generic
    accessDenied: 'Access was denied. Request a new link and try again.',
    invalidRequest: 'The sign-in request was incomplete. Request a new link.',
    validationFailed: 'The sign-in data isn\'t valid. Request a new link.',
    badJson: 'The sign-in server\'s response wasn\'t valid.',
    badJwt: 'Your session isn\'t valid. Sign in again.',
    sessionExpired: 'Your session has expired. Sign in again.',
    requestTimeout: 'The sign-in server took too long. Try again.',
    captchaFailed: 'Couldn\'t verify the captcha.',
    serverError: 'The sign-in server failed. Try again in a moment.',

    fallback: 'Couldn\'t complete the sign-in. Request a new link and try again.',

    // Only ever arrive as plain text, with no code (see BY_TEXT in auth-errors.ts)
    pkceSoloMismoNavegador:
      'That link only works in the browser you requested it from. Open it there, or use the 6-digit code.',
    enlaceCorreoCaducado: 'The link in the email had already been used, or it expired. They\'re single-use: request a new one.',
    codigoYaNoVale: 'That code no longer works. Request a new one.',
    procesoAccesoCaducadoEmpiezaOtraVez: 'The sign-in process has expired. Start again.',
    contrasenaMinimoOcho: 'The password must be at least 8 characters.',
    errorDeRed: 'Couldn\'t connect to the sign-in server. Check your connection.',

    esperarSegundos: (seconds: number) =>
      `For security, wait ${seconds} second${seconds === 1 ? '' : 's'} before requesting another link.`,
  },
};

export { en };
