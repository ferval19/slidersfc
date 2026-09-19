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
