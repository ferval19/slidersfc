import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Avatar } from '@/components/avatar';
import { CompareTable } from '@/components/compare-table';
import { ShareButton } from '@/components/share-button';
import { COMPARE_INK } from '@/components/slider-scale';
import { buildCompareView } from '@/lib/compare';
import { cpuBehaviourLabel } from '@/lib/constants';
import { comparePath, comparePickerPath, setPath } from '@/lib/paths';
import { getSetDetail, type SetDetail } from '@/lib/queries';
import { publicSiteUrl } from '@/lib/site-url';

type Params = Promise<{ ua: string; sa: string; ub: string; sb: string }>;

async function load(params: Params) {
  const { ua, sa, ub, sb } = await params;

  const [a, b] = await Promise.all([
    getSetDetail({ username: ua, slug: sa }),
    getSetDetail({ username: ub, slug: sb }),
  ]);

  return { a, b };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { a, b } = await load(params);
  if (!a || !b) return { title: 'Comparación no encontrada' };

  const title = `${a.set.title} contra ${b.set.title}`;
  const description = `En qué se diferencian estos dos sets de ${a.game.name}, valor a valor.`;

  // `twitter` va explícito y no se hereda de `openGraph`: sin él, X coge el
  // título y la descripción por defecto del layout y la tarjeta anuncia la
  // web entera en vez de esta comparación. La imagen la pone sola
  // `opengraph-image.tsx`, que vive en esta misma carpeta.
  return {
    title,
    description,
    openGraph: { title: `${title} — SlidersFC`, description, type: 'article' },
    twitter: { card: 'summary_large_image', title: `${title} — SlidersFC`, description },
  };
}

export default async function ComparePage({ params }: { params: Params }) {
  const { a, b } = await load(params);
  if (!a || !b) notFound();

  // Dos juegos distintos no se pueden comparar slider a slider: no son dos
  // versiones de la misma lista, son listas distintas. Se dice y ya.
  if (a.game.id !== b.game.id) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="display text-5xl">No se pueden comparar</h1>
        <p className="mt-4 max-w-prose text-sm text-chalk-dim">
          «{a.set.title}» es de {a.game.name} y «{b.set.title}» de {b.game.name}. Cada juego trae su
          propia lista de sliders, así que enfrentarlos valor a valor no diría nada. Si lo que
          quieres es llevarte un set al juego nuevo, en su ficha tienes el botón para copiarlo.
        </p>
        <Link href={comparePickerPath()} className="btn btn-ghost mt-8">
          Elegir otros dos
        </Link>
      </div>
    );
  }

  // Si alguno de los dos deja la CPU en automático, sus sliders de esa
  // pestaña están guardados pero el juego no los usa: compararlos sería
  // enseñar diferencias que no existen en el campo.
  const cpuIsComparable =
    !a.game.has_cpu_behaviour ||
    (a.set.cpu_behaviour === 'custom' && b.set.cpu_behaviour === 'custom');

  const view = buildCompareView({
    definitions: cpuIsComparable
      ? a.definitions
      : a.definitions.filter((definition) => definition.category !== 'cpu_controls'),
    a: plain(a),
    b: plain(b),
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <header className="flex flex-col gap-6 pb-8">
        <div>
          <p className="eyebrow">{a.game.name}</p>
          <h1 className="display mt-3 text-[clamp(2.25rem,6vw,3.75rem)]">
            {view.differing === 0 ? (
              'Son el mismo set'
            ) : (
              <>
                Se separan en {view.differing} de {view.total}
              </>
            )}
          </h1>
          <p className="mt-4 max-w-prose text-sm text-chalk-dim">
            {view.differing === 0
              ? 'Ni un solo valor distinto entre los dos.'
              : `En los otros ${view.total - view.differing} coinciden. La barra entre las dos muescas es la distancia, y la cifra de la derecha dice cuánto sube o baja el segundo: en verde si sube, en rojo si baja.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ShareButton
            url={`${publicSiteUrl()}${comparePath(
              { username: a.owner.username, slug: a.set.slug },
              { username: b.owner.username, slug: b.set.slug },
            )}`}
            title={`${a.set.title} contra ${b.set.title}`}
            text={
              view.differing === 0
                ? `${a.set.title} y ${b.set.title} son el mismo set, valor a valor`
                : `${a.set.title} contra ${b.set.title}: se separan en ${view.differing} de ${view.total} sliders de ${a.game.name}`
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SetCard detail={a} color={COMPARE_INK.a} />
          <SetCard detail={b} color={COMPARE_INK.b} />
        </div>

        {a.game.has_cpu_behaviour && !cpuIsComparable ? (
          <p className="panel p-4 text-sm text-chalk-dim">
            Los controles de la CPU se quedan fuera de la comparación:{' '}
            {a.set.cpu_behaviour === 'custom' ? '«' + b.set.title + '»' : '«' + a.set.title + '»'} la
            lleva en {cpuBehaviourLabel(
              a.set.cpu_behaviour === 'custom' ? b.set.cpu_behaviour : a.set.cpu_behaviour,
            ).toLowerCase()}
            , y ahí esos valores no los usa el juego.
          </p>
        ) : null}
      </header>

      <CompareTable view={view} aTitle={a.set.title} bTitle={b.set.title} />

      <div className="mt-10">
        <Link href={comparePickerPath()} className="btn btn-quiet">
          Comparar otros dos
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

/** El Map de valores, aplanado a lo que espera el modelo de comparación. */
function plain(detail: SetDetail) {
  return Object.fromEntries([...detail.values].map(([id, value]) => [String(id), value]));
}

function SetCard({ detail, color }: { detail: SetDetail; color: string }) {
  return (
    <Link
      href={setPath(detail.owner.username, detail.set.slug ?? '')}
      className="panel panel-hover flex items-start gap-3 p-4"
    >
      <span className="mt-1 h-10 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <div className="min-w-0">
        <p className="leading-tight font-semibold">{detail.set.title}</p>
        {detail.game.has_cpu_behaviour ? (
          <span className="eyebrow mt-1 block">
            CPU: {cpuBehaviourLabel(detail.set.cpu_behaviour)}
          </span>
        ) : null}
        <span className="mt-1.5 flex items-center gap-2 text-xs text-chalk-dim">
          <Avatar
            url={detail.owner.avatar_url}
            name={detail.owner.display_name ?? detail.owner.username}
            size={18}
          />
          @{detail.owner.username}
        </span>
      </div>
    </Link>
  );
}
