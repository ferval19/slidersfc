import type { Reto } from '../../lib/retos/tipos';

/**
 * El primer reto: las tácticas reales de Simeone pasadas a FC 27, con el
 * Atlético de Madrid. Es el documento que antes vivía como HTML a mano; los
 * textos están copiados tal cual.
 */
export const reto: Reto = {
  slug: 'el-ultimo-baile-del-cholo',
  titulo: 'El último baile del Cholo',
  resumen:
    'Las tácticas reales de Simeone pasadas al juego, el papel de cada jugador, los fichajes que suenan de verdad y una historia de cuatro temporadas para cerrar una era.',
  equipo: 'Atlético de Madrid',
  juego: 'FC 27',
  temporadas: '2026 — 2030',
  publicada: '2026-10-30',
  notaDatos:
    'Datos reales a 30 de octubre de 2026. Proyecto de aficionado, sin relación con el club ni con EA Sports.',
  tema: {
    primario: '#1b2a5c',
    primarioProfundo: '#0f1a3d',
    acento: '#cc2e24',
    acentoProfundo: '#9f2219',
    papel: '#f6f2ea',
    tinta: '#141a33',
    camiseta: { patron: 'rayas', colores: ['#cc2e24', '#ffffff'] },
  },

  portada: {
    antetitulo: 'Modo carrera · EA Sports FC 27 · Atlético de Madrid',
    titular: ['El último baile', 'del Cholo'],
    entradilla:
      'La biblia de tu partida: las tácticas reales de Simeone pasadas al juego, el papel de cada jugador, los fichajes que suenan de verdad y una historia de cuatro temporadas para cerrar una era.',
    sello: {
      grande: 'Cholo',
      pequeno: 'FC 27',
      anillo: 'EL ÚLTIMO BAILE · TEMPORADA 16 · 2026 — 2030',
    },
    marcadores: [
      { etiqueta: 'Banquillo', valor: '16.ª', detalle: 'temporada de Simeone' },
      { etiqueta: 'Contrato', valor: '30·06·27', detalle: 'fin del vínculo actual' },
      { etiqueta: 'LaLiga', valor: '2.º · 22', detalle: 'puntos antes de la jornada 10' },
      { etiqueta: 'Pizarra', valor: '4', detalle: 'planes para guardar en el juego' },
    ],
    cinta: [
      'Modo carrera',
      'EA Sports FC 27',
      'Temporada 16 del Cholo',
      'Contrato hasta el 30·06·2027',
      'Objetivo: un título',
      '2026 — 2030',
      'Cuatro planes',
      'El último baile',
    ],
  },

  desafio: {
    codigo: 'KI3F-W7QT-LO0K',
    texto:
      'Mete este código en los desafíos de Manager Live y juega la partida desde el mismo punto de partida que cuenta esta guía.',
  },

  secciones: [
    // 01 CONTEXTO
    {
      tipo: 'contexto',
      cabecera: {
        titulo: 'Punto de partida',
        nav: 'Contexto',
        icono: 'calendario',
        entradilla:
          'El Atleti arranca la 26/27 con plantilla nueva, el Cholo en el último año de contrato y dos finales que se le escaparon. Eso es oro para el lore.',
      },
      hitos: [
        {
          fecha: '18 abr 2026',
          titulo: 'La Cartuja',
          texto:
            "2-2 en la final de Copa con gol de Julián en el 87'. La Real gana 4-3 en los penaltis; Marrero para a Sørloth y a Julián.",
        },
        {
          fecha: 'Mar 2026',
          titulo: 'Apollo',
          texto: 'El fondo Apollo Sports Capital completa la compra del club.',
        },
        {
          fecha: '19 jul 2026',
          titulo: 'La final del Mundial',
          texto: 'España gana a Argentina. Grimaldo, campeón; Romero, Julián y Giuliano, con la plata.',
        },
        {
          fecha: '1 sep 2026',
          titulo: 'Julián se queda',
          texto: 'Pidió salir, el club no lo vendió. Contrato hasta 2030 y cláusula de 500 M€.',
        },
      ],
      movimientos: {
        titulo: 'El verano de 2026',
        filas: [
          { jugador: 'Cuti Romero', tipo: 'llega', detalle: 'Del Tottenham, ~40 M€, hasta 2031' },
          { jugador: 'Morten Hjulmand', tipo: 'llega', detalle: 'Del Sporting CP, 40 M€ + 5' },
          { jugador: 'Alejandro Grimaldo', tipo: 'llega', detalle: 'Del Leverkusen, ~20 M€' },
          { jugador: 'Kang-in Lee', tipo: 'llega', detalle: 'Del PSG, dorsal 7' },
          { jugador: 'Jonathan David', tipo: 'cedido', detalle: 'De la Juventus, opción de 25 M€' },
          { jugador: 'Griezmann', tipo: 'sale', detalle: 'Al Orlando City' },
          { jugador: 'Ruggeri', tipo: 'sale', detalle: 'Al Aston Villa' },
        ],
      },
      notas: [
        {
          icono: 'silbato',
          titulo: 'El Cholo',
          texto:
            'Su contrato acaba el 30 de junio de 2027. Ninguna parte activó la cláusula de salida anticipada y la prensa habla de posible última temporada.',
        },
        {
          icono: 'diana',
          titulo: 'Ahora mismo',
          texto:
            'Segundo con 22 puntos antes de la jornada 10, a cinco del Barça. Baena, pichichi de la liga con 4 goles. Por delante: Levante, Bayern y Barça.',
        },
        {
          icono: 'trofeo',
          titulo: 'La 25/26',
          texto: 'Final de Copa perdida y eliminación ante el Arsenal en semifinales de Champions.',
        },
      ],
    },

    // 02 ADN
    {
      tipo: 'principios',
      cabecera: {
        titulo: 'ADN Cholo',
        nav: 'ADN',
        icono: 'adn',
        entradilla:
          'El dibujo cambia según el rival; los principios no. Respeta estos seis y tu Atleti será reconocible en cualquier sistema.',
      },
      items: [
        {
          icono: 'escudo',
          titulo: 'Bloque compacto',
          texto: 'Las dos líneas de cuatro juntas, poco espacio entre ellas y el rival empujado hacia fuera.',
        },
        {
          icono: 'diana',
          titulo: 'La banda es la trampa',
          texto: 'Cuando el balón llega al lateral rival, extremo, lateral e interior saltan a la vez.',
        },
        {
          icono: 'rayo',
          titulo: 'Transición vertical',
          texto: 'Robo, pase al delantero que se mueve y llegada de la segunda línea en tres o cuatro toques.',
        },
        {
          icono: 'grupo',
          titulo: 'Línea de cinco a mano',
          texto: 'El extremo derecho baja a carrilero sin balón y el 4-4-2 se convierte en 5-3-2.',
        },
        {
          icono: 'flechas',
          titulo: 'Por fuera y al centro',
          texto: 'Ataca más por la derecha y es el equipo de LaLiga con más centros precisos por partido.',
        },
        {
          icono: 'bandera',
          titulo: 'Balón parado',
          texto: 'Baena y Grimaldo lanzan faltas y córners. Entrénalo en el juego.',
        },
      ],
    },

    // 03 VÍDEOS
    {
      tipo: 'videos',
      cabecera: {
        titulo: 'Lo que dicen los vídeos',
        nav: 'Vídeos',
        icono: 'play',
        entradilla:
          'Analizados a partir de sus transcripciones. El de SesqueT es la guía táctica y la base del Plan A; el de Brom Squad aporta el 3-5-2 ofensivo e historias para el lore.',
      },
      videos: [
        {
          etiqueta: 'Guía táctica · FC 26',
          tono: 'rojo',
          titulo: 'Simeone 4-4-2 — SesqueT',
          url: 'https://www.youtube.com/watch?v=FjyPYsVD-VE&t=30s',
          puntos: [
            '4-4-2 (contención) con dos mediocentros defensivos, con y sin balón.',
            'Creación de jugadas y enfoque defensivo en **Equilibrado**: con Contraataque los puntas dejan de bajar a ayudar.',
            'Dos falsos 9 que bajan; Llorente como lateral profundo; Giuliano baja a formar línea de cinco.',
          ],
          codigoTactica: '8BWsbgsGGEg9',
        },
        {
          etiqueta: 'Crónica de temporada · FC 27',
          titulo: 'I Rebuilt Atlético — Brom Squad',
          url: 'https://www.youtube.com/watch?v=PRbMFYTuhqQ&t=1361s',
          puntos: [
            'Alterna el 4-4-2 y un 3-5-2 ofensivo con Baena de mediapunta.',
            '4-1 al Bayern con el 3-5-2; eliminado por el Liverpool con el mismo plan.',
            'Gana Liga y Supercopa. Vende a Julián al City por casi 110 M€ en enero y ficha a Douvikas.',
          ],
          nota: 'No da roles por posición: el Plan D usa su idea con roles propios.',
        },
      ],
      cifras: {
        titulo: 'El Atleti en números (vídeo de SesqueT, LaLiga 25/26)',
        items: [
          { valor: '50,9 %', texto: 'de posesión media; 4.º equipo con más balón', barras: [50.9] },
          { valor: '39 / 35', texto: '% de ataques por la derecha frente a la izquierda', barras: [39, 35] },
          { valor: '30 %', texto: 'de tiros desde fuera del área; solo el Villarreal tira menos', barras: [30] },
          { valor: 'N.º 1', texto: 'en centros precisos por partido de toda LaLiga', barras: [100] },
        ],
      },
      claves: {
        titulo: 'Los cuatro movimientos',
        items: [
          {
            titulo: 'Puntas que bajan',
            texto:
              'Centrales y pivotes filtran al hueco entre líneas; los puntas combinan y abren a la banda donde el extremo ataca la espalda.',
          },
          {
            titulo: 'Lateral conductor',
            texto:
              'Tras un cambio de orientación, Llorente conduce en vertical y da el pase a Giuliano para que encare.',
          },
          {
            titulo: 'Triángulo derecho',
            texto:
              'Giuliano se mete dentro, Llorente ocupa el carril y el segundo punta se acerca para el pase al espacio.',
          },
          {
            titulo: 'Doblaje',
            texto: 'Extremo abierto, el lateral dobla por fuera, 2 contra 1, línea de fondo y centro con gente en el área.',
          },
        ],
      },
    },

    // 04 PIZARRA
    {
      tipo: 'pizarra',
      cabecera: {
        titulo: 'La pizarra',
        nav: 'Pizarra',
        icono: 'pizarra',
        entradilla:
          'Cuatro planes para guardar en el juego. Cambia de plan y mira cómo se mueven los jugadores; pulsa uno para ver su tarea. Los roles van con su nombre en castellano del juego y, debajo, el inglés, por si juegas con el menú en ese idioma.',
      },
      planes: [
        {
          clave: 'A',
          uso: 'base',
          nombre: 'El Cholismo',
          formacion: '4-4-2 (contención)',
          creacion: 'Equilibrada',
          enfoque: 'Equilibrado',
          alturaLinea: '40–45',
          cuando:
            'El plan de base: liga, partidos fuera y eliminatorias. Baja a Giuliano a la línea de defensa cuando el rival ataque por su lado.',
          fuente:
            'Roles del vídeo de SesqueT, pasados a la plantilla 26/27. La altura de línea es una sugerencia.',
          once: [
            { jugador: 'oblak', pos: 'POR', x: 50, y: 90, rol: 'Goalkeeper (Defend)', tarea: 'Quedarse en línea' },
            { jugador: 'llorente', pos: 'LD', x: 86, y: 73, rol: 'Attacking Wingback (Support)', tarea: 'Lateral profundo: dobla por fuera y por dentro' },
            { jugador: 'romero', pos: 'DFC', x: 63, y: 75, rol: 'Defender (Defend)', tarea: 'No se toca' },
            { jugador: 'hancko', pos: 'DFC', x: 37, y: 75, rol: 'Defender (Defend)', tarea: 'No se toca' },
            { jugador: 'grimaldo', pos: 'LI', x: 14, y: 73, rol: 'Fullback (Balanced)', tarea: 'Doblar sin descolgarse; balón parado' },
            { jugador: 'hjulmand', pos: 'MCD', x: 64, y: 58, rol: 'Holding (Defend)', tarea: 'El fijo del doble pivote' },
            { jugador: 'barrios', pos: 'MCD', x: 36, y: 58, rol: '«Mediocampista creador» (Creación)', tarea: 'Movilidad y llegada' },
            { jugador: 'giuliano', pos: 'MD', x: 85, y: 46, rol: 'Winger (Balanced)', tarea: 'Meterse dentro; bajar a cerrar la línea de cinco' },
            { jugador: 'lookman', pos: 'MI', x: 15, y: 42, rol: 'Winger (Attack)', tarea: 'Abierto y alto para la transición' },
            { jugador: 'baena', pos: 'DC', x: 59, y: 24, rol: 'False 9 (Build-Up)', tarea: 'Bajar entre líneas y girarse' },
            { jugador: 'julian', pos: 'DC', x: 41, y: 20, rol: 'False 9 (Attack)', tarea: 'Bajar a combinar y pisar área' },
          ],
        },
        {
          clave: 'B',
          uso: 'cerrar',
          nombre: 'La muralla',
          formacion: '5-3-2',
          creacion: 'Contraataque',
          enfoque: 'Bajo',
          alturaLinea: '30–35',
          cuando: "Para cerrar un resultado desde el 70', o de inicio contra Barça, Madrid y los grandes de Europa.",
          fuente: 'Basado en el 5-3-2 que Simeone usa sin balón. Roles propios.',
          once: [
            { jugador: 'oblak', pos: 'POR', x: 50, y: 90, rol: 'Goalkeeper (Defend)', tarea: 'Mandar en el área pequeña' },
            { jugador: 'pubill', pos: 'DFC', x: 70, y: 74, rol: 'Wide Back (Defend)', tarea: 'Cubrir la espalda de Llorente' },
            { jugador: 'romero', pos: 'DFC', x: 50, y: 76, rol: 'Defender (Defend)', tarea: 'Mandar en el área' },
            { jugador: 'hancko', pos: 'DFC', x: 30, y: 74, rol: 'Wide Back (Support)', tarea: 'Cubrir la banda y dar salida' },
            { jugador: 'llorente', pos: 'CAD', x: 88, y: 62, rol: 'Wingback (Balanced)', tarea: "Carril entero, piernas para 90'" },
            { jugador: 'grimaldo', pos: 'CAI', x: 12, y: 62, rol: 'Attacking Wingback (Attack)', tarea: 'La vía de escape del equipo' },
            { jugador: 'hjulmand', pos: 'MCD', x: 50, y: 60, rol: 'Holding (Defend)', tarea: 'Tapar el pasillo central' },
            { jugador: 'barrios', pos: 'MC', x: 68, y: 48, rol: 'Box-to-Box (Ball Winning)', tarea: 'Saltar a la presión en banda' },
            { jugador: 'koke', pos: 'MC', x: 32, y: 48, rol: 'Deep-Lying Playmaker (Defend)', tarea: 'Pausa y orden' },
            { jugador: 'julian', pos: 'DC', x: 41, y: 22, rol: 'Advanced Forward (Attack)', tarea: 'Primera presión y salida rápida' },
            { jugador: 'sorloth', pos: 'DC', x: 59, y: 20, rol: 'Target Forward (Balanced)', tarea: 'Balón largo, aguantar y ganar faltas' },
          ],
        },
        {
          clave: 'C',
          uso: 'dominar',
          nombre: 'El nuevo Atleti',
          formacion: '4-3-3',
          creacion: 'Equilibrada',
          enfoque: 'Equilibrado',
          alturaLinea: '50–55',
          cuando:
            'El modelo del 1-3 en Sevilla: en casa y contra bloques medios. Con balón, Llorente se queda y sale con tres.',
          fuente: 'Basado en el Sevilla 1-3 Atlético de agosto de 2026. Roles propios.',
          once: [
            { jugador: 'oblak', pos: 'POR', x: 50, y: 90, rol: 'Goalkeeper (Balanced)', tarea: 'Primer pase seguro' },
            { jugador: 'llorente', pos: 'LD', x: 85, y: 74, rol: 'Fullback (Defend)', tarea: 'Tercer central en la salida' },
            { jugador: 'romero', pos: 'DFC', x: 63, y: 75, rol: 'Defender (Defend)', tarea: 'Mandar atrás' },
            { jugador: 'hancko', pos: 'DFC', x: 37, y: 75, rol: 'Ball-Playing Defender (Build-Up)', tarea: 'Conducir y romper líneas' },
            { jugador: 'grimaldo', pos: 'LI', x: 13, y: 64, rol: 'Attacking Wingback (Attack)', tarea: 'Toda la amplitud izquierda' },
            { jugador: 'hjulmand', pos: 'MCD', x: 50, y: 62, rol: 'Deep-Lying Playmaker (Defend)', tarea: 'Ritmo de la circulación' },
            { jugador: 'barrios', pos: 'MC', x: 67, y: 46, rol: 'Box-to-Box (Balanced)', tarea: 'Llegada desde segunda línea' },
            { jugador: 'kangin', pos: 'MC', x: 33, y: 46, rol: 'Playmaker (Roaming)', tarea: 'Pase entre líneas' },
            { jugador: 'giuliano', pos: 'ED', x: 84, y: 24, rol: 'Winger (Balanced)', tarea: 'Amplitud derecha y presión' },
            { jugador: 'lookman', pos: 'EI', x: 16, y: 24, rol: 'Inside Forward (Attack)', tarea: 'Diagonal hacia el área' },
            { jugador: 'baena', pos: 'DC', x: 50, y: 20, rol: 'False 9 (Attack)', tarea: 'Bajar, arrastrar al central y pisar área' },
          ],
        },
        {
          clave: 'D',
          uso: 'remontar',
          nombre: 'A por ellos',
          formacion: '3-5-2',
          creacion: 'Equilibrada',
          enfoque: 'Alto',
          alturaLinea: '55–60',
          cuando:
            'Para ir a por un partido o remontar: sobrecarga el centro y presiona arriba. Le salió bien al de Brom Squad contra el Bayern y mal contra el Liverpool.',
          fuente:
            'Idea del vídeo de Brom Squad (3-5-2 con Baena de 10). El vídeo no da roles; estos son propios.',
          once: [
            { jugador: 'oblak', pos: 'POR', x: 50, y: 90, rol: 'Goalkeeper (Balanced)', tarea: 'Salida rápida en largo' },
            { jugador: 'pubill', pos: 'DFC', x: 72, y: 74, rol: 'Wide Back (Support)', tarea: 'Abrir la salida por la derecha' },
            { jugador: 'romero', pos: 'DFC', x: 50, y: 76, rol: 'Defender (Defend)', tarea: 'El que se queda' },
            { jugador: 'hancko', pos: 'DFC', x: 28, y: 74, rol: 'Wide Back (Support)', tarea: 'Abrir la salida por la izquierda' },
            { jugador: 'llorente', pos: 'MD', x: 88, y: 50, rol: 'Wide Midfielder (Support)', tarea: 'Carril entero' },
            { jugador: 'grimaldo', pos: 'MI', x: 12, y: 46, rol: 'Wide Playmaker (Attack)', tarea: 'Recibir alto y centrar' },
            { jugador: 'hjulmand', pos: 'MCD', x: 64, y: 62, rol: 'Holding (Defend)', tarea: 'Cubrir la espalda de todos' },
            { jugador: 'barrios', pos: 'MCD', x: 36, y: 62, rol: 'Box Crasher (Balanced)', tarea: 'Llegar al área desde atrás' },
            { jugador: 'baena', pos: 'MCO', x: 50, y: 40, rol: 'Playmaker (Balanced)', tarea: 'El número 10' },
            { jugador: 'julian', pos: 'DC', x: 40, y: 20, rol: 'False 9 (Attack)', tarea: 'Bajar a sobrecargar el centro' },
            { jugador: 'lookman', pos: 'DC', x: 60, y: 18, rol: 'Advanced Forward (Attack)', tarea: 'Atacar la espalda' },
          ],
        },
      ],
      cambios: {
        titulo: 'Cambios marca Simeone',
        items: [
          {
            icono: 'reloj',
            titulo: 'Min. 55–60, piernas frescas',
            texto: 'Los dos vídeos cambian siempre hacia el 60. Cambia pronto y por parejas.',
          },
          {
            icono: 'cambio',
            titulo: 'Sørloth por un falso 9',
            texto: 'Pasa a Target Forward (Attack) para rematar centros. Es el cambio de SesqueT.',
          },
          {
            icono: 'flechas',
            titulo: 'Llorente al doble pivote',
            texto: 'Entra Pubill de lateral derecho y Llorente rompe al espacio desde el medio.',
          },
          {
            icono: 'escudo',
            titulo: "Ganando de uno, 70'",
            texto: 'Plan B: Koke por un atacante y un central más.',
          },
        ],
      },
    },

    // 05 PLANTILLA
    {
      tipo: 'plantilla',
      cabecera: {
        titulo: 'Plantilla',
        icono: 'camiseta',
        entradilla:
          'Las medias de FC 27 y el papel de cada jugador en la historia. Usa las dos cosas para decidir renovaciones, ventas y minutos.',
      },
      jugadores: [
        { id: 'oblak', nombre: 'Jan Oblak', corto: 'Oblak', pos: 'POR', linea: 'POR', edad: 33, media: 88, potencial: 91, pais: 'SI', historia: 'El último muro de la era Cholo', decision: '¿Buscas su relevo en la T2?' },
        { id: 'musso', nombre: 'Juan Musso', pos: 'POR', linea: 'POR', edad: 32, media: 82, potencial: 82, pais: 'AR', historia: 'Portero de Copa; estaba en la final de La Cartuja', decision: 'Venta o continuidad' },
        { id: 'esquivel', nombre: 'Salvi Esquivel', pos: 'POR', linea: 'POR', edad: 20, media: 64, potencial: 78, pais: 'ES', historia: 'El portero joven de la casa', decision: 'Candidato al relevo de Oblak' },
        { id: 'romero', nombre: 'Cuti Romero', pos: 'DFC', linea: 'DEF', edad: 28, media: 82, potencial: 84, pais: 'AR', historia: 'El nuevo mariscal y la voz argentina del vestuario', decision: 'Capitán de la defensa' },
        { id: 'hancko', nombre: 'Dávid Hancko', corto: 'Hancko', pos: 'DFC', linea: 'DEF', edad: 28, media: 83, potencial: 83, pais: 'SK', historia: 'El comodín: vale para línea de tres y de cuatro', decision: 'Intocable' },
        { id: 'pubill', nombre: 'Marc Pubill', corto: 'Pubill', pos: 'DFC', linea: 'DEF', edad: 23, media: 81, potencial: 88, pais: 'ES', historia: 'La sorpresa que vino del Almería; el mayor potencial de la defensa', decision: 'Crecimiento: dale minutos' },
        { id: 'lenormand', nombre: 'Robin Le Normand', pos: 'DFC', linea: 'DEF', edad: 29, media: 81, potencial: 83, pais: 'ES', historia: 'Perdió el puesto tras el golpe en la cabeza', decision: 'Vender en la T1 o la T2' },
        { id: 'dani', nombre: 'Dani Martínez', pos: 'DFC', linea: 'DEF', edad: 22, media: 64, potencial: 77, pais: 'ES', historia: 'Canterano que también juega de lateral zurdo', decision: 'Recambio de urgencia de Grimaldo' },
        { id: 'llorente', nombre: 'Marcos Llorente', corto: 'Llorente', pos: 'LD', linea: 'DEF', edad: 31, media: 85, potencial: 86, pais: 'ES', historia: 'Los tres pulmones; juega donde haga falta', decision: 'Renovación corta: acaba en 2027' },
        { id: 'grimaldo', nombre: 'Grimaldo', pos: 'MI', linea: 'DEF', edad: 30, media: 85, potencial: 86, pais: 'ES', historia: 'Campeón del mundo; el juego ya lo pone de interior izquierdo', decision: 'Lateral en el Plan A, interior en el D' },
        { id: 'hjulmand', nombre: 'Morten Hjulmand', corto: 'Hjulmand', pos: 'MCD', linea: 'MED', edad: 27, media: 83, potencial: 86, pais: 'DK', historia: 'El que nadie pide en la camiseta pero todos echan de menos', decision: 'Ancla del proyecto' },
        { id: 'barrios', nombre: 'Pablo Barrios', corto: 'Barrios', pos: 'MC', linea: 'MED', edad: 23, media: 83, potencial: 87, pais: 'ES', historia: 'El futuro capitán', decision: 'Heredero del brazalete' },
        { id: 'koke', nombre: 'Koke', pos: 'MC', linea: 'MED', edad: 34, media: 81, potencial: 86, pais: 'ES', historia: 'El capitán de siempre en su último baile', decision: 'Despedida al final de la T1' },
        { id: 'cardoso', nombre: 'Johnny Cardoso', pos: 'MCD', linea: 'MED', edad: 24, media: 80, potencial: 84, pais: 'US', historia: 'Talento frenado por las lesiones', decision: 'Fondo de armario' },
        { id: 'vargas', nombre: 'Obed Vargas', pos: 'MCD', linea: 'MED', edad: 20, media: 72, potencial: 83, pais: 'MX', historia: 'Joven sin hueco en el doble pivote', decision: 'Cesión' },
        { id: 'mendoza', nombre: 'Rodri Mendoza', pos: 'MC', linea: 'MED', edad: 21, media: 72, potencial: 82, pais: 'ES', historia: 'Joven sin hueco en el centro del campo', decision: 'Cesión' },
        { id: 'baena', nombre: 'Álex Baena', corto: 'Baena', pos: 'MI', linea: 'MED', edad: 24, media: 83, potencial: 85, pais: 'ES', historia: 'Heredero de Griezmann y pichichi sorpresa', decision: 'Estrella del Plan C' },
        { id: 'kangin', nombre: 'Kang-in Lee', pos: 'ED', linea: 'DEL', edad: 25, media: 81, potencial: 84, pais: 'KR', historia: 'Fichaje mediático; el 7 que dejó Griezmann', decision: 'Titular en el Plan C' },
        { id: 'giuliano', nombre: 'Giuliano Simeone', corto: 'Giuliano', pos: 'MD', linea: 'DEL', edad: 23, media: 82, potencial: 85, pais: 'AR', historia: 'El hijo del entrenador: ¿mérito o apellido?', decision: 'Subtrama propia' },
        { id: 'lookman', nombre: 'Ademola Lookman', corto: 'Lookman', pos: 'DC', linea: 'DEL', edad: 28, media: 82, potencial: 84, pais: 'NG', historia: 'Se esperaba más; ni banda ni punta', decision: 'Demostrar o salir en verano' },
        { id: 'julian', nombre: 'Julián Álvarez', corto: 'Julián', pos: 'DC', linea: 'DEL', edad: 26, media: 86, potencial: 89, pais: 'AR', historia: 'La estrella que quiso irse; el mejor de campo de la plantilla', decision: 'La gran decisión de la T1' },
        { id: 'sorloth', nombre: 'Alexander Sørloth', corto: 'Sørloth', pos: 'DC', linea: 'DEL', edad: 30, media: 83, potencial: 84, pais: 'NO', historia: 'El nueve de área con futuro en el aire', decision: 'Vender o renovar en la T1' },
        { id: 'david', nombre: 'Jonathan David', pos: 'DC', linea: 'DEL', edad: 26, media: 80, potencial: 83, pais: 'CA', historia: 'Cedido que reclama titularidad', decision: 'Ejecutar o no los 25 M€' },
        { id: 'ortiz', nombre: 'Arnau Ortiz', pos: 'EI', linea: 'DEL', edad: 24, media: 71, potencial: 79, pais: 'ES', historia: 'Canterano con buenas maneras', decision: 'Minutos en Copa' },
        { id: 'cubo', nombre: 'Miguel Cubo', pos: 'DC', linea: 'DEL', edad: 18, media: 63, potencial: 80, pais: 'ES', historia: 'La perla de 18 años de la cantera', decision: 'Subirlo en la T3' },
      ],
      cedidos:
        'Cedidos: José María Giménez (Deportivo, 82 · pot. 85), Thomas Lemar (Elche, 77 · pot. 83) y Horațiu Moldovan (Eyüpspor, 70 · pot. 72).',
      fuente:
        'Medias y potencial del modo carrera de FC 27 según [CMTracker](https://cmtracker.net/en/teams/fc27/240/atletico-de-madrid) (base de datos de octubre de 2026). La posición es la que asigna el juego. En tu partida pueden variar por la media dinámica.',
    },

    // 06 MERCADO
    {
      tipo: 'mercado',
      cabecera: {
        titulo: 'Mercado',
        icono: 'traspaso',
        entradilla:
          'Todos los nombres han salido en la prensa entre junio y octubre de 2026, ordenados por media. Las medias son de FC 27 (CMTracker); los precios, los publicados. En el juego costarán otra cosa.',
      },
      necesidades: [
        'Recambio de Grimaldo: el único zurdo puro',
        'Un centrocampista creativo de nivel',
        'Un nueve si salen Julián o Sørloth',
      ],
      objetivos: [
        { nombre: 'Un lateral izquierdo', pos: 'LI', club: null, edad: null, media: null, potencial: null, precio: null, encaje: 'Alemany lo quiere ya: Grimaldo es el único zurdo puro y el juego lo pone de interior.', ventana: 'Enero T1', tono: 'rojo', fuente: { nombre: 'fichajes.net', url: 'https://www.fichajes.net/noticias/mateu-alemany-obsesionado-fichaje-defensa-20261027.html' } },
        { nombre: 'Bruno Fernandes', pos: 'MCO', club: 'Man. United', edad: 31, media: 89, potencial: 90, pais: 'PT', precio: null, encaje: 'El mejor jugador del mercado: un año para ganar ya.', ventana: 'Enero T1', tono: 'rojo', fuente: { nombre: 'fichajes.net', url: 'https://www.fichajes.net/noticias/mateu-alemany-tantea-fichaje-bruno-fernandes-20261027.html' } },
        { nombre: 'Viktor Gyökeres', pos: 'DC', club: 'Arsenal', edad: 28, media: 86, potencial: 87, pais: 'SE', precio: '~60 M£', encaje: 'El nueve hecho para la 27/28 si sale Julián.', ventana: 'Verano T1', fuente: { nombre: 'Esto es Atleti', url: 'https://www.estoesatleti.es/fichajes/simeone-3-objetivos-premier-league-verano/20261025210000042544.html' } },
        { nombre: 'Alexis Mac Allister', pos: 'MC', club: 'Liverpool', edad: 27, media: 84, potencial: 87, pais: 'AR', precio: null, encaje: 'Interior total y otro argentino para el vestuario.', ventana: 'Verano T1', fuente: { nombre: 'ElDesmarque', url: 'https://www.eldesmarque.com/futbol/mercado-de-fichajes/20261029/mateu-alemany-mueve-fichaje-bomba-atletico-madrid-cuenta-dos-bazas_18_020567470.html' } },
        { nombre: 'Jonathan David', pos: 'DC', club: 'Juventus (cedido)', edad: 26, media: 80, potencial: 83, pais: 'CA', precio: '25 M€ (opción)', encaje: 'Ejecutar la opción si marca 15+ goles en la T1.', ventana: 'Junio T1', tono: 'ambar', fuente: { nombre: 'El Gol Digital', url: 'https://www.elgoldigital.com/futbol/atletico-de-madrid/jonathan-david-atletico-opcion-compra-25-millones-juventus/' } },
        { nombre: 'Nico González', pos: 'MI', club: 'Juventus', edad: 28, media: 79, potencial: 81, pais: 'AR', precio: null, encaje: 'Extremo zurdo de ida y vuelta para el Plan A.', ventana: 'Cualquiera', fuente: { nombre: 'Dorsal 16', url: 'https://www.dorsal16.com/mateu-alemany-marca-el-camino-los-7-movimientos-en-el-mercado-de-fichajes-del-atletico-de-madrid/' } },
        { nombre: 'Malo Gusto', pos: 'LD', club: 'Chelsea', edad: 23, media: 79, potencial: 84, pais: 'FR', precio: '35–40 M€', encaje: 'El relevo de Llorente, que acaba contrato en 2027.', ventana: 'Verano T1', fuente: { nombre: 'Esto es Atleti', url: 'https://www.estoesatleti.es/fichajes/simeone-3-objetivos-premier-league-verano/20261025210000042544.html' } },
        { nombre: 'Diego Gómez', pos: 'MC', club: 'Brighton', edad: 23, media: 78, potencial: 85, pais: 'PY', precio: '~30 M£', encaje: 'Box-to-box con gol para rotar con Barrios.', ventana: 'Verano T1', fuente: { nombre: 'Esto es Atleti', url: 'https://www.estoesatleti.es/fichajes/simeone-3-objetivos-premier-league-verano/20261025210000042544.html' } },
        { nombre: 'Douvikas', pos: 'DC', club: 'Como', edad: 26, media: 78, potencial: 79, pais: 'GR', precio: null, encaje: 'El nueve que fichó Brom Squad en enero: hat-trick al Barça en su partida.', ventana: 'Enero T1', fuente: { nombre: 'Vídeo de Brom Squad', url: 'https://www.youtube.com/watch?v=PRbMFYTuhqQ&t=1361s' } },
        { nombre: 'William Gomes', pos: 'ED', club: 'Oporto', edad: 20, media: 77, potencial: 86, pais: 'BR', precio: null, encaje: 'Apuesta joven por banda: mucho margen de crecimiento.', ventana: 'Verano T1', fuente: { nombre: 'Dorsal 16', url: 'https://www.dorsal16.com/mateu-alemany-marca-el-camino-los-7-movimientos-en-el-mercado-de-fichajes-del-atletico-de-madrid/' } },
        { nombre: 'Nicolò Tresoldi', pos: 'DC', club: 'Club Brugge', edad: 21, media: 75, potencial: 87, pais: 'DE', precio: '70 M€', encaje: 'El elegido para heredar a Julián si se va en 2027. El Brujas pide 70 M€; hoy es 75, pero su techo es de 87.', ventana: 'Verano T1', tono: 'verde', fuente: { nombre: 'fichajes.net', url: 'https://www.fichajes.net/noticias/atletico-elige-sustituto-julian-alvarez-fichaje-costara-70-millones-20261016.html' } },
      ],
      perfilOjeo: {
        titulo: 'Perfil para el ojeo.',
        texto:
          'Fuera de esta lista, filtra por lo que pide el sistema: laterales con resistencia alta, medios con intercepciones y agresividad altas, y delanteros con aceleración y trabajo defensivo. Un jugador que no defiende no entra en el Atleti del Cholo.',
      },
    },

    // 07 LORE
    {
      tipo: 'saga',
      cabecera: {
        titulo: 'La saga',
        nav: 'Lore',
        icono: 'libro',
        entradilla:
          'Tú eres Diego Pablo Simeone en su temporada 16, la última de su contrato. Cuatro temporadas para ganar lo que se escapó y dejar un Atleti que sobreviva sin ti.',
      },
      prologo: [
        {
          fecha: 'Prólogo · Sevilla, 18 abr 2026',
          icono: 'trofeo',
          titulo: 'Dos finales, dos heridas',
          texto:
            "Julián empata en el 87' y la final se va a los penaltis. Marrero le para el suyo a Sørloth y a Julián. La Real levanta la Copa.",
        },
        {
          fecha: 'Prólogo · Nueva Jersey, 19 jul 2026',
          icono: 'grupo',
          titulo: 'Un vestuario partido',
          texto:
            'España gana el Mundial a Argentina. En el Metropolitano conviven ahora los que ganaron y los que perdieron la misma noche.',
        },
      ],
      temporadas: [
        {
          marca: 'T1',
          rotulo: 'Temporada 1 · 2026/27',
          titulo: 'El último contrato',
          objetivo: 'Objetivo de la junta: un título',
          actos: [
            { titulo: 'Acto I · agosto–diciembre', texto: 'El nueve fantasma. Julián empieza en el banquillo y Baena juega de falso 9. Juli vuelve al once cuando marque dos partidos seguidos desde el banquillo.' },
            { titulo: 'Acto II · enero', texto: 'El mercado de la urgencia. Ficha un lateral zurdo. La tentación: Bruno Fernandes para ganar ya, o guardar el dinero para el verano.' },
            { titulo: 'Acto III · febrero–mayo', texto: 'Las revanchas. Si te cruzas con la Real en Copa o con el Arsenal en Champions, se juega con el Plan A, sin excusas.' },
            { titulo: 'Epílogo · última jornada en casa', texto: 'Koke, titular y capitán. Al terminar, el brazalete pasa a Barrios.' },
          ],
          bifurcacion: {
            si: { titulo: 'Con título', texto: 'El Cholo renueva y la historia sigue.' },
            no: { titulo: 'Sin título', texto: 'Un año más, pero con objetivo de Champions y sin margen.' },
          },
        },
        {
          marca: 'T2',
          rotulo: 'Temporada 2 · 2027/28',
          titulo: 'El relevo',
          objetivo: 'Objetivo: LaLiga',
          actos: [
            { titulo: 'El nuevo centro del campo', texto: 'Barrios, capitán. Hjulmand y Barrios mandan; llega un interior: Mac Allister o Diego Gómez. Si salió Julián, el nueve es Gyökeres o Tresoldi.' },
            { titulo: 'Subtrama: el hijo', texto: '¿Giuliano juega por mérito o por apellido? No puede ser titular más de tres partidos seguidos si su media baja de 6,8.' },
            { titulo: 'Subtrama: el relevo de Oblak', texto: 'Ficha o sube un portero joven y dale la Copa.' },
            { titulo: 'El título de bloque', texto: 'Liga como en 2014 y 2021: regularidad antes que brillo.' },
          ],
        },
        {
          marca: 'T3',
          rotulo: 'Temporada 3 · 2028/29',
          titulo: 'La herencia',
          objetivo: 'Objetivo: semifinales de Champions',
          actos: [
            { titulo: 'El Plan C manda', texto: 'El Atleti ya juega con balón; el 4-4-2 se guarda para las noches grandes. Sube dos canteranos y dales minutos de verdad.' },
            { titulo: 'Conflicto: Apollo', texto: 'La propiedad quiere vender una estrella para cuadrar cuentas. Tú decides a quién y explicas por qué.' },
          ],
        },
        {
          marca: 'T4',
          rotulo: 'Temporada 4 · 2029/30',
          titulo: 'El último baile',
          objetivo: 'Objetivo: la Champions',
          actos: [
            { titulo: 'La despedida anunciada', texto: 'El Cholo anuncia en pretemporada que es su último año. A por la que se escapó en 2014 y 2016.' },
            { titulo: 'Julián, leyenda o salida', texto: 'Su contrato acaba en 2030. Si sigue, es su año para quedar como leyenda.' },
            { titulo: 'El sucesor', texto: 'En la última jornada eliges entrenador entre los que te ofrezca el juego y empieza otra partida sin el Cholo.' },
          ],
          final: true,
        },
      ],
      escenas: {
        titulo: 'Escenas robadas del vídeo de Brom Squad',
        items: [
          { icono: 'charla', texto: 'Julián marca y pide perdón a la grada por lo del Barça.' },
          { icono: 'reloj', texto: 'Julián llega tarde al entrenamiento antes del Barça y se queda en el banquillo.' },
          { icono: 'alerta', texto: 'Oblak y Llorente chocan en un entrenamiento y se lesionan; suena David Raya.' },
          { icono: 'moneda', texto: 'La junta no deja reinvertir lo ganado con las ventas de enero.' },
          { icono: 'trofeo', texto: 'Giuliano decide una final contra el Madrid: el hijo del Cholo.' },
          { icono: 'bandera', texto: 'Grimaldo gana un partido grande de falta directa.' },
        ],
      },
    },

    // 08 REGLAS
    {
      tipo: 'reglas',
      cabecera: {
        titulo: 'Reglas de la partida',
        nav: 'Reglas',
        icono: 'reglas',
        entradilla:
          'Para que el modo carrera no se convierta en fichar medias altas y jugar como cualquier equipo.',
      },
      items: [
        { icono: 'traspaso', titulo: 'Fichajes con historia', texto: 'En la T1, solo nombres del mercado o que encajen en el perfil de ojeo. Desde la T2, cualquiera que encaje en el perfil.' },
        { icono: 'moneda', titulo: 'Nada de regalar', texto: 'Cualquier venta a un rival directo de liga cuesta un 20 % más.' },
        { icono: 'escudo', titulo: 'Noches grandes', texto: 'Eliminatorias de Champions, Madrid y Barça empiezan con el Plan A o el B.' },
        { icono: 'cambio', titulo: 'Cinco cambios', texto: "Dos antes del 60'. En FC 27 la forma física afecta a la media dinámica." },
        { icono: 'brote', titulo: 'La cantera cuenta', texto: 'Al menos un canterano convocado en cada partido de Copa.' },
        { icono: 'pluma', titulo: 'Cuaderno del Cholo', texto: 'Dos líneas de rueda de prensa tras cada partido grande. Al final de cada temporada tendrás la crónica.' },
      ],
    },
  ],

  fuentes: [
    '[Simeone 4-4-2 — SesqueT](https://www.youtube.com/watch?v=FjyPYsVD-VE&t=30s) y [Brom Squad Gaming](https://www.youtube.com/watch?v=PRbMFYTuhqQ&t=1361s) (transcripciones)',
    '[Roles de FC 27 — FIFAUTeam](https://fifauteam.com/fc-27-roles/)',
    '[Guía del Atlético 26/27 — Comuniate](https://www.comuniate.com/noticias/37178/guia-fantasy-del-atletico-de-madrid-202627-plantilla-once-tipo-y-jugadores-recomendables-actualizado-1o-paron-selecciones)',
    '[Fichajes del verano — El Gol Digital](https://www.elgoldigital.com/futbol/atletico-de-madrid/once-2026-27-nueve-sin-julian-alvarez/)',
    '[¿Un nuevo esquema? — VAVEL](https://www.vavel.com/es/futbol/2026/08/06/atletico-de-madrid/1267385-atletico-de-madrid-un-nuevo-esquema-para-esta-temporada.html)',
    '[Sevilla 1-3 Atlético — El Rincón Atlético](https://elrinconatletico.com/2026/08/30/sin-julian-ni-sorloth-pero-con-tres-goles-el-plan-de-simeone-rompe-diez-anos-en-sevilla/)',
    '[Final de Copa 2026 — El Imparcial](https://www.elimparcial.com/deporte/2026/04/18/atletico-de-madrid-vs-real-sociedad-goles-resumen-y-mejores-momentos-de-la-final-de-la-copa-del-rey-2026/)',
    '[Cuti Romero, oficial — Futbol Fantasy](https://www.futbolfantasy.com/laliga/noticias/148974-cristian-romero-es-oficialmente-nuevo-jugador-del-atletico)',
    '[Jonathan David, cesión — Futbol Fantasy](https://www.futbolfantasy.com/laliga/noticias/150246-el-atletico-cierra-los-ultimos-detalles-del-fichaje-de-jonathan-david)',
    '[Julián y la oferta rechazada — beIN Sports](https://prod.beinsports.com/en-us/soccer/la-liga/articles/atl%C3%A9tico-say-they-would-reject-offers-worth-up-to-us-234-million-for-juli%C3%A1n-%C3%A1lvarez-2026-07-17)',
    '[Simeone sigue en la 26/27 — El Gol Digital](https://www.elgoldigital.com/futbol/atletico-de-madrid/simeone-continua-atletico-madrid-2026-27-apollo-acuerdo/)',
    '[Clasificación antes de la J10 — Diario del Sur](https://diariodelsur.com.co/noticias/atletico-de-madrid-y-su-situacion-como-constitucion-espanola)',
    '[Alemany busca lateral — fichajes.net](https://www.fichajes.net/noticias/mateu-alemany-obsesionado-fichaje-defensa-20261027.html)',
    '[Mac Allister — ElDesmarque](https://www.eldesmarque.com/futbol/mercado-de-fichajes/20261029/mateu-alemany-mueve-fichaje-bomba-atletico-madrid-cuenta-dos-bazas_18_020567470.html)',
    '[Objetivos en la Premier — Esto es Atleti](https://www.estoesatleti.es/fichajes/simeone-3-objetivos-premier-league-verano/20261025210000042544.html)',
  ],
  aviso:
    'Guía personal para un modo carrera. Proyecto de aficionado sin relación con el Club Atlético de Madrid ni con EA Sports.',
};
