'use client';

import { useState, useEffect } from 'react';
import { submitBooking } from '@/app/actions/booking';
import { motion, AnimatePresence } from 'framer-motion';

const COOLDOWN_TIME = 60000; // 60 seconds

export default function BookingForm({ 
  packageId, 
  packageTitle, 
  defaultNights 
}: { 
  packageId: string; 
  packageTitle: string; 
  defaultNights: number;
}) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [waUrl, setWaUrl] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  // Check for existing cooldown on mount
  useEffect(() => {
    setHasMounted(true);
    const lastBooking = localStorage.getItem('last_booking_time');
    if (lastBooking) {
      const timePassed = Date.now() - parseInt(lastBooking);
      if (timePassed < COOLDOWN_TIME) {
        setCooldown(Math.ceil((COOLDOWN_TIME - timePassed) / 1000));
      }
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  async function handleFormAction(formData: FormData) {
    // 1. Honeypot Check (Bot Protection)
    const honeypot = formData.get('website_url');
    if (honeypot) {
      console.warn('Bot detected via honeypot');
      return; // Silently ignore bots
    }

    // 2. Cooldown Check
    const lastBooking = localStorage.getItem('last_booking_time');
    if (lastBooking) {
      const timePassed = Date.now() - parseInt(lastBooking);
      if (timePassed < COOLDOWN_TIME) {
        setCooldown(Math.ceil((COOLDOWN_TIME - timePassed) / 1000));
        return;
      }
    }

    setLoading(true);
    try {
      const url = await submitBooking(formData);
      if (url) {
        // Set cooldown in localStorage
        localStorage.setItem('last_booking_time', Date.now().toString());
        setCooldown(60);
        
        setWaUrl(url);
        setIsSuccess(true);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      alert('Something went wrong. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  // Prevent hydration mismatch by only showing cooldown UI after mount
  const showCooldown = hasMounted && cooldown > 0;

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem', 
          background: '#f0fdf4', 
          borderRadius: '24px',
          border: '2px dashed #22c55e'
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎊</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', marginBottom: '1rem' }}>Booking Requested!</h3>
        <p style={{ color: '#15803d', marginBottom: '2rem', lineHeight: 1.6 }}>
          Thank you for choosing TravaNora! We are opening WhatsApp to finalize your dream trip to <strong>{packageTitle}</strong>.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a 
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ 
              backgroundColor: '#25D366', 
              padding: '1.25rem', 
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: 700,
              boxShadow: '0 10px 20px -5px rgba(37, 211, 102, 0.4)'
            }}
          >
            Continue to WhatsApp 📲
          </a>
          
          <button 
            onClick={() => setIsSuccess(false)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#166534', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            Make another request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: '24px', padding: '1rem' }}>
      <form action={handleFormAction}>
        {/* Honeypot field - hidden from users, visible to bots */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
        </div>

        <input type="hidden" name="packageId" value={packageId} />
        <input type="hidden" name="packageTitle" value={packageTitle} />
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#e0f2fe', padding: '8px', borderRadius: '10px' }}>👤</span> Personal Details
          </h3>
          
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              placeholder="Enter your full name" 
              required 
              style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                className="form-control" 
                placeholder="+94 ..." 
                required 
                style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Email (Optional)</label>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                placeholder="you@email.com" 
                style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', padding: '8px', borderRadius: '10px' }}>✈️</span> Trip Preferences
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Travel Date</label>
              <input 
                type="date" 
                name="travelDate" 
                className="form-control" 
                required 
                style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Nights</label>
              <input 
                type="number" 
                name="nights" 
                min="1" 
                defaultValue={defaultNights} 
                className="form-control" 
                required 
                style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Adults</label>
              <input 
                type="number" 
                name="guests" 
                min="1" 
                defaultValue="2" 
                className="form-control" 
                required 
                style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Children</label>
              <input 
                type="number" 
                name="children" 
                min="0" 
                defaultValue="0" 
                className="form-control" 
                style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>Children Ages (if any)</label>
            <input 
              type="text" 
              name="childrenAges" 
              className="form-control" 
              placeholder="e.g. 5, 8" 
              style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '100%' }}
            />
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          padding: '1.5rem', 
          borderRadius: '20px', 
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated Total</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0369a1' }}>Custom Quote</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Starting from</div>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>Best Rates</div>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || showCooldown}
          style={{ 
            width: '100%', 
            padding: '1.25rem', 
            fontSize: '1.2rem', 
            fontWeight: 800,
            borderRadius: '18px',
            border: 'none',
            background: (loading || showCooldown) ? '#94a3b8' : 'linear-gradient(to right, #25D366, #128C7E)',
            color: 'white',
            cursor: (loading || showCooldown) ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 25px -5px rgba(37, 211, 102, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => !(loading || showCooldown) && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => !(loading || showCooldown) && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {loading ? (
            <span>Processing...</span>
          ) : showCooldown ? (
            <span>Wait {cooldown}s to request again</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.348-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Request Quote via WhatsApp</span>
            </>
          )}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>
          Secure Booking • Anti-Spam Protected • Trusted Service
        </p>
      </form>
    </div>
  );
}
