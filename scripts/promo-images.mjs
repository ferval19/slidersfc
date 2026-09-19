/**
 * Imágenes de promoción para X.
 *
 * Se dibujan con el mismo motor que las tarjetas de OpenGraph de la web
 * (`next/og` = Satori + resvg) y con las fuentes de `public/fonts/`, así que
 * salen con la marca exacta y no con una aproximación hecha en otro sitio.
 *
 *   node scripts/promo-images.mjs
 *
 * Salen en `promo/x/` a 1600×900, que es la proporción con la que X enseña
 * una imagen suelta en el timeline: así no recorta nada.
 *
 * Los valores que aparecen NO están escritos a mano: se leen del catálogo y
 * del seed del preajuste realista de FC27, que son la fuente de verdad. Si
 * cambian allí, cambian aquí.
 *
 * Satori entiende un subconjunto de CSS: flex, posición absoluta y estilos en
 * línea. `display: flex` explícito en todo div con más de un hijo, y anchos
 * fijos — con crecimiento elástico las filas se colapsan.
 */

import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { slidersByGame, categoryOrder } from '../supabase/seed/catalog.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'promo', 'x');

const W = 1600;
const H = 900;

// docs/direccion-visual.md
const BOARD = '#0b241f';
const BOARD_RAISED = '#12342c';
const CHALK = '#f2efe4';
const DIM = '#93a9a1';
const RULE = '#f2efe433';
const USER = '#ffd24a';
const MATE = '#7fe0c8';
const RIVAL = '#ff5c7a';

const INK = { user: USER, cpu_teammate: MATE, cpu_opponent: RIVAL, cpu: RIVAL };

const URL = 'slidersfc.vercel.app';

// ---------------------------------------------------------------------------
// Datos: catálogo y valores de fábrica, leídos de la fuente de verdad
// ---------------------------------------------------------------------------

const fc27 = slidersByGame.fc27;
const nameOf = (slug) => fc27.find((s) => s.slug === slug)?.name ?? slug;

const CATEGORY_LABELS = {
  speed: 'Velocidad',
  shooting: 'Tiro',
  passing: 'Pase',
  injuries: 'Lesiones',
  goalkeeping: 'Portería',
  positioning: 'Posición del equipo',
  ball_control: 'Control del balón',
  defending: 'Defensa',
  cpu_controls: 'Controles de la CPU',
};

/** Los valores de fábrica, sacados del seed para no duplicarlos a mano. */
const realista = await (async () => {
  const sql = await readFile(join(root, 'supabase/seed/03_set_fc27_realista.sql'), 'utf8');
  const out = new Map();
  for (const m of sql.matchAll(/\('([a-z_]+)'(?:::text)?,\s*'([a-z_]+)'(?:::text)?,\s*(\d+)/g)) {
    out.set(`${m[1]}:${m[2]}`, Number(m[3]));
  }
  return out;
})();

const val = (slug, scope = 'user') => {
  const v = realista.get(`${slug}:${scope}`);
  if (v === undefined) throw new Error(`Falta ${slug}:${scope} en el seed del preajuste realista`);
  return v;
};

const counts = Object.fromEntries(
  categoryOrder.map((c) => [c, fc27.filter((s) => s.category === c).length]),
);
const totalSliders = fc27.length;
const totalValues = fc27.reduce(
  (n, s) => n + (s.sides === 'user' ? 1 : 2),
  0,
);

// ---------------------------------------------------------------------------
// Piezas
// ---------------------------------------------------------------------------

const flex = (style, children) =>
  h('div', { style: { display: 'flex', ...style } }, children);

/** Fondo con el filete de tiza de arriba y el pie de marca. */
function board({ children, footer = URL, accent = USER }) {
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: BOARD,
        color: CHALK,
        padding: '58px 72px',
        fontFamily: 'Plex',
      },
    },
    [
      flex({ key: 'top', width: W - 144, height: 3, backgroundColor: accent, opacity: 0.85 }),
      flex(
        { key: 'body', flexDirection: 'column', flexGrow: 1, paddingTop: 42 },
        children,
      ),
      flex({ key: 'foot', alignItems: 'center', width: W - 144, flexShrink: 0 }, [
        flex({ key: 'brand', fontFamily: 'Display', fontSize: 34, letterSpacing: 1 }, [
          h('span', { key: 'a' }, 'SLIDERS'),
          h('span', { key: 'b', style: { color: USER } }, 'FC'),
        ]),
        flex({ key: 'by', marginLeft: 16, fontSize: 17, color: DIM }, 'BY FULL MANUAL FG'),
        flex({ key: 'sp', flexGrow: 1 }),
        flex({ key: 'url', fontSize: 22, color: CHALK }, footer),
      ]),
    ],
  );
}

