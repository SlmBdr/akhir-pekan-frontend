export default function HeroSection({ content }) {
  const { title, subtitle, buttonText, buttonLink, bgImage } = content || {};
  
  const bgStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

  return (
    <section className="hero-section-container" style={bgStyle}>

      {/* Large overlay title at the bottom */}
      <div className="hero-title-wrapper">
        {title && <h1 className="hero-giant-title">{title}</h1>}
      </div>
    </section>
  );
}
