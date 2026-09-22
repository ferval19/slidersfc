/**
 * Dibujos de pizarra. SVG en línea, trazo único de tiza, con el filtro
 * `chalk-rough` que les da el temblor de una línea hecha a mano.
 *
 * Regla de uso: un dibujo entra en la página sólo si dice algo. Portada del
 * hero, marca de sección y estado vacío. Nunca como relleno.
 */

/** Definiciones de filtro. Va una sola vez, en el layout. */
export function ChalkFilters() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <filter id="chalk-rough" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Medio campo con una jugada pintada encima: los tuyos en amarillo, la línea
 * defensiva rival en rojo. Es la portada del hero.
 */
export function PitchDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 520"
      className={className}
      role="img"
      aria-label="Medio campo dibujado a tiza con una jugada de ataque: tres delanteros, dos carriles de desmarque y la línea defensiva rival"
    >
      <g className="chalk-stroke" stroke="#f2efe4" strokeOpacity="0.5" strokeWidth="1.8">
        {/* Líneas de banda y fondo */}
        <path d="M24 18 Q200 22 376 17 Q378 260 377 502 Q200 498 23 503 Q21 260 24 18 Z" />
        {/* Círculo central (medio) */}
        <path d="M140 18 Q141 66 200 78 Q259 65 260 19" />
        {/* Área grande */}
        <path d="M86 394 Q200 391 314 395 L313 502" />
        <path d="M86 394 L87 502" />
        {/* Área pequeña */}
        <path d="M150 456 Q200 453 250 457 L250 502" />
        <path d="M150 456 L151 502" />
        {/* Semicírculo del área */}
        <path d="M148 394 Q200 348 252 395" />
        {/* Punto de penalti */}
        <path d="M199 414 L201 414" strokeWidth="5" />
        {/* Portería */}
        <path d="M164 503 L164 516 Q200 513 236 516 L236 503" strokeOpacity="0.34" />
      </g>

      {/* Línea defensiva rival */}
      <g className="chalk-stroke" stroke="#ff5c7a" strokeWidth="2.4" strokeOpacity="0.85">
        <path d="M96 424 L116 444 M116 424 L96 444" />
        <path d="M164 432 L184 452 M184 432 L164 452" />
        <path d="M226 432 L246 452 M246 432 L226 452" />
        <path d="M292 424 L312 444 M312 424 L292 444" />
      </g>

      {/* Los tuyos, y por dónde van */}
      <g className="chalk-stroke" stroke="#ffd24a" strokeWidth="2.4">
        <circle cx="200" cy="330" r="13" />
        <circle cx="86" cy="268" r="13" />
        <circle cx="314" cy="268" r="13" />
        <circle cx="200" cy="150" r="13" strokeOpacity="0.6" />

        {/* Desmarques al área */}
        <path d="M92 288 Q108 356 148 396" strokeDasharray="9 8" />
        <path d="M308 288 Q292 356 252 396" strokeDasharray="9 8" />
        <path d="M200 350 Q200 382 200 404" />

        {/* Puntas de flecha */}
        <path d="M140 386 L149 399 L136 400" />
        <path d="M260 386 L251 399 L264 400" />
        <path d="M192 396 L200 408 L208 396" />

        {/* Pase del medio a la punta */}
        <path d="M200 166 Q214 236 208 314" strokeOpacity="0.45" strokeDasharray="3 9" />
      </g>
    </svg>
  );
}

/** Balón. Marca de sección. */
export function ChalkBall({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        <path d="M24 5 Q43 6 43 24 Q42 43 24 43 Q5 42 5 24 Q6 5 24 5 Z" />
        <path d="M24 14 L32 20 L29 30 L19 30 L16 20 Z" />
        <path d="M24 5 L24 14 M32 20 L42 17 M29 30 L35 38 M19 30 L13 38 M16 20 L6 17" />
      </g>
    </svg>
  );
}

