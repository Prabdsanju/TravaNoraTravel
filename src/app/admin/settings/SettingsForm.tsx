'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveSiteSettings } from '@/app/actions/settings';

export default function SettingsForm({ initialSettings, analytics }: { initialSettings: Record<string, string>, analytics?: any }) {
  const [activeTab, setActiveTab] = useState('stats'); // Default to stats to show off new feature
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [heroSlides, setHeroSlides] = useState<any[]>([]);

  useEffect(() => {
    try {
      if (initialSettings.hero_slides_json) {
        setHeroSlides(JSON.parse(initialSettings.hero_slides_json));
      } else {
        setHeroSlides([
          { title: 'THAILAND', spots: '15 Packages', description: 'Discover the land of smiles...', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', link: '/destinations' },
          { title: 'MALAYSIA', spots: '12 Packages', description: 'A melting pot of cultures...', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800', link: '/destinations' },
          { title: 'SINGAPORE', spots: '10 Packages', description: 'A futuristic garden city...', image: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=800', link: '/destinations' }
        ]);
      }
    } catch (e) {
      setHeroSlides([]);
    }
  }, [initialSettings]);

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: '📈', color: '#10b981' },
    { id: 'branding', label: 'Identity', icon: '💎', color: '#3b82f6' },
    { id: 'hero', label: 'Hero Manager', icon: '🌅', color: '#f59e0b' },
    { id: 'content', label: 'Site Content', icon: '🎨', color: '#8b5cf6' },
    { id: 'gallery', label: 'Visuals', icon: '📸', color: '#ec4899' },
    { id: 'contact', label: 'Support', icon: '📞', color: '#ef4444' },
  ];

  async function handleAction(formData: FormData) {
    setLoading(true);
    setMessage({ type: '', text: '' });
    formData.append('setting_hero_slides_json', JSON.stringify(heroSlides));
    
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

  const InputField = ({ label, name, defaultValue, type = "text", icon = "📝", preview = "" }: any) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
        <span>{icon}</span> {label}
      </label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          {type === "textarea" ? (
            <textarea name={name} className="form-control" defaultValue={defaultValue} style={{ padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', minHeight: '100px', fontSize: '0.95rem' }}></textarea>
          ) : (
            <input type={type} name={name} className="form-control" defaultValue={defaultValue} style={{ padding: '1.1rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', fontSize: '0.95rem' }} />
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

  const FileUpload = ({ label, name, currentImage }: any) => (
    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', display: 'block' }}>📤 {label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {currentImage && (
          <div style={{ width: '80px', height: '50px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            <img src={currentImage} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <input type="file" name={name} accept="image/*" style={{ fontSize: '0.8rem' }} />
      </div>
    </div>
  );

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

              {activeTab === 'branding' && (
                <motion.div key="branding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ background: 'white', padding: '3rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: '2.5rem' }}>Brand Identity</h2>
                    <InputField label="Main Brand Name" name="setting_site_name_main" defaultValue={initialSettings.site_name_main} icon="🏢" />
                    <InputField label="Sub-branding" name="setting_site_name_sub" defaultValue={initialSettings.site_name_sub} icon="🏷️" />
                    <FileUpload label="Logo" name="file_site_logo_img" currentImage={initialSettings.site_logo_img} />
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
                              <InputField label="Title" defaultValue={slide.title} icon="🔤" />
                              <InputField label="Subtitle" defaultValue={slide.spots} icon="🏷️" />
                           </div>
                           <InputField label="Description" defaultValue={slide.description} type="textarea" icon="📖" />
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                              <InputField label="Link" defaultValue={slide.link} icon="🔗" />
                              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img src={slide.image} style={{ width: '60px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <input type="file" name={`file_hero_dynamic_${idx}`} accept="image/*" style={{ fontSize: '0.7rem' }} />
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
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Other Visuals</h2>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                      {[1,2,3].map(n => (
                         <FileUpload key={n} label={`Blog Thumbnail ${n}`} name={`file_blog${n}_img`} currentImage={initialSettings[`blog${n}_img`]} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Contact Info</h2>
                    <InputField label="Address" name="setting_ft_address" defaultValue={initialSettings.ft_address} type="textarea" icon="📍" />
                    <InputField label="Phone" name="setting_ft_phone1" defaultValue={initialSettings.ft_phone1} icon="📞" />
                    <InputField label="Email" name="setting_ft_email" defaultValue={initialSettings.ft_email} icon="✉️" />
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
