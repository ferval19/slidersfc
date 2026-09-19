/**
 * Tarjeta que se genera como imagen de OpenGraph.
 *
 * Se dibuja con Satori (next/og), que sólo entiende un subconjunto de CSS:
 * flexbox, posicionamiento absoluto y estilos en línea. Nada de clases de
 * Tailwind ni de grid.
 *
 * Va aparte de la ruta a propósito: así se puede revisar el diseño con datos
 * de prueba sin tener que publicar un set.
 */

export const SHARE_CARD_SIZE = { width: 1200, height: 630 };

const BOARD = '#0b241f';
const CHALK = '#f2efe4';
const CHALK_DIM = '#93a9a1';
const INK = {
  user: '#ffd24a',
  cpu: '#ff5c7a',
  cpu_opponent: '#ff5c7a',
  cpu_teammate: '#7fe0c8',
} as const;

export type ShareCardRow = {
  name: string;
  marks: { scope: keyof typeof INK; value: number }[];
};

export type ShareCardData = {
  title: string;
  gameName: string;
  authorName: string;
  authorHandle: string;
  sliderCount: number;
  commentCount: number;
  rows: ShareCardRow[];
};

export function ShareCard({ data }: { data: ShareCardData }) {
  // El título manda en el alto disponible, así que su cuerpo depende de lo
  // largo que sea. Sin esto, las filas de abajo se quedaban sin sitio.
  const titleSize = data.title.length > 40 ? 64 : data.title.length > 26 ? 80 : 100;

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
          <span style={{ color: INK.user }}>FC</span>
        </div>
        <div style={{ display: 'flex', marginLeft: 16, fontSize: 17, color: CHALK_DIM }}>
          BY FULL MANUAL FG
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div
          style={{
            display: 'flex',
            fontSize: 19,
            color: INK.user,
            border: `2px solid ${INK.user}`,
            borderRadius: 3,
            padding: '5px 13px',
          }}
        >
          {data.gameName.toUpperCase()}
        </div>
      </div>

      {/* Título y autor */}
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Display',
            fontSize: titleSize,
            lineHeight: 1.04,
            textTransform: 'uppercase',
          }}
        >
          {data.title}
        </div>

        <div style={{ display: 'flex', marginTop: 14, fontSize: 22, color: CHALK_DIM }}>
          <span style={{ color: CHALK }}>{data.authorName}</span>
          {data.authorHandle ? (
            <span style={{ marginLeft: 12 }}>@{data.authorHandle}</span>
          ) : null}
          <span style={{ marginLeft: 12 }}>·</span>
          <span style={{ marginLeft: 12 }}>{data.sliderCount} sliders</span>
          {data.commentCount > 0 ? (
            <span style={{ marginLeft: 12 }}>
              · {data.commentCount} {data.commentCount === 1 ? 'comentario' : 'comentarios'}
            </span>
          ) : null}
        </div>
      </div>

      {/* Muestra de valores: es lo que hace útil la tarjeta */}
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column', flexShrink: 0 }}>
        {data.rows.map((row) => (
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
            {/* Anchos fijos en lugar de flexGrow: con crecimiento elástico la
                fila se salía del lienzo y la columna de valores desaparecía. */}
            <div
              style={{
                display: 'flex',
                width: 300,
                flexShrink: 0,
                fontSize: 21,
                color: CHALK,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {row.name}
            </div>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                width: 560,
                flexShrink: 0,
                height: 26,
                alignItems: 'center',
              }}
            >
              <div
                style={{ display: 'flex', width: '100%', height: 2, backgroundColor: '#f2efe433' }}
              />
              {row.marks.map((mark, index) => (
                <div
                  key={mark.scope}
                  style={{
                    position: 'absolute',
                    left: `${mark.value}%`,
                    top: row.marks.length > 1 ? 2 + index * (22 / row.marks.length) : 2,
                    width: 4,
                    height: row.marks.length > 1 ? 22 / row.marks.length : 22,
                    borderRadius: 2,
                    backgroundColor: INK[mark.scope],
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', width: 190, flexShrink: 0, justifyContent: 'flex-end' }}>
              {row.marks.map((mark) => (
                <div
                  key={mark.scope}
                  style={{
                    display: 'flex',
                    width: 60,
                    justifyContent: 'flex-end',
                    fontSize: 25,
                    color: INK[mark.scope],
                  }}
                >
                  {mark.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
/**
 * Tarjeta por defecto, para todo lo que no es la ficha de un set: portada,
 * páginas de juego y perfiles. Sin ella, compartir cualquiera de esas páginas
 * no enseñaba imagen ninguna.
 */
export function BrandCard({ subtitle }: { subtitle: string }) {
  // Tres filas de muescas, como guiño al regulador de la web. Valores reales
  // del preajuste realista de FC27.
  const rows: { user: number; cpu: number }[] = [
    { user: 35, cpu: 35 },
    { user: 52, cpu: 52 },
    { user: 65, cpu: 65 },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: BOARD,
        color: CHALK,
        padding: '64px 72px',
        fontFamily: 'Plex',
      }}
    >
      <div style={{ display: 'flex', fontFamily: 'Display', fontSize: 132, lineHeight: 1 }}>
        <span>SLIDERS</span>
        <span style={{ color: INK.user }}>FC</span>
      </div>

      <div style={{ display: 'flex', marginTop: 10, fontSize: 24, color: CHALK_DIM }}>
        BY FULL MANUAL FG
      </div>

      <div style={{ display: 'flex', marginTop: 34, fontSize: 32, color: CHALK, maxWidth: 900 }}>
        {subtitle}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 46 }}>
        {rows.map((row, index) => (
          <div
            key={index}
            style={{ display: 'flex', alignItems: 'center', width: 720, height: 30 }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                width: 720,
                height: 24,
                alignItems: 'center',
              }}
            >
              <div
                style={{ display: 'flex', width: '100%', height: 2, backgroundColor: '#f2efe433' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `${row.user}%`,
                  top: 1,
                  width: 4,
                  height: 11,
                  borderRadius: 2,
                  backgroundColor: INK.user,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `${row.cpu}%`,
                  top: 12,
                  width: 4,
                  height: 11,
                  borderRadius: 2,
                  backgroundColor: INK.cpu,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
