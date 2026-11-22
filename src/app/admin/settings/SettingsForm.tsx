'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { saveSiteSettings } from '@/app/actions/settings';

const InputField = ({ label, name, value, defaultValue, onChange, type = "text", icon = "📝", preview = "" }: any) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
      <span>{icon}</span> {label}
    </label>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
      <div style={{ flex: 1 }}>
        {type === "textarea" ? (
          <textarea name={name} className="form-control" value={value} defaultValue={defaultValue} onChange={onChange} style={{ padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', minHeight: '100px', fontSize: '0.95rem' }}></textarea>
        ) : (
          <input type={type} name={name} className="form-control" value={value} defaultValue={defaultValue} onChange={onChange} style={{ padding: '1.1rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', fontSize: '0.95rem' }} />
        )}
      </div>
      {preview && (
        <div style={{ width: '120px', height: '80px', borderRadius: '14px', overflow: 'hidden', border: '2px solid #f1f5f9', flexShrink: 0 }}>
          <img src={preview} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
    </div>
  </div>
);

const ToggleSwitch = ({ label, checked, onChange, icon = "👁️" }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: '#334155', cursor: 'pointer', margin: 0 }}>
      <span>{icon}</span> {label}
    </label>
    <div 
      onClick={() => onChange(!checked)}
      style={{ 
        width: '50px', height: '28px', borderRadius: '20px', 
        background: checked ? '#10b981' : '#cbd5e1', 
        position: 'relative', cursor: 'pointer', transition: '0.3s' 
      }}>
      <div style={{ 
        width: '20px', height: '20px', borderRadius: '50%', background: 'white', 
        position: 'absolute', top: '4px', left: checked ? '26px' : '4px', transition: '0.3s',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }} />
    </div>
  </div>
);

const FileUpload = ({ label, name, currentImage }: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  return (
  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', display: 'block' }}>📤 {label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      {(preview || currentImage) && (
        <div style={{ width: '80px', height: '50px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <img src={preview || currentImage} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <input type="file" name={name} accept="image/*" style={{ fontSize: '0.8rem' }} onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setPreview(URL.createObjectURL(e.target.files[0]));
        }
      }} />
    </div>
  </div>
)};

