'use client';

import { createContext, useContext, useMemo } from 'react';

import { getDictionary, type Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/locale';

/**
 * `next/root-params` sólo funciona en Server Components, así que los de
 * cliente no pueden llamar a `lang()` ni a `getDictionary()` por su cuenta.
 * Sin esto, cada componente de cliente que necesitara texto tendría que
 * recibir el diccionario entero por props, desde el layout raíz hasta donde
 * haga falta — y ese pasillo de props crece con cada componente nuevo.
 *
 * Aquí viaja **sólo el idioma**, nunca el diccionario. El diccionario lleva
 * funciones —los plurales y los textos con un hueco— y una función no puede
 * cruzar del servidor al cliente: React lanza «Functions cannot be passed
 * directly to Client Components» y la página se cae con un 500. No lo ven ni
 * `tsc`, ni eslint, ni `next build`; sólo se ve ejecutando.
 *
 * Así que el proveedor lo resuelve por su cuenta. El coste es que los dos
 * idiomas acaban en el paquete del navegador: unos pocos kilobytes de cadenas
 * cortas, a cambio de que el diccionario pueda tener funciones.
 */
type I18nValue = { locale: Locale; t: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, t: getDictionary(locale) }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n() necesita un <I18nProvider> por encima en el árbol.');
  return value;
}
