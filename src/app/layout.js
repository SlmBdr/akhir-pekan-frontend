import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata = {
  title: 'Teater Akhir Pekan | Di mana Sinema Bertemu Panggung Teater',
  description: 'Teater Akhir Pekan adalah kolektif seni pertunjukan modern yang memadukan keintiman panggung teater dengan estetika sinematik.',
  keywords: 'teater, seni pertunjukan, akhir pekan, sinema, drama, lakon, teater jakarta',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="platform-container">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
