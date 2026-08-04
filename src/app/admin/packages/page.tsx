import { prisma } from '@/lib/prisma';
import { addPackage, deletePackage } from '@/app/actions/package';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPackages({
  searchParams,
}: {
  searchParams: Promise<{ dest?: string }>;
}) {
  const { dest } = await searchParams;

  const destinations = await prisma.destination.findMany({
    include: { packages: true },
    orderBy: { position: 'asc' },
  });

  // Active destination tab — default to first one
  const activeDestId = dest || destinations[0]?.id || '';
  const activeDestination = destinations.find((d) => d.id === activeDestId) || destinations[0];
  const activePackages = activeDestination?.packages || [];

  return (
    <>
      <style>{`
        /* Modern Tabs */
        .pkg-tabs {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          background: #f8fafc;
          padding: 0.5rem;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
        }
        .pkg-tab-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #64748b;
          background: transparent;
        }
        .pkg-tab-btn:hover {
          background: white;
          color: #3b82f6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .pkg-tab-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
        }
        .pkg-tab-count {
          background: #3b82f6;
          color: white;
          border-radius: 999px;
          font-size: 0.75rem;
          padding: 2px 8px;
          font-weight: 800;
          transition: background 0.3s;
        }
        .pkg-tab-btn:not(.active) .pkg-tab-count {
          background: #cbd5e1;
        }

        /* Package Cards */
        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .pkg-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .pkg-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.08);
          border-color: #bfdbfe;
        }
        .pkg-card-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
          background: #f8fafc;
        }
        .pkg-card-img-placeholder {
          width: 100%;
          height: 180px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 3rem;
        }
        .pkg-card-body {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pkg-card-title {
          font-weight: 800;
          font-size: 1.1rem;
          color: #1e293b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pkg-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: #f0f9ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          display: inline-block;
        }
        .pkg-price {
          font-size: 1.1rem;
          font-weight: 900;
          color: #3b82f6;
          margin-top: 0.25rem;
        }
        .pkg-card-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 1rem;
        }
        .pkg-edit-btn {
          flex: 1;
          text-align: center;
          padding: 0.6rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          background: #f8fafc;
          color: #334155;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .pkg-edit-btn:hover { background: #3b82f6; color: white; }
        .pkg-delete-btn {
          padding: 0.6rem;
          border-radius: 12px;
          font-size: 1rem;
          background: #fef2f2;
          color: #ef4444;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
        }
        .pkg-delete-btn:hover { background: #ef4444; color: white; }

        .pkg-empty {
          text-align: center;
          padding: 5rem 2rem;
          color: #94a3b8;
          background: white;
          border-radius: 32px;
          border: 1px dashed #cbd5e1;
          margin-bottom: 3rem;
        }
        .pkg-empty-icon { font-size: 3.5rem; margin-bottom: 1rem; opacity: 0.5; }

        /* Add Form Panel */
        .add-form-panel {
          background: white;
          border-radius: 40px;
          border: 1px solid #f1f5f9;
          padding: 3.5rem;
          box-shadow: 0 30px 60px rgba(0,0,0,0.03);
        }
        .add-form-title {
          font-size: 1.75rem;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .form-section {
          background: #f8fafc;
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #f1f5f9;
        }
        .form-section-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #334155;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .form-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: #475569;
          margin-bottom: 0.5rem;
          display: block;
        }
        .form-control {
          width: 100%;
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background: white;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        textarea.form-control {
          min-height: 120px;
          resize: vertical;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Manage Packages</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
            {destinations.reduce((sum, d) => sum + d.packages.length, 0)} packages across {destinations.length} destinations
          </p>
        </div>
      </div>

      {/* Destination Tabs */}
      <div className="pkg-tabs">
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/admin/packages?dest=${dest.id}`}
            className={`pkg-tab-btn ${activeDestId === dest.id ? 'active' : ''}`}
          >
            {dest.name.trim() === 'Thailand' ? '🇹🇭' : dest.name.trim() === 'Singapore' ? '🇸🇬' : dest.name.trim() === 'Malaysia' ? '🇲🇾' : dest.name.trim() === 'Sri Lanka' ? '🇱🇰' : '🌍'}
            {' '}{dest.name}
            <span className="pkg-tab-count">{dest.packages.length}</span>
          </Link>
        ))}
      </div>

      {/* Active Destination Header */}
      {activeDestination && (
        <div style={{ 
          marginBottom: '2.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem',
          background: 'linear-gradient(135deg, #eff6ff, #ffffff)',
          padding: '2rem',
          borderRadius: '24px',
          border: '1px solid #e0f2fe'
        }}>
          {activeDestination.imageUrl ? (
            <img
              src={activeDestination.imageUrl}
              alt={activeDestination.name}
              style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🌍</div>
          )}
          <div>
            <div style={{ fontWeight: 900, color: '#1e293b', fontSize: '1.5rem' }}>
              {activeDestination.name} Packages
            </div>
            <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500, marginTop: '0.25rem' }}>
              {activePackages.length} package{activePackages.length !== 1 ? 's' : ''} available. You can update or delete them below.
            </div>
          </div>
        </div>
      )}

      {/* Package Cards Grid */}
      {activePackages.length === 0 ? (
        <div className="pkg-empty">
          <div className="pkg-empty-icon">🏖️</div>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>No packages yet</div>
          <div style={{ fontSize: '1rem' }}>Add the first tour package for {activeDestination?.name} below.</div>
        </div>
      ) : (
        <div className="pkg-grid">
          {activePackages.map((pkg) => (
            <div key={pkg.id} className="pkg-card">
              {pkg.imageUrl ? (
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="pkg-card-img"
                  onError={undefined}
                />
              ) : (
                <div className="pkg-card-img-placeholder">🏖️</div>
              )}
              <div className="pkg-card-body">
                <div>
                   <span className="pkg-badge">⏱ {pkg.days} Days / {pkg.nights} Nights</span>
                </div>
                <div className="pkg-card-title">{pkg.title}</div>
                <div>
                   <div className="pkg-price">LKR {pkg.price.toLocaleString()}</div>
                   <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>*Conditions Apply</div>
                </div>
                <div className="pkg-card-actions">
                  <Link href={`/admin/packages/${pkg.id}`} className="pkg-edit-btn">
                    ✏️ Edit Details
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await deletePackage(pkg.id);
                    }}
                    style={{ margin: 0 }}
                  >
                    <button type="submit" className="pkg-delete-btn" title="Delete Package">
                      🗑️
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Package Form */}
      <div className="add-form-panel">
        <div className="add-form-title">
          <span>➕ Add New Tour Package</span>
          {activeDestination && (
            <span style={{ fontWeight: 600, fontSize: '1rem', color: '#3b82f6' }}>
              Adding to: {activeDestination.name}
            </span>
          )}
        </div>
        <form action={addPackage}>
          
          <div className="form-section">
            <div className="form-section-title">📝 Basic Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <select name="destinationId" className="form-control" required defaultValue={activeDestId}>
                  <option value="">Select Destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Package Title</label>
                <input type="text" name="title" className="form-control" required placeholder="e.g. 03 Night Singapore Tour" />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Overview / Short Description</label>
              <textarea name="description" className="form-control" style={{ minHeight: '80px' }} required placeholder="A brief summary of what the package offers..."></textarea>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">💰 Pricing & Duration</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Price (LKR)</label>
                <input type="number" step="0.01" name="price" className="form-control" required placeholder="129900" />
              </div>
              <div className="form-group">
                <label className="form-label">Days</label>
                <input type="number" name="days" className="form-control" required placeholder="4" />
              </div>
              <div className="form-group">
                <label className="form-label">Nights</label>
                <input type="number" name="nights" className="form-control" required placeholder="3" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">🗺️ Detailed Itinerary</div>
            <div className="form-group">
              <label className="form-label">Itinerary (Day 01 - ..., Day 02 - ...)</label>
              <textarea name="itinerary" className="form-control" placeholder="Day 01 - Arrival..."></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">✅ Inclusions</label>
                <textarea name="inclusions" className="form-control" placeholder="Hotel, Breakfast..."></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">❌ Exclusions</label>
                <textarea name="exclusions" className="form-control" placeholder="Personal expenses..."></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">📸 Media & Visuals</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Main Thumbnail Image</label>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <input type="file" name="file" className="form-control" accept="image/*" style={{ border: 'none', padding: 0 }} />
                  <div style={{ textAlign: 'center', margin: '0.75rem 0', fontWeight: 600, color: '#94a3b8' }}>OR URL</div>
                  <input type="text" name="imageUrl" className="form-control" placeholder="https://example.com/image.jpg" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Gallery Images (For Slider)</label>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px dashed #cbd5e1', height: '100%' }}>
                  <input type="file" name="files" className="form-control" accept="image/*" multiple style={{ border: 'none', padding: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>Select multiple images to create an interactive gallery slider on the package details page.</p>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            background: '#3b82f6', 
            color: 'white', 
            fontWeight: 800, 
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.3s'
          }}>
            ➕ Publish Package
          </button>
        </form>
      </div>
    </>
  );
}
