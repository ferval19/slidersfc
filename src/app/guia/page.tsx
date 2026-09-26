import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';

import {
  ChalkBall,
  ChalkCamera,
  ChalkClipboard,
  ChalkCommentedValue,
  ChalkFormation,
  ChalkShield,
  ChalkStopwatch,
} from '@/components/chalk';
import { ScaleLegend, ScaleTrack } from '@/components/slider-scale';
import { CPU_BEHAVIOURS, SCOPE_LABELS } from '@/lib/constants';
import { CAMERAS, DIFFICULTIES } from '@/lib/set-conditions';

export const metadata: Metadata = {
  title: 'Qué lleva un set',
  description:
    'Todo lo que se puede contar de un set de sliders en SlidersFC, campo por campo, y por qué cada cosa importa.',
  alternates: { canonical: '/guia' },
  openGraph: {
    title: 'Qué lleva un set — SlidersFC',
    description: 'Campo por campo, qué se puede contar de un set de sliders y por qué importa.',
  },
};

/** Una fila de la muestra de la escala. Valores reales, no de relleno. */
const SAMPLE = [
  { name: 'Velocidad', user: 35, cpu: 35, reference: 35 },
  { name: 'Error en tiros de calidad', user: 62, cpu: 65, reference: 55 },
  { name: 'Altura de la línea', user: 58, cpu: 58, reference: 65 },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="pb-10">
        <p className="eyebrow">La guía</p>
        <h1 className="display mt-3 text-[clamp(2.75rem,8vw,4.5rem)]">Qué lleva un set</h1>
        <p className="mt-5 max-w-prose text-base text-chalk-dim">
          Un set de sliders son unos números, y unos números solos no le sirven a nadie. Esto es
          todo lo que se puede contar de un set aquí, campo por campo, y por qué cada cosa
          importa. Casi nada es obligatorio: cuanto más pongas, más útil le resulta a quien se
          lo lleve.
        </p>
      </header>

      <div className="chalk-rule" />

      <Block icon={ChalkClipboard} title="Lo básico" eyebrow="Obligatorio">
        <Field name="Título">
          Lo que se ve en la lista y lo que se comparte. Es lo único que se pide de verdad, junto
          con el juego. Un buen título ya dice a quién va dirigido:{' '}
          <em>«Full manual · Leyenda · 8 min»</em> se entiende sin abrirlo.
        </Field>
        <Field name="Juego">
          FC 27 o FC 26. No se puede cambiar después de crear el set, porque los valores cuelgan
          de la lista de sliders de ese juego y no son la misma lista. Si quieres llevarte un set
          al juego nuevo, en su ficha hay un botón que lo copia y empareja lo que encaja.
        </Field>
        <Field name="Descripción">
          Para qué sirve el set y cómo se comporta el partido con él. También los controles que
          usas: manual o asistido cambia el resultado tanto como cualquier slider.
        </Field>
        <Field name="Borrador o publicado">
          Un borrador sólo lo ves tú. Sirve para ir afinando sin que nadie lo vea a medias, y
          para compararlo con otro mientras lo trabajas.
        </Field>
      </Block>

      <Block icon={ChalkShield} title="Cómo lo juegas" eyebrow="Opcional, pero es lo que más falta hace">
        <p className="text-sm text-chalk-dim">
          Los mismos valores en otra dificultad no dan el mismo partido. Sin esto, quien copie tu
          set no sabe si le va a funcionar.
        </p>

        <Field name="Dificultad" icon={ChalkShield}>
          Las seis del juego: {DIFFICULTIES.map((d) => d.label).join(', ')}. Es lo que más cambia
          el comportamiento de la CPU, muy por encima de cualquier slider suelto.
        </Field>
        <Field name="Duración de cada tiempo" icon={ChalkStopwatch}>
          En minutos. Se puede poner un rango si juegas con uno —<code>7-8</code>— porque mucha
          gente no usa siempre el mismo. La duración manda en el ritmo: unos valores afinados a
          6 minutos se desmontan a 15.
        </Field>
        <Field name="Cámara" icon={ChalkCamera}>
          El nombre y, si los ajustas, su altura y su zoom —las dos van de 0 a 20—. El campo
          sugiere las del juego ({CAMERAS.slice(0, 4).join(', ')}…) pero admite cualquier cosa,
          porque cada menú las llama a su manera. Lo único que se pide es que si pones altura o
          zoom digas de qué cámara, porque unos números sueltos no dicen nada.
        </Field>
      </Block>

      <Block icon={ChalkBall} title="Los valores" eyebrow="El grueso del set">
        <p className="text-sm text-chalk-dim">
          FC 27 trae 65 sliders y FC 26, 29. Salen en el orden exacto del menú del juego, para
          que puedas ir metiéndolos mientras los consultas.
        </p>

        <div className="panel mt-5 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <span className="eyebrow">Así se lee</span>
            <ScaleLegend scopes={['user', 'cpu']} labels={SCOPE_LABELS} withReference />
          </div>
          <ul className="mt-4">
            {SAMPLE.map((row) => (
              <li
                key={row.name}
                className="grid items-center gap-x-5 gap-y-1 border-b border-chalk-line/60 py-2.5 last:border-b-0 sm:grid-cols-[minmax(7rem,11rem)_1fr_auto]"
              >
                <span className="text-sm font-semibold">{row.name}</span>
                <ScaleTrack
                  min={1}
                  max={99}
                  reference={row.reference}
                  marks={[
                    { scope: 'user', value: row.user },
                    { scope: 'cpu', value: row.cpu },
                  ]}
                />
                <span className="flex gap-4">
                  <span className="value-pill w-8 text-right text-base text-ink-user">
                    {row.user}
                  </span>
                  <span className="value-pill w-8 text-right text-base text-ink-rival">
                    {row.cpu}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-chalk-dim">
            La marca gris es lo que trae el juego de fábrica. Cuando tu muesca la tapa, ese slider
            está sin tocar; cuando se separa, ahí has metido mano. En la primera fila coinciden
            los tres.
          </p>
        </div>

        <Field name="Lados">
          Casi todos los sliders van por duplicado: lo que se aplica a tu equipo y lo que se
          aplica a la CPU. Alguno es sólo tuyo, como la barra de potencia, y sale con un guion en
          el lado de la CPU.
        </Field>
        <Field name="Los cuatro maestros">
          En FC 27, encima de los tiros y de los pases hay cuatro reguladores que escalan el grupo
          entero. El juego pide dejarlos en 50 y tocar sólo los de cada tipo — si los mueves, tus
          valores no significan lo mismo en otra consola, así que van guardados como cualquier
          otro.
        </Field>
        <Field name="Pegar un set escrito">
          En vez de teclear 129 valores, se puede pegar el texto tal como lo tengas: una tabla de
          Notion, un mensaje, una lista con viñetas. Antes de aplicar nada se ve qué ha entendido
          y qué líneas no ha reconocido.
        </Field>
      </Block>

      <Block icon={ChalkFormation} title="Comportamiento de la CPU" eyebrow="Sólo FC 27">
        <p className="text-sm text-chalk-dim">
          FC 27 deja elegir cómo se comporta la CPU, y sólo en uno de los tres modos sirven de
          algo los sliders de esa pestaña.
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {CPU_BEHAVIOURS.map((behaviour) => (
            <li key={behaviour.value} className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{behaviour.label}</span>
              <span className="text-sm text-chalk-dim">{behaviour.hint}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-chalk-dim">
          Si eliges táctico o dinámico, esos dieciséis sliders desaparecen de la ficha: enseñarlos
          sería decir que tu set toca cosas que no toca. Tus valores no se borran — vuelven al
          poner personalizado.
        </p>
      </Block>

      <Block icon={ChalkCommentedValue} title="Lo que aporta la gente" eyebrow="Después de publicar">
        <Field name="Comentarios valor a valor">
          Cada número abre su propio hilo. Es la razón de ser de esto: no «me gusta tu set», sino
          «ese 35 de velocidad a mí se me queda corto con equipos de segunda». El comentario vive
          pegado a la muesca de la que habla.
        </Field>
        <Field name="Comentarios generales">
          Para lo que no va de un valor concreto, debajo del todo.
        </Field>
        <Field name="Versiones">
          Si cambias valores de un set ya publicado, los comentarios anteriores se marcan como de
          la versión antigua. Nadie queda respondiendo a unos números que ya no están.
        </Field>
      </Block>

      <Block icon={ChalkStopwatch} title="Lo que sale solo" eyebrow="No hay que rellenarlo">
        <Field name="La dirección">
          <code>/u/tu-nombre/el-titulo-del-set</code>, generada del título. No cambia aunque
          cambies el título después, para que un enlace compartido no se rompa. Y si cambias tu
          nombre de usuario, el antiguo sigue llevando al sitio.
        </Field>
        <Field name="La imagen para compartir">
          Al pegar el enlace en WhatsApp o en X sale una tarjeta con los valores dibujados, no un
          recuadro vacío. Se genera sola con el contenido del set.
        </Field>
        <Field name="El modo consola">
          Una vista aparte, en letra grande y en el orden del menú, para tener el móvil en la mano
          mientras metes los valores. Marca lo que ya has hecho y no deja que se apague la
          pantalla.
        </Field>
      </Block>

      <div className="chalk-rule mt-4" />

      <div className="flex flex-wrap items-center gap-3 pt-8">
        <Link href="/sets/nuevo" className="btn btn-primary">
          Publicar un set
        </Link>
        <Link href="/" className="btn btn-ghost">
          Ver los que hay
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Block({
  icon: Icon,
  title,
  eyebrow,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-chalk-line/60 py-10 last:border-b-0">
      <header className="flex items-center gap-3">
        <Icon className="size-9 shrink-0 text-chalk-dim" />
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display text-3xl">{title}</h2>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Field({
  name,
  icon: Icon,
  children,
}: {
  name: string;
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        {Icon ? <Icon className="size-5 shrink-0 text-chalk-dim" /> : null}
        {name}
      </h3>
      <p className="max-w-prose text-sm leading-relaxed text-chalk-dim">{children}</p>
    </div>
  );
}
