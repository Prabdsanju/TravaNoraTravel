import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL('https://travanoratravel.com'),
  title: "TravaNora Travel PVT LTD | Premier Travel Agency in Sri Lanka",
  description: "Experience unforgettable journeys to Thailand, Singapore, Malaysia, and Vietnam with TravaNora Travel. Expertly crafted tour packages, seamless air ticketing, and hassle-free visa assistance.",
  keywords: "thailand tour package from sri lanka, singapore tour packages from sri lanka, malaysia holiday packages from sri lanka, vietnam tour packages from sri lanka, dubai tour packages from sri lanka, india tour packages from sri lanka, travel agency sri lanka, cheap air tickets sri lanka, travanora travel",
  authors: [{ name: "TravaNora Travel" }],
  openGraph: {
    title: "TravaNora Travel PVT LTD | Explore Asia with Ease",
    description: "Your trusted partner for curated holiday packages and seamless travel services in Asia.",
    url: "https://travanoratravel.com",
    siteName: "TravaNora Travel",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: '/logo-circle.svg',
    apple: '/logo-circle.svg',
  },
};

import { getSiteSettings } from '@/app/actions/settings';
import FloatingWhatsApp from './FloatingWhatsApp';
import VisitTracker from './VisitTracker';
import { HeaderWrapper, FooterWrapper } from './ClientLayoutWrapper';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "TravaNora Travel PVT LTD",
              "url": "https://travanoratravel.com",
              "logo": "https://travanoratravel.com/logo-circle.svg",
              "image": "https://travanoratravel.com/og-image.jpg",
              "description": "Premier Travel Agency in Sri Lanka offering curated tours to Thailand, Singapore, Malaysia, and Vietnam, along with air ticketing and visa assistance.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "LK"
              },
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <VisitTracker />
        <HeaderWrapper>
          <header className="site-header">
            <div className="container header-container" style={{ height: 'auto', minHeight: '70px', paddingTop: '10px', paddingBottom: '10px' }}>
              <Link href="/" className="logo travanora-logo" style={{ alignSelf: 'center' }}>
                {settings.site_logo_img ? (
                  <img src={settings.site_logo_img} alt="Logo" className="site-logo" style={{ width: settings.logo_size ? `${settings.logo_size}px` : '48px', height: settings.logo_size ? `${settings.logo_size}px` : '48px' }} />
                ) : (
                  <span className="p-icon">T</span>
                )}
                <span className="site-title">{settings.site_name_main || 'TravaNora'} <span>{settings.site_name_sub || 'Travel'}</span></span>
              </Link>
              <nav className="main-nav">
                <Link href="/">Home</Link>
                <div className="dropdown">
                  <Link href="/destinations">Tours <span className="caret">▼</span></Link>
                  <div className="dropdown-menu">
                    <Link href="/destinations">Group Tours</Link>
                    <Link href="/destinations">Combo Tours</Link>
                    <Link href="/destinations">Private Tours</Link>
                  </div>
                </div>
                <Link href="/services/air-tickets">Air Tickets</Link>
                <Link href="/services/visa">Visa</Link>
                <Link href="/services">Our Services</Link>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact Us</Link>
              </nav>
            </div>
          </header>
        </HeaderWrapper>

        <main className="main-content">
          {children}
        </main>

        <FooterWrapper>
          <footer className="site-footer">
            <div className="container footer-container" style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div className="footer-col footer-intro">
                <div className="logo travanora-logo mb-4" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                  {settings.site_logo_img ? (
                    <img src={settings.site_logo_img} alt="Logo" className="site-logo" style={{ width: settings.logo_size ? `${settings.logo_size}px` : '48px', height: settings.logo_size ? `${settings.logo_size}px` : '48px' }} />
                  ) : (
                    <span className="p-icon">T</span>
                  )}
                  <span className="site-title">{settings.site_name_main || 'TravaNora'} <span>{settings.site_name_sub || 'Travel'}</span></span>
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  TravaNora Travel is more than a travel agency—it’s your gateway to experiencing the wonders of the world seamlessly.
                </p>
                <div className="social-media" style={{ display: 'flex', gap: '1rem' }}>
                  <a href="#" className="social-icon" style={{ color: 'var(--accent-color)' }}>Facebook</a>
                  <a href="#" className="social-icon" style={{ color: 'var(--accent-color)' }}>Instagram</a>
                  <a href="#" className="social-icon" style={{ color: 'var(--accent-color)' }}>TikTok</a>
                </div>
              </div>
              
              <div className="footer-col">
                <h3>Explore</h3>
                <ul className="footer-links">
                  <li><Link href="/services/air-tickets">Air Tickets</Link></li>
                  <li><Link href="/services/visa">Visa Services</Link></li>
                  <li><Link href="/services">Our Services</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/terms">Terms & Conditions</Link></li>
                </ul>
              </div>
              
              <div className="footer-col ft-contacts">
                <h3>Contact Us</h3>
                <p style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', color: '#94a3b8' }}>
                  <span style={{ color: 'var(--accent-color)' }}>📍</span> 
                  <span>{settings.ft_address || '304, 3rd Floor, Jana Jaya City Mall, Rajagiriya, Sri Lanka.'}</span>
                </p>
                <p style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', color: '#94a3b8' }}>
                  <span style={{ color: 'var(--accent-color)' }}>📞</span> 
                  <span>
                    <a href={`tel:${settings.ft_phone1 || '+94712225808'}`} style={{ color: 'white', fontWeight: 600 }}>{settings.ft_phone1 || '+94 71 22 25 808'}</a>
                  </span>
                </p>
                <p style={{ display: 'flex', gap: '0.75rem', color: '#94a3b8' }}>
                  <span style={{ color: 'var(--accent-color)' }}>✉️</span> 
                  <a href={`mailto:${settings.ft_email || 'info@travanoratravel.com'}`} style={{ color: '#94a3b8' }}>{settings.ft_email || 'info@travanoratravel.com'}</a>
                </p>
              </div>
            </div>
            <div className="footer-bottom text-center pt-8 mt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: '#64748b' }}>&copy; {new Date().getFullYear()} {settings.site_name_main || 'TravaNora'} {settings.site_name_sub || 'Travel'}. All rights reserved. <Link href="/admin" style={{ opacity: 0.3, textDecoration: 'none', marginLeft: '8px', cursor: 'pointer' }}>🔒</Link></p>
            </div>
          </footer>

          <FloatingWhatsApp phoneNumber={settings.ft_phone1 || '94740077377'} />
        </FooterWrapper>
      </body>
    </html>
  );
}
