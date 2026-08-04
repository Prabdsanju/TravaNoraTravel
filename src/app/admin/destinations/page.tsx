import { prisma } from '@/lib/prisma';
import { addDestination, deleteDestination, updateDestination, moveDestination } from '@/app/actions/destination';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDestinations() {
  const destinations = await prisma.destination.findMany({ orderBy: { position: 'asc' } });

  return (
    <>
      <div className="flex space-between align-center mb-6">
        <h1 className="text-primary font-bold" style={{ fontSize: '1.5rem' }}>Manage Destinations</h1>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="card">
          <div className="card-body">
            <h2 className="font-bold mb-4">Add New Destination</h2>
            <form action={addDestination}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Image Upload</label>
                <input type="file" name="file" className="form-control" accept="image/*" />
              </div>
              <p className="text-light text-center my-2">OR</p>
              <div className="form-group">
                <label className="form-label">Image URL Header</label>
                <input type="text" name="imageUrl" className="form-control" placeholder="https://" />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add Destination</button>
            </form>
          </div>
        </div>

        <div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest: any) => (
                  <tr key={dest.id}>
                    <td>
                      <form action={async (formData) => {
                        "use server";
                        const newName = formData.get('name') as string;
                        await updateDestination(dest.id, newName);
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input type="text" name="name" defaultValue={dest.name} className="form-control" style={{ width: '200px' }} />
                          <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.6rem' }}>Save</button>
                        </div>
                      </form>
                    </td>
                    <td>
                      {dest.imageUrl ? <img src={dest.imageUrl} alt={dest.name} style={{ width: '50px', height: '50px', borderRadius: '4px' }} /> : 'No image'}
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Link href={`/admin/destinations/${dest.id}`} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        Edit
                      </Link>
                      <form action={moveDestination}>
                        <input type="hidden" name="id" value={dest.id} />
                        <input type="hidden" name="delta" value={-1} />
                        <button type="submit" className="btn-outline" title="Move up">↑</button>
                      </form>
                      <form action={moveDestination}>
                        <input type="hidden" name="id" value={dest.id} />
                        <input type="hidden" name="delta" value={1} />
                        <button type="submit" className="btn-outline" title="Move down">↓</button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await deleteDestination(dest.id)
                      }}>
                        <button type="submit" className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
