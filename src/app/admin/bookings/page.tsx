import { prisma } from '@/lib/prisma';
import { updateBookingStatus, deleteBooking } from '@/app/actions/booking';
import StatusSelector from '../StatusSelector';
import DeleteButton from '../DeleteButton';

export default async function AdminBookings() {
  const bookings = await prisma.booking.findMany({ 
    include: { package: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <h1 className="text-primary font-bold mb-6" style={{ fontSize: '1.5rem' }}>Manage Bookings</h1>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Travel Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking: any) => (
              <tr key={booking.id}>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="font-bold">{booking.name}</div>
                  {booking.email && <div className="text-light" style={{ fontSize: '0.75rem' }}>{booking.email}</div>}
                  <div className="text-light" style={{ fontSize: '0.75rem' }}>{booking.phone}</div>
                </td>
                <td>
                  <div className="font-bold text-primary">{booking.package.title}</div>
                  <div style={{ fontSize: '0.75rem' }} className="text-light">
                    {booking.guests} Adults
                    {booking.children > 0 && ` | ${booking.children} Children (Ages: ${booking.childrenAges || 'N/A'})`}
                    {booking.nights && ` | ${booking.nights} Nights`}
                  </div>
                </td>
                <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                <td>
                  <StatusSelector 
                    id={booking.id} 
                    currentStatus={booking.status === 'CONFIRMED' ? 'COMPLETED' : booking.status} 
                    updateAction={async (id, status) => {
                      'use server';
                      const finalStatus = status === 'COMPLETED' ? 'CONFIRMED' : status;
                      await updateBookingStatus(id, finalStatus);
                    }} 
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <a 
                      href={`https://wa.me/${booking.phone.replace(/\+/g, '').replace(/\s/g, '')}`} 
                      target="_blank" 
                      className="btn-primary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#25D366' }}
                    >
                      WhatsApp
                    </a>
                    <DeleteButton id={booking.id} onDelete={deleteBooking} />
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={6} className="text-center py-4">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .btn-remove {
          padding: 0.25rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 6px;
          border: 1px solid #ef4444;
          background-color: transparent;
          color: #ef4444;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-remove:hover {
          background-color: #ef4444;
          color: #fff;
        }
      `}</style>
    </>
  );
}
