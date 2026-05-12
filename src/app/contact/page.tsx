'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COOLDOWN_TIME = 60000; // 60 seconds

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website_url: '' });
  const [cooldown, setCooldown] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  // Check for existing cooldown on mount
  useEffect(() => {
    setHasMounted(true);
    const lastContact = localStorage.getItem('last_contact_time');
    if (lastContact) {
      const timePassed = Date.now() - parseInt(lastContact);
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

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot Check (Bot Protection)
    if (formData.website_url) {
      console.warn('Bot detected via honeypot');
      return; // Silently ignore bots
    }

    // 2. Cooldown Check
    const lastContact = localStorage.getItem('last_contact_time');
    if (lastContact) {
      const timePassed = Date.now() - parseInt(lastContact);
      if (timePassed < COOLDOWN_TIME) {
        setCooldown(Math.ceil((COOLDOWN_TIME - timePassed) / 1000));
        return;
      }
    }

    // Set cooldown in localStorage
    localStorage.setItem('last_contact_time', Date.now().toString());
    setCooldown(60);

    const text = `*New General Inquiry from TravaNora Site*%0A
----------------------------%0A
*Name:* ${formData.name}%0A
*Email:* ${formData.email}%0A
*Message:* ${formData.message}%0A
----------------------------`;
    window.open(`https://wa.me/94740077377?text=${text}`, '_blank');
  };

  const showCooldown = hasMounted && cooldown > 0;

  return (
    <div className="animate-fade-in" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ 
        padding: '6rem 0', 
        background: '#fff', 
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center' 
      }}>
        <div className="container">
          <span style={{ color: 'var(--accent-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Get In Touch</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1e293b', marginTop: '1rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            We'd Love to Hear From You
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Whether you have a specific travel question or just want to say hi, our team is ready to help you plan your next adventure.
          </p>
        </div>
      </section>

      <div className="container py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: '📍', title: 'Our Office', content: '304, 3rd Floor, Jana Jaya City Mall, Rajagiriya, Sri Lanka.', color: '#eff6ff' },
            { icon: '📞', title: 'Call Us', content: '+94 71 22 25 808\nAvailable 9 AM - 6 PM', color: '#f0fdf4' },
            { icon: '✉️', title: 'Email Us', content: 'info@travanoratravel.com\nbooking@travanoratravel.com', color: '#fef2f2' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ translateY: -10 }}
              style={{ 
                background: 'white', 
                padding: '3rem 2rem', 
                borderRadius: '32px', 
                textAlign: 'center',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9'
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <div style={{ background: 'white', padding: '4rem', borderRadius: '40px', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: '2.5rem' }}>Send Us a Message</h2>
              <form onSubmit={handleWhatsApp}>
                {/* Honeypot field - hidden from users, visible to bots */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input 
                    type="text" 
                    name="website_url" 
                    tabIndex={-1} 
                    autoComplete="off" 
                    value={formData.website_url}
                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem', display: 'block' }}>Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="form-control" 
                    placeholder="Enter your name" 
                    style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem', display: 'block' }}>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-control" 
                    placeholder="Enter your email" 
                    style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem', display: 'block' }}>Your Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="form-control" 
                    rows={5}
                    placeholder="What's on your mind?" 
                    style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', resize: 'none' }}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={showCooldown}
                  className="btn-primary" 
                  style={{ 
                    width: '100%', 
                    padding: '1.5rem', 
                    fontSize: '1.15rem', 
                    fontWeight: 800,
                    borderRadius: '20px',
                    backgroundColor: showCooldown ? '#94a3b8' : '#25D366',
                    cursor: showCooldown ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.3s'
                  }}
                >
                  {showCooldown ? (
                    <span>Please wait {cooldown}s...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.348-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Send to WhatsApp Directly
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="md:col-span-2">
            <div style={{ background: '#0f172a', padding: '3.5rem', borderRadius: '40px', color: 'white', position: 'sticky', top: '120px' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>24/7 Support</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.8, marginBottom: '2rem' }}>
                We pride ourselves on being available whenever our travelers need us. Whether you're planning or currently on a trip, we're just a message away.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💬</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Live Chat</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>WhatsApp: Available now</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⏰</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Response Time</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Average under 15 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
