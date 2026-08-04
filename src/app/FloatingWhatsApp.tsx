'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const COOLDOWN_TIME = 30000; // 30 seconds

export default function FloatingWhatsApp({ phoneNumber }: { phoneNumber: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const cleanPhone = phoneNumber.replace(/\+/g, '').replace(/\s/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello TravaNora! I have a question regarding your services.`;

  // Check for existing cooldown on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
      const lastClick = localStorage.getItem('last_wa_click');
      if (lastClick) {
        const timePassed = Date.now() - parseInt(lastClick);
        if (timePassed < COOLDOWN_TIME) {
          setCooldown(Math.ceil((COOLDOWN_TIME - timePassed) / 1000));
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleClick = () => {
    if (cooldown === 0) {
      localStorage.setItem('last_wa_click', Date.now().toString());
      setCooldown(30);
      window.open(whatsappUrl, '_blank');
    }
  };

  const showCooldown = hasMounted && cooldown > 0;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!showCooldown ? { scale: 1.1 } : {}}
      whileTap={!showCooldown ? { scale: 0.9 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 2 
      }}
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '65px',
        height: '65px',
        backgroundColor: showCooldown ? '#94a3b8' : '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: showCooldown ? 'none' : '0 10px 25px rgba(37, 211, 102, 0.4)',
        zIndex: 9999,
        cursor: showCooldown ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s'
      }}
    >
      {/* Pulse Animation - Only show when NOT on cooldown */}
      {!showCooldown && (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#25D366',
            borderRadius: '50%',
            zIndex: -1
          }}
        />
      )}

      {cooldown > 0 ? (
        <span style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>{cooldown}</span>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="35" 
          height="35" 
          viewBox="0 0 24 24" 
          fill="white"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.348-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      )}
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        style={{
          position: 'absolute',
          right: '80px',
          background: 'white',
          padding: '8px 15px',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          color: '#1e293b',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: '1px solid #f1f5f9'
        }}
      >
        {cooldown > 0 ? `Wait ${cooldown}s` : 'Chat with us! 👋'}
      </motion.div>
    </motion.div>
  );
}
