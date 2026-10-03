import type { MetadataRoute } from 'next';

import { LOCALES, localePath } from '@/lib/i18n/locale';
import { publicSiteUrl } from '@/lib/site-url';

const siteUrl = publicSiteUrl();

/** Nada de esto tiene sentido en un buscador: o pide sesión o es un trámite. */
const PRIVADAS = ['/sets/nuevo', '/login', '/auth/', '/perfil', '/recuperar', '/cuenta/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Una por idioma. `Disallow: /login` NO tapa `/en/login`: robots.txt
        // compara prefijos literales, no entiende de idiomas. El inglés se
        // quedó destapado desde el día que se publicó.
        disallow: LOCALES.flatMap((locale) =>
          PRIVADAS.map((ruta) => localePath(locale, ruta)),
        ),
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
