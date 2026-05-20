import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BookingForm from './BookingForm';
import ImageSlider from './ImageSlider';

export default async function PackageDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { 
      destination: true,
      images: true
    }
  });

  if (!pkg) notFound();

  // Prepare images for slider: Thumbnail first, then gallery images
  const sliderImages = [];
  if (pkg.imageUrl) sliderImages.push(pkg.imageUrl);
  pkg.images.forEach(img => {
    if (img.url !== pkg.imageUrl) sliderImages.push(img.url); // avoid duplicates
  });
  
  if (sliderImages.length === 0) {
    sliderImages.push('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000');
  }

  return (
    <div className="container py-16 animate-fade-in">
      <Link href={`/destinations/${pkg.destinationId}`} className="text-accent mb-6 inline-block">
        ← Back to {pkg.destination.name}
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ImageSlider images={sliderImages} />
          <h1 className="font-bold text-primary mb-2" style={{ fontSize: '2.5rem' }}>{pkg.title}</h1>
          <div className="flex gap-4 mb-6">
            <span className="bg-primary text-white px-3 py-1 rounded" style={{ backgroundColor: '#f1f5f9', color: 'var(--primary-color)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem' }}>
              {pkg.days} Days / {pkg.nights} Nights
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="bg-primary text-white px-3 py-1 rounded" style={{ backgroundColor: '#e0f2fe', color: 'var(--accent-color)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem' }}>
                LKR {pkg.price.toLocaleString()} per person
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginLeft: '0.5rem', marginTop: '0.25rem' }}>*Conditions Apply</span>
            </div>
          </div>
          
          <div className="text-dark">
            {/* Overview Section */}
            <div className="mb-10">
              <h2 className="text-primary font-bold mb-4" style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Overview</h2>
              <p style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#475569', whiteSpace: 'pre-line' }}>{pkg.description}</p>
            </div>

            {/* Itinerary Section */}
            {pkg.itinerary && (
              <div className="mb-10">
                <h2 className="text-primary font-bold mb-6" style={{ fontSize: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Itinerary</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {(() => {
                    const days: { title: string; points: string[] }[] = [];
                    let currentDay: { title: string; points: string[] } | null = null;
                    
                    pkg.itinerary.split('\n').forEach(line => {
                      const trimmed = line.trim();
                      if (!trimmed) return;
                      
                      // Check if line starts with "Day" (flexible with spaces/dashes)
                      if (/^Day[\s-]*\d+/i.test(trimmed)) {
                        currentDay = { title: trimmed, points: [] };
                        days.push(currentDay);
                      } else if (currentDay) {
                        currentDay.points.push(trimmed);
                      } else {
                        // Fallback for text before the first "Day"
                        currentDay = { title: 'Overview', points: [trimmed] };
                        days.push(currentDay);
                      }
                    });

                    return days.map((day, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{day.title}</h3>
                        {day.points.length > 0 && (
                          <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {day.points.map((p, i) => (
                              <li key={i} style={{ color: '#475569', fontSize: '0.95rem' }}>{p.replace(/^[\s•*-]+/, '')}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-8 mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {pkg.inclusions && (
                <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontWeight: 700, color: '#065f46', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ✅ Inclusions
                  </h3>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pkg.inclusions.split('\n').filter(p => p.trim()).map((p, i) => (
                      <li key={i} style={{ color: '#065f46', fontSize: '0.95rem', opacity: 0.9 }}>{p.replace(/^[\s•*-]+/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions && (
                <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontWeight: 700, color: '#991b1b', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ❌ Exclusions
                  </h3>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pkg.exclusions.split('\n').filter(p => p.trim()).map((p, i) => (
                      <li key={i} style={{ color: '#991b1b', fontSize: '0.95rem', opacity: 0.9 }}>{p.replace(/^[\s•*-]+/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <div className="card-body">
              <h2 className="font-bold text-primary mb-6" style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                Book This Package
              </h2>
              
              <BookingForm packageId={pkg.id} packageTitle={pkg.title} defaultNights={pkg.nights} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
