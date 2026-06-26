'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  
  const pathname = usePathname();

  useEffect(() => {
    // Fetch menus from backend API Gateway
    const fetchMenus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/menus`);
        if (!res.ok) {
          throw new Error(`Failed to fetch menus. Status: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setMenus(data);
        }
      } catch (err) {
        console.error('Failed to fetch menus from backend:', err);
      }
    };
    fetchMenus();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getLinkHref = (slug) => {
    if (slug === 'home') return '/';
    return `/${slug}`;
  };

  const isActive = (slug) => {
    const href = getLinkHref(slug);
    if (href === '/') return pathname === '/';
    return pathname === href;
  };

  // Don't show public navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Separate center nav links and right CTA
  const centerLinks = menus.filter((m) => m.slug !== 'collab');
  const ctaLink = menus.find((m) => m.slug === 'collab') || { title: 'Collab With Us', slug: 'collab' };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Left Logo Column */}
        <div className="navbar-logo-box">
          <Link href="/" className="navbar-logo">
            TEATER AKHIR PEKAN
          </Link>
        </div>

        {/* Center Navigation Links Column */}
        <nav className="navbar-nav-box">
          {centerLinks.map((m) => (
            <Link
              key={m.slug}
              href={getLinkHref(m.slug)}
              className={`navbar-link ${isActive(m.slug) ? 'active' : ''}`}
            >
              {m.title}
            </Link>
          ))}
        </nav>

        {/* Right CTA Column */}
        <div className="navbar-cta-box">
          <Link href={getLinkHref(ctaLink.slug)} className="navbar-cta-link">
            {ctaLink.title}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`navbar-mobile ${isOpen ? 'open' : ''}`}>
        <nav className="navbar-mobile-nav">
          {menus.map((m) => (
            <Link
              key={m.slug}
              href={getLinkHref(m.slug)}
              className={`navbar-mobile-link ${isActive(m.slug) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {m.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
