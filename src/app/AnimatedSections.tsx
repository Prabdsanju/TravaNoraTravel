'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// --- Animated Philosophy ---
export function AnimatedPhilosophy({ settings }: { settings: any }) {
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '5rem', alignItems: 'center' }}>
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.15 }}
        className="about-reel" 
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
      >
        {[
          settings.about_img_1 || 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80',
          settings.about_img_2 || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
          settings.about_img_3 || 'https://images.unsplash.com/photo-1510255375549-0fa733d9cddf?w=600&q=80',
          settings.about_img_4 || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'
        ].map((imgUrl, idx) => (
          <motion.div 
            key={idx} 
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 30 },
              visible: { opacity: 1, scale: 1, y: 0 }
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ 
              height: '300px', 
              borderRadius: '30px', 
              backgroundImage: `url(${imgUrl})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
              marginTop: idx === 1 ? '2rem' : idx === 2 ? '-2rem' : '0'
            }}
          />
        ))}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="content-block"
      >
        <span style={{ color: 'var(--accent-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.875rem', display: 'block', marginBottom: '1.5rem' }}>Our Philosophy</span>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1e293b', lineHeight: 1.1, marginBottom: '2rem' }}>
          {settings.about_title || 'Crafting Journeys with Care and Passion'}
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.8, marginBottom: '2.5rem' }}>
          {settings.about_text || 'We believe travel is more than just a destination...'}
        </p>
      </motion.div>
    </div>
  );
}

// --- Animated Personalize ---
export function AnimatedPersonalize({ settings }: { settings: any }) {
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img src={settings.personalize_img || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"} alt="Personalize" style={{ borderRadius: 'var(--radius)', boxShadow: '0 30px 60px -10px rgba(0,0,0,0.2)' }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-head" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <h3 className="section-title">{settings.personalize_title || 'Personalize your tour'}</h3>
        </div>  
        <div className="icon-content">
            {[1,2,3].map(n => (
              <motion.div 
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: n * 0.2 }}
                className="data-row"
              >
                <i style={{ backgroundImage: `url(${n === 1 ? 'https://cdn-icons-png.flaticon.com/128/4059/4059990.png' : n === 2 ? 'https://cdn-icons-png.flaticon.com/128/8991/8991475.png' : 'https://cdn-icons-png.flaticon.com/128/4524/4524225.png'})` }}></i>
                <div>
                    <h4>{settings[`pers_i${n}_title`] || 'Step Title'}</h4>
                    <p>{settings[`pers_i${n}_desc`] || 'Step Description'}</p>
                </div>
              </motion.div>
            ))}
        </div>
        <Link href="/contact" className="btn-primary dark-btn" style={{ marginTop: '2rem' }}>{settings.pers_btn || 'Plan Your Tour'}</Link>
      </motion.div>
    </div>
  );
}

// --- Animated Cards Wrapper (For Blog & Destinations) ---
export function AnimatedCards({ children }: { children: any }) {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }}
      className="grid md:grid-cols-3"
      style={{ display: 'grid', gap: '2rem' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children }: { children: any }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
