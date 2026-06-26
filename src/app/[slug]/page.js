'use client';
import { useState, useEffect, use } from 'react';
import SectionRenderer from '@/components/SectionRenderer';

export default function DynamicPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/public/${slug}`);
        if (!res.ok) {
          throw new Error(`Failed to load page. Server returned status ${res.status}`);
        }
        const data = await res.json();
        if (!data) {
          throw new Error("No page data returned from backend");
        }
        setPage(data);
      } catch (err) {
        console.error(`Failed to fetch page ${slug}:`, err);
        setError(err.message || 'Gagal memuat data dari backend');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-white)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.2em' }}>MEMUAT...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-white)', gap: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.1em', color: '#ff4d4d' }}>GAGAL MEMUAT DATA</h2>
        <p style={{ color: 'var(--text-muted)' }}>{error}</p>
      </div>
    );
  }

  return <SectionRenderer sections={page?.sections} />;
}
