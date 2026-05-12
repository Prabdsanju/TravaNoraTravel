'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AnimatedServices({ settings }: { settings: any }) {
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '4rem', alignItems: 'center' }}>
      
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="section-head" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="title-prefix"
          >
            {settings.services_prefix || 'Travel Services'}
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="section-title" 
            style={{ whiteSpace: 'pre-line' }}
          >
            {settings.services_title || 'Looking for Air Tickets and \nVisa Services?'}
          </motion.h3>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-light" 
          style={{ marginBottom: '2rem', fontSize: '1.1rem', whiteSpace: 'pre-line' }}
        >
          {settings.services_text || 'Discover hassle-free travel planning with our seamless flight ticket booking and visa assistance services.'}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}
        >
          <Link href="/services/air-tickets" className="btn-primary dark-btn">
            {settings.services_btn1 || 'Air Tickets'}
          </Link>
          <Link href="/services/visa" className="btn-outline light-btn">
            {settings.services_btn2 || 'Visa Services'}
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated Image */}
      <motion.div 
        initial={{ opacity: 0, x: 100, scale: 0.9, rotate: 2 }}
        whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ position: 'relative', height: '100%', minHeight: '400px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)' }}
      >
         <motion.img 
           whileHover={{ scale: 1.05 }}
           transition={{ duration: 0.6 }}
           src={settings.services_img || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"} 
           alt="Flights" 
           style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} 
         />
      </motion.div>

    </div>
  );
}
