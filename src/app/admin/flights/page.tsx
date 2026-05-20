import { prisma } from '@/lib/prisma';
import { updateFlightStatus, deleteFlightRequest } from '@/app/actions/flight';
import StatusSelector from '../StatusSelector';
import DeleteButton from '../DeleteButton';

export default async function AdminFlights() {
  const flights = await prisma.flightRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="admin-container">
      <div className="flex space-between align-center mb-6">
        <h1 className="text-primary font-bold" style={{ fontSize: '1.5rem' }}>Flight Inquiries</h1>
        <div className="text-light" style={{ fontSize: '0.875rem' }}>
          Total Inquiries: {flights.length}
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Passenger</th>
                <th>Route</th>
                <th>Trip Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No flight inquiries found.</td>
                </tr>
              ) : (
                flights.map((flight) => (
                  <tr key={flight.id}>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {flight.createdAt.toLocaleDateString()}<br/>
                      <span className="text-light">{flight.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{flight.name}</div>
                      <div className="text-light" style={{ fontSize: '0.8rem' }}>{flight.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>{flight.from}</span>
                        <span style={{ color: '#0284c7' }}>➔</span>
                        <span style={{ fontWeight: 600 }}>{flight.to}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>📅 Dep: {flight.departureDate.toLocaleDateString()}</div>
                        {flight.returnDate && <div>🔄 Ret: {flight.returnDate.toLocaleDateString()}</div>}
                        <div className="text-accent" style={{ fontWeight: 600 }}>
                          {flight.adults} Adults {flight.children > 0 && `, ${flight.children} Child`}
                        </div>
                        {flight.preferredAirline && <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>✈️ {flight.preferredAirline}</div>}
                      </div>
                    </td>
                    <td>
                      <StatusSelector 
                        id={flight.id} 
                        currentStatus={flight.status} 
                        updateAction={updateFlightStatus} 
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <a 
                          href={`https://wa.me/${flight.phone.replace(/\+/g, '').replace(/\s/g, '')}`} 
                          target="_blank" 
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#25D366' }}
                        >
                          WhatsApp
                        </a>
                        <DeleteButton id={flight.id} onDelete={deleteFlightRequest} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
