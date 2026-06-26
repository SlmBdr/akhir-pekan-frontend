'use client';
import Link from 'next/link';

export default function CustomContentSection({ content }) {
  const {
    title,
    subtitle,
    text,
    image,
    imagePosition = 'left',
    bgImage,
    bgColor = '#070708',
    buttonText,
    buttonLink
  } = content || {};

  const sectionStyle = {
    padding: '6rem 2rem',
    backgroundColor: bgColor,
    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const isLeft = imagePosition === 'left';

  return (
    <section style={sectionStyle}>
      {/* Background Overlay (glassmorphic dark layer if bgImage is present) */}
      {bgImage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(7, 7, 8, 0.85)',
          zIndex: 1
        }}></div>
      )}

      <div style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: image ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
        gap: '4rem',
        alignItems: 'center'
      }}>
        {/* Render Image Column (if present and positioned Left) */}
        {image && isLeft && (
          <div className="custom-media-wrapper">
            <img 
              src={image} 
              alt={title || 'Media'} 
              style={{
                width: '100%',
                maxHeight: '450px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
              }}
            />
          </div>
        )}

        {/* Text Area Content Column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {subtitle && (
            <span style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-gold)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}>
              {subtitle}
            </span>
          )}

          {title && (
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: 'var(--text-white)',
              lineHeight: '1.2',
              marginBottom: '2rem'
            }}>
              {title}
            </h2>
          )}

          {text && (
            <div 
              style={{
                color: 'var(--text-gray)',
                fontSize: '1.05rem',
                lineHeight: '1.8',
                marginBottom: buttonText && buttonLink ? '2.5rem' : 0
              }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}

          {buttonText && buttonLink && (
            <div>
              <Link 
                href={buttonLink} 
                className="btn btn-primary"
                style={{
                  display: 'inline-block',
                  padding: '0.8rem 2rem',
                  fontSize: '0.8rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              >
                {buttonText} &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Render Image Column (if present and positioned Right) */}
        {image && !isLeft && (
          <div className="custom-media-wrapper">
            <img 
              src={image} 
              alt={title || 'Media'} 
              style={{
                width: '100%',
                maxHeight: '450px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
