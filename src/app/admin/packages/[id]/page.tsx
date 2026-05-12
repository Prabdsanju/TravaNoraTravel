import { prisma } from '@/lib/prisma';
import { updatePackage, addPackageImages, deletePackageImage } from '@/app/actions/package';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditPackage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ 
    where: { id },
    include: { images: true }
  });
  const destinations = await prisma.destination.findMany({ orderBy: { position: 'asc' } });

  if (!pkg) return notFound();

  return (
    <>
      <div className="flex space-between align-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="text-primary font-bold" style={{ fontSize: '1.5rem' }}>Edit Package</h1>
        <Link href="/admin/packages" className="btn-outline" style={{ display: 'inline-block', padding: '0.5rem 1rem' }}>Back to Packages</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Basic Details */}
        <div className="card">
          <div className="card-body">
            <h2 className="font-bold mb-6" style={{ fontSize: '1.1rem' }}>Basic Details</h2>
            <form action={updatePackage}>
              <input type="hidden" name="id" value={pkg.id} />
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Destination</label>
                <select name="destinationId" className="form-control" defaultValue={pkg.destinationId} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="">Select Destination</option>
                  {destinations.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                <input type="text" name="title" className="form-control" defaultValue={pkg.title} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Overview / Short Description</label>
                <textarea name="description" className="form-control" defaultValue={pkg.description} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', minHeight: '80px' }}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Itinerary (Day 01 - ..., Day 02 - ...)</label>
                <textarea name="itinerary" className="form-control" defaultValue={pkg.itinerary || ""} placeholder="Day 01 - Arrival..." style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', minHeight: '150px' }}></textarea>
              </div>
              <div className="grid md:grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Inclusions</label>
                  <textarea name="inclusions" className="form-control" defaultValue={pkg.inclusions || ""} placeholder="Hotel, Breakfast..." style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', minHeight: '100px' }}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Exclusions</label>
                  <textarea name="exclusions" className="form-control" defaultValue={pkg.exclusions || ""} placeholder="Personal expenses..." style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', minHeight: '100px' }}></textarea>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Price (LKR)</label>
                  <input type="number" step="0.01" name="price" className="form-control" defaultValue={pkg.price} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Days</label>
                  <input type="number" name="days" className="form-control" defaultValue={pkg.days} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Nights</label>
                  <input type="number" name="nights" className="form-control" defaultValue={pkg.nights} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Main Thumbnail</label>
                {pkg.imageUrl ? (
                  <img src={pkg.imageUrl} alt={pkg.title} style={{ height: '100px', width: '100%', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                ) : <p style={{ fontSize: '0.875rem' }}>No thumbnail uploaded.</p>}
                <label className="form-label mt-4" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1rem' }}>Replace Thumbnail</label>
                <input type="file" name="file" className="form-control" accept="image/*" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <p style={{ textAlign: 'center', opacity: 0.7, margin: '0.5rem 0', fontSize: '0.8rem' }}>OR URL</p>
                <input type="text" name="imageUrl" className="form-control" defaultValue={pkg.imageUrl || ""} placeholder="https://" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <button type="submit" className="btn-primary mt-4" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>Save Basic Details</button>
            </form>
          </div>
        </div>

        {/* Right Column: Gallery Management */}
        <div className="card">
          <div className="card-body">
            <h2 className="font-bold mb-6" style={{ fontSize: '1.1rem' }}>Gallery Images (Slider)</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {pkg.images.map((img) => (
                <div key={img.id} style={{ position: 'relative' }}>
                  <img src={img.url} alt="Gallery" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <form action={async () => {
                    "use server";
                    await deletePackageImage(img.id, pkg.id);
                  }}>
                    <button 
                      type="submit" 
                      style={{ 
                        position: 'absolute', 
                        top: '-5px', 
                        right: '-5px', 
                        background: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '24px', 
                        height: '24px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                    >
                      ✕
                    </button>
                  </form>
                </div>
              ))}
              {pkg.images.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                  No slider images yet.
                </div>
              )}
            </div>

            <div className="add-image-box" style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Add More Images</h3>
              <form action={addPackageImages}>
                <input type="hidden" name="packageId" value={pkg.id} />
                <div className="form-group">
                  <input type="file" name="files" className="form-control" accept="image/*" multiple required style={{ width: '100%', padding: '0.75rem', background: 'white' }} />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>You can select multiple images at once.</p>
                </div>
                <button type="submit" className="btn-primary mt-4" style={{ width: '100%', background: 'var(--primary-color)' }}>
                  Upload to Gallery
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
