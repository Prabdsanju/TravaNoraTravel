'use client';

export default function StatusSelector({ 
  id, 
  currentStatus, 
  updateAction 
}: { 
  id: string, 
  currentStatus: string, 
  updateAction: (id: string, status: string) => Promise<void> 
}) {
  return (
    <select 
      name="status" 
      defaultValue={currentStatus}
      onChange={async (e) => {
        const newStatus = e.target.value;
        await updateAction(id, newStatus);
      }}
      className="form-control"
      style={{ 
        padding: '0.25rem 0.5rem', 
        fontSize: '0.8rem', 
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: currentStatus === 'COMPLETED' ? '#ecfdf5' : currentStatus === 'CONTACTED' ? '#eff6ff' : '#fff',
        borderColor: currentStatus === 'COMPLETED' ? '#10b981' : currentStatus === 'CONTACTED' ? '#3b82f6' : '#cbd5e1'
      }}
    >
      <option value="PENDING">Pending</option>
      <option value="CONTACTED">Contacted</option>
      <option value="COMPLETED">Completed</option>
    </select>
  );
}
