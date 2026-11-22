import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({
    where: { id },
  });

  if (!destination) {
    return {
      title: 'Destination | TravaNora Travel',
    };
  }

  const title = `${destination.name} Tour Packages | TravaNora Travel`;
  const description = destination.description?.slice(0, 160) || `Explore customized holiday packages in ${destination.name} with TravaNora Travel Sri Lanka.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://travanoratravel.com/destinations/${destination.id}`,
      images: destination.imageUrl ? [{ url: destination.imageUrl, width: 1200, height: 630, alt: destination.name }] : undefined,
    },
  };
}

export default async function DestinationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: { packages: true }
  });

  if (!destination) notFound();

  return (
    <>
      <section className="hero-section" style={{
        background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url("${destination.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000'}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container animate-fade-in">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 700 }}>{destination.name}</h1>
          <p style={{ fontSize: '1.125rem', maxWidth: '800px', margin: '0 auto' }}>
            {destination.description}
          </p>
        </div>
      </section>

      <div className="container py-16">
        <h2 className="text-primary font-bold mb-8 text-center" style={{ fontSize: '2rem' }}>Packages in {destination.name}</h2>
        
        <div className="grid md:grid-cols-3">
          {destination.packages.length > 0 ? destination.packages.map((pkg) => (
            <div key={pkg.id} className="card">
              <div className="card-image" style={{
                background: `url(${pkg.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500'}) center/cover`
              }}></div>
              <div className="card-body">
                <h3 className="font-bold text-primary mb-2" style={{ fontSize: '1.25rem' }}>{pkg.title}</h3>
                <div className="flex gap-4 mb-2 text-light text-sm">
                  <span>{pkg.days} Days / {pkg.nights} Nights</span>
                </div>

                <p className="text-light mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {pkg.description}
                </p>
                
                <div className="flex space-between align-center mt-auto">
                  <div>
                    <span className="text-light" style={{ fontSize: '0.875rem', display: 'block' }}>Price</span>
                    <span className="font-bold text-accent" style={{ fontSize: '1.25rem' }}>LKR {pkg.price.toLocaleString()}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', display: 'block', marginTop: '-2px' }}>*Conditions Apply</span>
                  </div>
                  <Link href={`/packages/${pkg.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center md:grid-cols-3 grid-cols-1" style={{ gridColumn: 'span 3' }}>
              <p className="text-light">No packages available for this destination yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
