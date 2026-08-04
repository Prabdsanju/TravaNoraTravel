import { prisma } from '@/lib/prisma';
import Sidebar from './Sidebar';

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

  return (
    <div className="admin-layout">
      <Sidebar 
        bookingCount={bookingCount} 
        flightCount={flightCount} 
        visaCount={visaCount} 
      />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
