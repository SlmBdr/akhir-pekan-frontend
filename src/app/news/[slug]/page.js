'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function NewsDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/articles/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.category === 'news') {
            setArticle(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch article detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-white)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.2em' }}>MEMUAT DETAIL ARTIKEL...</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-white)', gap: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>ARTIKEL TIDAK DITEMUKAN</h2>
        <Link href="/news" className="btn btn-secondary">KEMBALI KE BERITA</Link>
      </div>
    );
  }

  const bgStyle = article.thumbnailUrl ? { backgroundImage: `url(${article.thumbnailUrl})` } : {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070708', color: 'var(--text-gray)' }}>
      {/* Cinematic Banner */}
      <div style={{
        height: '50vh',
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
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' }}>ARTIKEL & BERITA</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text-white)' }}>{article.title}</h1>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>
            Diterbitkan pada {new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {article.content}
        </div>

        <div style={{ marginTop: '5rem', borderTop: '1px solid rgba(240, 240, 242, 0.05)', paddingTop: '2rem' }}>
          <Link href="/news" style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            &larr; Kembali ke halaman berita
          </Link>
        </div>
      </div>
    </div>
  );
}
