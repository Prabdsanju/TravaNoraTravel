import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const destCount = await prisma.destination.count();
  const pkgCount = await prisma.package.count();
  const bookingCount = await prisma.booking.count();

  return (
    <>
      <h1 className="text-primary font-bold mb-8" style={{ fontSize: '2rem' }}>Dashboard</h1>
      
      <div className="grid md:grid-cols-3">
        <div className="card">
          <div className="card-body">
            <h3 className="text-light mb-2">Destinations</h3>
            <p className="font-bold text-primary" style={{ fontSize: '2.5rem' }}>{destCount}</p>
            <Link href="/admin/destinations" className="text-accent mt-4 inline-block font-bold">Manage &rarr;</Link>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h3 className="text-light mb-2">Packages</h3>
            <p className="font-bold text-primary" style={{ fontSize: '2.5rem' }}>{pkgCount}</p>
            <Link href="/admin/packages" className="text-accent mt-4 inline-block font-bold">Manage &rarr;</Link>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h3 className="text-light mb-2">Bookings</h3>
            <p className="font-bold text-primary" style={{ fontSize: '2.5rem' }}>{bookingCount}</p>
            <Link href="/admin/bookings" className="text-accent mt-4 inline-block font-bold">Manage &rarr;</Link>
          </div>
        </div>
      </div>
    </>
  );
}
