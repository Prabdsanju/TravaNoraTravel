import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [destCount, pkgCount, bookingCount, flightCount, visaCount] = await Promise.all([
    prisma.destination.count(),
    prisma.package.count(),
    prisma.booking.count(),
    prisma.flightRequest.count(),
    prisma.visaRequest.count(),
  ]);

  const stats = [
    { title: 'Destinations', value: destCount, icon: '🗺️', color: '#3b82f6', link: '/admin/destinations', footer: 'Total locations managed' },
    { title: 'Packages', value: pkgCount, icon: '📦', color: '#f59e0b', link: '/admin/packages', footer: 'Active tour packages' },
    { title: 'Bookings', value: bookingCount, icon: '📅', color: '#10b981', link: '/admin/bookings', footer: 'Customer reservations' },
    { title: 'Flights', value: flightCount, icon: '✈️', color: '#8b5cf6', link: '/admin/flights', footer: 'Flight ticket requests' },
    { title: 'Visas', value: visaCount, icon: '🪪', color: '#ef4444', link: '/admin/visas', footer: 'Visa filing inquiries' },
  ];

  return (
    <>
      <h1 className="text-primary font-bold mb-8 animate-fade-in" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>Dashboard</h1>
      
      <div className="admin-stats-grid animate-fade-in">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">{stat.title}</span>
              <div className="stat-icon-wrapper" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-footer">
              <span>{stat.footer}</span>
              <Link href={stat.link} style={{ color: stat.color, fontWeight: 700 }}>
                Manage &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary / Status block */}
      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
         <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1rem' }}>✨ Welcome back, Admin!</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              From this portal you can manage tour packages, approve or edit destinations, track booking inquiries, and respond to flight and visa forms. Use the navigation sidebar to visit specific sections.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <Link href="/admin/settings" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                  ⚙️ Site Settings
               </Link>
               <Link href="/" className="btn-outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                  👁️ View Site
               </Link>
            </div>
         </div>

         <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>💬 Operations Summary</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>Active operations status updates at a glance.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Tour Bookings:</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>
                     {await prisma.booking.count({ where: { status: 'PENDING' } })} Pending
                  </span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Flight Inquiries:</span>
                  <span style={{ fontWeight: 700, color: '#8b5cf6' }}>
                     {await prisma.flightRequest.count({ where: { status: 'PENDING' } })} Pending
                  </span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>Visa Inquiries:</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>
                     {await prisma.visaRequest.count({ where: { status: 'PENDING' } })} Pending
                  </span>
               </div>
            </div>
         </div>
      </div>
    </>
  );
}
