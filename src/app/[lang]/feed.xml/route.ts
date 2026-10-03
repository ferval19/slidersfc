import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionary';
import { setPath } from '@/lib/paths';
import { publicSiteUrl } from '@/lib/site-url';
import { createSupabaseAnonClient } from '@/lib/supabase/anon';

/**
 * Feed RSS de los sets publicados.
 *
 * Es la única forma de avisar de algo nuevo que **no genera cola**. La hoja de
 * ruta descarta las notificaciones por correo, y con razón: cada una te ata a
 * mantener una lista, un envío y una baja. Un feed lo sirve el servidor, no lo
 * mantiene nadie, y si el proyecto se enfría sigue en pie — que es la tercera
 * regla del encuadre.
 *
 * Uno por idioma, con los mismos sets dentro: lo que cambia es el envoltorio y
 * a qué versión de la ficha apunta cada enlace. Los títulos y las
 * descripciones son de quien los escribe y no se traducen, igual que en la web.
 */

export const revalidate = 3600;

/**
 * Escapar NO es opcional aquí: el título y la descripción los escribe
 * cualquiera, y un `&` o un `<` sueltos rompen el XML entero — el lector no
 * enseña «un set raro», deja de enseñar el feed. Es el mismo cuidado que lleva
 * `json-ld.ts` con su `<`.
 */
function xml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

type Fila = {
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  games: { name: string } | null;
  profiles: { username: string; display_name: string | null } | null;
};

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = getDictionary(locale).feed;
  const siteUrl = publicSiteUrl();

  let sets: Fila[] = [];
  try {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from('slider_sets')
      .select('title, slug, description, created_at, games ( name ), profiles!inner ( username, display_name )')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(30);
    sets = (data ?? []) as unknown as Fila[];
  } catch (error) {
    // Igual que las lecturas de la web: un feed vacío es mejor que un 500.
    console.error('[slidersfc] feed falló:', error);
  }

  const items = sets
    .filter((set) => set.profiles)
    .map((set) => {
      const url = `${siteUrl}${localePath(locale, setPath(set.profiles!.username, set.slug))}`;
      const autor = set.profiles!.display_name ?? set.profiles!.username;
      const resumen = (set.description ?? '').replace(/\s+/g, ' ').trim().slice(0, 400);

      return [
        '    <item>',
        `      <title>${xml(set.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        `      <pubDate>${new Date(set.created_at).toUTCString()}</pubDate>`,
        `      <category>${xml(set.games?.name ?? '')}</category>`,
        `      <description>${xml(t.porAutor(autor, set.games?.name ?? '') + (resumen ? ` — ${resumen}` : ''))}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const feedUrl = `${siteUrl}${localePath(locale, '/feed.xml')}`;

  const cuerpo = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(t.titulo)}</title>
    <link>${xml(`${siteUrl}${localePath(locale, '/')}`)}</link>
    <description>${xml(t.descripcion)}</description>
    <language>${locale}</language>
    <atom:link href="${xml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(cuerpo, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
