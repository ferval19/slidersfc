/**
 * Las guías de modo carrera.
 *
 * Cada una es una página HTML entera y autónoma —con su tipografía, sus
 * colores y su pizarra— que vive en `src/content/modo-carrera/<slug>.html` y
 * se sirve tal cual desde `/modo-carrera/<slug>`. No pasan por el layout de la
 * web: su CSS toca `body`, `h1` y compañía, y metido dentro de la pizarra
 * verde se pelearían los dos diseños.
 *
 * Esta lista es lo único que hay que tocar para añadir una: el fichero HTML
 * con el mismo slug y una entrada aquí. El índice, el sitemap y la ruta salen
 * de ella. Están escritas en castellano y no se traducen; en inglés se enseñan
 * igual, con la canónica apuntando a la castellana.
 */
export type GuiaModoCarrera = {
  slug: string;
  titulo: string;
  resumen: string;
  equipo: string;
  juego: string;
  /** El arco de la partida, tal como lo cuenta la guía. */
  temporadas: string;
  /** ISO, para ordenar y para el sitemap. */
  publicada: string;
  /** Los colores del club, para las rayas de la tarjeta del índice. */
  colores: [string, string];
  /**
   * Lo que pinta la imagen para compartir. Copia la portada de la guía —su
   * fondo, su titular partido en dos y sus marcadores— para que el enlace
   * pegado en X o en WhatsApp ya se parezca a lo que se va a abrir.
   */
  portada: {
    fondo: string;
    fondoProfundo: string;
    /** La segunda línea va resaltada, como en la guía. */
    titular: [string, string];
    antetitulo: string;
    sello: { grande: string; pequeno: string };
    marcadores: { etiqueta: string; valor: string; detalle: string }[];
  };
};

export const GUIAS_MODO_CARRERA: GuiaModoCarrera[] = [
  {
    slug: 'el-ultimo-baile-del-cholo',
    titulo: 'El último baile del Cholo',
    resumen:
      'Las tácticas reales de Simeone pasadas al juego, el papel de cada jugador, los fichajes que suenan de verdad y una historia de cuatro temporadas para cerrar una era.',
    equipo: 'Atlético de Madrid',
    juego: 'FC 27',
    temporadas: '2026 — 2030',
    publicada: '2026-10-30',
    colores: ['#cc2e24', '#ffffff'],
    portada: {
      fondo: '#1b2a5c',
      fondoProfundo: '#0f1a3d',
      titular: ['El último baile', 'del Cholo'],
      antetitulo: 'Modo carrera · EA Sports FC 27 · Atlético de Madrid',
      sello: { grande: 'Cholo', pequeno: 'FC 27' },
      marcadores: [
        { etiqueta: 'Banquillo', valor: '16.ª', detalle: 'temporada de Simeone' },
        { etiqueta: 'Contrato', valor: '30·06·27', detalle: 'fin del vínculo' },
        { etiqueta: 'Pizarra', valor: '4', detalle: 'planes tácticos' },
        { etiqueta: 'La partida', valor: '2026—30', detalle: 'cuatro temporadas' },
      ],
    },
  },
];

export function guiasOrdenadas(): GuiaModoCarrera[] {
  return [...GUIAS_MODO_CARRERA].sort((a, b) => b.publicada.localeCompare(a.publicada));
}

export function guiaPorSlug(slug: string): GuiaModoCarrera | undefined {
  return GUIAS_MODO_CARRERA.find((guia) => guia.slug === slug);
}
