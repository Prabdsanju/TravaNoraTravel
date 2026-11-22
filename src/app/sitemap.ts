import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.travanoratravel.com';

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/air-tickets`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/visa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    const [destinations, packages] = await Promise.all([
      prisma.destination.findMany({ select: { id: true } }),
      prisma.package.findMany({ select: { id: true, updatedAt: true } }),
    ]);

    const destinationRoutes: MetadataRoute.Sitemap = destinations.map((dest) => ({
      url: `${baseUrl}/destinations/${dest.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.id}`,
      lastModified: pkg.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...staticRoutes, ...destinationRoutes, ...packageRoutes];
  } catch (e) {
    console.error('Error generating dynamic sitemap:', e);
    return staticRoutes;
  }
}
