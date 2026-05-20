import { prisma } from '@/lib/prisma';
import { updateVisaStatus, deleteVisaRequest } from '@/app/actions/visa';
import StatusSelector from '../StatusSelector';
import DeleteButton from '../DeleteButton';

export default async function AdminVisas() {
  const visas = await prisma.visaRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="admin-container">
      <div className="flex space-between align-center mb-6">
        <h1 className="text-primary font-bold" style={{ fontSize: '1.5rem' }}>Visa Inquiries</h1>
        <div className="text-light" style={{ fontSize: '0.875rem' }}>
          Total Inquiries: {visas.length}
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Applicant</th>
                <th>Destination</th>
                <th>Visa Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visas.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No visa inquiries found.</td>
                </tr>
              ) : (
                visas.map((visa) => (
                  <tr key={visa.id}>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {visa.createdAt.toLocaleDateString()}<br/>
                      <span className="text-light">{visa.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{visa.name}</div>
                      <div className="text-light" style={{ fontSize: '0.8rem' }}>{visa.phone}</div>
                      {visa.email && <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{visa.email}</div>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0369a1' }}>{visa.country}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{visa.visaType}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>👥 Applicants: <span style={{ fontWeight: 700 }}>{visa.applicants}</span></div>
                        <div>📅 Travel Date: {visa.travelDate.toLocaleDateString()}</div>
                        {visa.message && (
                          <div style={{ 
                            marginTop: '0.5rem', 
                            fontSize: '0.75rem', 
                            fontStyle: 'italic', 
                            background: '#f1f5f9', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            maxWidth: '200px'
                          }}>
                            "{visa.message}"
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusSelector 
                        id={visa.id} 
                        currentStatus={visa.status} 
                        updateAction={updateVisaStatus} 
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <a 
                          href={`https://wa.me/${visa.phone.replace(/\+/g, '').replace(/\s/g, '')}`} 
                          target="_blank" 
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#25D366' }}
                        >
                          WhatsApp
                        </a>
                        <DeleteButton id={visa.id} onDelete={deleteVisaRequest} />
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
