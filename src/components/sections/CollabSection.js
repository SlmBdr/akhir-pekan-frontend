'use client';
import { useState } from 'react';

export default function CollabSection({ content }) {
  const { title, text } = content || {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    collabType: 'sponsor',
    message: ''
  });
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
          type: 'collab',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          metadata: {
            phone: formData.phone,
            organization: formData.organization,
            collabType: formData.collabType,
          }
        }),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          collabType: 'sponsor',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error', err);
      setStatus('error');
    }
  };

  return (
    <section className="form-section" id="collab-form">
      <div className="form-left-label">
        Collab
      </div>
      <div className="form-right-content">
        <h2 className="form-section-title">{title || 'Collaborate With Us'}</h2>
        {text && <p className="form-section-desc">{text}</p>}

        <div className="form-wrapper">
          {status === 'success' && (
            <div className="notification notification-success">
              Proposal kolaborasi Anda telah kami terima. Tim kami akan segera meninjau dan menghubungi Anda kembali!
            </div>
          )}
          {status === 'error' && (
            <div className="notification notification-error">
              Gagal mengirim proposal. Silakan periksa kembali data Anda dan coba lagi.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="collab-name">Nama Lengkap / Kontak Utama</label>
              <input
                type="text"
                id="collab-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="collab-email">Alamat Email</label>
              <input
                type="email"
                id="collab-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="collab-phone">Nomor Telepon / WhatsApp</label>
              <input
                type="tel"
                id="collab-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="collab-org">Nama Organisasi / Komunitas</label>
              <input
                type="text"
                id="collab-org"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="form-input"
                placeholder="Kosongkan jika individu"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="collab-type">Jenis Kolaborasi</label>
              <select
                id="collab-type"
                name="collabType"
                value={formData.collabType}
                onChange={handleChange}
                className="form-select"
                required
                disabled={status === 'submitting'}
              >
                <option value="sponsor">Sponsor / Donatur</option>
                <option value="media-partner">Media Partner</option>
                <option value="artist">Aktor / Sutradara / Seniman</option>
                <option value="crew">Kru Panggung / Produksi</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="collab-message">Deskripsi Singkat Rencana Kolaborasi</label>
              <textarea
                id="collab-message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Jelaskan bagaimana kita bisa bekerja sama..."
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
              {status === 'submitting' ? 'MENGIRIM...' : 'KIRIM PROPOSAL'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
