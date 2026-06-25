import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
      </body>
    </html>
  );
}
