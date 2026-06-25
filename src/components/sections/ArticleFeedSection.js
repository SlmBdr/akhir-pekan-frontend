'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArticleFeedSection({ content }) {
  const { title } = content || {};
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/articles?category=news`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setArticles(data);
        }
      } catch (err) {
        console.error('Failed to fetch articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="showcase-section" id="news-feed">
      <div className="showcase-header-grid">
        <div className="showcase-header-label">
          News
        </div>
        <div className="showcase-header-title-box">
          <h2 className="showcase-header-title">{title || 'Latest News & Blogs'}</h2>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
          MEMUAT BERITA...
        </div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
          BELUM ADA BERITA TERSEDIA.
        </div>
      ) : (
        <div className="showcase-grid">
          {articles.map((article) => (
            <div key={article._id || article.slug} className="show-card">
              <div className="card-img-wrapper" style={{ aspectRatio: '16 / 9' }}>
                <img
                  src={article.thumbnailUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'}
                  alt={article.title}
                  className="card-img"
                />
              </div>
              <div className="card-info">
                <span className="card-meta">
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h3 className="card-title">
                  {article.title}
                </h3>
                <p className="card-summary">
                  {article.summary}
                </p>
                <div className="card-footer">
                  <Link href={`/news/${article.slug}`} className="card-link">
                    Baca Selengkapnya &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
