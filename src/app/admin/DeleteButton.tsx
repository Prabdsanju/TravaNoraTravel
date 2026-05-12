'use client';

import { useState } from 'react';

export default function DeleteButton({ 
  id, 
  onDelete 
}: { 
  id: string, 
  onDelete: (id: string) => Promise<void> 
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently remove this inquiry?')) {
      setIsDeleting(true);
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn-danger"
      style={{ 
        padding: '0.4rem 0.6rem', 
        fontSize: '0.75rem', 
        backgroundColor: '#ef4444',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        opacity: isDeleting ? 0.6 : 1,
        transition: 'all 0.2s'
      }}
      title="Remove Inquiry"
    >
      {isDeleting ? '...' : '🗑️'}
    </button>
  );
}
