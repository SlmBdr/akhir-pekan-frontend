import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ShowGridSection from './sections/ShowGridSection';
import ArticleFeedSection from './sections/ArticleFeedSection';
import ContactSection from './sections/ContactSection';
import CollabSection from './sections/CollabSection';

const sectionComponents = {
  'hero': HeroSection,
  'about-intro': AboutSection,
  'showcase-grid': ShowGridSection,
  'article-feed': ArticleFeedSection,
  'contact-form': ContactSection,
  'collab-form': CollabSection,
};

export default function SectionRenderer({ sections }) {
  if (!Array.isArray(sections)) return null;
  
  return (
    <>
      {sections
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((sec) => {
          const Component = sectionComponents[sec.type];
          if (!Component) return null;
          return <Component key={sec.id || sec._id} content={sec.content} />;
        })}
    </>
  );
}
