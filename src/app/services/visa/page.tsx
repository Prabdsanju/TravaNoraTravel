'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitVisaRequest } from '@/app/actions/visa';
import CountrySearch from './CountrySearch';

export default function VisaServicesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const result = await submitVisaRequest(formData);
      if (result.success && result.url) {
        window.open(result.url, '_blank');
        alert("Your visa inquiry has been sent successfully!");
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
    <main style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Hero Section */}
      <section style={{ 
        height: '40vh', 
        background: 'linear-gradient(rgba(7, 89, 133, 0.8), rgba(7, 89, 133, 0.8)), url("https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=2000")',
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
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem' }}>Visa Assistance</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Reliable Visa Services for Any Destination</p>
        </motion.div>
      </section>

      <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10, paddingBottom: '5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ 
            background: 'white', 
            borderRadius: '24px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            padding: '3rem'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0c4a6e' }}>Start Your Visa Application</h2>
            <p style={{ color: '#64748b' }}>Please fill in the details below and our experts will get in touch with you.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Country to Visit</label>
                <CountrySearch name="country" placeholder="Type Country Name (e.g. Thailand, UK)" required />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Visa Type</label>
                <select name="visaType" className="form-control" required style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <option value="Tourist Visa">Tourist Visa</option>
                  <option value="Business Visa">Business Visa</option>
                  <option value="Transit Visa">Transit Visa</option>
                  <option value="Student Visa">Student Visa</option>
                  <option value="Work Visa">Work Visa</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Number of Applicants</label>
                <input type="number" name="applicants" min="1" defaultValue="1" className="form-control" required style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Expected Travel Date</label>
                <input type="date" name="travelDate" className="form-control" required style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
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

            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Additional Notes / Questions</label>
              <textarea name="message" className="form-control" placeholder="Any specific requirements or questions..." style={{ minHeight: '120px', padding: '1rem' }}></textarea>
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
                background: '#0284c7',
                boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.3)' 
              }}
            >
              {isSubmitting ? 'Processing...' : 'Send Visa Inquiry via WhatsApp 📲'}
            </button>
          </form>
        </motion.div>
      </div>

      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0c4a6e' }}>Hassle-Free Visa Processing</h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.7 }}>
                  Obtaining a visa can be a complex process, but with TravaNora Travel, it doesn&apos;t have to be. Our experienced team handles the documentation and application process for you, ensuring a higher success rate and peace of mind.
                </p>
                <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>✅ <span style={{ fontWeight: 600 }}>Expert Document Review</span></li>
                  <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>✅ <span style={{ fontWeight: 600 }}>Fast Processing Times</span></li>
                  <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>✅ <span style={{ fontWeight: 600 }}>High Approval Rates</span></li>
                </ul>
              </div>
              <div style={{ position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800" alt="Visa Assistance" style={{ borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
