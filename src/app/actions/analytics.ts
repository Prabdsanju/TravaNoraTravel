"use server";

import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function recordVisit(path: string) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Get IP (Handle proxy/forwarded headers)
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               '127.0.0.1';

    // Fetch Geo-IP data (using a free tier of ipapi.co)
    // In production, you might want an API key for higher limits
    let country = 'Unknown';
    let city = 'Unknown';

    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const geo = await response.json();
      if (geo && !geo.error) {
        country = geo.country_name || 'Unknown';
        city = geo.city || 'Unknown';
      }
    } catch (e) {
      console.error("Geo-IP lookup failed", e);
    }

    if (!(prisma as any).visit) return;

    await (prisma as any).visit.create({
      data: {
        ip,
        userAgent,
        path,
        country,
        city
      }
    });

  } catch (error) {
    console.error("Failed to record visit:", error);
  }
}

export async function getAnalytics() {
  if (!(prisma as any).visit) return { totalVisits: 0, uniqueVisitors: 0, countryStats: [], recentVisits: [] };
  
  const totalVisits = await (prisma as any).visit.count();
  
  // Get unique visitors by IP
  const uniqueResult = await prisma.$queryRaw`SELECT COUNT(DISTINCT ip) as count FROM Visit` as any[];
  const uniqueVisitors = Number(uniqueResult[0]?.count || 0);

  // Get country-wise counts
  const countryStats = await (prisma as any).visit.groupBy({
    by: ['country'],
    _count: { _all: true },
    orderBy: { _count: { country: 'desc' } },
    take: 10
  });

  // Get recent visits
  const recentVisits = await (prisma as any).visit.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return {
    totalVisits,
    uniqueVisitors,
    countryStats: countryStats.map((c: any) => ({ name: c.country, count: c._count._all })),
    recentVisits
  };
}
