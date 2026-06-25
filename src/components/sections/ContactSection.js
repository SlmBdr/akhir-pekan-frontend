'use client';
import { useState } from 'react';

export default function ContactSection({ content }) {
  const { title, text } = content || {};
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | 'submitting'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${apiUrl}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error', err);
      setStatus('error');
    }
  };

  return (
    <section className="form-section" id="contact-form">
      <div className="form-left-label">
        Contact
      </div>
      <div className="form-right-content">
        <h2 className="form-section-title">{title || 'Get In Touch'}</h2>
        {text && <p className="form-section-desc">{text}</p>}

        <div className="form-wrapper">
          {status === 'success' && (
            <div className="notification notification-success">
              Pesan Anda telah berhasil dikirim. Terima kasih telah menghubungi kami!
            </div>
          )}
          {status === 'error' && (
            <div className="notification notification-error">
              Gagal mengirim pesan. Silakan coba lagi nanti.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">Nama Lengkap</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">Alamat Email</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Pesan Anda</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                required
                disabled={status === 'submitting'}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'MENGIRIM...' : 'KIRIM PESAN'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
