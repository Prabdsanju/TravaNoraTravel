import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    include: { _count: { select: { packages: true } } },
    orderBy: { position: 'asc' }
  });

  return (
    <div className="container py-16 animate-fade-in">
      <h1 className="text-primary font-bold mb-4 text-center" style={{ fontSize: '2.5rem' }}>Our Destinations</h1>
      <p className="text-light text-center mb-8 max-w-2xl mx-auto">
        Discover the unique cultures, landscapes, and experiences awaiting you in Southeast Asia.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {destinations.map((dest: any) => (
          <div key={dest.id} className="card" style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
            <div className="card-image" style={{
              width: '40%',
              minHeight: '250px',
              height: '100%',
              background: `url(${dest.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500'}) center/cover`
            }}></div>
            <div className="card-body" style={{ width: '60%', justifyContent: 'center' }}>
              <h2 className="font-bold text-primary mb-2" style={{ fontSize: '1.5rem' }}>{dest.name}</h2>
              <p className="text-light mb-4 text-sm" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {dest.description}
              </p>
              <div className="flex space-between align-center mt-auto">
                <span className="font-bold text-accent">{dest._count.packages} Packages</span>
                <Link href={`/destinations/${dest.id}`} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>
                  View Packages
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
