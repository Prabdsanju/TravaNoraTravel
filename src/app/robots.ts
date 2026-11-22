import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/*'],
      },
    ],
    sitemap: 'https://travanoratravel.com/sitemap.xml',
  };
}
