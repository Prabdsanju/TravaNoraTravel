'use client';

import { useState } from 'react';

export interface StatusOption {
  value: string;
  label: string;
  color?: {
    bg: string;
    border: string;
    text: string;
  };
}

export default function StatusSelector({ 
  id, 
  currentStatus, 
  updateAction,
  options
}: { 
  id: string;
  currentStatus: string;
  updateAction: (id: string, status: string) => Promise<void>;
  options?: StatusOption[];
}) {
  const defaultOptions: StatusOption[] = [
    { value: 'PENDING', label: 'Pending', color: { bg: '#fffbeb', border: '#fcd34d', text: '#b45309' } },
    { value: 'CONTACTED', label: 'Contacted', color: { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8' } },
    { value: 'COMPLETED', label: 'Completed', color: { bg: '#ecfdf5', border: '#6ee7b7', text: '#047857' } }
  ];

  const activeOptions = options || defaultOptions;
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Find color for the current status
  const currentOption = activeOptions.find(o => o.value === status) || activeOptions[0];
  const colors = currentOption?.color || { bg: '#f8fafc', border: '#cbd5e1', text: '#475569' };

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select 
        name="status" 
        value={status}
        disabled={isLoading}
        onChange={async (e) => {
          const newStatus = e.target.value;
          const oldStatus = status;
          setStatus(newStatus);
          setIsLoading(true);
          try {
            await updateAction(id, newStatus);
          } catch (error) {
            console.error('Failed to update status', error);
            // Revert state on failure
            setStatus(oldStatus);
          } finally {
            setIsLoading(false);
          }
        }}
        style={{ 
          padding: '0.35rem 1.75rem 0.35rem 0.75rem', 
          fontSize: '0.75rem', 
          fontWeight: 600,
          borderRadius: '20px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.border,
          borderWidth: '1.5px',
          borderStyle: 'solid',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='${encodeURIComponent(colors.text)}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1rem',
          transition: 'all 0.25s ease',
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        {activeOptions.map((opt) => (
          <option 
            key={opt.value} 
            value={opt.value}
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#1e293b',
              fontWeight: 500
            }}
          >
            {opt.label}
          </option>
        ))}
      </select>
      {isLoading && (
        <span style={{
          position: 'absolute',
          right: '-1.5rem',
          width: '12px',
          height: '12px',
          border: '2px solid #cbd5e1',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
