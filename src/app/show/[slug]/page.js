'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function ShowDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev === 0 ? show.metadata.galleryImages.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev === show.metadata.galleryImages.length - 1 ? 0 : prev + 1));
  };

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
        <div 
          style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: show.content }}
        />

        {/* Photo Gallery & Slideshow */}
        {show.metadata?.galleryImages && show.metadata.galleryImages.length > 0 && (
          <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(240, 240, 242, 0.08)', paddingTop: '3rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '1.5rem', marginBottom: '2rem', letterSpacing: '0.05em' }}>DOKUMENTASI PENTAS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {show.metadata.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/2',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                  }}
                  className="gallery-item-hover"
                >
                  <img
                    src={imgUrl}
                    alt={`Dokumentasi ${show.title} - ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="gallery-img-hover"
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }} className="gallery-overlay-hover">
                    <span>🔍</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Hover CSS */}
            <style>{`
              .gallery-item-hover:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.4);
                border-color: var(--accent-gold);
              }
              .gallery-item-hover:hover .gallery-img-hover {
                transform: scale(1.05);
              }
              .gallery-item-hover:hover .gallery-overlay-hover {
                opacity: 1;
              }
            `}</style>
          </div>
        )}

        {/* Lightbox Modal */}
        {activePhotoIndex !== null && show.metadata?.galleryImages && (
          <div
            onClick={() => setActivePhotoIndex(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(7, 7, 8, 0.95)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'opacity 0.2s',
              }}
            >
              ✕
            </button>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevPhoto}
              style={{
                position: 'absolute',
                left: '2rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                color: 'white',
                width: '50px',
                height: '50px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              ‹
            </button>

            <div style={{ maxWidth: '80%', maxHeight: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={show.metadata.galleryImages[activePhotoIndex]}
                alt={`Lightbox view`}
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
              />
              <div style={{ color: 'var(--text-muted)', marginTop: '1rem', fontFamily: 'var(--font-serif)', fontSize: '0.9rem' }}>
                {activePhotoIndex + 1} / {show.metadata.galleryImages.length}
              </div>
            </div>

            <button
              onClick={handleNextPhoto}
              style={{
                position: 'absolute',
                right: '2rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                color: 'white',
                width: '50px',
                height: '50px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              ›
            </button>
          </div>
        )}

        <div style={{ marginTop: '5rem', borderTop: '1px solid rgba(240, 240, 242, 0.05)', paddingTop: '2rem' }}>
          <Link href="/our-show" style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            &larr; Kembali ke daftar pertunjukan
          </Link>
        </div>
      </div>
    </div>
  );
}
