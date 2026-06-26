export default function AboutSection({ content }) {
  const { title, text } = content || {};

  return (
    <section className="about-intro-section" id="about-intro">
      <div className="about-intro-label">
        {title || 'About Us'}
      </div>
      <div className="about-intro-content">
        {text && <div className="about-intro-text" dangerouslySetInnerHTML={{ __html: text }} />}
      </div>
    </section>
  );
}
