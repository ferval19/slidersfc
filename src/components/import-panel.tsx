'use client';

import { useMemo, useState } from 'react';

import { useI18n } from '@/components/i18n-provider';
import { parseSliderText } from '@/lib/import-sliders';
import { SCOPE_INK, scopeLabel } from '@/lib/constants';
import type { SliderDefinition } from '@/lib/database.types';

type Props = {
  definitions: SliderDefinition[];
  onApply: (values: Record<string, number>) => void;
};

/**
 * Pegar un set escrito en cualquier sitio y que se rellene el formulario.
 *
 * El análisis va en vivo mientras se escribe, y nada toca el formulario hasta
 * que se pulsa «Rellenar»: lo importante es poder comprobar antes lo que se ha
 * entendido, porque el texto de origen no siempre dice lo que parece.
 */
export function ImportPanel({ definitions, onApply }: Props) {
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.importPanel;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const report = useMemo(
    () => (text.trim() ? parseSliderText(text, definitions) : null),
    [text, definitions],
  );

  const clamped = report?.rows.reduce(
    (total, row) => total + row.values.filter((value) => value.clamped).length,
    0,
  );

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-quiet self-start">
        {t.pegarUnSetEscrito}
      </button>
    );
  }

  return (
    <section className="panel flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="display text-2xl">{t.pegarUnSetEscrito}</h3>
          <button type="button" onClick={() => setOpen(false)} className="btn btn-quiet shrink-0">
            {t.cerrar}
          </button>
        </div>
        <p className="text-xs text-chalk-dim">{t.ayuda}</p>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t.placeholder}
        aria-label={t.textoDelSet}
        className="field resize-y font-mono text-xs"
      />

      {report ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm">
            <strong className="display text-xl text-ink-user">{report.rows.length}</strong>{' '}
            <span className="text-chalk-dim">{t.reconocidos(report.total)}</span>
          </p>

          {report.rows.length > 0 ? (
            <ul className="max-h-56 overflow-y-auto border border-chalk-line text-xs">
              {report.rows.map((row) => (
                <li
                  key={row.slug}
                  className="flex items-center justify-between gap-3 border-b border-chalk-line/60 px-3 py-1.5 last:border-b-0"
                >
                  <span className="leading-tight">{row.name}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {row.values.map((value) => (
                      <span
                        key={value.scope}
                        title={scopeLabel(value.scope, locale)}
                        className={`value-pill px-1.5 py-0.5 ${SCOPE_INK[value.scope].text}`}
                      >
                        {value.value}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {clamped ? (
            <p className="text-xs text-chalk-dim">{t.valoresFueraDeRango(clamped)}</p>
          ) : null}

          {report.unmatched.length > 0 ? (
            <div className="text-xs text-chalk-dim">
              <p className="eyebrow">{t.sinReconocer}</p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {report.unmatched.slice(0, 6).map((line, index) => (
                  <li key={index} className="truncate font-mono">
                    {line}
                  </li>
                ))}
              </ul>
              {report.unmatched.length > 6 ? (
                <p className="mt-1">{t.yLineasMas(report.unmatched.length - 6)}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onApply(report.values);
                setText('');
                setOpen(false);
              }}
              disabled={report.rows.length === 0}
              className="btn btn-primary"
            >
              {t.rellenarConEsto}
            </button>
            <button type="button" onClick={() => setText('')} className="btn btn-quiet">
              {t.vaciar}
            </button>
            <p className="text-xs text-chalk-dim">{t.loQueNoSeReconozca}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
