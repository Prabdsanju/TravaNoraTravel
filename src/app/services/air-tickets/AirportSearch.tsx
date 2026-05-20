'use client';

import { useState, useEffect, useRef } from 'react';

// Curated list of major airports (Name, City, Code, Country)
const AIRPORTS = [
  { name: 'Bandaranaike International Airport', city: 'Colombo', code: 'CMB', country: 'Sri Lanka' },
  { name: 'Suvarnabhumi Airport', city: 'Bangkok', code: 'BKK', country: 'Thailand' },
  { name: 'Changi Airport', city: 'Singapore', code: 'SIN', country: 'Singapore' },
  { name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', code: 'KUL', country: 'Malaysia' },
  { name: 'Dubai International Airport', city: 'Dubai', code: 'DXB', country: 'UAE' },
  { name: 'Hamad International Airport', city: 'Doha', code: 'DOH', country: 'Qatar' },
  { name: 'Heathrow Airport', city: 'London', code: 'LHR', country: 'UK' },
  { name: 'John F. Kennedy International Airport', city: 'New York', code: 'JFK', country: 'USA' },
  { name: 'Don Mueang International Airport', city: 'Bangkok', code: 'DMK', country: 'Thailand' },
  { name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', code: 'SGN', country: 'Vietnam' },
  { name: 'Noi Bai International Airport', city: 'Hanoi', code: 'HAN', country: 'Vietnam' },
  { name: 'Chennai International Airport', city: 'Chennai', code: 'MAA', country: 'India' },
  { name: 'Indira Gandhi International Airport', city: 'Delhi', code: 'DEL', country: 'India' },
  { name: 'Melbourne Airport', city: 'Melbourne', code: 'MEL', country: 'Australia' },
  { name: 'Sydney Kingsford Smith Airport', city: 'Sydney', code: 'SYD', country: 'Australia' },
  { name: 'Paris Charles de Gaulle Airport', city: 'Paris', code: 'CDG', country: 'France' },
  { name: 'Frankfurt Airport', city: 'Frankfurt', code: 'FRA', country: 'Germany' },
  { name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', code: 'AUH', country: 'UAE' },
  { name: 'Narita International Airport', city: 'Tokyo', code: 'NRT', country: 'Japan' },
  { name: 'Incheon International Airport', city: 'Seoul', code: 'ICN', country: 'South Korea' },
  { name: 'Phuket International Airport', city: 'Phuket', code: 'HKT', country: 'Thailand' },
  { name: 'Male International Airport', city: 'Male', code: 'MLE', country: 'Maldives' },
  { name: 'Ngurah Rai International Airport', city: 'Bali', code: 'DPS', country: 'Indonesia' },
  { name: 'Hong Kong International Airport', city: 'Hong Kong', code: 'HKG', country: 'Hong Kong' },
];

export default function AirportSearch({ name, placeholder, required, onSelect }: { name: string, placeholder: string, required?: boolean, onSelect?: (val: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof AIRPORTS>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const filtered = AIRPORTS.filter(a => 
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.city.toLowerCase().includes(query.toLowerCase()) ||
      a.code.toLowerCase().includes(query.toLowerCase()) ||
      a.country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
    
    setResults(filtered);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        name={name}
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="form-control"
        placeholder={placeholder}
        required={required}
        style={{ 
          padding: '1rem', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          width: '100%',
          fontSize: '1rem'
        }}
      />
      
      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '105%',
          left: 0,
          right: 0,
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 100,
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #f1f5f9'
        }}>
          {results.map((airport) => (
            <div
              key={airport.code}
              onClick={() => {
                const val = `${airport.city} (${airport.code})`;
                setQuery(val);
                setIsOpen(false);
                if (onSelect) onSelect(val);
              }}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                borderBottom: '1px solid #f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{airport.city}, {airport.country}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{airport.name}</div>
              </div>
              <div style={{ 
                background: '#e0f2fe', 
                color: '#0369a1', 
                padding: '2px 8px', 
                borderRadius: '6px', 
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                {airport.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
