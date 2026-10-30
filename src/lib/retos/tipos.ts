/**
 * La forma de un reto de modo carrera.
 *
 * Un reto es un **documento**, no datos relacionales: una portada, un puñado
 * de secciones y las listas que cuelgan de cada una. Por eso vive como un
 * fichero tipado en `src/content/retos/` y no repartido en tablas de Supabase.
 * Si algún día publican retos otras personas, este mismo tipo pasa tal cual a
 * una columna `jsonb`; por eso aquí sólo hay datos serializables —cadenas,
 * números, listas—, nada de JSX ni funciones.
 *
 * Los textos largos (`Texto`) admiten un markdown mínimo: `**negrita**`,
 * `*cursiva*` y `[enlace](https://…)`. Nada más: lo justo para lo que usaba
 * el HTML original, y fácil de escapar.
 *
 * Los retos están escritos en castellano y no se traducen. Los rótulos fijos
 * de la plantilla («Ordenar», «Potencial»…) también van en castellano, para
 * no mezclar idiomas dentro del mismo documento.
 */

/** Texto con markdown mínimo: `**negrita**`, `*cursiva*`, `[enlace](url)`. */
export type Texto = string;

/** Los iconos del juego de la plantilla. Uno por símbolo del sprite. */
export type Icono =
  | 'pizarra'
  | 'play'
  | 'calendario'
  | 'adn'
  | 'camiseta'
  | 'traspaso'
  | 'libro'
  | 'reglas'
  | 'enlace'
  | 'trofeo'
  | 'silbato'
  | 'escudo'
  | 'rayo'
  | 'flechas'
  | 'diana'
  | 'cambio'
  | 'bandera'
  | 'ojo'
  | 'reloj'
  | 'grupo'
  | 'pluma'
  | 'brote'
  | 'moneda'
  | 'alerta'
  | 'charla'
  | 'mando';

/** Código ISO 3166-1 alfa-2 en mayúsculas. Cada uno necesita su SVG en `banderas.ts`. */
export type Pais = string;

/** Las posiciones con el nombre que usa el juego en castellano. */
export type Posicion =
  | 'POR'
  | 'DFC'
  | 'LD'
  | 'LI'
  | 'CAD'
  | 'CAI'
  | 'MCD'
  | 'MC'
  | 'MD'
  | 'MI'
  | 'MCO'
  | 'ED'
  | 'EI'
  | 'SD'
  | 'DC';

/** Las cuatro líneas por las que se filtra la plantilla. */
export type Linea = 'POR' | 'DEF' | 'MED' | 'DEL';

// --- Tema ------------------------------------------------------------------

/**
 * Cómo viste el club. Las rayas verticales eran del Atleti, no de la
 * plantilla: un equipo a aros, a mitades o liso tiene que poder verse igual de
 * suyo. El patrón se pinta en la portada, en el sello, en las tarjetas del
 * índice y en la imagen para compartir.
 */
export type Patron = 'rayas' | 'aros' | 'mitades' | 'banda' | 'liso';

export type Tema = {
  /** Fondo de la portada y de la barra de secciones, y color de los titulares. */
  primario: string;
  /** La versión oscura: barra de navegación, marcadores, sello. */
  primarioProfundo: string;
  /** El único acento fuerte: números de sección, iconos, botones. */
  acento: string;
  acentoProfundo: string;
  /** Fondo de la página. Cálido, no blanco puro. */
  papel: string;
  tinta: string;
  /** La camiseta: patrón y sus dos colores (en `liso` sólo cuenta el primero). */
  camiseta: { patron: Patron; colores: [string, string] };
};

// --- Bloques sueltos ---------------------------------------------------------

export type Tarjeta = { icono?: Icono; titulo: string; texto: Texto };

/** La cabecera numerada de cada sección. El número lo pone el orden. */
export type Cabecera = {
  titulo: string;
  /** El rótulo corto en la barra de navegación; si falta, `titulo`. */
  nav?: string;
  icono: Icono;
  entradilla?: Texto;
};

// --- Secciones ---------------------------------------------------------------

export type Hito = { fecha: string; titulo: string; texto: Texto };

export type Movimiento = {
  jugador: string;
  tipo: 'llega' | 'sale' | 'cedido';
  detalle: string;
};

export type SeccionContexto = {
  tipo: 'contexto';
  cabecera: Cabecera;
  hitos: Hito[];
  movimientos?: { titulo: string; filas: Movimiento[] };
  notas?: Tarjeta[];
};

export type SeccionPrincipios = {
  tipo: 'principios';
  cabecera: Cabecera;
  items: Tarjeta[];
};

export type Video = {
  etiqueta: string;
  /** `rojo` para destacarla; por defecto, neutra. */
  tono?: 'rojo';
  titulo: string;
  url: string;
  puntos: Texto[];
  /** Código de táctica compartida del juego, si el vídeo da uno. */
  codigoTactica?: string;
  nota?: Texto;
};

export type Cifra = {
  valor: string;
  texto: string;
  /** Porcentajes de 0 a 100. Dos barras para comparar (39 % frente a 35 %). */
  barras: number[];
};

