'use client';

import { useState } from 'react';
import { setupAdmin, loginAdmin, resetPassword } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LoginForm({ isSetupRequired }: { isSetupRequired: boolean }) {
  const router = useRouter();
  
  const [mode, setMode] = useState<'login' | 'setup' | 'reset'>(isSetupRequired ? 'setup' : 'login');
  
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    if (mode === 'setup') {
      if (password.length < 6 || pin.length < 4) {
        setError('Password must be at least 6 chars and PIN at least 4 chars.');
        setLoading(false);
        return;
      }
      res = await setupAdmin(password, pin);
    } else if (mode === 'login') {
      res = await loginAdmin(password);
    } else if (mode === 'reset') {
      if (password.length < 6) {
        setError('New password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      res = await resetPassword(pin, password);
    }

    if (res?.success) {
      router.push('/admin');
      router.refresh(); // Ensure layout updates state if needed
    } else {
      setError(res?.error || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)' }}>
          {mode === 'setup' ? 'Admin Setup' : mode === 'reset' ? 'Reset Password' : 'Admin Login'}
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {mode === 'setup' ? 'Create your master password and a recovery PIN.' : 
           mode === 'reset' ? 'Enter your recovery PIN to set a new password.' : 
           'Enter your password to access the dashboard.'}
        </p>
      </div>

      {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mode === 'setup' && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Create Password</label>
            <input type="password" required className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        )}
        
        {mode === 'setup' && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Recovery PIN (e.g. 1234)</label>
            <input type="password" required className="form-control" value={pin} onChange={e => setPin(e.target.value)} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>Store this safely. You need it if you forget your password.</p>
          </div>
        )}

        {mode === 'login' && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input type="password" required className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        )}

        {mode === 'reset' && (
          <>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Recovery PIN</label>
              <input type="password" required className="form-control" value={pin} onChange={e => setPin(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Password</label>
              <input type="password" required className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? 'Please wait...' : mode === 'setup' ? 'Complete Setup' : mode === 'reset' ? 'Reset & Login' : 'Login'}
        </button>
      </form>

      {mode === 'login' && !isSetupRequired && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => { setMode('reset'); setError(''); setPassword(''); setPin(''); }} style={{ color: 'var(--accent-color)', fontSize: '0.85rem', textDecoration: 'underline' }}>
            Forgot Password?
          </button>
        </div>
      )}
      
      {mode === 'reset' && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => { setMode('login'); setError(''); setPassword(''); setPin(''); }} style={{ color: 'var(--text-light)', fontSize: '0.85rem', textDecoration: 'underline' }}>
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
