'use client';
import { useState, useEffect } from 'react';

export default function GallerySection({ content }) {
  const { title } = content || {};
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    const fetchShowsAndImages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/articles?category=show`);
        if (!res.ok) throw new Error('Failed to fetch shows');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Extract thumbnailUrls and metadata.galleryImages from all shows
          const extracted = [];
          const seenUrls = new Set();

          data.forEach(show => {
            // Main thumbnail
            if (show.thumbnailUrl && !seenUrls.has(show.thumbnailUrl)) {
              seenUrls.add(show.thumbnailUrl);
              extracted.push({
                url: show.thumbnailUrl,
                title: show.title,
                category: show.summary || 'Pertunjukan'
              });
            }

            // Gallery images in metadata
            if (show.metadata && Array.isArray(show.metadata.galleryImages)) {
              show.metadata.galleryImages.forEach(imgUrl => {
                if (imgUrl && !seenUrls.has(imgUrl)) {
                  seenUrls.add(imgUrl);
                  extracted.push({
                    url: imgUrl,
                    title: show.title,
                    category: 'Galeri Foto'
                  });
                }
              });
            }
          });

          setImages(extracted);
        }
      } catch (err) {
        console.error('Failed to load gallery images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowsAndImages();
  }, []);

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % images.length);
  };

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  };

  return (
    <section style={{ padding: '6rem 2rem', backgroundColor: '#070708', position: 'relative' }}>
      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .gallery-card {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .gallery-card:hover img {
          transform: scale(1.06);
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7, 7, 8, 0.95) 0%, rgba(7, 7, 8, 0.2) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(7, 7, 8, 0.98);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }
        .lightbox-close {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: none;
          border: none;
          color: white;
          font-size: 2.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .lightbox-close:hover {
          color: var(--accent-gold);
        }
        .lightbox-nav {
          position: absolute;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.5rem;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          user-select: none;
        }
        .lightbox-nav:hover {
          background: var(--accent-gold);
          color: black;
          border-color: var(--accent-gold);
        }
        .lightbox-prev { left: 2rem; }
        .lightbox-next { right: 2rem; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.75rem', paddingTop: '0.3rem' }}>
            Galeri
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-white)' }}>
              {title || 'Dokumentasi Teater'}
            </h2>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
            MEMUAT GALERI FOTO...
          </div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
            BELUM ADA FOTO DOKUMENTASI TERSEDIA.
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((img, idx) => (
              <div key={idx} className="gallery-card" onClick={() => setActiveImageIndex(idx)}>
                <img src={img.url} alt={img.title} loading="lazy" />
                <div className="gallery-overlay">
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.3rem' }}>
                    {img.category}
                  </span>
                  <h4 style={{ color: 'var(--text-white)', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                    {img.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Slideshow Modal */}
      {activeImageIndex !== null && (
        <div className="lightbox-backdrop" onClick={() => setActiveImageIndex(null)}>
          <button className="lightbox-close" onClick={() => setActiveImageIndex(null)}>&times;</button>
          
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
            &#8592;
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '80%', maxHeight: '85vh' }} onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[activeImageIndex].url} 
              alt={images[activeImageIndex].title} 
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.05)' }} 
            />
            <div style={{ color: 'white', marginTop: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {images[activeImageIndex].category}
              </span>
              <h3 style={{ margin: '0.25rem 0 0.5rem 0', fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                {images[activeImageIndex].title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Foto {activeImageIndex + 1} dari {images.length}
              </p>
            </div>
          </div>

          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
            &#8594;
          </button>
        </div>
      )}
    </section>
  );
}
