import { fondoCamiseta } from '@/components/reto/camiseta';
import { SHARE_CARD_SIZE } from '@/components/share-card';
import type { Reto } from '@/lib/retos/tipos';

/**
 * Imagen para compartir de un reto de modo carrera.
 *
 * No lleva la pizarra verde de SlidersFC: copia la portada del propio reto
 * (colores del tema, camiseta del club, titular partido, sello y marcadores)
 * porque es lo que se va a abrir al pinchar. La marca de la web queda en una
 * esquina.
 *
 * Satori: `display: flex` explícito en todo `div` con más de un hijo, y
 * anchos fijos. Las rayas y los aros son `div`s y no un
 * `repeating-linear-gradient`, que Satori no pinta igual en todas las
 * versiones; el resto de patrones (mitades, banda, liso) son un degradado de
 * paradas duras o un color, que sí salen bien.
 */

const W = SHARE_CARD_SIZE.width;
const H = SHARE_CARD_SIZE.height;
const RAYAS = 9;
const ANCHO_RAYAS = 470;
const BANDA = 146;

/** La camiseta del club como bloque de `ancho` × `alto`, a la manera de cada patrón. */
function Camiseta({ camiseta, ancho, alto }: { camiseta: Reto['tema']['camiseta']; ancho: number; alto: number }) {
  const [a, b] = camiseta.colores;

  if (camiseta.patron === 'rayas' || camiseta.patron === 'aros') {
    const vertical = camiseta.patron === 'rayas';
    return (
      <div
        style={{
          width: ancho,
          height: alto,
          display: 'flex',
          flexDirection: vertical ? 'row' : 'column',
        }}
      >
        {Array.from({ length: RAYAS }, (_, i) => (
          <div
            key={i}
            style={{
              width: vertical ? ancho / RAYAS : '100%',
              height: vertical ? '100%' : alto / RAYAS,
              backgroundColor: i % 2 ? b : a,
            }}
          />
        ))}
      </div>
    );
  }

  return <div style={{ width: ancho, height: alto, display: 'flex', backgroundImage: fondoCamiseta(camiseta) }} />;
}

export function RetoShareCard({ reto }: { reto: Reto }) {
  const { tema, portada, resumen } = reto;
  const { titular, antetitulo, sello, marcadores } = portada;
  const fondo = tema.primario;
  const fondoProfundo = tema.primarioProfundo;
  const rojo = tema.acento;
  const blanco = '#ffffff';
  const largo = Math.max(titular[0].length, titular[1].length);
  const cuerpo = largo > 17 ? 92 : largo > 14 ? 108 : 120;

  return (
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        position: 'relative',
        backgroundColor: fondo,
        color: '#ffffff',
        fontFamily: 'Plex',
      }}
    >
      {/* La camiseta del club a la derecha, fundida hacia el fondo. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: ANCHO_RAYAS,
          height: H - BANDA,
          display: 'flex',
        }}
      >
        <Camiseta camiseta={tema.camiseta} ancho={ANCHO_RAYAS} alto={H - BANDA} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: ANCHO_RAYAS,
          height: H - BANDA,
          backgroundImage: `linear-gradient(90deg, ${fondo} 0%, ${fondo}e6 20%, ${fondo}59 60%, ${fondo}26 100%)`,
        }}
      />

      {/* El sello. */}
      <div
        style={{
          position: 'absolute',
          top: 92,
          right: 92,
          width: 290,
          height: 290,
          borderRadius: 290,
          backgroundColor: fondoProfundo,
          border: `10px solid ${blanco}`,
          boxShadow: `0 0 0 10px ${rojo}, 0 24px 40px rgba(10,16,40,.55)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: blanco,
            color: fondoProfundo,
            padding: '6px 18px 0',
            fontFamily: 'Display',
            fontSize: 74,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
        >
          {sello.grande}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 14,
            fontSize: 22,
            letterSpacing: '0.24em',
            color: blanco,
          }}
        >
          {sello.pequeno}
        </div>
      </div>

      {/* Columna de texto. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 760,
          height: H - BANDA,
          padding: '54px 0 0 64px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '8px 16px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,.22)',
            backgroundColor: `${rojo}40`,
            color: '#ffd4cf',
            fontSize: 17,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {antetitulo}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontFamily: 'Display',
            fontSize: cuerpo,
            lineHeight: 0.9,
            textTransform: 'uppercase',
          }}
        >
          {titular[0]}
        </div>
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            marginTop: 14,
            padding: '8px 22px 0',
            backgroundColor: blanco,
            color: rojo,
            fontFamily: 'Display',
            fontSize: cuerpo,
            lineHeight: 0.9,
            textTransform: 'uppercase',
            transform: 'skewX(-6deg)',
            boxShadow: `10px 10px 0 ${fondoProfundo}`,
          }}
        >
          {titular[1]}
        </div>
        <div
          style={{
            display: 'flex',
            width: 640,
            marginTop: 34,
            fontSize: 19,
            lineHeight: 1.4,
            color: '#dfe4f5',
          }}
        >
          {resumen}
        </div>
      </div>

      {/* Marcadores, como la banda bajo la portada de la guía. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: W,
          height: BANDA,
          display: 'flex',
          backgroundColor: fondoProfundo,
          borderTop: `6px solid ${rojo}`,
        }}
      >
        {marcadores.map((m, i) => (
          <div
            key={m.etiqueta}
            style={{
              width: (W - 220) / marcadores.length,
              height: '100%',
              padding: '18px 0 0 28px',
              display: 'flex',
              flexDirection: 'column',
              borderRight: i < marcadores.length - 1 ? '1px solid rgba(255,255,255,.12)' : 'none',
            }}
          >
            <div style={{ display: 'flex', fontSize: 14, letterSpacing: '0.16em', color: '#ff8b80', textTransform: 'uppercase' }}>
              {m.etiqueta}
            </div>
            <div style={{ display: 'flex', fontFamily: 'Display', fontSize: 50, lineHeight: 1, marginTop: 4 }}>
              {m.valor}
            </div>
            <div style={{ display: 'flex', fontSize: 14, color: '#aab3d6', marginTop: 4 }}>{m.detalle}</div>
          </div>
        ))}

        <div
          style={{
            width: 220,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#06170f',
          }}
        >
          <div style={{ display: 'flex', fontFamily: 'Display', fontSize: 38, lineHeight: 1 }}>
            <span style={{ color: '#f2efe4' }}>SLIDERS</span>
            <span style={{ color: '#ffd24a' }}>FC</span>
          </div>
          <div style={{ display: 'flex', marginTop: 8, fontSize: 12, letterSpacing: '0.18em', color: '#93a9a1' }}>
            MODO CARRERA
          </div>
        </div>
      </div>
    </div>
  );
}
