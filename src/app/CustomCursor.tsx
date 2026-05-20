'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = () => {
      // Find all interactive elements
      const updateHoverables = () => {
        const hoveredElement = document.querySelectorAll('a, button, .flip-card, .card, .blog-card, input, textarea');
        hoveredElement.forEach((el) => {
          el.addEventListener('mouseenter', () => setIsHovered(true));
          el.addEventListener('mouseleave', () => setIsHovered(false));
        });
      };

      updateHoverables();
      // Re-run occasionally if content changes
      const timer = setInterval(updateHoverables, 2000);
      return () => clearInterval(timer);
    };

    window.addEventListener('mousemove', moveCursor);
    const stopHover = handleHover();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      stopHover();
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: isHovered ? 80 : 20,
          height: isHovered ? 80 : 20,
          backgroundColor: isHovered ? 'transparent' : 'var(--primary-color)',
          border: isHovered ? '2px solid var(--accent-color)' : 'none',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Small inner dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          backgroundColor: isHovered ? 'var(--accent-color)' : 'white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      <style jsx global>{`
        body { cursor: none !important; }
        a, button, input, textarea, .card, .flip-card { cursor: none !important; }
        
        /* Modern Hover Zoom for elements */
        a, button, .card, .flip-card, .blog-card {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        
        a:hover, button:hover, .card:hover, .flip-card:hover, .blog-card:hover {
          transform: scale(1.05) translateY(-5px);
        }

        @media (max-width: 768px) {
          body { cursor: auto !important; }
          a:hover, button:hover { transform: none !important; }
        }
      `}</style>
    </>
  );
}
