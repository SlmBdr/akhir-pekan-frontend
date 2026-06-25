'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function ShowDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/articles/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.category === 'show') {
            setShow(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch show detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-white)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.2em' }}>MEMUAT DETAIL PERTUNJUKAN...</h2>
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-white)', gap: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>PERTUNJUKAN TIDAK DITEMUKAN</h2>
        <Link href="/our-show" className="btn btn-secondary">KEMBALI KE DAFTAR SHOW</Link>
      </div>
    );
  }

  const bgStyle = show.thumbnailUrl ? { backgroundImage: `url(${show.thumbnailUrl})` } : {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070708', color: 'var(--text-gray)' }}>
      {/* Cinematic Banner */}
      <div style={{
        height: '60vh',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '3rem',
        ...bgStyle
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 100 + '%',
          height: 100 + '%',
          background: 'linear-gradient(to bottom, rgba(7, 7, 8, 0.2) 0%, rgba(7, 7, 8, 0.9) 100%)'
        }}></div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' }}>PERTUNJUKAN TEATER</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text-white)' }}>{show.title}</h1>
        </div>
      </div>

      {/* Show Details Grid */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '3rem', marginBottom: '3rem' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tanggal Pertunjukan</h4>
            <p style={{ color: 'var(--text-white)', fontSize: '1.1rem' }}>
              {show.metadata?.eventDate ? new Date(show.metadata.eventDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera Diumumkan'}
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Lokasi Event</h4>
            <p style={{ color: 'var(--text-white)', fontSize: '1.1rem' }}>{show.metadata?.eventLocation || 'Studio Teater Akhir Pekan'}</p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tiket</h4>
            {show.metadata?.ticketLink ? (
              <a href={show.metadata.ticketLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                Beli Tiket
              </a>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tiket Belum Tersedia</p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {show.content}
        </div>

        <div style={{ marginTop: '5rem', borderTop: '1px solid rgba(240, 240, 242, 0.05)', paddingTop: '2rem' }}>
          <Link href="/our-show" style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            &larr; Kembali ke daftar pertunjukan
          </Link>
        </div>
      </div>
    </div>
  );
}
