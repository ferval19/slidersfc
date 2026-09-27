import type { Metadata } from 'next';
import Link from 'next/link';
import { lang } from 'next/root-params';
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
import { cpuBehaviours, scopeLabels } from '@/lib/constants';
import { alternates } from '@/lib/i18n/alternates';
import { getDictionary } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';
import { localized } from '@/lib/paths';
import { CAMERAS, difficulties } from '@/lib/set-conditions';

export async function generateMetadata(): Promise<Metadata> {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).guia;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternates(locale, '/guia'),
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
    },
  };
}

export default async function GuidePage() {
  const locale = ((await lang()) ?? DEFAULT_LOCALE) as Locale;
  const t = getDictionary(locale).guia;
  const tComun = getDictionary(locale).comun;

  /** Una fila de la muestra de la escala. Valores reales, no de relleno. */
  const SAMPLE = [
    { name: t.sampleVelocidad, user: 35, cpu: 35, reference: 35 },
    { name: t.sampleErrorTiros, user: 62, cpu: 65, reference: 55 },
    { name: t.sampleAlturaLinea, user: 58, cpu: 58, reference: 65 },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="pb-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="display mt-3 text-[clamp(2.75rem,8vw,4.5rem)]">{t.titulo}</h1>
        <p className="mt-5 max-w-prose text-base text-chalk-dim">{t.intro}</p>
      </header>

      <div className="chalk-rule" />

      <Block icon={ChalkClipboard} title={t.loBasicoTitulo} eyebrow={t.obligatorio}>
        <Field name={t.tituloNombre}>
          {t.tituloBodyInicio}
          <em>{t.tituloEjemplo}</em>
          {t.tituloBodyFin}
        </Field>
        <Field name={t.juegoNombre}>{t.juegoBody}</Field>
        <Field name={t.descripcionNombre}>{t.descripcionBody}</Field>
        <Field name={t.borradorPublicadoNombre}>{t.borradorPublicadoBody}</Field>
      </Block>

      <Block icon={ChalkShield} title={t.comoLoJuegasTitulo} eyebrow={t.opcionalPeroFalta}>
        <p className="text-sm text-chalk-dim">{t.comoLoJuegasIntro}</p>

        <Field name={t.dificultadNombre} icon={ChalkShield}>
          {t.dificultadBodyInicio}
          {difficulties(locale).map((d) => d.label).join(', ')}
          {t.dificultadBodyFin}
        </Field>
        <Field name={t.duracionNombre} icon={ChalkStopwatch}>
          {t.duracionBodyInicio}
          <code>{t.duracionCodigo}</code>
          {t.duracionBodyFin}
        </Field>
        <Field name={t.camaraNombre} icon={ChalkCamera}>
          {t.camaraBodyInicio}
          {CAMERAS.slice(0, 4).join(', ')}…{t.camaraBodyFin}
        </Field>
      </Block>

      <Block icon={ChalkBall} title={t.losValoresTitulo} eyebrow={t.elGruesoDelSet}>
        <p className="text-sm text-chalk-dim">{t.losValoresIntro}</p>

        <div className="panel mt-5 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <span className="eyebrow">{t.asiSeLee}</span>
            <ScaleLegend scopes={['user', 'cpu']} labels={scopeLabels(locale)} withReference />
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
          <p className="mt-4 text-xs text-chalk-dim">{t.notaMarcaGris}</p>
        </div>

        <Field name={t.ladosNombre}>{t.ladosBody}</Field>
        <Field name={t.maestrosNombre}>{t.maestrosBody}</Field>
        <Field name={t.pegarNombre}>{t.pegarBody}</Field>
      </Block>

      <Block icon={ChalkFormation} title={t.comportamientoCpuTitulo} eyebrow={t.soloFc27}>
        <p className="text-sm text-chalk-dim">{t.comportamientoCpuIntro}</p>
        <ul className="mt-4 flex flex-col gap-3">
          {cpuBehaviours(locale).map((behaviour) => (
            <li key={behaviour.value} className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{behaviour.label}</span>
              <span className="text-sm text-chalk-dim">{behaviour.hint}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-chalk-dim">{t.comportamientoCpuOutro}</p>
      </Block>

      <Block icon={ChalkCommentedValue} title={t.loQueAportaTitulo} eyebrow={t.despuesDePublicar}>
        <Field name={t.comentariosValorNombre}>{t.comentariosValorBody}</Field>
        <Field name={t.comentariosGeneralesNombre}>{t.comentariosGeneralesBody}</Field>
        <Field name={t.versionesNombre}>{t.versionesBody}</Field>
      </Block>

      <Block icon={ChalkStopwatch} title={t.loQueSaleSoloTitulo} eyebrow={t.noHayQueRellenarlo}>
        <Field name={t.direccionNombre}>
          <code>{t.direccionCodigo}</code>
          {t.direccionBodyFin}
        </Field>
        <Field name={t.imagenNombre}>{t.imagenBody}</Field>
        <Field name={t.modoConsolaNombre}>{t.modoConsolaBody}</Field>
      </Block>

      <div className="chalk-rule mt-4" />

      <div className="flex flex-wrap items-center gap-3 pt-8">
        <Link href={localized(locale, '/sets/nuevo')} className="btn btn-primary">
          {tComun.publicarUnSet}
        </Link>
        <Link href={localized(locale, '/')} className="btn btn-ghost">
          {t.verLosQueHay}
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
