import Link from 'next/link';
import type { ComponentType } from 'react';

import {
  ChalkCommentedValue,
  ChalkGamepad,
  ChalkSliderStack,
  PitchDiagram,
} from '@/components/chalk';

type Hero = {
  eyebrow: string;
  /**
   * El titular, en tres líneas; la última va con el rotulador. Conviene que
   * ninguna pase de unos veinte caracteres: en ultracondensada y a 80 px, una
   * línea más larga se parte sola y el hero se come la pantalla entera.
   */
  title: [string, string, string];
  body: string;
  drawing: ComponentType<{ className?: string }>;
  secondary: { href: string; label: string };
};

/**
 * La portada dice una cosa distinta cada vez que se entra.
 *
 * No es un carrusel: no hay flechas ni temporizador. Se elige uno al azar en
 * el servidor y ahí se queda hasta que se recarga. Un carrusel que se mueve
 * solo obliga a leer a su ritmo; esto deja que cada visita se lleve un ángulo
 * del producto, y con el tiempo los cubre todos.
 *
 * Cada uno defiende una razón distinta para usar esto, y lleva el dibujo que
 * le corresponde. Añadir uno es añadir un objeto aquí.
 */
export const HEROES: Hero[] = [
  {
    eyebrow: 'EA Sports FC 27 y FC 26 · by Full Manual FG',
    title: ['Publica tus sliders', 'y que te discutan', 'cada valor'],
    body: 'Un set no se explica con una captura de pantalla. Aquí cada valor lleva su propio hilo: por qué 35 y no 42, con qué dificultad, y a quién le funciona.',
    drawing: ChalkCommentedValue,
    secondary: { href: '#sets', label: 'Ver los sets' },
  },
  {
    eyebrow: 'Lo que trae el juego, y lo que has tocado tú',
    title: ['Cincuenta números', 'no dicen nada.', 'Una forma sí'],
    body: 'Cada set se dibuja sobre el preajuste de fábrica, así que de un vistazo ves qué ha movido esa persona y cuánto. Es la pregunta de verdad, y no hay que comparar nada a mano.',
    drawing: ChalkSliderStack,
    secondary: { href: '/guia', label: 'Qué lleva un set' },
  },
  {
    eyebrow: 'Modo consola',
    title: ['Mete los valores', 'sin levantar', 'la vista'],
    body: 'Los valores en el orden exacto del menú del juego, en letra grande, marcando lo que ya has metido. La pantalla no se apaga mientras lo haces.',
    drawing: ChalkGamepad,
    secondary: { href: '/guia', label: 'Qué lleva un set' },
  },
  {
    eyebrow: 'Los mismos sliders, otro partido',
    title: ['Los mismos sliders', 'en otra dificultad:', 'otro partido'],
    body: 'Unos valores sin saber en qué condiciones se probaron no significan lo mismo para quien los copia. Aquí van con el set, no perdidos en un comentario.',
    drawing: PitchDiagram,
    secondary: { href: '/guia', label: 'Qué lleva un set' },
  },
];

/**
 * Uno al azar. Va en el servidor, así que cada carga trae el suyo y el cliente
 * no tiene que decidir nada — sin parpadeo ni salto de maquetación.
 */
export function pickHero() {
  return HEROES[Math.floor(Math.random() * HEROES.length)];
}

export function Hero({ hero, newSetHref }: { hero: Hero; newSetHref: string }) {
  const Drawing = hero.drawing;

  return (
    <section className="grid items-center gap-10 pt-12 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-16">
      <div>
        <p className="eyebrow">{hero.eyebrow}</p>

        <h1 className="display mt-5 text-[clamp(3rem,10vw,6rem)]">
          {hero.title[0]}
          <br />
          {hero.title[1]}
          <br />
          <span className="text-ink-user">{hero.title[2]}</span>
        </h1>

        <p className="mt-7 max-w-prose text-base text-chalk-dim sm:text-lg">{hero.body}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={newSetHref} className="btn btn-primary">
            Publicar mi set
          </Link>
          <Link href={hero.secondary.href} className="btn btn-ghost">
            {hero.secondary.label}
          </Link>
        </div>
      </div>

      <Drawing className="mx-auto w-full max-w-[21rem] lg:max-w-none" />
    </section>
  );
}
