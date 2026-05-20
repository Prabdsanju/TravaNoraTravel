import { prisma } from '@/lib/prisma';
import { updateDestinationDetails } from '@/app/actions/destination';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({
    where: { id }
  });

  if (!destination) notFound();

  return (
    <div className="container py-8">
      <div className="flex space-between align-center mb-6">
        <h1 className="text-primary font-bold" style={{ fontSize: '1.5rem' }}>Edit Destination: {destination.name}</h1>
        <Link href="/admin/destinations" className="btn-outline">Back to List</Link>
      </div>

      <div className="card max-w-2xl mx-auto">
        <div className="card-body">
          <form action={updateDestinationDetails}>
            <input type="hidden" name="id" value={destination.id} />
            
            <div className="form-group">
              <label className="form-label">Destination Name</label>
              <input type="text" name="name" className="form-control" defaultValue={destination.name} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                defaultValue={destination.description || ''} 
                style={{ minHeight: '150px' }}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Update Image (Optional)</label>
              <input type="file" name="file" className="form-control" accept="image/*" />
              <p className="text-light mt-1" style={{ fontSize: '0.8rem' }}>Leave empty to keep current image.</p>
            </div>

            <p className="text-light text-center my-4">OR</p>

            <div className="form-group">
              <label className="form-label">Change Image URL</label>
              <input type="text" name="imageUrl" className="form-control" defaultValue={destination.imageUrl || ''} />
            </div>

            <div className="mt-8 flex gap-4">
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
              <Link href="/admin/destinations" className="btn-outline" style={{ flex: 1, textAlign: 'center' }}>Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