export type SeccionVideos = {
  tipo: 'videos';
  cabecera: Cabecera;
  videos: Video[];
  cifras?: { titulo: string; items: Cifra[] };
  claves?: { titulo: string; items: { titulo: string; texto: Texto }[] };
};

export type Titular = {
  /** El `id` de un jugador de la sección `plantilla`. */
  jugador: string;
  pos: Posicion;
  /** Posición en el campo, en % del ancho (izquierda → derecha). */
  x: number;
  /** Posición en el campo, en % del alto (portería rival arriba = 0). */
  y: number;
  /** El rol tal como sale en el juego, p. ej. «False 9 (Attack)». */
  rol: string;
  tarea: string;
};

export type Plan = {
  /** «A», «B»… Va en la pestaña: «Plan A · base». */
  clave: string;
  /** Lo que sigue a la clave en la pestaña: «base», «cerrar»… */
  uso: string;
  nombre: string;
  formacion: string;
  creacion: string;
  enfoque: string;
  alturaLinea: string;
  cuando: Texto;
  fuente: Texto;
  once: Titular[];
};

export type SeccionPizarra = {
  tipo: 'pizarra';
  cabecera: Cabecera;
  planes: Plan[];
  cambios?: { titulo: string; items: Tarjeta[] };
};

export type Jugador = {
  /** Corto y estable: lo usan los `once` de la pizarra. */
  id: string;
  nombre: string;
  /** Cómo se rotula en la pizarra si `nombre` no cabe: «Cuti Romero», «Julián». */
  corto?: string;
  pos: Posicion;
  linea: Linea;
  edad: number;
  media: number;
  potencial: number;
  pais?: Pais;
  historia: string;
  decision: string;
};

export type SeccionPlantilla = {
  tipo: 'plantilla';
  cabecera: Cabecera;
  jugadores: Jugador[];
  /**
   * Las cifras de arriba se calculan solas (media del once del primer plan,
   * media de la plantilla, el mejor y el de más margen). Esto sólo cambia el
   * texto del mejor, por si hay que matizarlo.
   */
  notaMejor?: string;
  cedidos?: Texto;
  fuente?: Texto;
};

export type Objetivo = {
  nombre: string;
  pos: Posicion;
  /** `null` cuando es un perfil y no un nombre: «Un lateral izquierdo». */
  club: string | null;
  edad: number | null;
  media: number | null;
  potencial: number | null;
  pais?: Pais;
  /** `null` = precio sin publicar. */
  precio: string | null;
  encaje: string;
  ventana: string;
  tono?: 'rojo' | 'verde' | 'ambar';
  fuente: { nombre: string; url: string };
};

export type SeccionMercado = {
  tipo: 'mercado';
  cabecera: Cabecera;
  necesidades: string[];
  objetivos: Objetivo[];
  perfilOjeo?: { titulo: string; texto: Texto };
};

export type Temporada = {
  /** «T1». Va en grande, de fondo. */
  marca: string;
  rotulo: string;
  titulo: string;
  objetivo: string;
  actos: { titulo: string; texto: Texto }[];
  bifurcacion?: { si: { titulo: string; texto: Texto }; no: { titulo: string; texto: Texto } };
  /** La última temporada se pinta distinta. */
  final?: boolean;
};

export type SeccionSaga = {
  tipo: 'saga';
  cabecera: Cabecera;
  prologo?: (Tarjeta & { fecha: string })[];
  temporadas: Temporada[];
  escenas?: { titulo: string; items: { icono: Icono; texto: Texto }[] };
};

export type SeccionReglas = {
  tipo: 'reglas';
  cabecera: Cabecera;
  items: (Tarjeta & { icono: Icono })[];
};

export type Seccion =
  | SeccionContexto
  | SeccionPrincipios
  | SeccionVideos
  | SeccionPizarra
  | SeccionPlantilla
  | SeccionMercado
  | SeccionSaga
  | SeccionReglas;

// --- El reto entero ----------------------------------------------------------

export type Reto = {
  slug: string;
  titulo: string;
  /** Una o dos frases. Meta descripción, tarjeta del índice y entradilla de la imagen. */
  resumen: string;
  equipo: string;
  juego: string;
  /** El arco de la partida: «2026 — 2030». */
  temporadas: string;
  /** ISO. Para ordenar el índice y para el sitemap. */
  publicada: string;
  /** El aviso bajo la portada: de cuándo son los datos. */
  notaDatos: string;
  tema: Tema;

  portada: {
    antetitulo: string;
    /** La segunda línea va resaltada. */
    titular: [string, string];
    entradilla: Texto;
    sello: {
      grande: string;
      pequeno: string;
      /** El texto que da vueltas alrededor del sello. */
      anillo: string;
    };
    marcadores: { etiqueta: string; valor: string; detalle: string }[];
    /** La cinta que corre bajo los marcadores. */
    cinta: string[];
  };

  /** Código de desafío de Manager Live, si lo hay. */
  desafio?: { codigo: string; texto: Texto };

  /** El `slug` de un set de sliders publicado que va bien con el reto. */
  setRecomendado?: { usuario: string; slug: string };

  secciones: Seccion[];

  fuentes: Texto[];
  aviso: Texto;
};