export default function SettingsForm({ 
  initialSettings, 
  analytics, 
  destinations 
}: { 
  initialSettings: Record<string, string>; 
  analytics?: any; 
  destinations?: any[];
}) {
  const [activeTab, setActiveTab] = useState('stats'); // Default to stats to show off new feature
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [visibility, setVisibility] = useState({
    show_hero: initialSettings.show_hero !== 'false',
    show_destinations: initialSettings.show_destinations !== 'false',
    show_features: initialSettings.show_features !== 'false',
    show_services: initialSettings.show_services !== 'false',
    show_philosophy: initialSettings.show_philosophy !== 'false',
    show_packages: initialSettings.show_packages !== 'false',
    show_testimonials: initialSettings.show_testimonials !== 'false',
    show_personalize: initialSettings.show_personalize !== 'false',
    show_blog: initialSettings.show_blog !== 'false',
  });

  const [blogFiles, setBlogFiles] = useState<Record<string, File>>({});
  const [blogPreviews, setBlogPreviews] = useState<Record<string, string>>({});
  
  const handleBlogFileChange = (idx: number, e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogFiles(prev => ({ ...prev, [idx]: file }));
      setBlogPreviews(prev => ({ ...prev, [`blog_${idx}`]: URL.createObjectURL(file) }));
    }
  };

  const [blogList, setBlogList] = useState<any[]>(() => {
    let list: any[] = [];
    try {
      if (initialSettings.blog_list_json) {
        list = JSON.parse(initialSettings.blog_list_json);
      }
    } catch (e) {}
    if (!list || list.length === 0) {
      list = [
        { title: 'Top 10 Hidden Gems in Sri Lanka', date: '12 May 2026', description: 'Discover the untouched beauty of Sri Lanka...', image: 'https://images.unsplash.com/photo-1542662565-7e4fd159dddd?w=600', link: '/blog/hidden-gems' },
        { title: 'A Guide to Asian Street Food', date: '20 Apr 2026', description: 'Explore the vibrant flavors of Asia...', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600', link: '/blog/street-food' },
        { title: 'Packing Essentials for Maldives', date: '05 Mar 2026', description: 'Everything you need for a tropical getaway...', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600', link: '/blog/maldives-packing' }
      ];
    }
    return list;
  });

  const addBlogPost = () => {
    setBlogList([...blogList, { title: 'New Post Title', date: 'DD MMM YYYY', description: 'Short excerpt...', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600', link: '/blog/new-post' }]);
  };

  const removeBlogPost = (index: number) => {
    const newList = [...blogList];
    newList.splice(index, 1);
    setBlogList(newList);
  };

  const updateBlogPost = (index: number, field: string, value: string) => {
    const newList = [...blogList];
    newList[index][field] = value;
    setBlogList(newList);
  };

  const [heroFiles, setHeroFiles] = useState<Record<string, File>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  const handleHeroFileChange = (idx: number, e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFiles(prev => ({ ...prev, [idx]: file }));
      setFilePreviews(prev => ({ ...prev, [`hero_${idx}`]: URL.createObjectURL(file) }));
    }
  };
  
  const [heroSlides, setHeroSlides] = useState<any[]>(() => {
    let list: any[] = [];
    try {
      if (initialSettings.hero_slides_json) {
        list = JSON.parse(initialSettings.hero_slides_json);
      }
    } catch (e) {
      // ignore
    }
    if (!list || list.length === 0) {
      list = [
        { title: 'THAILAND', spots: '15 Packages', description: 'Discover the land of smiles...', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', link: '/destinations/thailand' },
        { title: 'MALAYSIA', spots: '12 Packages', description: 'A melting pot of cultures...', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800', link: '/destinations/malaysia' },
        { title: 'SINGAPORE', spots: '10 Packages', description: 'A futuristic garden city...', image: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=800', link: '/destinations/singapore' },
        { title: 'VIETNAM', spots: '2 Packages', description: 'Emerald waters and ancient towns...', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', link: '/destinations/dest-vietnam' },
        { title: 'SRI LANKA', spots: '2 Packages', description: 'The Pearl of the Indian Ocean...', image: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=800', link: '/destinations/dest-srilanka' }
      ];
    }

    if (destinations) {
      destinations.forEach((d: any) => {
        const key = d.name.toLowerCase().replace(/\s+/g, '');
        const exists = list.some((slide: any) => 
          slide.title.toLowerCase().replace(/\s+/g, '') === key
        );
        if (!exists && d._count.packages > 0) {
          list.push({
            title: d.name.toUpperCase(),
            spots: `${d._count.packages} Packages`,
            description: d.description || `Explore the beauty of ${d.name}...`,
            image: d.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
            link: `/destinations/${d.id}`
          });
        }
      });
    }
    return list;
  });

  const [servicesList, setServicesList] = useState<any[]>(() => {
    let list: any[] = [];
    try {
      if (initialSettings.services_list_json) {
        list = JSON.parse(initialSettings.services_list_json);
      }
    } catch (e) {
      // ignore
    }
    if (!list || list.length === 0) {
      list = [
        {
          icon: '🗺️',
          title: 'Tailor-Made Tour Packages',
          subtitle: 'Bespoke Itineraries',
          description: "Tailor-made itineraries crafted by our travel experts. Experience Sigiriya's ancient heights, Ella's lush bridges, or Mirissa's gorgeous beaches with custom-designed routes matching your budget and pace.",
          features: ['Personalized Daily Schedules', 'Private English-speaking Guides', 'Hand-picked Accommodation Choices'],
          link: '/destinations',
          btnText: 'Explore Destinations',
          badge: 'Popular',
          color: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          accentColor: '#3b82f6'
        },
        {
          icon: '✈️',
          title: 'Global Air Tickets',
          subtitle: 'Best Fares Guaranteed',
          description: 'Get the most competitive rates on international and domestic flights. Enjoy full booking assistance, seat selection preferences, excess baggage coordination, and 24/7 schedule change monitoring.',
          features: ['Multi-Airline Price Comparison', 'Baggage Allowances Optimized', 'Instant Booking Confirmation'],
          link: '/services/air-tickets',
          btnText: 'Book Air Tickets',
          badge: 'Best Rates',
          color: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          accentColor: '#10b981'
        },
        {
          icon: '📄',
          title: 'Worldwide Visa Services',
          subtitle: 'Consultancy & Documentation',
          description: 'Fast, reliable, and highly successful tourist and business visa consultancy. We manage complete file preparations, document reviews, interview guidelines, and submission follow-ups.',
          features: ['Accurate Embassy Document Checks', 'High Processing Success Rate', 'Comprehensive Visa Guidance'],
          link: '/services/visa',
          btnText: 'Request Visa Assistance',
          badge: 'Expert Assistance',
          color: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          accentColor: '#ef4444'
        },
        {
          icon: '🏨',
          title: 'Hotel & Resort Bookings',
          subtitle: 'Handpicked Luxury Hotels',
          description: 'Find hand-picked boutique villas, wellness resorts, and premium beach retreats. We negotiate custom rates to secure exclusive benefits like room upgrades, complimentary breakfasts, and early check-ins.',
          features: ['Exclusive Premium Rates', 'Early Check-In Perks', 'Verified High-Quality Resorts'],
          link: '/contact',
          btnText: 'Inquire Accommodations',
          badge: 'VIP Perks',
          color: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          accentColor: '#8b5cf6'
        },
        {
          icon: '🚘',
          title: 'Airport Transfers & Transit',
          subtitle: 'Seamless Ground Travel',
          description: 'Start your vacation in complete peace. Rely on pre-arranged, comfortable private vehicles, professional English-speaking drivers, and full flight-monitoring services that sync with your arrival.',
          features: ['Professional Insured Chauffeurs', 'Real-Time Flight Tracking', 'Clean, Fully Air-Conditioned Fleet'],
          link: '/contact',
          btnText: 'Book Local Transfers',
          badge: 'Reliable Shuttles',
          color: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          accentColor: '#f59e0b'
        },
        {
          icon: '🛡️',
          title: 'Comprehensive Travel Insurance',
          subtitle: 'Global Journey Protection',
          description: 'Explore the world with complete confidence. Safeguard your family and trip investments with comprehensive medical coverage, luggage loss policies, and flight interruption coverage.',
          features: ['24/7 Medical Cover Assistance', 'Lost Luggage Protection Claims', 'Flexible Trip Interruption Cover'],
          link: '/contact',
          btnText: 'Get Insurance Cover',
          badge: 'Absolute Peace of Mind',
          color: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
          accentColor: '#06b6d4'
        }
      ];
    }
    return list;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let list: any[] = [];
        if (initialSettings.hero_slides_json) {
          list = JSON.parse(initialSettings.hero_slides_json);
        }
        if (!list || list.length === 0) {
          list = [
            { title: 'THAILAND', spots: '15 Packages', description: 'Discover the land of smiles...', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', link: '/destinations/thailand' },
            { title: 'MALAYSIA', spots: '12 Packages', description: 'A melting pot of cultures...', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800', link: '/destinations/malaysia' },
            { title: 'SINGAPORE', spots: '10 Packages', description: 'A futuristic garden city...', image: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=800', link: '/destinations/singapore' },
            { title: 'VIETNAM', spots: '2 Packages', description: 'Emerald waters and ancient towns...', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', link: '/destinations/dest-vietnam' },
            { title: 'SRI LANKA', spots: '2 Packages', description: 'The Pearl of the Indian Ocean...', image: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=800', link: '/destinations/dest-srilanka' }
          ];
        }

        if (destinations) {
          destinations.forEach((d: any) => {
            const key = d.name.toLowerCase().replace(/\s+/g, '');
            const exists = list.some((slide: any) => 
              slide.title.toLowerCase().replace(/\s+/g, '') === key
            );
            if (!exists && d._count.packages > 0) {
              list.push({
                title: d.name.toUpperCase(),
                spots: `${d._count.packages} Packages`,
                description: d.description || `Explore the beauty of ${d.name}...`,
                image: d.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
                link: `/destinations/${d.id}`
              });
            }
          });
        }
        setHeroSlides(list);
      } catch (e) {
        setHeroSlides([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialSettings, destinations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let list: any[] = [];
        if (initialSettings.services_list_json) {
          list = JSON.parse(initialSettings.services_list_json);
        }
        if (list && list.length > 0) {
          setServicesList(list);
        }
      } catch (e) {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialSettings]);

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: '📈', color: '#10b981' },
    { id: 'visibility', label: 'Visibility', icon: '👁️', color: '#6366f1' },
    { id: 'branding', label: 'Identity', icon: '💎', color: '#3b82f6' },
    { id: 'hero', label: 'Hero Manager', icon: '🌅', color: '#f59e0b' },
    { id: 'content', label: 'Site Content', icon: '🎨', color: '#8b5cf6' },
    { id: 'gallery', label: 'Visuals', icon: '📸', color: '#ec4899' },
    { id: 'contact', label: 'Contact Us', icon: '📞', color: '#ef4444' },
    { id: 'services', label: 'Services Manager', icon: '🛠️', color: '#06b6d4' },
  ];

  async function handleAction(formData: FormData) {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    // Explicitly append hero files to ensure they are captured even if unmounted
    Object.keys(heroFiles).forEach(idx => {
      formData.delete(`file_hero_dynamic_${idx}`);
      formData.append(`file_hero_dynamic_${idx}`, heroFiles[idx]);
    });
    
    // Explicitly append blog files
    Object.keys(blogFiles).forEach(idx => {
      formData.delete(`file_blog_dynamic_${idx}`);
      formData.append(`file_blog_dynamic_${idx}`, blogFiles[idx]);
    });

    formData.append('setting_hero_slides_json', JSON.stringify(heroSlides));
    formData.append('setting_services_list_json', JSON.stringify(servicesList));
    formData.append('setting_blog_list_json', JSON.stringify(blogList));

    // Append visibility settings
    Object.entries(visibility).forEach(([key, value]) => {
      formData.append(`setting_${key}`, value ? 'true' : 'false');
    });
    
    try {
      await saveSiteSettings(formData);
      setMessage({ type: 'success', text: 'Deployment Successful! ✨' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Deployment failed.' });
    } finally {
      setLoading(false);
    }
  }

  const addHeroSlide = () => {
    setHeroSlides([...heroSlides, { title: 'NEW DESTINATION', spots: '0 Packages', description: 'Enter description...', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', link: '/destinations' }]);
  };

  const removeHeroSlide = (index: number) => {
    const newList = [...heroSlides];
    newList.splice(index, 1);
    setHeroSlides(newList);
  };

  const updateHeroSlide = (index: number, field: string, value: string) => {
    const newList = [...heroSlides];
    newList[index][field] = value;
    setHeroSlides(newList);
  };

  const addService = () => {
    setServicesList([...servicesList, {
      icon: '🗺️',
      title: 'New Custom Service',
      subtitle: 'Premium Traveling Offer',
      description: 'Describe this customized travel service to your audience to attract inquiries.',
      features: ['Feature Advantage 1', 'Feature Advantage 2', 'Feature Advantage 3'],
      link: '/contact',
      btnText: 'Inquire Service Now',
      badge: 'Custom',
      color: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      accentColor: '#3b82f6'
    }]);
  };

  const removeService = (index: number) => {
    const newList = [...servicesList];
    newList.splice(index, 1);
    setServicesList(newList);
  };

  const updateService = (index: number, field: string, value: string) => {
    const newList = [...servicesList];
    newList[index][field] = value;
    setServicesList(newList);
  };

  const updateServiceFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const newList = [...servicesList];
    if (!newList[serviceIndex].features) {
      newList[serviceIndex].features = ['', '', ''];
    }
    newList[serviceIndex].features[featureIndex] = value;
    setServicesList(newList);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <form action={handleAction}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'start' }}>
          
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '32px', padding: '1.25rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    borderRadius: '20px',
                    border: 'none',
                    background: activeTab === tab.id ? `${tab.color}15` : 'transparent',
                    color: activeTab === tab.id ? tab.color : '#64748b',
                    fontWeight: 800,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ 
                    fontSize: '1.5rem',
                    background: activeTab === tab.id ? tab.color : '#f1f5f9',
                    color: activeTab === tab.id ? 'white' : '#94a3b8',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{ width: '100%', marginTop: '2rem', padding: '1.5rem', borderRadius: '24px', fontWeight: 900, fontSize: '1.1rem', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)', border: 'none', color: 'white', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Processing...' : 'Publish Changes'}
            </motion.button>
          </div>

          <div style={{ minHeight: '800px' }}>
            <AnimatePresence mode="wait">
              
              {activeTab === 'stats' && (
                <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ display: 'grid', gap: '2rem' }}>
                    
                    {/* Header Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '2.5rem', borderRadius: '32px', color: 'white', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Total Hits</span>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, margin: '0.5rem 0' }}>{analytics?.totalVisits || 0}</h2>
                        <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Total page views across all sections.</p>
                      </div>
                      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Unique Visitors</span>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1e293b', margin: '0.5rem 0' }}>{analytics?.uniqueVisitors || 0}</h2>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Distinct users based on IP address.</p>
                      </div>
                    </div>

                    {/* Location Breakdown */}
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '2rem' }}>🌍 Top Visitor Locations</h3>
                      <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {analytics?.countryStats && analytics.countryStats.length > 0 ? analytics.countryStats.map((stat: any, i: number) => (
                          <div key={i} style={{ display: 'grid', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                              <span>{stat.name}</span>
                              <span style={{ color: '#10b981' }}>{stat.count} visits</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${(stat.count / analytics.totalVisits) * 100}%` }} 
                                style={{ height: '100%', background: '#10b981', borderRadius: '4px' }} 
                              />
                            </div>
                          </div>
                        )) : (
                          <p style={{ color: '#94a3b8', textAlign: 'center' }}>No location data yet. Waiting for visitors...</p>
                        )}
                      </div>
                    </div>

                    {/* Recent Feed */}
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '2.5rem' }}>🕒 Recent Activity</h3>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {analytics?.recentVisits && analytics.recentVisits.length > 0 ? analytics.recentVisits.map((visit: any, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '20px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                              📍
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{visit.city}, {visit.country}</p>
                              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Visited {visit.path}</p>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{new Date(visit.createdAt).toLocaleTimeString()}</span>
                          </div>
                        )) : (
                          <p style={{ color: '#94a3b8', textAlign: 'center' }}>No activity recorded yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'visibility' && (
                <motion.div key="visibility" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ background: 'white', padding: '3rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: '1rem' }}>Section Visibility</h2>
                    <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Toggle sections ON or OFF to dynamically show or hide them on the live homepage.</p>
                    
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      <ToggleSwitch label="Show Hero Slider Section" icon="🌅" checked={visibility.show_hero} onChange={(val: boolean) => setVisibility({...visibility, show_hero: val})} />
                      <ToggleSwitch label="Show Destinations Section" icon="🗺️" checked={visibility.show_destinations} onChange={(val: boolean) => setVisibility({...visibility, show_destinations: val})} />
                      <ToggleSwitch label="Show Why Choose Us (Features)" icon="✨" checked={visibility.show_features} onChange={(val: boolean) => setVisibility({...visibility, show_features: val})} />
                      <ToggleSwitch label="Show Services Section" icon="🛠️" checked={visibility.show_services} onChange={(val: boolean) => setVisibility({...visibility, show_services: val})} />
                      <ToggleSwitch label="Show Our Philosophy Section" icon="📜" checked={visibility.show_philosophy} onChange={(val: boolean) => setVisibility({...visibility, show_philosophy: val})} />
                      <ToggleSwitch label="Show Tour Packages Section" icon="🌍" checked={visibility.show_packages} onChange={(val: boolean) => setVisibility({...visibility, show_packages: val})} />
                      <ToggleSwitch label="Show Testimonials / Happy Travelers" icon="💬" checked={visibility.show_testimonials} onChange={(val: boolean) => setVisibility({...visibility, show_testimonials: val})} />
                      <ToggleSwitch label="Show Personalize Trip Section" icon="✈️" checked={visibility.show_personalize} onChange={(val: boolean) => setVisibility({...visibility, show_personalize: val})} />
                      <ToggleSwitch label="Show Insight & Stories (Blog)" icon="✍️" checked={visibility.show_blog} onChange={(val: boolean) => setVisibility({...visibility, show_blog: val})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'branding' && (
                <motion.div key="branding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ background: 'white', padding: '3rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: '2.5rem' }}>Brand Identity</h2>
                    <InputField label="Main Brand Name" name="setting_site_name_main" defaultValue={initialSettings.site_name_main} icon="🏢" />
                    <InputField label="Sub-branding" name="setting_site_name_sub" defaultValue={initialSettings.site_name_sub} icon="🏷️" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <FileUpload label="Logo Image" name="file_site_logo_img" currentImage={initialSettings.site_logo_img} />
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Logo Size (px)</label>
                        <input type="number" name="setting_logo_size" defaultValue={initialSettings.logo_size || '48'} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Default is 48px. Increase this to make the logo larger.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hero' && (
                <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                   <div style={{ background: 'white', padding: '2.5rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginBottom: '2rem' }}>
                       <InputField label="Welcome Label" name="setting_hero_prefix" defaultValue={initialSettings.hero_prefix} icon="👋" />
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '24px', border: '1px solid #fef3c7' }}>
                          <div>
                            <h3 style={{ fontWeight: 900, fontSize: '1.25rem', color: '#92400e' }}>Dynamic Hero Slides</h3>
                          </div>
                          <button type="button" onClick={addHeroSlide} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '20px', fontWeight: 800, cursor: 'pointer' }}>+ Add New Slide</button>
                       </div>
                   </div>
                   <div style={{ display: 'grid', gap: '2rem' }}>
                      {heroSlides.map((slide, idx) => (
                        <div key={idx} style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #f1f5f9', position: 'relative' }}>
                           <button type="button" onClick={() => removeHeroSlide(idx)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: 700 }}>Delete</button>
                           <h4 style={{ fontWeight: 900, color: '#f59e0b', marginBottom: '1.5rem' }}>Slide #{idx + 1}</h4>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <InputField label="Title" value={slide.title} onChange={(e: any) => updateHeroSlide(idx, 'title', e.target.value)} icon="🔤" />
                              <InputField label="Subtitle" value={slide.spots} onChange={(e: any) => updateHeroSlide(idx, 'spots', e.target.value)} icon="🏷️" />
                           </div>
                           <InputField label="Description" value={slide.description} onChange={(e: any) => updateHeroSlide(idx, 'description', e.target.value)} type="textarea" icon="📖" />
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                              <InputField label="Link" value={slide.link} onChange={(e: any) => updateHeroSlide(idx, 'link', e.target.value)} icon="🔗" />
                              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img src={filePreviews[`hero_${idx}`] || slide.image} style={{ width: '60px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <input type="file" name={`file_hero_dynamic_${idx}`} accept="image/*" style={{ fontSize: '0.7rem' }} onChange={(e) => handleHeroFileChange(idx, e)} />
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'content' && (
                <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ display: 'grid', gap: '2.5rem' }}>
                    <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>📜 Our Philosophy</h3>
                      <InputField label="Heading" name="setting_about_title" defaultValue={initialSettings.about_title} icon="✒️" />
                      <InputField label="Story Text" name="setting_about_text" defaultValue={initialSettings.about_text} type="textarea" icon="📄" />
                      

                      <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>🌍 Packages Section</h3>
                        <p style={{ marginBottom: '2rem', color: '#64748b' }}>
                          💡 <strong>Pro Tip:</strong> You can add, edit, or delete the actual Tour Packages directly from the <Link href="/admin/packages" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Packages Page</Link> and <Link href="/admin/destinations" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Destinations Page</Link>. They will automatically sync with the homepage!
                        </p>
                        <InputField label="Packages Prefix" name="setting_pkg_prefix" defaultValue={initialSettings.pkg_prefix || 'Explore Destinations'} icon="🏷️" />
                        <InputField label="Packages Title" name="setting_pkg_title" defaultValue={initialSettings.pkg_title || 'Join us on a group adventure'} icon="✒️" />
                        <InputField label="Button Text" name="setting_pkg_btn" defaultValue={initialSettings.pkg_btn || 'Book Now'} icon="🔘" />
                      </div>

                      <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>✍️ Blog Section</h3>
                        <InputField label="Blog Prefix" name="setting_blog_prefix" defaultValue={initialSettings.blog_prefix || 'Our Blog'} icon="🏷️" />
                        <InputField label="Blog Title" name="setting_blog_title" defaultValue={initialSettings.blog_title || 'Insight & Stories'} icon="✒️" />
                        <InputField label="Read More Button" name="setting_blog_read_btn" defaultValue={initialSettings.blog_read_btn || 'Read More →'} icon="🔘" />
                        
                        <div style={{ marginTop: '3rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b' }}>📝 Blog Posts Manager</h4>
                            <button type="button" onClick={addBlogPost} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Add Post</button>
                          </div>
                          
                          <div style={{ display: 'grid', gap: '2rem' }}>
                            {blogList.map((post, idx) => (
                              <div key={idx} style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #f1f5f9', position: 'relative' }}>
                                <button type="button" onClick={() => removeBlogPost(idx)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <InputField label="Post Title" value={post.title} onChange={(e: any) => updateBlogPost(idx, 'title', e.target.value)} icon="✒️" />
                                    <InputField label="Date" value={post.date} onChange={(e: any) => updateBlogPost(idx, 'date', e.target.value)} icon="📅" />
                                    <InputField label="Description" value={post.description} onChange={(e: any) => updateBlogPost(idx, 'description', e.target.value)} type="textarea" icon="📄" />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <InputField label="Read More Link" value={post.link} onChange={(e: any) => updateBlogPost(idx, 'link', e.target.value)} icon="🔗" />
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                       <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem', display: 'block' }}>📸 Post Image</label>
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                          <img src={blogPreviews[`blog_${idx}`] || post.image} style={{ width: '80px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                          <input type="file" name={`file_blog_dynamic_${idx}`} accept="image/*" style={{ fontSize: '0.7rem' }} onChange={(e) => handleBlogFileChange(idx, e)} />
                                       </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', marginBottom: '1.5rem' }}>🖼️ Philosophy Grid (4 Images)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          {[1,2,3,4].map(n => (
                            <FileUpload key={n} label={`Corner Image ${n}`} name={`file_about_img_${n}`} currentImage={initialSettings[`about_img_${n}`]} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Blog Images</h2>
                    <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>
                      💡 Blog images are now managed directly from the <strong>Site Content &gt; Blog Posts Manager</strong> section! Go there to upload images for your dynamic blog posts.
                    </p>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                      {/* Other visuals can go here in the future */}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ display: 'grid', gap: '2.5rem' }}>
                    <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Footer Contact Info</h2>
                      <InputField label="Footer Address" name="setting_ft_address" defaultValue={initialSettings.ft_address || '234/7, Gamunumawatha, Kotuwegoda, Rajagiriya 10100, Sri Lanka.'} type="textarea" icon="📍" />
                      <InputField label="Footer Phone" name="setting_ft_phone1" defaultValue={initialSettings.ft_phone1 || '+94 71 25 22 808'} icon="📞" />
                      <InputField label="Footer Email" name="setting_ft_email" defaultValue={initialSettings.ft_email || 'travanoratravel@gmail.com'} icon="✉️" />
                    </div>

                    <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Contact Page Banner</h2>
                      <InputField label="Banner Label" name="setting_contact_label" defaultValue={initialSettings.contact_label || 'Get In Touch'} icon="🏷️" />
                      <InputField label="Banner Title" name="setting_contact_title" defaultValue={initialSettings.contact_title || "We'd Love to Hear From You"} icon="✒️" />
                      <InputField label="Banner Subtitle" name="setting_contact_subtitle" defaultValue={initialSettings.contact_subtitle || "Whether you have a specific travel question or just want to say hi, our team is ready to help you plan your next adventure."} type="textarea" icon="📄" />
                    </div>

                    <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Contact Info Cards</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <InputField label="Office Card Title" name="setting_contact_office_title" defaultValue={initialSettings.contact_office_title || 'Our Office'} icon="🏢" />
                        <InputField label="Office Card Content" name="setting_contact_office_text" defaultValue={initialSettings.contact_office_text || '234/7, Gamunumawatha, Kotuwegoda, Rajagiriya 10100, Sri Lanka.'} type="textarea" icon="📍" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <InputField label="Phone Card Title" name="setting_contact_phone_title" defaultValue={initialSettings.contact_phone_title || 'Call Us'} icon="📱" />
                        <InputField label="Phone Card Content" name="setting_contact_phone_text" defaultValue={initialSettings.contact_phone_text || '+94 71 22 25 808\nAvailable 9 AM - 6 PM'} type="textarea" icon="📞" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <InputField label="Email Card Title" name="setting_contact_email_title" defaultValue={initialSettings.contact_email_title || 'Email Us'} icon="📧" />
                        <InputField label="Email Card Content" name="setting_contact_email_text" defaultValue={initialSettings.contact_email_text || 'info@travanoratravel.com\nbooking@travanoratravel.com'} type="textarea" icon="✉️" />
                      </div>
                    </div>

                    <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Inquiry Form & WhatsApp</h2>
                      <InputField label="WhatsApp Contact Number (No spaces/plus sign, e.g. 94740077377)" name="setting_contact_whatsapp_number" defaultValue={initialSettings.contact_whatsapp_number || '94740077377'} icon="🟢" />
                      <InputField label="Form Heading" name="setting_contact_form_title" defaultValue={initialSettings.contact_form_title || 'Send Us a Message'} icon="✒️" />
                      <InputField label="Button Text" name="setting_contact_submit_btn" defaultValue={initialSettings.contact_submit_btn || 'Send to WhatsApp Directly'} icon="🔘" />
                    </div>

                    <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Side Support Card</h2>
                      <InputField label="Side Card Heading" name="setting_contact_side_title" defaultValue={initialSettings.contact_side_title || '24/7 Support'} icon="✒️" />
                      <InputField label="Side Card Description" name="setting_contact_side_text" defaultValue={initialSettings.contact_side_text || "We pride ourselves on being available whenever our travelers need us. Whether you're planning or currently on a trip, we're just a message away."} type="textarea" icon="📄" />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                        <InputField label="Option 1 Icon" name="setting_contact_side_opt1_icon" defaultValue={initialSettings.contact_side_opt1_icon || '💬'} icon="🎭" />
                        <InputField label="Option 1 Title" name="setting_contact_side_opt1_title" defaultValue={initialSettings.contact_side_opt1_title || 'Live Chat'} icon="🔤" />
                        <div style={{ gridColumn: 'span 2' }}>
                          <InputField label="Option 1 Subtitle" name="setting_contact_side_opt1_desc" defaultValue={initialSettings.contact_side_opt1_desc || 'WhatsApp: Available now'} icon="📝" />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                        <InputField label="Option 2 Icon" name="setting_contact_side_opt2_icon" defaultValue={initialSettings.contact_side_opt2_icon || '⏰'} icon="🎭" />
                        <InputField label="Option 2 Title" name="setting_contact_side_opt2_title" defaultValue={initialSettings.contact_side_opt2_title || 'Response Time'} icon="🔤" />
                        <div style={{ gridColumn: 'span 2' }}>
                          <InputField label="Option 2 Subtitle" name="setting_contact_side_opt2_desc" defaultValue={initialSettings.contact_side_opt2_desc || 'Average under 15 minutes'} icon="📝" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ background: 'white', padding: '3rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', marginBottom: '1rem' }}>Our Services Banner</h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Customize the main header texts on the global `/services` page.</p>
                    
                    <InputField label="Services Main Title" name="setting_services_title" defaultValue={initialSettings.services_title || 'Our Travel Services'} icon="✒️" />
                    <InputField label="Services Description Text" name="setting_services_subtitle" defaultValue={initialSettings.services_subtitle || 'From bespoke luxury packages and global flight bookings to seamless visa handlings, our team is dedicated to turning your dreams into custom realities.'} type="textarea" icon="📄" />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', padding: '1.5rem', background: '#ecfdf5', borderRadius: '24px', border: '1px solid #a7f3d0' }}>
                      <div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.25rem', color: '#065f46' }}>Services Manager</h3>
                        <p style={{ color: '#047857', fontSize: '0.85rem', marginTop: '0.25rem' }}>Add, remove, or customize individual service offering cards.</p>
                      </div>
                      <button type="button" onClick={addService} style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '20px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                        + Add Custom Service
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '2.5rem' }}>
                    {servicesList.map((service, idx) => (
                      <div key={idx} style={{ background: 'white', padding: '3rem', borderRadius: '36px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', position: 'relative' }}>
                        <button type="button" onClick={() => removeService(idx)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s' }}>
                          Delete Service
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem 1rem', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Service Offer #{idx + 1}
                        </span>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                          <InputField label="Title" value={service.title} onChange={(e: any) => updateService(idx, 'title', e.target.value)} icon="🔤" />
                          <InputField label="Subtitle / Catchphrase" value={service.subtitle} onChange={(e: any) => updateService(idx, 'subtitle', e.target.value)} icon="🏷️" />
                        </div>

                        <InputField label="Description" value={service.description} onChange={(e: any) => updateService(idx, 'description', e.target.value)} type="textarea" icon="📖" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                          <InputField label="Icon Emoji (e.g. 🗺️, ✈️, 📄)" value={service.icon} onChange={(e: any) => updateService(idx, 'icon', e.target.value)} icon="🎭" />
                          <InputField label="Badge Tag (e.g. Popular, Expert)" value={service.badge} onChange={(e: any) => updateService(idx, 'badge', e.target.value)} icon="🎖️" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                          <InputField label="Action Route / Link" value={service.link} onChange={(e: any) => updateService(idx, 'link', e.target.value)} icon="🔗" />
                          <InputField label="Button Action Text" value={service.btnText} onChange={(e: any) => updateService(idx, 'btnText', e.target.value)} icon="🔘" />
                          <InputField label="Brand Accent Color (Hex)" value={service.accentColor} onChange={(e: any) => updateService(idx, 'accentColor', e.target.value)} icon="🎨" />
                        </div>

                        <InputField label="CSS Background Gradient Preset" value={service.color} onChange={(e: any) => updateService(idx, 'color', e.target.value)} icon="🌅" />

                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', marginTop: '2rem' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>✓</span> Highlight Features (Bullet Points)
                          </h4>
                          <div style={{ display: 'grid', gap: '1rem' }}>
                            {[0, 1, 2].map((featIdx) => (
                              <InputField
                                key={featIdx}
                                label={`Bullet Feature #${featIdx + 1}`}
                                value={service.features?.[featIdx] || ''}
                                onChange={(e: any) => updateServiceFeature(idx, featIdx, e.target.value)}
                                icon="🔹"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </div>
  );
}