/** Bota. Marca de sección para tiro y pase. */
export function ChalkBoot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        <path d="M8 14 Q9 26 12 30 Q22 33 32 32 Q42 30 42 36 L8 37 Q6 26 8 14 Z" />
        <path d="M11 39 L11 42 M19 39 L19 42 M27 39 L27 42 M35 39 L35 42" strokeWidth="1.6" />
        <path d="M13 20 Q23 22 31 27" strokeWidth="1.4" strokeOpacity="0.6" />
      </g>
    </svg>
  );
}

/** Silbato. Marca de sección para reglas y lesiones. */
export function ChalkWhistle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        <path d="M14 17 Q29 15 33 19 Q37 24 33 30 Q28 35 21 33 Q14 30 14 24 Z" />
        <path d="M33 21 L43 18" />
        <circle cx="22" cy="25" r="4" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

/** Cronómetro. Marca de sección para velocidad. */
export function ChalkStopwatch({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        <path d="M24 12 Q38 13 38 26 Q37 39 24 39 Q10 38 10 26 Q11 13 24 12 Z" />
        <path d="M20 8 L28 8" />
        <path d="M24 12 L24 8" />
        <path d="M24 26 L31 21" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** Cámara de televisión. Para la cámara con la que se probó un set. */
export function ChalkCamera({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        {/* Cuerpo */}
        <path d="M8 18 Q8 16 10 16 L29 16 Q31 16 31 18 L31 32 Q31 34 29 34 L10 34 Q8 34 8 32 Z" />
        {/* Objetivo */}
        <path d="M31 22 L40 18 Q41 17 41 19 L41 31 Q41 33 40 32 L31 28" />
        {/* Bobina */}
        <path d="M16 16 Q16 11 20 11 Q24 11 24 16" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** Guante de portero. */
export function ChalkGlove({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        <path d="M14 40 Q12 26 13 18 Q13 13 17 13 Q21 13 21 18 L21 24" />
        <path d="M21 20 Q21 14 25 14 Q29 14 29 20 L29 25" />
        <path d="M29 21 Q29 16 33 16 Q37 16 37 22 Q37 33 34 40" />
        <path d="M14 40 Q24 42 34 40" />
      </g>
    </svg>
  );
}

/** Escudo. Marca de sección para defensa. */
export function ChalkShield({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        <path d="M24 7 Q35 10 39 12 Q39 30 24 41 Q9 30 9 12 Q13 10 24 7 Z" />
        <path d="M24 7 L24 41" strokeWidth="1.4" strokeOpacity="0.55" />
      </g>
    </svg>
  );
}

/** Formación sobre el campo. Marca de sección para posicionamiento. */
export function ChalkFormation({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 8 Q24 10 41 7 Q42 24 41 41 Q24 38 6 41 Q5 24 7 8 Z" />
        <path d="M7 24 Q24 26 41 24" strokeWidth="1.2" strokeOpacity="0.5" />
      </g>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2.4">
        <path d="M14 33 L14.6 33 M24 35 L24.6 35 M34 33 L34.6 33" />
        <path d="M17 15 L17.6 15 M31 15 L31.6 15" />
      </g>
    </svg>
  );
}

/** Carpeta de entrenador. Marca de sección para los controles de la CPU. */
export function ChalkClipboard({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="2">
        <path d="M11 9 Q24 11 37 8 Q38 24 37 41 Q24 38 10 41 Q9 25 11 9 Z" />
        <path d="M19 6 Q24 4 29 6 L29 11 Q24 13 19 11 Z" strokeWidth="1.6" />
        <path d="M16 22 Q24 24 32 22 M16 29 Q22 31 27 29" strokeWidth="1.4" strokeOpacity="0.6" />
      </g>
    </svg>
  );
}

/**
 * El regulador, a tamaño grande: tres carriles con sus muescas y la marca de
 * fábrica asomando. Es el producto dibujado — lo que hace esta web es enseñar
 * un set así en vez de como una lista de cincuenta números.
 */
export function ChalkSliderStack({ className = '' }: { className?: string }) {
  const rows = [
    { y: 26, ref: 108, user: 74, cpu: 96 },
    { y: 78, ref: 150, user: 196, cpu: 178 },
    { y: 130, ref: 96, user: 148, cpu: 148 },
    { y: 182, ref: 178, user: 132, cpu: 158 },
  ];

  return (
    <svg viewBox="0 0 300 210" className={className} aria-hidden>
      {rows.map((row) => (
        <g key={row.y}>
          {/* Carril, con su temblor */}
          <path
            className="chalk-stroke"
            stroke="#f2efe4"
            strokeOpacity="0.32"
            strokeWidth="1.8"
            d={`M24 ${row.y} Q90 ${row.y - 2} 150 ${row.y + 1} T276 ${row.y - 1}`}
          />
          {/* Topes */}
          <path
            className="chalk-stroke"
            stroke="#f2efe4"
            strokeOpacity="0.4"
            strokeWidth="1.6"
            d={`M24 ${row.y - 8} L24 ${row.y + 8} M276 ${row.y - 8} L276 ${row.y + 8}`}
          />
          {/* Lo que trae el juego */}
          <path
            className="chalk-stroke"
            stroke="#f2efe4"
            strokeOpacity="0.45"
            strokeWidth="2"
            d={`M${row.ref} ${row.y - 13} L${row.ref} ${row.y + 13}`}
          />
          {/* Usuario y CPU */}
          <path
            className="chalk-stroke"
            stroke="#ffd24a"
            strokeWidth="3.4"
            d={`M${row.user} ${row.y - 10} L${row.user} ${row.y + 10}`}
          />
          <path
            className="chalk-stroke"
            stroke="#ff5c7a"
            strokeWidth="3.4"
            d={`M${row.cpu} ${row.y - 10} L${row.cpu} ${row.y + 10}`}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Una muesca con su bocadillo: el comentario vive pegado al valor del que
 * habla. Es el diferencial de la web en un dibujo.
 */
export function ChalkCommentedValue({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 210" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="#f2efe4" strokeOpacity="0.32" strokeWidth="1.8">
        <path d="M24 150 Q90 148 150 151 T276 149" />
      </g>
      <g className="chalk-stroke" stroke="#f2efe4" strokeOpacity="0.4" strokeWidth="1.6">
        <path d="M24 140 L24 160 M276 140 L276 160" />
        <path d="M87 145 L87 155 M150 144 L150 156 M213 145 L213 155" strokeOpacity="0.25" />
      </g>
      {/* La muesca de la que se habla */}
      <g className="chalk-stroke" stroke="#ffd24a" strokeWidth="3.6">
        <path d="M117 136 L117 164" />
      </g>
      {/* Bocadillo, colgando de ella */}
      <g className="chalk-stroke" stroke="#f2efe4" strokeOpacity="0.62" strokeWidth="1.8">
        <path d="M58 42 Q57 30 70 29 L216 27 Q230 28 229 41 L230 92 Q229 105 216 104 L136 106 L118 128 L120 106 L70 105 Q57 104 58 92 Z" />
        <path d="M82 56 Q130 58 190 55" strokeOpacity="0.4" strokeWidth="1.5" />
        <path d="M82 72 Q120 74 168 71" strokeOpacity="0.4" strokeWidth="1.5" />
        <path d="M82 88 Q106 90 134 87" strokeOpacity="0.4" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/** Mando. Para el modo consola: el móvil en la mano y el juego delante. */
export function ChalkGamepad({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 210" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="#f2efe4" strokeOpacity="0.5" strokeWidth="2.4">
        {/* Cuerpo */}
        <path d="M96 72 Q150 66 204 72 Q236 78 244 116 Q250 146 232 152 Q214 157 196 128 Q150 120 104 128 Q86 157 68 152 Q50 146 56 116 Q64 78 96 72 Z" />
        {/* Cruceta */}
        <path d="M100 100 L124 100 M112 88 L112 112" strokeWidth="2" />
        {/* Botones */}
        <path d="M186 92 L186.6 92 M204 102 L204.6 102 M186 112 L186.6 112 M168 102 L168.6 102" strokeWidth="5" strokeOpacity="0.7" />
      </g>
      {/* La línea de valores que estás metiendo */}
      <g className="chalk-stroke" stroke="#ffd24a" strokeWidth="2.6" strokeOpacity="0.85">
        <path d="M74 178 Q150 172 226 178" />
        <path d="M112 170 L112 186 M168 170 L168 186" />
      </g>
    </svg>
  );
}

/** Pizarra vacía. Estado vacío. */
export function EmptyBoardDrawing({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="#f2efe4" strokeOpacity="0.34" strokeWidth="1.8">
        <path d="M10 10 Q110 13 210 9 Q212 65 210 121 Q110 118 9 122 Q7 65 10 10 Z" />
        <path d="M110 10 L110 121" strokeOpacity="0.2" strokeDasharray="6 10" />
        <path d="M84 65 Q85 42 110 40 Q135 42 136 65 Q135 88 110 90 Q85 88 84 65 Z" strokeOpacity="0.2" />
      </g>
      <g className="chalk-stroke" stroke="#ffd24a" strokeWidth="2.2" strokeOpacity="0.75">
        <path d="M148 96 Q160 97 160 106 Q159 115 148 115 Q137 114 137 106 Q138 97 148 96 Z" />
        <path d="M148 100 L152 103 L150 108 L145 108 L144 103 Z" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

/** Iconos de categoría, por si la categoría no tiene uno propio. */
// ---------------------------------------------------------------------------
// Iconos de botón
//
// Otra familia, aunque compartan tiza. Los dibujos de arriba se ven a 28 px o
// más y pueden permitirse detalle; éstos viven dentro de un botón, a 14-16 px,
// y ahí el detalle se convierte en mugre. Las reglas, por si se añade uno:
// lienzo de 48, **trazo de 4** (a 14 px da el mismo grosor aparente que un
// dibujo de trazo 2 a 28) y tres o cuatro caminos como mucho.
//
// Lo que NO se dibuja en tiza: las marcas ajenas. El logotipo de X va tal cual
// es, porque una marca no es decoración y redibujarla es falsificarla.
// ---------------------------------------------------------------------------

function Icono({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g className="chalk-stroke" stroke="currentColor" strokeWidth="4">
        {children}
      </g>
    </svg>
  );
}

/**
 * Estrella. Guardar un set de otro. Rellena cuando ya está guardado.
 *
 * El relleno va en `style` y no en `fill` porque `.chalk-stroke` declara
 * `fill: none`, y una regla de CSS le gana siempre a un atributo.
 */
export function ChalkStar({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g
        className="chalk-stroke"
        stroke="currentColor"
        strokeWidth="4"
        style={filled ? { fill: 'currentColor', fillOpacity: 0.35 } : undefined}
      >
        <path d="M24 6 L29 19 Q36 19 42 20 Q35 25 31 29 Q34 36 36 42 Q29 38 24 35 Q19 39 12 42 Q14 35 17 29 Q11 25 6 20 Q13 19 19 19 Z" />
      </g>
    </svg>
  );
}

/** Mando. Meter el set en la consola. */
export function ChalkPad({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M15 17 Q24 15 33 17 Q41 19 43 30 Q44 38 38 38 Q33 37 31 30 Q24 28 17 30 Q15 37 10 38 Q4 38 5 30 Q7 19 15 17 Z" />
      <path d="M13 24 L21 24 M17 20 L17 28" strokeWidth="3.2" />
      <path d="M33 22 L33.4 22 M37 27 L37.4 27" strokeWidth="6" />
    </Icono>
  );
}

/** Un enlace que sale. Compartir. */
export function ChalkShare({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M22 11 L11 11 Q8 11 8 14 L8 37 Q8 40 11 40 L34 40 Q37 40 37 37 L37 26" />
      <path d="M24 24 L41 7" />
      <path d="M30 7 L42 6 L41 18" />
    </Icono>
  );
}

/**
 * Dos carriles con la muesca en sitios distintos. Comparar.
 *
 * Es el regulador de la web en miniatura: quien ya ha visto una ficha
 * reconoce el dibujo antes de leer la palabra.
 */
export function ChalkScales({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M6 17 L42 17" strokeWidth="3" />
      <path d="M17 11 L17 23" />
      <path d="M6 32 L42 32" strokeWidth="3" />
      <path d="M32 26 L32 38" />
    </Icono>
  );
}

/** Tiza escribiendo. Editar. */
export function ChalkPiece({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M17 33 L32 11 L40 17 L25 39 Z" />
      <path d="M25 39 L14 41 L17 33" />
    </Icono>
  );
}

/** Ojo. Publicar o retirar: se ve o no se ve. */
export function ChalkEye({ className = '', crossed = false }: { className?: string; crossed?: boolean }) {
  return (
    <Icono className={className}>
      <path d="M5 24 Q24 9 43 24 Q24 39 5 24 Z" />
      <path d="M24 21 L24.4 21" strokeWidth="9" />
      {crossed ? <path d="M9 41 L39 7" /> : null}
    </Icono>
  );
}

/** Una hoja que se va a otro sitio. Llevar el set a otro juego. */
export function ChalkCarry({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M7 9 L23 9 L23 39 L7 39 Z" />
      <path d="M29 24 L43 24" />
      <path d="M37 18 L43 24 L37 30" />
    </Icono>
  );
}

/**
 * El borrador de la pizarra. Borrar.
 *
 * En una pizarra no se tira nada a una papelera: se pasa el borrador. Y la
 * palabra doble —borrador de pizarra, borrador de set— la desambigua la
 * etiqueta, que aquí siempre va al lado.
 */
export function ChalkEraser({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M9 28 L28 13 Q29 12 30 13 L40 22 Q41 23 40 24 L21 39 Q20 40 19 39 L9 30 Q8 29 9 28 Z" />
      <path d="M15 33 L34 18" strokeWidth="3" />
    </Icono>
  );
}

/** Visto. El enlace ya está copiado. */
export function ChalkCheck({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M8 26 L19 37 L41 11" />
    </Icono>
  );
}

/** Puerta con la flecha saliendo. Cerrar sesión. */
export function ChalkExit({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M22 8 L8 8 L8 40 L22 40" />
      <path d="M20 24 L41 24" />
      <path d="M33 16 L41 24 L33 32" />
    </Icono>
  );
}

/** Flecha a la izquierda. Volver. */
export function ChalkBack({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M40 24 L9 24" />
      <path d="M19 14 L9 24 L19 34" />
    </Icono>
  );
}

/**
 * Dos galones y una línea. Despliegan si se alejan de ella, pliegan si se
 * acercan. La línea no es adorno: sin ella, dos galones que convergen se leen
 * como una equis, que en cualquier interfaz significa «cerrar».
 */
export function ChalkChevrons({ className = '', expand = false }: { className?: string; expand?: boolean }) {
  return (
    <Icono className={className}>
      <path d="M10 24 L38 24" strokeWidth="3" />
      {expand ? (
        <path d="M14 16 L24 6 L34 16 M14 32 L24 42 L34 32" />
      ) : (
        <path d="M14 6 L24 16 L34 6 M14 42 L24 32 L34 42" />
      )}
    </Icono>
  );
}

/** Flecha que vuelve sobre sí misma. Restablecer. */
export function ChalkUndo({ className = '' }: { className?: string }) {
  return (
    <Icono className={className}>
      <path d="M11 20 Q20 8 31 12 Q42 16 40 28 Q38 40 25 40 Q16 40 12 34" />
      <path d="M6 10 L11 21 L22 17" />
    </Icono>
  );
}

export const CATEGORY_DRAWINGS = {
  speed: ChalkStopwatch,
  shooting: ChalkBoot,
  passing: ChalkBall,
  ball_control: ChalkBall,
  defending: ChalkShield,
  goalkeeping: ChalkGlove,
  positioning: ChalkFormation,
  injuries: ChalkWhistle,
  cpu_controls: ChalkClipboard,
} as const;