function eyebrow(text, color = DIM) {
  return flex(
    { fontSize: 20, letterSpacing: 4, color, textTransform: 'uppercase' },
    text,
  );
}

/**
 * Satori colapsa los saltos de línea, así que un `\n` en el texto no parte el
 * titular: hay que dar cada línea como su propio bloque.
 */
function title(text, size = 92) {
  const style = {
    fontFamily: 'Display',
    fontSize: size,
    lineHeight: 1.02,
    textTransform: 'uppercase',
    maxWidth: W - 144,
  };

  const lines = text.split('\n');
  if (lines.length === 1) return flex(style, text);

  return flex({ flexDirection: 'column' }, lines.map((line, i) =>
    flex({ ...style, key: `l${i}` }, line),
  ));
}

/**
 * El regulador: carril de 0 a 100 con muescas cada 25 y la marca en el valor.
 * Es el elemento firma de la web — un valor se lee como posición, no como
 * número suelto.
 */
function slider({ label, marks, labelWidth = 560, trackWidth = 640, fontSize = 27, height = 58 }) {
  const markW = 5;
  const usable = trackWidth - markW;
  const tall = marks.length > 1 ? 15 : 26;

  return flex({ alignItems: 'center', width: W - 144, height, flexShrink: 0 }, [
    flex(
      {
        key: 'l',
        width: labelWidth,
        flexShrink: 0,
        fontSize,
        color: CHALK,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      label,
    ),
    h(
      'div',
      {
        key: 't',
        style: {
          position: 'relative',
          display: 'flex',
          width: trackWidth,
          height: 34,
          flexShrink: 0,
          alignItems: 'center',
        },
      },
      [
        flex({ key: 'rail', width: '100%', height: 2, backgroundColor: RULE }),
        ...[0, 25, 50, 75, 100].map((p) =>
          h('div', {
            key: `tick${p}`,
            style: {
              position: 'absolute',
              left: Math.round((p / 100) * usable),
              top: 12,
              width: 2,
              height: 10,
              backgroundColor: RULE,
            },
          }),
        ),
        ...marks.map((m, i) =>
          h('div', {
            key: `m${m.scope}`,
            style: {
              position: 'absolute',
              left: Math.round((m.value / 100) * usable),
              top: marks.length > 1 ? 1 + i * 17 : 4,
              width: markW,
              height: tall,
              borderRadius: 2,
              backgroundColor: INK[m.scope],
            },
          }),
        ),
      ],
    ),
    flex({ key: 'v', width: 220, flexShrink: 0, justifyContent: 'flex-end' }, [
      ...marks.map((m) =>
        flex(
          {
            key: m.scope,
            width: marks.length > 1 ? 100 : 200,
            justifyContent: 'flex-end',
            fontSize: fontSize + 8,
            color: INK[m.scope],
          },
          String(m.value),
        ),
      ),
    ]),
  ]);
}

function legend(items) {
  return flex({ alignItems: 'center', width: W - 144, flexShrink: 0 }, [
    ...items.map(([color, text], i) =>
      flex({ key: text, alignItems: 'center', marginLeft: i === 0 ? 0 : 38 }, [
        flex({ key: 'd', width: 5, height: 20, borderRadius: 2, backgroundColor: color }),
        flex({ key: 't', marginLeft: 12, fontSize: 21, color: DIM }, text),
      ]),
    ),
  ]);
}

// ---------------------------------------------------------------------------
// Las siete imágenes
// ---------------------------------------------------------------------------

const cards = {
  /**
   * 0 · Post de presentación. Va sin datos a propósito: es el único post
   * personal de la campaña y los números le quitarían sitio a la frase.
   */
  '00-presentacion': () =>
    board({
      children: [
        flex({ key: 'e' }, eyebrow('El documento lleva desde diciembre')),
        flex({ key: 'sp1', flexGrow: 1 }),
        title('Cada año\nempezamos\ntodos de cero', 150),
        flex({ key: 'sp2', height: 40 }),
        flex({ key: 's', fontSize: 34, color: CHALK, maxWidth: 1150, lineHeight: 1.4 },
          'Los números se comparten. El porqué se pierde.'),
        flex({ key: 'sp3', flexGrow: 1 }),
      ],
    }),

  /** 1 · Post de lanzamiento. La marca y para qué sirve. */
  '01-marca': () =>
    board({
      children: [
        flex({ key: 'e' }, eyebrow('Sliders de EA SPORTS FC')),
        flex({ key: 'sp1', height: 26 }),
        flex({ key: 'h', fontFamily: 'Display', fontSize: 168, lineHeight: 0.94 }, [
          h('span', { key: 'a' }, 'SLIDERS'),
          h('span', { key: 'b', style: { color: USER } }, 'FC'),
        ]),
        flex({ key: 'sp2', height: 34 }),
        flex({ key: 's', fontSize: 33, color: CHALK, maxWidth: 1080, lineHeight: 1.4 },
          'Publica tu set y que la gente comente valor a valor. No una captura suelta: un comentario pegado a la muesca de la que habla.'),
        flex({ key: 'sp3', flexGrow: 1 }),
        slider({ label: nameOf('sprint_speed'), marks: [{ scope: 'user', value: val('sprint_speed') }, { scope: 'cpu_opponent', value: val('sprint_speed', 'cpu_opponent') }] }),
        slider({ label: nameOf('marking'), marks: [{ scope: 'user', value: val('marking') }, { scope: 'cpu_opponent', value: val('marking', 'cpu_opponent') }] }),
        slider({ label: nameOf('cpu_buildup_speed'), marks: [{ scope: 'cpu_opponent', value: val('cpu_buildup_speed', 'cpu_opponent') }, { scope: 'cpu_teammate', value: val('cpu_buildup_speed', 'cpu_teammate') }] }),
        flex({ key: 'sp4', height: 28 }),
      ],
    }),

  /** 2 · El gancho: cómo sale FC27 de fábrica. */
  '02-preajuste-realista': () =>
    board({
      children: [
        flex({ key: 'e' }, eyebrow('EA SPORTS FC 27 · preajuste «Jugabilidad realista»', USER)),
        flex({ key: 'sp1', height: 22 }),
        title('Así sale FC27\nde fábrica', 104),
        flex({ key: 'sp2', height: 20 }),
        flex({ key: 's', fontSize: 24, color: DIM }, 'Leído del menú del juego, no reconstruido. 19/09/2026.'),
        flex({ key: 'sp3', flexGrow: 1 }),
        ...[
          'sprint_speed',
          'acceleration',
          'first_touch_error',
          'interception_error',
          'physicality_impact',
          'injury_frequency',
        ].map((slug) =>
          slider({
            label: nameOf(slug),
            marks: [{ scope: 'user', value: val(slug) }],
            height: 62,
          }),
        ),
        flex({ key: 'sp4', height: 18 }),
      ],
    }),

  /** 3 · El dato que engancha: la CPU no es simétrica. */
  '03-cpu-asimetria': () =>
    board({
      accent: RIVAL,
      children: [
        flex({ key: 'e' }, eyebrow('FC27 · controles de la CPU, valores de fábrica', RIVAL)),
        flex({ key: 'sp1', height: 22 }),
        title('La CPU de tu equipo\nno juega como la del rival', 84),
        flex({ key: 'sp2', height: 24 }),
        legend([
          [RIVAL, 'CPU rival'],
          [MATE, 'CPU de tu equipo'],
        ]),
        flex({ key: 'sp3', flexGrow: 1 }),
        ...[
          'cpu_buildup_speed',
          'cpu_shot_frequency',
          'cpu_finesse_shot_frequency',
          'cpu_long_shot_frequency',
          'cpu_skill_move_frequency',
          'cpu_defending_aggression',
        ].map((slug) =>
          slider({
            label: nameOf(slug),
            marks: [
              { scope: 'cpu_opponent', value: val(slug, 'cpu_opponent') },
              { scope: 'cpu_teammate', value: val(slug, 'cpu_teammate') },
            ],
            height: 56,
            fontSize: 25,
          }),
        ),
        flex({ key: 'sp4', height: 14 }),
      ],
    }),

  /** 4 · El catálogo entero, que es el trabajo que nadie quiere hacer. */
  '04-catalogo': () =>
    board({
      accent: MATE,
      children: [
        flex({ key: 'e' }, eyebrow('El menú de sliders de FC27, entero', MATE)),
        flex({ key: 'sp1', height: 26 }),
        flex({ key: 'nums', alignItems: 'flex-end', width: W - 144 }, [
          flex({ key: 'n1', flexDirection: 'column', width: 360 }, [
            flex({ key: 'a', fontFamily: 'Display', fontSize: 148, lineHeight: 0.88, color: USER }, String(totalSliders)),
            flex({ key: 'b', fontSize: 24, color: DIM, letterSpacing: 2 }, 'SLIDERS'),
          ]),
          flex({ key: 'n2', flexDirection: 'column', width: 420 }, [
            flex({ key: 'a', fontFamily: 'Display', fontSize: 148, lineHeight: 0.88, color: CHALK }, String(totalValues)),
            flex({ key: 'b', fontSize: 24, color: DIM, letterSpacing: 2 }, 'VALORES QUE METER'),
          ]),
          flex({ key: 'n3', flexDirection: 'column', width: 360 }, [
            flex({ key: 'a', fontFamily: 'Display', fontSize: 148, lineHeight: 0.88, color: MATE }, String(categoryOrder.length)),
            flex({ key: 'b', fontSize: 24, color: DIM, letterSpacing: 2 }, 'CATEGORÍAS'),
          ]),
        ]),
        flex({ key: 'sp2', flexGrow: 1 }),
        // Tres columnas: con dos, la lista se lee en zigzag y el orden del
        // menú —que es lo que se está enseñando— deja de verse.
        flex({ key: 'grid', flexWrap: 'wrap', width: W - 144 }, [
          ...categoryOrder.map((c, i) =>
            flex(
              {
                key: c,
                width: 438,
                height: 68,
                marginRight: i % 3 === 2 ? 0 : 20,
                marginBottom: 16,
                alignItems: 'center',
                paddingLeft: 22,
                paddingRight: 22,
                backgroundColor: BOARD_RAISED,
                borderRadius: 3,
              },
              [
                flex({ key: 'n', fontSize: 24, color: CHALK }, CATEGORY_LABELS[c]),
                flex({ key: 'sp', flexGrow: 1 }),
                flex({ key: 'c', fontSize: 28, color: USER }, String(counts[c])),
              ],
            ),
          ),
        ]),
        flex({ key: 'sp3', flexGrow: 1 }),
        flex({ key: 'note', fontSize: 22, color: DIM, marginBottom: 22 }, 'En el orden exacto del menú del juego, para que lo sigas con el mando en la mano.'),
      ],
    }),

  /** 5 · El diferencial: el comentario cuelga de un valor concreto. */
  '05-comentarios': () =>
    board({
      children: [
        flex({ key: 'e' }, eyebrow('Lo que no tiene una captura de pantalla')),
        flex({ key: 'sp1', height: 22 }),
        title('Cada comentario cuelga\nde un valor', 86),
        flex({ key: 'sp2', flexGrow: 1 }),
        slider({
          label: nameOf('sprint_speed'),
          marks: [
            { scope: 'user', value: val('sprint_speed') },
            { scope: 'cpu_opponent', value: val('sprint_speed', 'cpu_opponent') },
          ],
          height: 64,
          fontSize: 30,
        }),
        flex({ key: 'bubble', width: 1300, marginLeft: 60, marginTop: 6, padding: '28px 34px', backgroundColor: BOARD_RAISED, borderRadius: 3, flexDirection: 'column' }, [
          flex({ key: 'who', alignItems: 'center' }, [
            flex({ key: 'd', width: 5, height: 20, borderRadius: 2, backgroundColor: USER }),
            flex({ key: 'n', marginLeft: 12, fontSize: 21, color: USER }, '@fullmanualfg'),
            flex({ key: 's', marginLeft: 14, fontSize: 20, color: DIM }, '· sobre Velocidad · 35'),
          ]),
          flex({ key: 'txt', marginTop: 16, fontSize: 28, color: CHALK, lineHeight: 1.42, maxWidth: 1200 },
            '«A 35 el partido ya va a ritmo de verdad. Pero si juegas a 6 minutos por parte súbelo a 40, o no te da tiempo ni a rematar un centro.»'),
        ]),
        flex({ key: 'sp3', flexGrow: 1 }),
        flex({ key: 'note', fontSize: 24, color: DIM, maxWidth: 1250, lineHeight: 1.4 },
          'El porqué de un 35 no cabe en una captura. Ahí es donde se pierde, y por eso cada quien vuelve a empezar de cero.'),
        flex({ key: 'sp4', height: 22 }),
      ],
    }),

  /** 6 · Modo consola: el móvil en la mano mientras metes los valores. */
  '06-modo-consola': () =>
    board({
      accent: MATE,
      children: [
        flex({ key: 'row', width: W - 144, flexGrow: 1, alignItems: 'center' }, [
          flex({ key: 'left', flexDirection: 'column', width: 820 }, [
            flex({ key: 'e' }, eyebrow('Modo consola', MATE)),
            flex({ key: 'sp1', height: 22 }),
            title('Para meterlos sin perder la cuenta', 96),
            flex({ key: 'sp2', height: 40 }),
            ...[
              'Una columna, en el orden del menú del juego',
              'Números grandes, se leen desde el sofá',
              'Marcas cada slider que ya has metido',
              'La pantalla no se apaga a mitad',
            ].map((t) =>
              flex({ key: t, alignItems: 'center', marginBottom: 18, width: 780 }, [
                flex({ key: 'd', width: 5, height: 22, borderRadius: 2, backgroundColor: MATE }),
                flex({ key: 't', marginLeft: 16, fontSize: 26, color: CHALK }, t),
              ]),
            ),
          ]),
          flex({ key: 'spacer', flexGrow: 1 }),
          // Maqueta del móvil
          flex(
            {
              key: 'phone',
              width: 420,
              height: 664,
              flexDirection: 'column',
              backgroundColor: '#06170f',
              borderRadius: 3,
              padding: '26px 28px',
            },
            [
              flex({ key: 'h', fontSize: 17, color: DIM, letterSpacing: 3 }, 'TIRO · 3 DE 11'),
              flex({ key: 'sp', height: 20 }),
              ...[
                ['Error en tiros normales', val('shot_error'), true],
                ['Velocidad de tiros normales', val('shot_speed'), true],
                ['Error en tiros de calidad', val('finesse_shot_error'), true],
                ['Velocidad de tiros de calidad', val('finesse_shot_speed'), false],
                ['Error en vaselina', val('chip_shot_error'), false],
                ['Altura de vaselina', val('chip_shot_height'), false],
              ].map(([label, value, done]) =>
                flex(
                  {
                    key: String(label),
                    alignItems: 'center',
                    width: 364,
                    height: 88,
                    marginBottom: 10,
                    paddingLeft: 18,
                    paddingRight: 18,
                    backgroundColor: done ? '#0f2c24' : BOARD_RAISED,
                    borderRadius: 3,
                  },
                  [
                    flex({ key: 'c', width: 26, height: 26, borderRadius: 3, backgroundColor: done ? MATE : 'transparent', border: done ? 'none' : `2px solid ${RULE}` }),
                    flex({ key: 'n', marginLeft: 16, width: 190, fontSize: 19, color: done ? DIM : CHALK, lineHeight: 1.25 }, String(label)),
                    flex({ key: 'sp', flexGrow: 1 }),
                    flex({ key: 'v', fontFamily: 'Display', fontSize: 54, color: done ? DIM : USER }, String(value)),
                  ],
                ),
              ),
            ],
          ),
        ]),
        flex({ key: 'sp3', height: 24 }),
      ],
    }),

  /** 7 · La llamada: publica el tuyo. */
  '07-publica-tu-set': () =>
    board({
      children: [
        flex({ key: 'e' }, eyebrow('Tienes tus sliders en una nota del móvil')),
        flex({ key: 'sp1', height: 24 }),
        title('Publica tu set', 128),
        flex({ key: 'sp2', height: 26 }),
        flex({ key: 's', fontSize: 30, color: DIM, maxWidth: 1150, lineHeight: 1.4 },
          'Y deja de reescribirlo cada vez que alguien te lo pide en respuestas.'),
        flex({ key: 'sp3', flexGrow: 1 }),
        flex({ key: 'steps', width: W - 144 }, [
          ...[
            ['01', 'Entras', 'Con correo y contraseña, o con tu cuenta de X.'],
            ['02', 'Metes los valores', 'El catálogo real de FC27, en el orden del menú.'],
            ['03', 'Compartes el enlace', 'Con su tarjeta, y con los comentarios ya abiertos.'],
          ].map(([n, t, d], i) =>
            flex(
              {
                key: n,
                flexDirection: 'column',
                width: 440,
                height: 250,
                marginRight: i === 2 ? 0 : 28,
                padding: '30px 30px',
                backgroundColor: BOARD_RAISED,
                borderRadius: 3,
              },
              [
                flex({ key: 'n', fontFamily: 'Display', fontSize: 66, color: USER, lineHeight: 1 }, n),
                flex({ key: 't', marginTop: 14, fontSize: 30, color: CHALK }, t),
                flex({ key: 'd', marginTop: 12, fontSize: 22, color: DIM, lineHeight: 1.4, maxWidth: 380 }, d),
              ],
            ),
          ),
        ]),
        flex({ key: 'sp4', height: 30 }),
      ],
    }),
};

// ---------------------------------------------------------------------------

const [display, mono] = await Promise.all([
  readFile(join(root, 'public/fonts/big-shoulders-900.ttf')),
  readFile(join(root, 'public/fonts/plex-mono-500.ttf')),
]);

await mkdir(outDir, { recursive: true });

for (const [name, build] of Object.entries(cards)) {
  const res = new ImageResponse(build(), {
    width: W,
    height: H,
    fonts: [
      { name: 'Display', data: display, weight: 900, style: 'normal' },
      { name: 'Plex', data: mono, weight: 500, style: 'normal' },
    ],
  });
  const file = join(outDir, `${name}.png`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log('·', file.replace(`${root}/`, ''));
}

console.log(`\n${Object.keys(cards).length} imágenes en promo/x/ (${W}×${H}).`);
