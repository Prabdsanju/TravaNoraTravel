import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

import Hero from './Hero';
import AnimatedFeatures from './AnimatedFeatures';
import AnimatedServices from './AnimatedServices';
import { AnimatedPhilosophy, AnimatedPersonalize, AnimatedCards, AnimatedCard } from './AnimatedSections';

export default async function Home() {
  const packages = await prisma.package.findMany({
    include: { destination: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  const destinations = await prisma.destination.findMany({ 
    include: { _count: { select: { packages: true } } },
    orderBy: { position: 'asc' } 
  });
  const settings = await getSiteSettings();

  const heroData: Record<string, { count: number; id: string; name: string; description: string | null; imageUrl: string | null }> = {};
  destinations.forEach(d => {
    const key = d.name.toLowerCase().replace(/\s+/g, '');
    heroData[key] = {
      count: d._count.packages,
      id: d.id,
      name: d.name,
      description: d.description,
      imageUrl: d.imageUrl
    };
  });


  let blogList = [];
  try {
    if (settings.blog_list_json) {
      blogList = JSON.parse(settings.blog_list_json);
    }
  } catch (e) {}

  if (blogList.length === 0) {
    blogList = [
      { title: 'Top 10 Hidden Gems in Sri Lanka', date: '12 May 2026', description: 'Discover the untouched beauty of Sri Lanka...', image: 'https://images.unsplash.com/photo-1542662565-7e4fd159dddd?w=600', link: '/blog/hidden-gems' },
      { title: 'A Guide to Asian Street Food', date: '20 Apr 2026', description: 'Explore the vibrant flavors of Asia...', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600', link: '/blog/street-food' },
      { title: 'Packing Essentials for Maldives', date: '05 Mar 2026', description: 'Everything you need for a tropical getaway...', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600', link: '/blog/maldives-packing' }
    ];
  }

  return (
    <>
      {settings.show_hero !== 'false' && (
        <Hero data={heroData} settings={settings} />
      )}

      {settings.show_destinations !== 'false' && (
      <section className="py-16 container">
        <div className="section-head">
          <span className="title-prefix">{settings.dest_prefix || 'Where to go'}</span>
          <h3 className="section-title">{settings.dest_title || 'Explore Stunning Destinations'}</h3>
        </div>
        
        <AnimatedCards>
          {destinations.length > 0 ? destinations.map(dest => (
            <AnimatedCard key={dest.id}>
              <Link href={`/destinations/${dest.id}`} className="flip-card" style={{ display: 'block' }}>
                <div className="flip-card-inner">
                  <div className="flip-card-front" style={{
                    backgroundImage: `url(${dest.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500'})`
                  }}>
                    <h4>{dest.name} <br/> <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>📍 View Packages</span></h4>
                  </div>
                  <div className="flip-card-back">
                    <h4>{dest.name}</h4>
                    <p>{(settings.flipcard_text || 'Experience the rich history, natural beauty, and vibrant culture of [DEST_NAME]. Our curated packages ensure a seamless travel experience.').replace('[DEST_NAME]', dest.name)}</p>
                    <span className="btn-outline" style={{ color: 'white', borderColor: 'white', alignSelf: 'flex-start', padding: '0.5rem 1rem' }}>
                      {settings.flipcard_btn || 'View Packages'}
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedCard>
          )) : (
            <div className="text-center grid-cols-1 md:grid-cols-4" style={{ gridColumn: 'span 4' }}>
              <p className="text-light">No destinations found. Please add them from the admin panel.</p>
            </div>
          )}
        </AnimatedCards>
      </section>
      )}

      {settings.show_features !== 'false' && (
      <section className="py-20" style={{ background: 'linear-gradient(to bottom, #f8fafc, #ffffff)' }}>
        <div className="container">
          <div className="section-head">
            <span className="title-prefix">Why TravaNora?</span>
            <h3 className="section-title">The Best Travel Experience</h3>
          </div>
          <AnimatedFeatures />
        </div>
      </section>
      )}

      {settings.show_services !== 'false' && (
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--card-bg)' }}>
        <AnimatedServices settings={settings} />
      </section>
      )}

      {settings.show_philosophy !== 'false' && (
      <section className="py-24" style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <AnimatedPhilosophy settings={settings} />
        {/* Abstract background shape */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.03)', zIndex: -1 }}></div>
      </section>
      )}

      {settings.show_packages !== 'false' && (
      <section className="py-16 container">
        <div className="section-head">
          <span className="title-prefix">{settings.pkg_prefix || 'Explore Destinations'}</span>
          <h3 className="section-title">{settings.pkg_title || 'Join us on a group adventure'}</h3>
        </div>
        
        <AnimatedCards>
          {packages.length > 0 ? packages.map(pkg => (
            <AnimatedCard key={pkg.id}>
              <div className="card">
                <div className="card-image" style={{
                  background: `url(${pkg.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500'}) center/cover`
                }}></div>
                <div className="card-body">
                  <p className="text-light mb-2" style={{ fontSize: '0.875rem' }}>📍 {pkg.destination?.name}</p>
                  <h4 className="font-bold text-primary mb-2" style={{ fontSize: '1.25rem' }}>{pkg.title}</h4>

                  <div className="flex space-between align-center mt-4" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="price-box">
                      <p className="price" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}><span>{settings.global_currency || 'LKR '}</span>{pkg.price.toLocaleString()}</p>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', display: 'block', marginTop: '-2px' }}>*Conditions Apply</span>
                    </div>
                    <Link href={`/packages/${pkg.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      {settings.pkg_btn || 'Book Now'}
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          )) : (
            <div className="text-center grid-cols-1 md:grid-cols-3" style={{ gridColumn: 'span 3' }}>
              <p className="text-light">No packages yet. Stay tuned!</p>
            </div>
          )}
        </AnimatedCards>
      </section>
      )}

      {settings.show_testimonials !== 'false' && (
      <section className="py-20" style={{ backgroundColor: 'var(--primary-color)', color: 'white', overflow: 'hidden' }}>
        <div className="container">
          <div className="section-head">
            <span className="title-prefix" style={{ color: 'var(--accent-color)' }}>Happy Travelers</span>
            <h3 className="section-title" style={{ color: 'white' }}>Stories from Our Clients</h3>
          </div>
          <AnimatedCards>
            {[
              { name: 'Sameera Perera', trip: 'Thailand Combo', text: 'TravaNora made our honeymoon absolutely perfect. Everything from the flights to the private tours was seamless!' },
              { name: 'Nilanthi Silva', trip: 'Singapore Group Tour', text: 'The best travel agency in Sri Lanka! The group tour was well organized and very affordable. Highly recommended.' },
              { name: 'Kusal Mendis', trip: 'Visa Assistance', text: 'I was worried about my visa, but their team handled everything professionally. Got my visa in just 3 days!' }
            ].map((review, i) => (
              <AnimatedCard key={i}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '2.5rem', 
                  borderRadius: '0px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  height: '100%'
                }}>
                  <div style={{ color: '#fbbf24', fontSize: '1.25rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
                  <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.7, opacity: 0.9 }}>&ldquo;{review.text}&rdquo;</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 700, margin: 0 }}>{review.name}</h5>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{review.trip}</span>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </AnimatedCards>
        </div>
      </section>
      )}

      {settings.show_personalize !== 'false' && (
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <AnimatedPersonalize settings={settings} />
      </section>
      )}

      {settings.show_blog !== 'false' && (
      <section className="py-16" style={{ background: 'var(--bg-color)' }}>
        <div className="container">
            <div className="section-head">
                <span className="title-prefix">{settings.blog_prefix || 'Our Blog'}</span>
                <h3 className="section-title">{settings.blog_title || 'Insight & Stories'}</h3>
            </div>
            <AnimatedCards>
              {blogList.map((post: any, n: number) => (
                <AnimatedCard key={n}>
                  <div className="blog-card">
                      <div className="card-image" style={{ backgroundImage: `url(${post.image || 'https://images.unsplash.com/photo-1542662565-7e4fd159dddd?w=600&q=80'})` }}></div>
                      <div className="card-content">
                          <p className="card-meta">{post.date || '20 Apr 2026'}</p>
                          <h3 className="post-title">{post.title || 'Story Title'}</h3>
                          <p className="text-light hide-overflow-text" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                            {post.description || 'Description goes here...'}
                          </p>
                          <Link href={post.link || '/blog'} className="text-accent font-bold" style={{ fontSize: '0.9rem' }}>{settings.blog_read_btn || 'Read More →'}</Link>
                      </div>
                  </div>
                </AnimatedCard>
              ))}
            </AnimatedCards>
        </div>
      </section>
      )}

    </>
  );
}
