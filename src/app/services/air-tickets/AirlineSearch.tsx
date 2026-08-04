'use client';

import { useState, useEffect, useRef } from 'react';

// Airline list with regions/routes they commonly serve
const AIRLINES = [
  { name: 'SriLankan Airlines', code: 'UL', regions: ['Asia', 'Europe', 'Middle East', 'Australia'] },
  { name: 'Emirates', code: 'EK', regions: ['Global', 'Middle East', 'Europe', 'Asia', 'USA'] },
  { name: 'Qatar Airways', code: 'QR', regions: ['Global', 'Middle East', 'Europe', 'Asia', 'USA'] },
  { name: 'Singapore Airlines', code: 'SQ', regions: ['Asia', 'Australia', 'USA', 'Europe'] },
  { name: 'Thai Airways', code: 'TG', regions: ['Asia', 'Europe', 'Australia'] },
  { name: 'Malaysia Airlines', code: 'MH', regions: ['Asia', 'Australia', 'Europe'] },
  { name: 'Etihad Airways', code: 'EY', regions: ['Middle East', 'Europe', 'Asia', 'Global'] },
  { name: 'Turkish Airlines', code: 'TK', regions: ['Europe', 'Asia', 'Middle East', 'Global'] },
  { name: 'Air India', code: 'AI', regions: ['Asia', 'USA', 'Europe'] },
  { name: 'IndiGo', code: '6E', regions: ['Asia', 'Middle East'] },
  { name: 'AirAsia', code: 'AK', regions: ['Asia', 'Australia'] },
  { name: 'Cathay Pacific', code: 'CX', regions: ['Asia', 'USA', 'Europe', 'Australia'] },
  { name: 'Flydubai', code: 'FZ', regions: ['Middle East', 'Asia'] },
  { name: 'Jazeera Airways', code: 'J9', regions: ['Middle East', 'Asia'] },
  { name: 'Gulf Air', code: 'GF', regions: ['Middle East', 'Asia'] },
  { name: 'Oman Air', code: 'WY', regions: ['Middle East', 'Asia', 'Europe'] },
  { name: 'Kuwait Airways', code: 'KU', regions: ['Middle East', 'Asia', 'Europe'] },
  { name: 'Qantas', code: 'QF', regions: ['Australia', 'Asia', 'USA', 'Europe'] },
  { name: 'Lufthansa', code: 'LH', regions: ['Europe', 'USA', 'Asia', 'Global'] },
  { name: 'British Airways', code: 'BA', regions: ['Europe', 'USA', 'Asia', 'Global'] },
  { name: 'Vistara', code: 'UK', regions: ['Asia', 'Europe', 'Middle East'] },
  { name: 'Air Arabia', code: 'G9', regions: ['Middle East', 'Asia'] },
  { name: 'SpiceJet', code: 'SG', regions: ['Asia', 'Middle East'] },
  { name: 'Maldivian', code: 'Q2', regions: ['Asia'] },
];

export default function AirlineSearch({ name, placeholder, selectedDestination }: { name: string, placeholder: string, selectedDestination?: string }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive results directly during render to prevent synchronous state updates in useEffect
  let filteredAirlines = AIRLINES;

  if (selectedDestination) {
    const dest = selectedDestination.toLowerCase();
    
    // Map destinations to regions
    let region = '';
    if (dest.includes('thailand') || dest.includes('singapore') || dest.includes('malaysia') || dest.includes('vietnam') || dest.includes('india') || dest.includes('cambodia')) {
      region = 'Asia';
    } else if (dest.includes('dubai') || dest.includes('uae') || dest.includes('qatar') || dest.includes('doha') || dest.includes('kuwait') || dest.includes('oman') || dest.includes('middle east')) {
      region = 'Middle East';
    } else if (dest.includes('london') || dest.includes('uk') || dest.includes('france') || dest.includes('paris') || dest.includes('germany') || dest.includes('europe')) {
      region = 'Europe';
    } else if (dest.includes('australia') || dest.includes('sydney') || dest.includes('melbourne')) {
      region = 'Australia';
    } else if (dest.includes('usa') || dest.includes('york')) {
      region = 'USA';
    }

    if (region) {
      // Filter: ONLY show airlines serving this region or 'Global'
      filteredAirlines = AIRLINES.filter(a => a.regions.includes(region) || a.regions.includes('Global'));
    }
  }

  if (query.length > 0) {
    filteredAirlines = filteredAirlines.filter(a => 
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  const results = filteredAirlines.slice(0, 8);

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
          maxHeight: '250px',
          overflowY: 'auto',
          border: '1px solid #f1f5f9'
        }}>
          {results.map((airline) => (
            <div
              key={airline.code}
              onClick={() => {
                setQuery(airline.name);
                setIsOpen(false);
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
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{airline.name}</div>
              <div style={{ 
                color: '#64748b', 
                fontWeight: 600,
                fontSize: '0.8rem'
              }}>
                {airline.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
