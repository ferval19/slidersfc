import type { CSSProperties, ReactNode } from 'react';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import Link from 'next/link';

import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { localized, setPath } from '@/lib/paths';

import type { Reto, Seccion, Tema } from '../../lib/retos/tipos';

import { fondoCamiseta } from './camiseta';
import { BotonCopiar } from './copiar';
import { Icono, IconosSprite } from './iconos';
import { Marco } from './marco';
import styles from './reto.module.css';
import { SeccionContextoCuerpo } from './seccion-contexto';
import { SeccionMercadoCuerpo } from './seccion-mercado';
import { SeccionPizarraCuerpo } from './seccion-pizarra';
import { SeccionPlantillaCuerpo } from './seccion-plantilla';
import { SeccionPrincipiosCuerpo } from './seccion-principios';
import { SeccionReglasCuerpo } from './seccion-reglas';
import { SeccionSagaCuerpo } from './seccion-saga';
import { SeccionVideosCuerpo } from './seccion-videos';
import { Texto } from './texto';

/**
 * Las dos familias del cuerpo del reto. La de los titulares (Big Shoulders)
 * ya la carga el layout del sitio como `--font-big-shoulders`; `next/font` no
 * exporta `Big_Shoulders_Display`, que es el mismo diseño con otro nombre.
 */
const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

/**
 * El ancla de cada tipo de sección. Los enlaces antiguos (`#tacticas`,
 * `#lore`…) siguen valiendo; si un reto repite tipo, el segundo lleva `-2`.
 */
const ANCLA: Record<Seccion['tipo'], string> = {
  contexto: 'contexto',
  principios: 'adn',
  videos: 'videos',
  pizarra: 'tacticas',
  plantilla: 'plantilla',
  mercado: 'mercado',
  saga: 'lore',
  reglas: 'reglas',
};

function anclas(secciones: Seccion[]): string[] {
  const usadas = new Map<string, number>();
  return secciones.map((seccion) => {
    const base = ANCLA[seccion.tipo];
    const veces = (usadas.get(base) ?? 0) + 1;
    usadas.set(base, veces);
    return veces === 1 ? base : `${base}-${veces}`;
  });
}

/**
 * El tema como variables CSS en la raíz del reto, y los patrones de camiseta
 * ya resueltos a un `background` (ver `camiseta.ts`) para que el CSS no tenga
 * que saber de patrones: `--cam-4` es la camiseta con franjas de 4 px, y las
 * `--cam-y*` las de los separadores verticales.
 */
function variablesDelTema(tema: Tema): CSSProperties {
  const [a, b] = tema.camiseta.colores;
  const variables: Record<string, string> = {
    '--primario': tema.primario,
    '--primario-profundo': tema.primarioProfundo,
    '--acento': tema.acento,
    '--acento-profundo': tema.acentoProfundo,
    '--papel': tema.papel,
    '--tinta': tema.tinta,
    '--camiseta-a': a,
    '--camiseta-b': b,
    '--cam-4': fondoCamiseta(tema.camiseta, 4),
    '--cam-6': fondoCamiseta(tema.camiseta, 6),
    '--cam-12': fondoCamiseta(tema.camiseta, 12),
    '--cam-y10': fondoCamiseta(tema.camiseta, 10, 'y'),
    '--cam-y14': fondoCamiseta(tema.camiseta, 14, 'y'),
  };
  return variables as CSSProperties;
}

/** El disco del sello: la camiseta del club, recortada en círculo, con el patrón que toque. */
function DiscoCamiseta({ camiseta }: { camiseta: Tema['camiseta'] }) {
  const [a, b] = camiseta.colores;
  const franjas = [0, 1, 2, 3].map((i) => 42 + i * 33.2);

  switch (camiseta.patron) {
    case 'rayas':
      return (
        <>
          <rect x="42" y="42" width="116" height="116" fill={b} />
          {franjas.map((x) => (
            <rect key={x} x={x} y="42" width="16.6" height="116" fill={a} />
          ))}
        </>
      );
    case 'aros':
      return (
        <>
          <rect x="42" y="42" width="116" height="116" fill={b} />
          {franjas.map((y) => (
            <rect key={y} x="42" y={y} width="116" height="16.6" fill={a} />
          ))}
        </>
      );
    case 'mitades':
      return (
        <>
          <rect x="42" y="42" width="116" height="116" fill={b} />
          <rect x="42" y="42" width="58" height="116" fill={a} />
        </>
      );
    case 'banda':
      return (
        <>
          <rect x="42" y="42" width="116" height="116" fill={b} />
          <path d="M42 42H78L158 122V158H122L42 78Z" fill={a} />
        </>
      );
    case 'liso':
      return <rect x="42" y="42" width="116" height="116" fill={a} />;
  }
}

