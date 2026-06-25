'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const [footerData, setFooterData] = useState({
    bigText: 'Teater Akhir Pekan',
    tagline: 'Di mana Sinema Bertemu Panggung Teater.',
    subtagline: 'Kolektif seni pertunjukan modern yang memadukan keintiman teater dengan estetika film.',
    copyrightText: `© ${new Date().getFullYear()} Teater Akhir Pekan. All rights reserved.`,
    creditText: 'Designed with clarity & motion.',
  });

  useEffect(() => {
    // Don't fetch on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const fetchFooter = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/footer`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setFooterData({
              bigText: data.bigText || 'Teater Akhir Pekan',
              tagline: data.tagline || 'Di mana Sinema Bertemu Panggung Teater.',
              subtagline: data.subtagline || 'Kolektif seni pertunjukan modern yang memadukan keintiman teater dengan estetika film.',
              copyrightText: data.copyrightText || `© ${new Date().getFullYear()} Teater Akhir Pekan. All rights reserved.`,
              creditText: data.creditText || 'Designed with clarity & motion.',
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch footer data:', err);
      }
    };

    fetchFooter();
  }, [pathname]);

  // Don't show public footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer-sec">
      <div className="footer-container">
        {/* Giant Display Brand Logo */}
        <div className="footer-big-text">
          {footerData.bigText}
        </div>

        {/* Middle Details & Links Section */}
        <div className="footer-middle-grid">
          {/* Left Column: Brand Vision info */}
          <div className="footer-left-info">
            <span className="footer-tagline">
              {footerData.tagline}
            </span>
            <span className="footer-subtagline">
              {footerData.subtagline}
            </span>
          </div>

          {/* Right Column: Grid of Links columns */}
          <div className="footer-links-grid">
            <div className="footer-column">
              <span className="footer-column-title">Explore</span>
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/about-us" className="footer-link">About Us</Link>
              <Link href="/our-show" className="footer-link">Our Show</Link>
              <Link href="/news" className="footer-link">News</Link>
            </div>
            
            <div className="footer-column">
              <span className="footer-column-title">Connect</span>
              <Link href="/collab" className="footer-link">Collab With Us</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
        </div>

        {/* Bottom row: copyright */}
        <div className="footer-copyright-row">
          <span>{footerData.copyrightText}</span>
          <span>{footerData.creditText}</span>
        </div>
      </div>
    </footer>
  );
}

