import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookingCount, flightCount, visaCount] = await Promise.all([
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.flightRequest.count({ where: { status: 'PENDING' } }),
    prisma.visaRequest.count({ where: { status: 'PENDING' } }),
  ]);

  const Badge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <span style={{ 
        background: '#ef4444', 
        color: 'white', 
        fontSize: '0.7rem', 
        padding: '2px 6px', 
        borderRadius: '10px', 
        marginLeft: 'auto',
        fontWeight: 'bold'
      }}>
        {count}
      </span>
    );
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2 className="text-primary font-bold mb-6" style={{ fontSize: '1.25rem' }}>Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link href="/admin" className="sidebar-link">Dashboard</Link>
          <Link href="/admin/destinations" className="sidebar-link">Destinations</Link>
          <Link href="/admin/packages" className="sidebar-link">Packages</Link>
          
          <Link href="/admin/bookings" className="sidebar-link" style={{ display: 'flex', alignItems: 'center' }}>
            Tour Bookings <Badge count={bookingCount} />
          </Link>
          
          <Link href="/admin/flights" className="sidebar-link" style={{ display: 'flex', alignItems: 'center' }}>
            Flight Inquiries <Badge count={flightCount} />
          </Link>
          
          <Link href="/admin/visas" className="sidebar-link" style={{ display: 'flex', alignItems: 'center' }}>
            Visa Inquiries <Badge count={visaCount} />
          </Link>
          
          <Link href="/admin/settings" className="sidebar-link">Site Settings</Link>
          <Link href="/" className="sidebar-link mt-8" style={{ color: "var(--text-light)" }}>&larr; Back to Site</Link>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
