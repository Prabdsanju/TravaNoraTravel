'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ServicesClientProps {
  settings: Record<string, string>;
}

export default function ServicesClient({ settings }: ServicesClientProps) {
  const brandName = settings.site_name_main || 'TravaNora';
  const whatsappNumber = settings.contact_whatsapp_number || '94740077377';

  const servicesTitle = settings.services_title || 'Our Travel Services';
  const servicesSubtitle = settings.services_subtitle || `From bespoke luxury packages and global flight bookings to seamless visa handlings, ${brandName} is your dedicated full-service travel partner committed to turning every journey into an unforgettable story.`;

  let services: any[] = [];
  try {
    if (settings.services_list_json) {
      services = JSON.parse(settings.services_list_json);
    }
  } catch (e) {
    // ignore
  }

  if (!services || services.length === 0) {
    services = [
      {
        icon: '🗺️',
        title: 'Tailor-Made Tour Packages',
        subtitle: 'Bespoke Itineraries',
        description: "Tailor-made itineraries crafted by our travel experts. Experience Sigiriya's ancient heights, Ella's lush bridges, or Mirissa's gorgeous beaches with custom-designed routes matching your budget and pace.",
        features: ['Personalized Daily Schedules', 'Private English-speaking Guides', 'Hand-picked Accommodation Choices'],
        link: '/destinations',
        btnText: 'Explore Destinations',
        badge: 'Popular',
        color: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        accentColor: '#3b82f6'
      },
      {
        icon: '✈️',
        title: 'Global Air Tickets',
        subtitle: 'Best Fares Guaranteed',
        description: 'Get the most competitive rates on international and domestic flights. Enjoy full booking assistance, seat selection preferences, excess baggage coordination, and 24/7 schedule change monitoring.',
        features: ['Multi-Airline Price Comparison', 'Baggage Allowances Optimized', 'Instant Booking Confirmation'],
        link: '/services/air-tickets',
        btnText: 'Book Air Tickets',
        badge: 'Best Rates',
        color: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        accentColor: '#10b981'
      },
      {
        icon: '📄',
        title: 'Worldwide Visa Services',
        subtitle: 'Consultancy & Documentation',
        description: 'Fast, reliable, and highly successful tourist and business visa consultancy. We manage complete file preparations, document reviews, interview guidelines, and submission follow-ups.',
        features: ['Accurate Embassy Document Checks', 'High Processing Success Rate', 'Comprehensive Visa Guidance'],
        link: '/services/visa',
        btnText: 'Request Visa Assistance',
        badge: 'Expert Assistance',
        color: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        accentColor: '#ef4444'
      },
      {
        icon: '🏨',
        title: 'Hotel & Resort Bookings',
        subtitle: 'Handpicked Luxury Hotels',
        description: 'Find hand-picked boutique villas, wellness resorts, and premium beach retreats. We negotiate custom rates to secure exclusive benefits like room upgrades, complimentary breakfasts, and early check-ins.',
        features: ['Exclusive Premium Rates', 'Early Check-In Perks', 'Verified High-Quality Resorts'],
        link: '/contact',
        btnText: 'Inquire Accommodations',
        badge: 'VIP Perks',
        color: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        accentColor: '#8b5cf6'
      },
      {
        icon: '🚘',
        title: 'Airport Transfers & Transit',
        subtitle: 'Seamless Ground Travel',
        description: 'Start your vacation in complete peace. Rely on pre-arranged, comfortable private vehicles, professional English-speaking drivers, and full flight-monitoring services that sync with your arrival.',
        features: ['Professional Insured Chauffeurs', 'Real-Time Flight Tracking', 'Clean, Fully Air-Conditioned Fleet'],
        link: '/contact',
        btnText: 'Book Local Transfers',
        badge: 'Reliable Shuttles',
        color: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        accentColor: '#f59e0b'
      },
      {
        icon: '🛡️',
        title: 'Comprehensive Travel Insurance',
        subtitle: 'Global Journey Protection',
        description: 'Explore the world with complete confidence. Safeguard your family and trip investments with comprehensive medical coverage, luggage loss policies, and flight interruption coverage.',
        features: ['24/7 Medical Cover Assistance', 'Lost Luggage Protection Claims', 'Flexible Trip Interruption Cover'],
        link: '/contact',
        btnText: 'Get Insurance Cover',
        badge: 'Absolute Peace of Mind',
        color: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
        accentColor: '#06b6d4'
      }
    ];
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero Header Section */}
      <section style={{
        padding: '7rem 0 6rem 0',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Blurs */}
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            color: 'var(--accent-color)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.85rem',
            background: 'rgba(2, 132, 199, 0.1)',
            padding: '0.5rem 1.25rem',
            borderRadius: '50px'
          }}>
            Exclusive Operations
          </span>
          <h1 style={{
            fontSize: '3.75rem',
            fontWeight: 900,
            color: '#0f172a',
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            letterSpacing: '-1.5px',
            lineHeight: 1.1
          }}>
            {servicesTitle}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            {servicesSubtitle}
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="container py-20">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem'
        }}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.08)' }}
              style={{
                background: 'white',
                borderRadius: '32px',
                padding: '2.5rem',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s'
              }}
            >
              <div>
                {/* Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '24px',
                    background: service.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    boxShadow: '0 10px 20px -5px rgba(0,0,0,0.03)'
                  }}>
                    {service.icon}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: service.accentColor,
                    background: `${service.accentColor}10`,
                    padding: '0.4rem 1rem',
                    borderRadius: '50px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {service.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.5px'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: service.accentColor,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem'
                }}>
                  {service.subtitle}
                </p>
                <p style={{
                  color: '#64748b',
                  lineHeight: 1.6,
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem'
                }}>
                  {service.description}
                </p>

                {/* Features Checklist */}
                <div style={{
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: '20px',
                  marginBottom: '2rem',
                  border: '1px solid #f1f5f9'
                }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(service.features || []).map((feat: string, fIdx: number) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                        <span style={{ color: service.accentColor, fontSize: '1.1rem' }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link */}
              <Link href={service.link} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    borderRadius: '16px',
                    background: service.accentColor,
                    color: 'white',
                    fontWeight: 800,
                    textAlign: 'center',
                    fontSize: '0.95rem',
                    boxShadow: `0 10px 20px -8px ${service.accentColor}50`,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  className="service-btn"
                >
                  {service.btnText}
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner Section */}
      <section className="container" style={{ paddingBottom: '7rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '40px',
          padding: '4rem 3.5rem',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 30px 60px -20px rgba(15, 23, 42, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Elements */}
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px', margin: '0 auto' }}>
            <span style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'block' }}>📞</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>
              Have Unique Custom Requirements?
            </h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              We understand that standard solutions do not fit every traveler. Contact our VIP support team directly via WhatsApp, and let us design the perfect plan for you.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: 'white',
                  padding: '1.25rem 2.5rem',
                  borderRadius: '20px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 10px 20px -5px rgba(37, 211, 102, 0.4)',
                  fontSize: '1.05rem',
                  transition: 'transform 0.2s'
                }}
              >
                <span>💬</span> WhatsApp Direct Chat
              </a>
              <Link
                href="/contact"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '1.25rem 2.5rem',
                  borderRadius: '20px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '1.05rem',
                  transition: 'background 0.2s'
                }}
              >
                Visit Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
