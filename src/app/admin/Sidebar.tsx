'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAdmin } from '@/app/actions/auth';

export default function Sidebar({ 
  bookingCount, 
  flightCount, 
  visaCount 
}: { 
  bookingCount: number; 
  flightCount: number; 
  visaCount: number; 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

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

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📈' },
    { href: '/admin/destinations', label: 'Destinations', icon: '🗺️' },
    { href: '/admin/packages', label: 'Packages', icon: '📦' },
    { href: '/admin/bookings', label: 'Tour Bookings', icon: '📅', count: bookingCount },
    { href: '/admin/flights', label: 'Flight Inquiries', icon: '✈️', count: flightCount },
    { href: '/admin/visas', label: 'Visa Inquiries', icon: '🪪', count: visaCount },
    { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>🌍</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>TravaNora Admin</span>
        </div>
        <button type="button" className="admin-mobile-toggle" onClick={toggleSidebar} aria-label="Toggle Navigation">
          <span style={{ fontSize: '1.25rem' }}>{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      <div 
        className={`admin-sidebar-overlay ${isOpen ? 'mobile-open' : ''}`} 
        onClick={closeSidebar} 
      />

      {/* Main Sidebar Panel */}
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-title-wrapper">
          <h2 className="sidebar-title">Admin Panel</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.count !== undefined && <Badge count={item.count} />}
              </Link>
            );
          })}
          
          <Link 
            href="/" 
            className="sidebar-link mt-8" 
            style={{ color: "var(--text-light)" }}
            onClick={closeSidebar}
          >
            <span className="sidebar-link-icon">←</span>
            <span>Back to Site</span>
          </Link>
          <button
            onClick={async () => {
              await logoutAdmin();
              router.push('/admin/login');
              router.refresh();
            }}
            className="sidebar-link"
            style={{ color: '#ef4444', textAlign: 'left', width: '100%' }}
          >
            <span className="sidebar-link-icon">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
