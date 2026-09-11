import type { MetadataRoute } from 'next';

import { publicSiteUrl } from '@/lib/site-url';

const siteUrl = publicSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/sets/nuevo', '/login', '/auth/', '/perfil'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
