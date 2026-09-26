/**
 * Tarjeta que se genera como imagen de OpenGraph para la comparación de dos
 * sets: en vez del resumen de un set solo, lo que enseña es en qué se
 * diferencian.
 *
 * Se dibuja con Satori (next/og), igual que `ShareCard`: sólo flexbox,
 * posicionamiento absoluto y estilos en línea. Nada de clases de Tailwind ni
 * de grid.
 *
 * El tamaño es `SHARE_CARD_SIZE`, de `share-card.tsx`: quien genere la imagen
 * lo importa de ahí, no hace falta declararlo aquí también.
 */

const BOARD = '#0b241f';
const CHALK = '#f2efe4';
const CHALK_DIM = '#93a9a1';

// Mismos colores que `COMPARE_INK` en `slider-scale.tsx`, pero declarados
// aquí a mano: ese módulo es de la web (clases, hooks), no de Satori, y
// arrastrarlo aquí encadenaría esta tarjeta a módulos que no necesita.
const A_INK = '#ffd24a';
const B_INK = '#7fe0c8';

// Mismos colores que `--color-delta-up` / `--color-delta-down` en
// globals.css, medidos ahí contra este mismo fondo (BOARD).
const DELTA_UP = '#5ec96a';
const DELTA_DOWN = '#ff7d94';

export type CompareCardData = {
  gameName: string;
  differing: number;
  total: number;
  a: { title: string; author: string };
  b: { title: string; author: string };
  rows: { name: string; a: number | null; b: number | null; delta: number }[];
};

/** Signo tipográfico (menos U+2212, no un guion) delante del valor absoluto. */
function formatDelta(delta: number) {
  return delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`;
}

export function CompareCard({ data }: { data: CompareCardData }) {
  const title =
    data.differing === 0 ? 'Son el mismo set' : `Se separan en ${data.differing} de ${data.total}`;

  // Mismo truco que en ShareCard: el título manda en el alto disponible.
  const titleSize = title.length > 40 ? 64 : title.length > 26 ? 80 : 100;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BOARD,
        color: CHALK,
        padding: '52px 64px',
        fontFamily: 'Plex',
      }}
    >
      {/* Marca */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', fontFamily: 'Display', fontSize: 38 }}>
          <span>SLIDERS</span>
          <span style={{ color: A_INK }}>FC</span>
        </div>
        <div style={{ display: 'flex', marginLeft: 16, fontSize: 17, color: CHALK_DIM }}>
          BY FULL MANUAL FG
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div
          style={{
            display: 'flex',
            fontSize: 19,
            color: A_INK,
            border: `2px solid ${A_INK}`,
            borderRadius: 3,
            padding: '5px 13px',
          }}
        >
          {data.gameName.toUpperCase()}
        </div>
      </div>

      {/* Titular */}
      <div
        style={{
          display: 'flex',
          fontFamily: 'Display',
          fontSize: titleSize,
          lineHeight: 1.04,
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        {title}
      </div>

      {/* Los dos sets, uno al lado del otro */}
      <div style={{ display: 'flex', width: '100%', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 520 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Display',
              fontSize: 30,
              lineHeight: 1.05,
              color: A_INK,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {data.a.title}
          </div>
          <div style={{ display: 'flex', marginTop: 8, fontSize: 18, color: CHALK_DIM }}>
            {data.a.author}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: 520, marginLeft: 32 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Display',
              fontSize: 30,
              lineHeight: 1.05,
              color: B_INK,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {data.b.title}
          </div>
          <div style={{ display: 'flex', marginTop: 8, fontSize: 18, color: CHALK_DIM }}>
            {data.b.author}
          </div>
        </div>
      </div>

      {/* Las filas donde más se separan, o el aviso de que no hay ninguna */}
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column', flexShrink: 0 }}>
        {data.rows.length === 0 ? (
          <div style={{ display: 'flex', fontSize: 22, color: CHALK_DIM }}>
            Los {data.total} valores coinciden.
          </div>
        ) : (
          data.rows.map((row) => (
            <div
              key={row.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 40,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  fontSize: 22,
                  color: CHALK,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {row.name}
              </div>

              <div style={{ display: 'flex', width: 90, justifyContent: 'flex-end', fontSize: 26, color: A_INK }}>
                {row.a === null ? '—' : row.a}
              </div>

              <div
                style={{
                  display: 'flex',
                  width: 90,
                  marginLeft: 24,
                  justifyContent: 'flex-end',
                  fontSize: 26,
                  color: B_INK,
                }}
              >
                {row.b === null ? '—' : row.b}
              </div>

              <div
                style={{
                  display: 'flex',
                  width: 110,
                  marginLeft: 24,
                  justifyContent: 'flex-end',
                  fontSize: 26,
                  color: row.delta > 0 ? DELTA_UP : DELTA_DOWN,
                }}
              >
                {row.a === null || row.b === null ? '—' : formatDelta(row.delta)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sin pie. La marca ya está arriba, y repetirla abajo en la misma
          tarjeta no cierra nada: sólo la dice dos veces. */}
    </div>
  );
}
