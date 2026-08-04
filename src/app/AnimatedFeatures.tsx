'use client';

import { motion } from 'framer-motion';

export default function AnimatedFeatures() {
  const features = [
    { icon: '🗺️', title: 'Expert Planning', desc: 'Crafting detailed itineraries tailored to your travel style and budget.' },
    { icon: '💎', title: 'Premium Service', desc: 'Enjoy high-end accommodations and exclusive experiences on every trip.' },
    { icon: '🤝', title: '24/7 Support', desc: 'Our team is always available to assist you, anywhere in the world.' },
    { icon: '💰', title: 'Best Value', desc: 'Get the most competitive rates without compromising on quality.' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className="grid md:grid-cols-4 gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {features.map((feature, i) => (
        <motion.div 
          key={i} 
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          style={{ 
            background: 'white', 
            padding: '2.5rem 1.5rem', 
            borderRadius: '24px', 
            textAlign: 'center',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9',
            cursor: 'default'
          }}
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
            style={{ fontSize: '3rem', marginBottom: '1.5rem' }}
          >
            {feature.icon}
          </motion.div>
          <h4 style={{ fontWeight: 800, color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{feature.title}</h4>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>{feature.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
