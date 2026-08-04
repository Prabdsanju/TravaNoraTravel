import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        height: '60vh', 
        background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80) center/cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1px' }}>TravaNora Travel</h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            Redefining the art of travel through passion, expertise, and a commitment to unforgettable experiences.
          </p>
        </div>
      </section>

      <div className="container py-24">
        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <span style={{ 
              color: 'var(--accent-color)', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              fontSize: '0.85rem',
              display: 'block',
              marginBottom: '1rem'
            }}>Our Legacy</span>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 900, color: '#1e293b', marginBottom: '2rem', lineHeight: 1.1 }}>
              Crafting Stories Since the Beginning
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.9, marginBottom: '1.5rem' }}>
              TravaNora Travel PVT LTD isn&apos;t just a travel agency; it&apos;s a dream realized. Born from a profound love for the diverse cultures and breathtaking landscapes of Southeast Asia, we&apos;ve dedicated ourselves to uncovering the hidden gems that ordinary travelers often miss.
            </p>
            <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.9 }}>
              Our journey started with a simple belief: that travel should be transformative. Today, we stand as a premier gateway to Thailand, Singapore, Malaysia, and Vietnam, serving thousands of happy travelers with personalized care.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80" 
              alt="Travel Expert" 
              style={{ borderRadius: '32px', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)', width: '100%' }}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: '-30px', 
              right: '20px', 
              background: 'var(--accent-color)', 
              color: 'white', 
              padding: '2rem', 
              borderRadius: '24px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>10+</div>
              <div style={{ fontWeight: 700, opacity: 0.9 }}>Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-32">
          {[
            { label: 'Happy Travelers', value: '5,000+' },
            { label: 'Destinations', value: '45+' },
            { label: 'Expert Guides', value: '120+' },
            { label: 'Award Won', value: '15+' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              textAlign: 'center', 
              padding: '3rem 1.5rem', 
              background: '#f8fafc', 
              borderRadius: '24px',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{stat.value}</div>
              <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <div style={{ 
            padding: '4rem', 
            borderRadius: '40px', 
            backgroundColor: '#0f172a', 
            color: 'white',
            backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(2, 132, 199, 0.15) 0%, transparent 50%)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🎯</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Our Vision</h3>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.8 }}>
              To redefine the travel industry by creating sustainable, culturally immersive, and deeply personal journeys that connect people with the heart of Asia.
            </p>
          </div>
          <div style={{ 
            padding: '4rem', 
            borderRadius: '40px', 
            backgroundColor: '#f1f5f9', 
            color: '#1e293b',
            backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(2, 132, 199, 0.05) 0%, transparent 50%)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🚀</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Our Mission</h3>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: '#64748b' }}>
              To provide seamless, expert-led travel services that exceed expectations, ensuring every TravaNora journey is safe, enriching, and flawlessly executed.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, #0c4a6e 100%)', 
          padding: '6rem 2rem', 
          borderRadius: '48px', 
          textAlign: 'center', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Start Your Next Chapter</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              The world is waiting for you. Let our experts craft the perfect itinerary for your dream escape.
            </p>
            <Link href="/destinations" className="btn-primary" style={{ 
              backgroundColor: 'white', 
              color: 'var(--primary-color)', 
              padding: '1.25rem 3rem', 
              fontSize: '1.15rem',
              borderRadius: '16px',
              fontWeight: 800
            }}>
              Explore Destinations 🌍
            </Link>
          </div>
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
          <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
        </div>
      </div>
    </div>
  );
}
