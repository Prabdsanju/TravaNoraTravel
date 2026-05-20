import { prisma } from '@/lib/prisma';
import { addPackage, deletePackage } from '@/app/actions/package';
import Link from 'next/link';

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
        .pkg-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.75rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0;
        }
        .pkg-tab-btn {
          padding: 0.6rem 1.25rem;
          border-radius: 8px 8px 0 0;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s;
          background: #f1f5f9;
          color: #64748b;
          position: relative;
          bottom: -2px;
          border-bottom: 2px solid transparent;
        }
        .pkg-tab-btn:hover {
          background: #e0f2fe;
          color: #0284c7;
        }
        .pkg-tab-btn.active {
          background: white;
          color: #0284c7;
          border: 2px solid #e2e8f0;
          border-bottom: 2px solid white;
        }
        .pkg-tab-count {
          background: #0284c7;
          color: white;
          border-radius: 999px;
          font-size: 0.7rem;
          padding: 1px 7px;
          font-weight: 700;
        }
        .pkg-tab-btn:not(.active) .pkg-tab-count {
          background: #94a3b8;
        }

        /* Package card grid */
        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .pkg-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
        }
        .pkg-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          border-color: #bae6fd;
        }
        .pkg-card-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          display: block;
          background: #f1f5f9;
        }
        .pkg-card-img-placeholder {
          width: 100%;
          height: 140px;
          background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 2rem;
        }
        .pkg-card-body {
          padding: 0.9rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .pkg-card-title {
          font-weight: 700;
          font-size: 0.88rem;
          color: #1e293b;
          line-height: 1.35;
        }
        .pkg-card-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .pkg-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          background: #f0f9ff;
          color: #0284c7;
          border: 1px solid #bae6fd;
        }
        .pkg-price {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0284c7;
        }
        .pkg-card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .pkg-edit-btn {
          flex: 1;
          text-align: center;
          padding: 0.45rem 0.5rem;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          background: #0284c7;
          color: white;
          text-decoration: none;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
        }
        .pkg-edit-btn:hover { background: #0369a1; color: white; }
        .pkg-delete-btn {
          padding: 0.45rem 0.6rem;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pkg-delete-btn:hover { background: #dc2626; color: white; }

        .pkg-empty {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px dashed #e2e8f0;
        }
        .pkg-empty-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }

        /* Add form panel */
        .add-form-panel {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .add-form-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="text-primary font-bold" style={{ fontSize: '1.5rem' }}>Manage Packages</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
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
            {dest.name === 'Thailand' ? '🇹🇭' : dest.name === 'Singapore' ? '🇸🇬' : dest.name === 'Malaysia' ? '🇲🇾' : '🌍'}
            {' '}{dest.name}
            <span className="pkg-tab-count">{dest.packages.length}</span>
          </Link>
        ))}
      </div>

      {/* Active Destination Header */}
      {activeDestination && (
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {activeDestination.imageUrl && (
            <img
              src={activeDestination.imageUrl}
              alt={activeDestination.name}
              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #e2e8f0' }}
            />
          )}
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
              {activeDestination.name} Packages
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {activePackages.length} package{activePackages.length !== 1 ? 's' : ''} — click Edit to update details
            </div>
          </div>
        </div>
      )}

      {/* Package Cards Grid */}
      {activePackages.length === 0 ? (
        <div className="pkg-empty">
          <div className="pkg-empty-icon">📦</div>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No packages yet</div>
          <div style={{ fontSize: '0.85rem' }}>Add the first package for {activeDestination?.name} below</div>
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
                <div className="pkg-card-title">{pkg.title}</div>
                <div className="pkg-card-meta">
                  <span className="pkg-badge">⏱ {pkg.days}D/{pkg.nights}N</span>
                </div>
                <div className="pkg-price">LKR {pkg.price.toLocaleString()}</div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '-2px' }}>*Conditions Apply</div>
                <div className="pkg-card-actions">
                  <Link href={`/admin/packages/${pkg.id}`} className="pkg-edit-btn">
                    ✏️ Edit
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await deletePackage(pkg.id);
                    }}
                    style={{ margin: 0 }}
                  >
                    <button type="submit" className="pkg-delete-btn" title="Delete">
                      🗑
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
          ➕ Add New Package
          {activeDestination && (
            <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#64748b' }}>
              — will be added to <strong>{activeDestination.name}</strong>
            </span>
          )}
        </div>
        <form action={addPackage}>
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
            <label className="form-label">Title</label>
            <input type="text" name="title" className="form-control" required placeholder="e.g. 03 Night Singapore Tour" />
          </div>
          <div className="form-group">
            <label className="form-label">Overview / Short Description</label>
            <textarea name="description" className="form-control" required placeholder="Package details, summary..."></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Itinerary (Day 01 - ..., Day 02 - ...)</label>
            <textarea name="itinerary" className="form-control" placeholder="Day 01 - Arrival..."></textarea>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Inclusions</label>
              <textarea name="inclusions" className="form-control" placeholder="Hotel, Breakfast..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Exclusions</label>
              <textarea name="exclusions" className="form-control" placeholder="Personal expenses..."></textarea>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
          <div className="form-group">
            <label className="form-label">Main Thumbnail</label>
            <input type="file" name="file" className="form-control" accept="image/*" />
            <p style={{ textAlign: 'center', opacity: 0.6, margin: '0.5rem 0', fontSize: '0.8rem' }}>OR URL</p>
            <input type="text" name="imageUrl" className="form-control" placeholder="https://example.com/image.jpg" />
          </div>
          <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <label className="form-label" style={{ fontWeight: 700 }}>Gallery Images (For Slider)</label>
            <input type="file" name="files" className="form-control" accept="image/*" multiple style={{ background: 'white' }} />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Select multiple images for the interactive slider.</p>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Add Package
          </button>
        </form>
      </div>
    </>
  );
}
