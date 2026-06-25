'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const checkRes = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        const checkData = await checkRes.json();
        if (checkData.success) {
          router.push('/admin');
        }
      } catch (err) {
        // Not authenticated
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        router.push('/admin');
      } else {
        setError(data.error || 'Login gagal. Coba lagi.');
      }
    } catch (err) {
      console.error('Login error', err);
      setError('Gagal menghubungkan ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#070708',
      padding: '2rem',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '3rem 2.5rem',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
            TEATER AKHIR PEKAN
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ADMIN PORTAL
          </span>
        </div>

        {error && (
          <div className="notification notification-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem' }}
            disabled={loading}
          >
            {loading ? 'MEMASUKI PORTAL...' : 'MASUK'}
          </button>
        </form>
      </div>
    </div>
  );
}
