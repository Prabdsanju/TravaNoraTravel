'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitFlightRequest } from '@/app/actions/flight';
import AirportSearch from './AirportSearch';
import AirlineSearch from './AirlineSearch';

export default function AirTicketsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripType, setTripType] = useState('round-trip');
  const [destination, setDestination] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const result = await submitFlightRequest(formData);
      if (result.success && result.url) {
        // Open WhatsApp
        window.open(result.url, '_blank');
        alert("Your inquiry has been sent successfully!");
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero Section */}
      <section style={{ 
        height: '40vh', 
        background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem' }}>Book Your Flight</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Best Rates for International & Domestic Air Tickets</p>
        </motion.div>
      </section>

      {/* Booking Form Container */}
      <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10, paddingBottom: '5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ 
            background: 'white', 
            borderRadius: '24px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            padding: '2.5rem'
          }}
        >
          {/* Trip Type Selector */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input type="radio" name="tripType" checked={tripType === 'round-trip'} onChange={() => setTripType('round-trip')} />
              Round Trip
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input type="radio" name="tripType" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} />
              One Way
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              
              {/* From & To */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Departure From</label>
                <AirportSearch name="from" placeholder="Origin City or Airport Code" required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Going To</label>
                <AirportSearch name="to" placeholder="Destination City or Airport Code" required onSelect={setDestination} />
              </div>

              {/* Dates */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Departure Date</label>
                <input type="date" name="departureDate" className="form-control" required style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              </div>
              {tripType === 'round-trip' && (
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Return Date</label>
                  <input type="date" name="returnDate" className="form-control" required style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              {/* Passengers */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Adults (12+ Yrs)</label>
                <input type="number" name="adults" min="1" defaultValue="1" className="form-control" required style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Children (2-12 Yrs)</label>
                <input type="number" name="children" min="0" defaultValue="0" className="form-control" style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Child Ages (if any)</label>
                <input type="text" name="childrenAges" placeholder="e.g. 5, 8" className="form-control" style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              {/* Preferences */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Baggage Requirement</label>
                <select name="baggage" className="form-control" style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <option value="Standard">Standard (20-30kg)</option>
                  <option value="Extra">Extra Baggage</option>
                  <option value="Light">Light (Hand baggage only)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>Preferred Airline</label>
                <AirlineSearch name="preferredAirline" placeholder="e.g. SriLankan, Emirates, Qatar" selectedDestination={destination} />
              </div>
            </div>

            {/* Contact Info */}
            <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' }}>Contact Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" required style={{ padding: '0.8rem' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" name="phone" className="form-control" required placeholder="+94 7X XXX XXXX" style={{ padding: '0.8rem' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-control" style={{ padding: '0.8rem' }} />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary" 
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                fontSize: '1.25rem', 
                fontWeight: 700,
                boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.3)' 
              }}
            >
              {isSubmitting ? 'Processing...' : 'Request a Quote via WhatsApp 🚀'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>Why Book With TravaNora?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Best Price Guarantee</h4>
              <p style={{ color: '#64748b' }}>We compare multiple airlines to give you the most competitive fares.</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎧</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>24/7 Support</h4>
              <p style={{ color: '#64748b' }}>Our travel experts are available around the clock to assist you.</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✈️</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Personalized Experience</h4>
              <p style={{ color: '#64748b' }}>From extra baggage to seat preferences, we handle all your needs.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
