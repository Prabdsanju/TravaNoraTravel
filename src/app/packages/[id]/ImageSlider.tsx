'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-Play every 2 seconds
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, [nextSlide, images]);

  if (!images || images.length === 0) return null;

  // Helper to get visible images for the 3-card layout
  const getVisibleImages = () => {
    const total = images.length;
    if (total === 1) return [images[0]];
    if (total === 2) return [images[0], images[1]];
    
    const prev = (currentIndex - 1 + total) % total;
    const next = (currentIndex + 1) % total;
    return [
      { url: images[prev], position: 'left' },
      { url: images[currentIndex], position: 'center' },
      { url: images[next], position: 'right' }
    ];
  };

  return (
    <div className="slider-wrapper" style={{ 
      position: 'relative', 
      width: '100%', 
      height: '450px', 
      marginBottom: '3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '20px 0'
    }}>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <AnimatePresence mode='popLayout'>
          {images.map((img, index) => {
            // Calculate distance from current index for visual hierarchy
            const total = images.length;
            let diff = index - currentIndex;
            
            // Handle wrapping for infinite loop look
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isActive = index === currentIndex;
            const isVisible = Math.abs(diff) <= 1;

            if (!isVisible) return null;

            return (
              <motion.div
                key={img}
                layout
                initial={{ opacity: 0, scale: 0.8, x: diff * 300 }}
                animate={{ 
                  opacity: 1, 
                  scale: isActive ? 1.05 : 0.85, 
                  x: diff * 280,
                  zIndex: isActive ? 10 : 5,
                  filter: isActive ? 'blur(0px)' : 'blur(2px)',
                }}
                exit={{ opacity: 0, scale: 0.8, x: diff * 300 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  opacity: { duration: 0.2 }
                }}
                style={{
                  position: 'absolute',
                  width: '80%',
                  height: '100%',
                  borderRadius: '24px',
                  boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.1)',
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentIndex(index)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="slider-btn-prev"
            style={{
              position: 'absolute',
              left: '5%',
              zIndex: 20,
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              fontSize: '1.5rem',
              color: 'var(--primary-color)'
            }}
          >
            ❮
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="slider-btn-next"
            style={{
              position: 'absolute',
              right: '5%',
              zIndex: 20,
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              fontSize: '1.5rem',
              color: 'var(--primary-color)'
            }}
          >
            ❯
          </button>
        </>
      )}

      {/* Indicators */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        display: 'flex',
        gap: '8px',
        zIndex: 20
      }}>
        {images.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              width: index === currentIndex ? '30px' : '10px',
              backgroundColor: index === currentIndex ? 'var(--primary-color)' : 'rgba(0,0,0,0.2)'
            }}
            style={{
              height: '10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
