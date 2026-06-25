'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShowGridSection({ content }) {
  const { title } = content || {};
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/articles?category=show`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setShows(data);
        }
      } catch (err) {
        console.error('Failed to fetch shows', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  return (
    <section className="showcase-section" id="shows">
      <div className="showcase-header-grid">
        <div className="showcase-header-label">
          Showcase
        </div>
        <div className="showcase-header-title-box">
          <h2 className="showcase-header-title">{title || 'Our Performances'}</h2>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
          MEMUAT PERTUNJUKAN...
        </div>
      ) : shows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
          BELUM ADA PERTUNJUKAN YANG TERSEDIA.
        </div>
      ) : (
        <div className="showcase-grid">
          {shows.map((show) => (
            <div key={show._id || show.slug} className="show-card">
              <div className="card-img-wrapper">
                <img
                  src={show.thumbnailUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'}
                  alt={show.title}
                  className="card-img"
                />
              </div>
              <div className="card-info">
                <span className="card-meta">
                  {show.metadata?.eventDate ? new Date(show.metadata.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera Hadir'}
                  {show.metadata?.eventLocation ? ` | ${show.metadata.eventLocation}` : ''}
                </span>
                <h3 className="card-title">{show.title}</h3>
                <p className="card-summary">{show.summary}</p>
                <div className="card-footer">
                  <Link href={`/show/${show.slug}`} className="card-link">
                    Detail Pertunjukan &rarr;
                  </Link>
                  {show.metadata?.ticketLink && (
                    <a
                      href={show.metadata.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 1.25rem', fontSize: '0.65rem' }}
                    >
                      Beli Tiket
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