function Sello({ reto }: { reto: Reto }) {
  const { tema, portada } = reto;
  const { grande, pequeno, anillo } = portada.sello;

  return (
    <div className={styles.emblem} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="reto-anillo" d="M100 100 m-77 0 a77 77 0 1 1 154 0 a77 77 0 1 1 -154 0" />
          <clipPath id="reto-disco">
            <circle cx="100" cy="100" r="58" />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="97" fill={tema.primarioProfundo} stroke="#ffffff" strokeWidth="3" />
        <circle cx="100" cy="100" r="89" fill="none" stroke={tema.acento} strokeWidth="2" />
        <circle cx="100" cy="100" r="65" fill="none" stroke={tema.acento} strokeWidth="2" />
        <g className={styles.ring}>
          <text className={styles.ringText} fontSize="12.5" letterSpacing="3.2" fill="#ffffff">
            <textPath href="#reto-anillo">{`${anillo} · `}</textPath>
          </text>
        </g>
        <g className={styles.pop}>
          <g clipPath="url(#reto-disco)">
            <DiscoCamiseta camiseta={tema.camiseta} />
          </g>
          <circle cx="100" cy="100" r="58" fill="none" stroke="#ffffff" strokeWidth="3" />
          <rect x="52" y="80" width="96" height="40" rx="6" fill={tema.primario} stroke="#ffffff" strokeWidth="2" />
          <text
            className={styles.selloGrande}
            x="100"
            y="110"
            textAnchor="middle"
            fontSize="30"
            fill="#ffffff"
            textLength={Math.min(80, grande.length * 16)}
            lengthAdjust="spacingAndGlyphs"
          >
            {grande.toUpperCase()}
          </text>
          <text
            className={styles.selloPequeno}
            x="100"
            y="140"
            textAnchor="middle"
            fontSize="11"
            fill={tema.primario}
            letterSpacing="2"
          >
            {pequeno.toUpperCase()}
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Las rayas de la portada: caen una a una si la camiseta es a rayas; el resto de patrones sólo aparece. */
function RayasPortada({ tema }: { tema: Tema }) {
  const [a, b] = tema.camiseta.colores;

  return (
    <div className={styles.stripes} aria-hidden="true">
      {tema.camiseta.patron === 'rayas' ? (
        Array.from({ length: 9 }, (_, i) => <i key={i} style={{ background: i % 2 === 0 ? a : b }} />)
      ) : (
        <i className={styles.stripePlano} style={{ background: fondoCamiseta(tema.camiseta, 48) }} />
      )}
    </div>
  );
}

function Cuerpo({
  reto,
  seccion,
}: {
  reto: Reto;
  seccion: Seccion;
}): ReactNode {
  switch (seccion.tipo) {
    case 'contexto':
      return <SeccionContextoCuerpo seccion={seccion} />;
    case 'principios':
      return <SeccionPrincipiosCuerpo seccion={seccion} />;
    case 'videos':
      return <SeccionVideosCuerpo seccion={seccion} />;
    case 'pizarra': {
      const plantilla = reto.secciones.find((s) => s.tipo === 'plantilla');
      return (
        <SeccionPizarraCuerpo seccion={seccion} jugadores={plantilla?.tipo === 'plantilla' ? plantilla.jugadores : []} />
      );
    }
    case 'plantilla': {
      const pizarra = reto.secciones.find((s) => s.tipo === 'pizarra');
      return (
        <SeccionPlantillaCuerpo
          seccion={seccion}
          primerPlan={pizarra?.tipo === 'pizarra' ? pizarra.planes[0] : undefined}
        />
      );
    }
    case 'mercado':
      return <SeccionMercadoCuerpo seccion={seccion} />;
    case 'saga':
      return <SeccionSagaCuerpo seccion={seccion} />;
    case 'reglas':
      return <SeccionReglasCuerpo seccion={seccion} />;
  }
}

/**
 * Un reto entero: barra de secciones, portada, desafío, las secciones
 * numeradas por orden y el pie de fuentes.
 *
 * Se pinta dentro del layout del sitio, así que es un `div` y no un
 * documento: lleva su propio `lang="es"` porque los retos no se traducen y
 * en `/en` la página sigue siendo castellana. Todo su CSS está en un módulo
 * (`reto.module.css`) por la misma razón de aislamiento: la web ya define
 * `.chip`, `.eyebrow`, `.panel` o `.btn`, y un CSS global del reto los pisaría.
 */
export function RetoPagina({ reto, locale = DEFAULT_LOCALE }: { reto: Reto; locale?: Locale }) {
  const { tema, portada, desafio, setRecomendado } = reto;
  const ids = anclas(reto.secciones);
  const enlaces = [
    ...(desafio ? [{ id: 'desafio', rotulo: 'Desafío' }] : []),
    ...reto.secciones.map((seccion, i) => ({ id: ids[i], rotulo: seccion.cabecera.nav ?? seccion.cabecera.titulo })),
  ];

  return (
    <div
      lang="es"
      className={`${styles.reto} ${barlow.variable} ${barlowCondensed.variable}`}
      style={variablesDelTema(tema)}
    >
      <IconosSprite />

      <nav className={styles.nav} aria-label="Secciones">
        <div className={`${styles.wrap} ${styles.navDentro}`}>
          <a className={styles.brand} href="#inicio">
            <span className={styles.brandFlag} aria-hidden="true" />
            <span className={styles.txt}>
              {portada.sello.grande} · {portada.sello.pequeno}
            </span>
          </a>
          <ul>
            {enlaces.map((enlace) => (
              <li key={enlace.id}>
                <a className={styles.lnk} href={`#${enlace.id}`}>
                  {enlace.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <header className={styles.hero} id="inicio">
        <RayasPortada tema={tema} />
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div>
            <span className={styles.eyebrow}>
              <Icono nombre="silbato" />
              {portada.antetitulo}
            </span>
            <h1>
              <span className={styles.l1}>{portada.titular[0]}</span>
              <span className={styles.l2}>{portada.titular[1]}</span>
            </h1>
            <p className={styles.lead}>
              <Texto>{portada.entradilla}</Texto>
            </p>
          </div>
          <Sello reto={reto} />
        </div>
        <div className={styles.scoreband}>
          <div className={`${styles.wrap} ${styles.scores}`}>
            {portada.marcadores.map((marcador) => (
              <div key={marcador.etiqueta} className={styles.score}>
                <small>{marcador.etiqueta}</small>
                <b>{marcador.valor}</b>
                <span>{marcador.detalle}</span>
              </div>
            ))}
          </div>
        </div>
        {/* La cinta se pinta dos veces: la animación la desplaza la mitad y empalma. */}
        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.track}>
            {[...portada.cinta, ...portada.cinta].map((texto, i) => (
              <span key={i}>{texto}</span>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.wrap}>
        <p className={styles.note}>{reto.notaDatos}</p>
        {desafio ? (
          <aside id="desafio" className={styles.challenge} aria-label="Desafío de Manager Live">
            <div className={styles.ic}>
              <Icono nombre="mando" />
            </div>
            <div>
              <small>Desafío de Manager Live</small>
              <p>
                <Texto>{desafio.texto}</Texto>
              </p>
            </div>
            <div className={styles.cbox}>
              <code>{desafio.codigo}</code>
              <BotonCopiar texto={desafio.codigo} variante="desafio" />
            </div>
          </aside>
        ) : null}
        {setRecomendado ? (
          <div className={styles.recomendado}>
            <Icono nombre="enlace" />
            <p>
              <b>Un set que le va bien a este reto</b>
              <Link href={localized(locale, setPath(setRecomendado.usuario, setRecomendado.slug))}>
                {setRecomendado.slug} · @{setRecomendado.usuario}
              </Link>
            </p>
          </div>
        ) : null}
      </div>

      <div>
        {reto.secciones.map((seccion, i) => (
          <Marco
            key={ids[i]}
            id={ids[i]}
            numero={String(i + 1).padStart(2, '0')}
            alt={i % 2 === 0}
            cabecera={seccion.cabecera}
          >
            <Cuerpo reto={reto} seccion={seccion} />
          </Marco>
        ))}
      </div>

      <footer className={styles.pie}>
        <div className={styles.wrap}>
          <h3>Fuentes</h3>
          <ul>
            {reto.fuentes.map((fuente) => (
              <li key={fuente}>
                <Texto>{fuente}</Texto>
              </li>
            ))}
          </ul>
          <p className={styles.disclaimer}>
            <Texto>{reto.aviso}</Texto>
          </p>
        </div>
      </footer>
    </div>
  );
}
