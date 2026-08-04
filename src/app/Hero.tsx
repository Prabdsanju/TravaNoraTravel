'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Hero({ 
  data, 
  settings 
}: { 
  data: any;
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const slides = (() => {
    try {
      let rawSlides = [];
      if (settings.hero_slides_json) {
        rawSlides = JSON.parse(settings.hero_slides_json);
      } else {
        // Default initial slides
        rawSlides = [
          { title: 'THAILAND', description: 'Discover the land of smiles...', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=2000', link: '/destinations/thailand' },
          { title: 'MALAYSIA', description: 'A melting pot of cultures...', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=2000', link: '/destinations/malaysia' },
          { title: 'SINGAPORE', description: 'A futuristic garden city...', image: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=2000', link: '/destinations/singapore' },
          { title: 'VIETNAM', description: 'Emerald waters and ancient towns...', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=2000', link: '/destinations/dest-vietnam' },
          { title: 'SRI LANKA', description: 'The Pearl of the Indian Ocean...', image: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=2000', link: '/destinations/dest-srilanka' }
        ];
      }

      // AUTO-UPDATE: Link slides to real database counts and correct links
      const syncedSlides = rawSlides.map((slide: any) => {
        const titleKey = slide.title.toLowerCase().replace(/\s+/g, '');
        // Check if we have real data for this title (Thailand, Malaysia, Singapore, etc.)
        if (data && data[titleKey]) {
          return {
            ...slide,
            spots: `${data[titleKey].count} Packages Available`,
            link: `/destinations/${data[titleKey].id}`
          };
        }
        // If no match, keep the spots as is (or use a fallback)
        return {
          ...slide,
          spots: slide.spots || 'Explore Packages'
        };
      });

      // AUTO-APPEND: Automatically add slides for destinations that have at least 1 package but aren't in the slides list yet
      const finalSlides = [...syncedSlides];
      if (data) {
        Object.entries(data).forEach(([key, destInfo]: [string, any]) => {
          if (destInfo.count > 0) {
            const exists = finalSlides.some((slide: any) => 
              slide.title.toLowerCase().replace(/\s+/g, '') === key
            );
            if (!exists) {
              finalSlides.push({
                title: destInfo.name.toUpperCase(),
                description: destInfo.description || `Explore the beauty of ${destInfo.name}...`,
                image: destInfo.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000',
                link: `/destinations/${destInfo.id}`,
                spots: `${destInfo.count} Packages Available`
              });
            }
          }
        });
      }

      return finalSlides;

    } catch (e) {
      return [];
    }
  })();
  
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="hero-slider" style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden',
      background: '#0f172a' 
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${slides[activeTab]?.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }}
        />
      </AnimatePresence>

      <div className="container" style={{ 
        position: 'relative', 
        zIndex: 10, 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', width: '100%', gap: '4rem', alignItems: 'center' }}>
          
          <div style={{ color: 'white', maxWidth: '600px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span style={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.4em', 
                  fontSize: '0.8rem', 
                  fontWeight: 300,
                  display: 'block',
                  marginBottom: '1rem',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  {settings.hero_prefix || 'Experience the Adventure'}
                </span>
                <h1 style={{ 
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
                  fontWeight: 700, 
                  lineHeight: 1.1, 
                  marginBottom: '1.5rem',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}>
                  {slides[activeTab]?.title}
                </h1>
                <p style={{ 
                  fontSize: '1.15rem', 
                  lineHeight: 1.8, 
                  fontWeight: 300,
                  marginBottom: '2.5rem',
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '500px'
                }}>
                  {slides[activeTab]?.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href={slides[activeTab]?.link || '/destinations'} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                    {settings.hero_btn1 || 'Explore Now'}
                  </Link>
                  <Link href={slides[activeTab]?.link || '/destinations'} className="btn-outline" style={{ 
                    padding: '1rem 2.5rem', 
                    fontSize: '1rem', 
                    color: 'white', 
                    borderColor: 'white' 
                  }}>
                    {settings.hero_btn2 || 'View Details'}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                onClick={() => {
                  if (index === activeTab && slide.link) {
                    router.push(slide.link);
                  } else {
                    setActiveTab(index);
                  }
                }}
                whileHover={{ x: -10 }}
                style={{
                  background: index === activeTab ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(12px)',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: index === activeTab ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0
                }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{slide.title}</h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>{slide.spots}</p>
                </div>
                {index === activeTab && (
                  <motion.div 
                    layoutId="active-indicator"
                    style={{
                      marginLeft: 'auto',
                      width: '4px',
                      height: '24px',
                      background: 'var(--accent-color)',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {slides.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 20
        }}>
          <motion.div
            key={activeTab}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 8, ease: "linear" }}
            style={{
              height: '100%',
              background: 'var(--accent-color)'
            }}
          />
        </div>
      )}
    </section>
  );
}
