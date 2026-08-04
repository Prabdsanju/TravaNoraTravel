import { getSiteSettings } from '@/app/actions/settings';
import { getAnalytics } from '@/app/actions/analytics';
import SettingsForm from './SettingsForm';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminSettings() {
  const settings = await getSiteSettings();
  const analytics = await getAnalytics();
  const destinations = await prisma.destination.findMany({
    include: { _count: { select: { packages: true } } },
    orderBy: { position: 'asc' }
  });

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          Global Site Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Customize your website&apos;s appearance, content, and contact information.
        </p>
      </div>

      <SettingsForm initialSettings={settings} analytics={analytics} destinations={destinations} />
    </div>
  );
}
