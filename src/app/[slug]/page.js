'use client';
import { useState, useEffect, use } from 'react';
import SectionRenderer from '@/components/SectionRenderer';

export default function DynamicPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/public/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPage(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error(`Failed to fetch page ${slug}`, err);
      }

      // Default static fallbacks for main pages
      let defaultSections = [];
      if (slug === 'about-us') {
        defaultSections = [
          { id: 'sec-1', type: 'hero', content: { title: 'ABOUT US', subtitle: 'Who We Are', buttonText: 'See Our Vision', buttonLink: '#about-intro', bgImage: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
          { id: 'sec-2', type: 'about-intro', content: { title: 'OUR STORY', text: 'Founded with a vision to redefine weekend entertainment, Teater Akhir Pekan creates immersive plays, cinematic adaptations, and collaborative installations. We provide a space for actors, writers, and designers to push boundaries.' }, order: 2 }
        ];
      } else if (slug === 'our-show') {
        defaultSections = [
          { id: 'sec-1', type: 'hero', content: { title: 'OUR SHOWS', subtitle: 'Cinematic Theater Performances', buttonText: 'Explore Shows', buttonLink: '#shows', bgImage: 'https://images.unsplash.com/photo-1503095391755-14144b6969FC?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
          { id: 'sec-2', type: 'showcase-grid', content: { title: 'RECENT & UPCOMING' }, order: 2 }
        ];
      } else if (slug === 'news') {
        defaultSections = [
          { id: 'sec-1', type: 'hero', content: { title: 'LATEST NEWS', subtitle: 'Updates & Announcements', buttonText: 'Read Below', buttonLink: '#news-feed', bgImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
          { id: 'sec-2', type: 'article-feed', content: { title: 'STORY & HIGHLIGHTS' }, order: 2 }
        ];
      } else if (slug === 'collab') {
        defaultSections = [
          { id: 'sec-1', type: 'hero', content: { title: 'COLLABORATE', subtitle: 'Create Art Together', buttonText: 'Submit Proposal', buttonLink: '#collab-form', bgImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
          { id: 'sec-2', type: 'collab-form', content: { title: 'BECOME A PARTNER', text: 'Let us build something extraordinary. We welcome actors, stage crew, sponsors, and media partners.' }, order: 2 }
        ];
      } else if (slug === 'contact') {
        defaultSections = [
          { id: 'sec-1', type: 'hero', content: { title: 'CONTACT US', subtitle: 'Reach Out', buttonText: 'Write Message', buttonLink: '#contact-form', bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
          { id: 'sec-2', type: 'contact-form', content: { title: 'GET IN TOUCH', text: 'Have questions? Want to book a private performance or write to our crew? Drop a line.' }, order: 2 }
        ];
      }

      setPage({
        title: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '),
        sections: defaultSections,
      });
      setLoading(false);
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

  return <SectionRenderer sections={page?.sections} />;
}
