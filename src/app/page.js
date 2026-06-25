'use client';
import { useState, useEffect } from 'react';
import SectionRenderer from '@/components/SectionRenderer';

export default function HomePage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/public/home`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPage(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch home page from backend, using default sections', err);
      }
      
      // Fallback home page structure
      setPage({
        title: 'Home',
        sections: [
          {
            id: 'sec-1',
            type: 'hero',
            content: {
              title: 'TEATER AKHIR PEKAN',
              subtitle: 'Where Cinema Meets Theatre',
              buttonText: 'Explore Shows',
              buttonLink: '/our-show',
              bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80'
            },
            order: 1
          },
          {
            id: 'sec-2',
            type: 'about-intro',
            content: {
              title: 'A NEW ERA OF PERFORMANCE',
              text: 'Teater Akhir Pekan is a modern performance collective blending the raw intensity of theatrical arts with the meticulous aesthetics of cinema. We craft experiences that linger in the dark, bridging stories and souls.'
            },
            order: 2
          }
        ]
      });
      setLoading(false);
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-white)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.2em' }}>TEATER AKHIR PEKAN</h2>
      </div>
    );
  }

  return <SectionRenderer sections={page?.sections} />;
}
