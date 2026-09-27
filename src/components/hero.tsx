import Link from 'next/link';
import type { ComponentType } from 'react';

import {
  ChalkCommentedValue,
  ChalkGamepad,
  ChalkSliderStack,
  PitchDiagram,
} from '@/components/chalk';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';

type HeroContent = {
  eyebrow: string;
  /**
   * El titular, en tres líneas; la última va con el rotulador. Conviene que
   * ninguna pase de unos veinte caracteres: si se parte sola, el hero se come
   * la pantalla entera y los sets quedan debajo del pliegue. El tope de
   * tamaño (5rem) está puesto para que quepan tres líneas en la columna del
   * hero a 1280 px; con 6rem se partían en cinco. Por lo mismo la columna del
   * texto se lleva 1,35 de 2 en pantalla ancha: el dibujo es decoración y el
   * titular es lo que no puede romperse.
   */
  title: [string, string, string];
  body: string;
  secondaryLabel: string;
};

type Hero = {
  content: Record<Locale, HeroContent>;
  drawing: ComponentType<{ className?: string }>;
  /** `#sets` es un ancla de la propia página: no lleva prefijo de idioma. */
  secondaryHref: string;
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
 * le corresponde. Añadir uno es añadir un objeto aquí — con su texto en los
 * dos idiomas, porque el sorteo va antes de saber en qué idioma se lee.
 *
 * Traducido con voz, no calcado: mismo tono seco y directo en los dos
 * idiomas, sin exclamaciones.
 */
export const HEROES: Hero[] = [
  {
    content: {
      es: {
        eyebrow: 'EA Sports FC 27 y FC 26 · by Full Manual FG',
        title: ['Publica tus sliders', 'y que te discutan', 'cada valor'],
        body: 'Un set no se explica con una captura de pantalla. Aquí cada valor lleva su propio hilo: por qué 35 y no 42, con qué dificultad, y a quién le funciona.',
        secondaryLabel: 'Ver los sets',
      },
      en: {
        eyebrow: 'EA Sports FC 27 and FC 26 · by Full Manual FG',
        title: ['Post your sliders', 'and get every value', 'argued over'],
        body: "A set isn't explained by a screenshot. Every value here gets its own thread: why 35 and not 42, under what difficulty, and who it works for.",
        secondaryLabel: 'See the sets',
      },
    },
    drawing: ChalkCommentedValue,
    secondaryHref: '#sets',
  },
  {
    content: {
      es: {
        eyebrow: 'Lo que trae el juego, y lo que has tocado tú',
        title: ['Cincuenta números', 'no dicen nada.', 'Una forma sí'],
        body: 'Cada set se dibuja sobre el preajuste de fábrica, así que de un vistazo ves qué ha movido esa persona y cuánto. Es la pregunta de verdad, y no hay que comparar nada a mano.',
        secondaryLabel: 'Ver los sets',
      },
      en: {
        eyebrow: 'What the game ships with, and what you changed',
        title: ['Fifty numbers', 'say nothing.', 'A shape does'],
        body: "Every set is drawn against the factory preset, so one glance shows what someone moved and by how much. That's the real question, and nothing needs comparing by hand.",
        secondaryLabel: 'See the sets',
      },
    },
    drawing: ChalkSliderStack,
    secondaryHref: '#sets',
  },
  {
    content: {
      es: {
        eyebrow: 'Modo consola',
        title: ['Mete los valores', 'sin levantar', 'la vista'],
        body: 'Los valores en el orden exacto del menú del juego, en letra grande, marcando lo que ya has metido. La pantalla no se apaga mientras lo haces.',
        secondaryLabel: 'Qué lleva un set',
      },
      en: {
        eyebrow: 'Console mode',
        title: ['Enter the values', 'without ever', 'looking up'],
        body: "Values in the exact order of the game's menu, in large type, marking what you've already entered. The screen stays on the whole time.",
        secondaryLabel: 'What goes into a set',
      },
    },
    drawing: ChalkGamepad,
    secondaryHref: '/guia',
  },
  {
    content: {
      es: {
        eyebrow: 'Los mismos sliders, otro partido',
        title: ['Los mismos sliders', 'en otra dificultad:', 'otro partido'],
        body: 'Unos valores sin saber en qué condiciones se probaron no significan lo mismo para quien los copia. Aquí van con el set, no perdidos en un comentario.',
        secondaryLabel: 'Qué lleva un set',
      },
      en: {
        eyebrow: 'Same sliders, different match',
        title: ['The same sliders,', 'another difficulty:', 'another match'],
        body: "Values without knowing the conditions they were tested under don't mean the same to whoever copies them. Here they travel with the set, not lost in some comment.",
        secondaryLabel: 'What goes into a set',
      },
    },
    drawing: PitchDiagram,
    secondaryHref: '/guia',
  },
];

/**
 * Uno al azar. Va en el servidor, así que cada carga trae el suyo y el cliente
 * no tiene que decidir nada — sin parpadeo ni salto de maquetación.
 *
 * El sorteo es independiente del idioma: lo mismo alguien lee la web en
 * castellano que en inglés, ve el mismo reparto de heroes con el tiempo.
 */
export function pickHero() {
  return HEROES[Math.floor(Math.random() * HEROES.length)];
}

export function Hero({
  hero,
  locale,
  newSetHref,
  setCount,
}: {
  hero: Hero;
  locale: Locale;
  newSetHref: string;
  /** Cuántos sets hay publicados. Sale en el botón: es la prueba de que esto
   *  tiene contenido, y va en la primera pantalla sin costar sitio. */
  setCount: number;
}) {
  const Drawing = hero.drawing;
  const content = hero.content[locale];
  const t = getDictionary(locale).portada;
  const isAnchor = hero.secondaryHref.startsWith('#');
  const secondaryHref = isAnchor ? hero.secondaryHref : localized(locale, hero.secondaryHref);
  const verLos = setCount > 0 && setCount < 30 ? t.verLosSets(setCount) : content.secondaryLabel;

  return (
    <section className="grid items-center gap-6 pt-8 pb-8 sm:gap-10 sm:pt-12 sm:pb-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16 lg:pt-16">
      <div>
        <p className="eyebrow">{content.eyebrow}</p>

        <h1 className="display mt-5 text-[clamp(2.75rem,8vw,5rem)]">
          {content.title[0]}
          <br />
          {content.title[1]}
          <br />
          <span className="text-ink-user">{content.title[2]}</span>
        </h1>

        <p className="mt-5 max-w-prose text-base text-chalk-dim sm:mt-7 sm:text-lg">{content.body}</p>

        <div className="mt-6 flex flex-wrap gap-3 sm:mt-9">
          <Link href={localized(locale, newSetHref)} className="btn btn-primary">
            {t.publicarMiSet}
          </Link>
          <Link href={secondaryHref} className="btn btn-ghost">
            {isAnchor ? verLos : content.secondaryLabel}
          </Link>
        </div>
      </div>

      {/* Más pequeño en el móvil: ahí va después de los botones, y a tamaño
          completo se comía un tercio de pantalla justo antes del primer set. */}
      <Drawing className="mx-auto w-full max-w-[13rem] sm:max-w-[21rem] lg:max-w-none" />
    </section>
  );
}
