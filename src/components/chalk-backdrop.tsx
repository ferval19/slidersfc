/**
 * Trozos de campo dibujados al fondo, con el mismo trazo de tiza que el resto.
 *
 * Son fragmentos, no un campo entero: un arco de medio campo asomando por
 * arriba, la esquina del área por el lado y el cuarto de círculo del córner
 * abajo. Un campo completo de fondo competiría con el contenido; tres trozos
 * que se salen por los bordes se leen como lo que hay dibujado debajo en una
 * pizarra que ya se ha usado otras veces.
 *
 * La opacidad es el punto delicado y no es un capricho: sobre estas líneas se
 * lee texto, así que suben el brillo del fondo y bajan el contraste. A 0,035
 * la cifra verde de la comparación se queda en 7,16:1 (venía de 7,80:1) y la
 * roja en 6,15:1 — medido, no estimado. El listón de AAA para texto pequeño
 * es 7:1, así que no hay margen para subirla sin volver a medir.
 *
 * Va fijo y detrás de todo: al desplazarse, la pizarra se queda quieta y es el
 * contenido el que pasa por delante.
 */
export function ChalkBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: 0.035 }}
    >
      {/* Arriba a la derecha: el círculo central, cortado por el borde. */}
      <svg
        viewBox="0 0 400 400"
        className="absolute -top-40 -right-28 h-[34rem] w-[34rem] sm:-top-48 sm:-right-24 sm:h-[46rem] sm:w-[46rem]"
      >
        {/* Sólo el círculo. Una línea de medio campo, recta y de arriba abajo,
            se lee como un filete de la interfaz y no como un dibujo. */}
        <g className="chalk-stroke" stroke="#f2efe4" strokeWidth="4.5">
          <path d="M40 200 Q42 112 122 74 Q205 40 288 76 Q366 114 364 200 Q366 288 288 326 Q205 362 122 328 Q42 290 40 200 Z" />
          <path d="M200 160 Q205 200 200 240" strokeWidth="3.5" />
        </g>
      </svg>

      {/* A la izquierda: la esquina del área grande, saliéndose por el lado.
          Sólo a partir de `sm`: en un móvil, tres trozos es un trozo de más. */}
      <svg
        viewBox="0 0 320 420"
        className="absolute top-1/3 -left-24 hidden h-[30rem] w-[22rem] sm:block"
      >
        <g className="chalk-stroke" stroke="#f2efe4" strokeWidth="4.5" strokeLinecap="round">
          <path d="M-20 24 Q140 20 292 26 Q296 210 292 396 Q140 402 -20 398" />
          <path d="M-20 138 Q80 134 176 140 Q180 210 176 282 Q80 288 -20 284" strokeWidth="3.8" />
          <path d="M292 168 Q246 210 292 252" strokeWidth="3.5" />
        </g>
      </svg>

      {/* Abajo a la derecha: el cuarto de círculo del córner, en su esquina. */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -right-10 -bottom-10 h-56 w-56 sm:h-72 sm:w-72"
      >
        <g className="chalk-stroke" stroke="#f2efe4" strokeWidth="4.5" strokeLinecap="round">
          <path d="M10 196 Q12 60 16 10" />
          <path d="M8 190 Q120 188 194 192" />
          <path d="M14 122 Q62 124 76 188" strokeWidth="3.8" />
        </g>
      </svg>
    </div>
  );
}
