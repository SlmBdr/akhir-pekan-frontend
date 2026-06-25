'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layout,
  FileText,
  Inbox,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  ArrowUp,
  ArrowDown,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
  const [pendingPageUploads, setPendingPageUploads] = useState({}); // { [secId]: File }
  const [pendingArticleFile, setPendingArticleFile] = useState(null); // File

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' | 'articles' | 'submissions' | 'footer'

  // --- TAB: FOOTER BUILDER ---
  const [footerForm, setFooterForm] = useState({
    bigText: '',
    tagline: '',
    subtagline: '',
    copyrightText: '',
    creditText: ''
  });

  // Global State Loader
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getHeaders = (hasBody = true) => {
    const token = localStorage.getItem('adminToken');
    const headers = {};
    if (hasBody) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // --- TAB: PAGES (PAGE BUILDER) ---
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [editingSections, setEditingSections] = useState([]);

  // --- TAB: ARTICLES ---
  const [articles, setArticles] = useState([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [articleEditId, setArticleEditId] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'news',
    summary: '',
    content: '',
    thumbnailUrl: '',
    eventDate: '',
    eventLocation: '',
    ticketLink: ''
  });

  // --- TAB: SUBMISSIONS ---
  const [submissions, setSubmissions] = useState([]);
  const [submissionFilter, setSubmissionFilter] = useState('all');

  // Check Auth on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/auth/me`, { 
          credentials: 'include',
          headers
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAdmin(data.admin);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Auth check error', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch Page-specific or Article-specific or Submission-specific data
  useEffect(() => {
    if (!admin) return;

    if (activeTab === 'pages') {
      fetchPages();
    } else if (activeTab === 'articles') {
      fetchArticles();
    } else if (activeTab === 'submissions') {
      fetchSubmissions();
    } else if (activeTab === 'footer') {
      fetchFooter();
    }
  }, [admin, activeTab, refreshTrigger]);

  // --- API FETCH METHODS ---
  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pages`, { 
        credentials: 'include',
        headers: getHeaders(false)
      });
      const data = await res.json();
      setPages(data);
      if (data.length > 0 && !selectedPage) {
        handleSelectPage(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch pages', err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/articles`);
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const url = submissionFilter === 'all'
        ? `${API_URL}/api/submissions`
        : `${API_URL}/api/submissions?type=${submissionFilter}`;
      const res = await fetch(url, { 
        credentials: 'include',
        headers: getHeaders(false)
      });
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    }
  };

  const fetchFooter = async () => {
    try {
      const res = await fetch(`${API_URL}/api/footer`);
      const data = await res.json();
      if (data) {
        setFooterForm({
          bigText: data.bigText || '',
          tagline: data.tagline || '',
          subtagline: data.subtagline || '',
          copyrightText: data.copyrightText || '',
          creditText: data.creditText || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch footer data', err);
    }
  };

  const handleSaveFooter = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/footer`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(footerForm),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('Footer berhasil disimpan!', 'success');
      } else {
        showNotification('Gagal menyimpan footer.', 'error');
      }
    } catch (err) {
      console.error('Save footer error', err);
      showNotification('Error saat menghubungi server.', 'error');
    }
  };

  const handleUploadImage = async (e, onUploadSuccess) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: getHeaders(false),
        body: formData,
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onUploadSuccess(data.url);
        showNotification('Gambar berhasil diunggah!', 'success');
      } else {
        showNotification(data.error || 'Gagal mengunggah gambar.', 'error');
      }
    } catch (err) {
      console.error('Image upload error', err);
      showNotification('Error saat mengunggah gambar.', 'error');
    }
  };

  // Re-fetch submissions when filter changes
  useEffect(() => {
    if (admin && activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [submissionFilter]);

  // --- LOGOUT ---
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${API_URL}/api/auth/logout`, { 
        method: 'POST', 
        credentials: 'include',
        headers
      });
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  // --- PAGE BUILDER LOGIC ---
  const handleSelectPage = (page) => {
    setSelectedPage(page);
    setEditingSections(JSON.parse(JSON.stringify(page.sections || [])));
  };

  const handleAddSection = (type) => {
    const defaultContents = {
      hero: { title: 'TEATER AKHIR PEKAN', subtitle: 'DI BAWAH CAHAYA REDUP', buttonText: 'LIHAT SHOW', buttonLink: '/our-show', bgImage: '' },
      'about-intro': { title: 'TENTANG KAMI', text: 'Tuliskan kutipan visual atau perkenalan teater di sini.' },
      'showcase-grid': { title: 'JADWAL PENTAS TERBARU', limit: 6 },
      'article-feed': { title: 'SOROTAN HARI INI', limit: 6 },
      'contact-form': { title: 'KONTAK TIM KAMI', text: 'Tuliskan petunjuk pengisian kontak form.' },
      'collab-form': { title: 'AJUKAN KOLABORASI', text: 'Deskripsikan tawaran kerja sama di sini.' }
    };

    const newSection = {
      id: 'sec-' + Date.now(),
      type,
      content: defaultContents[type] || {},
      order: editingSections.length + 1
    };

    setEditingSections([...editingSections, newSection]);
  };

  const handleUpdateSectionContent = (secId, field, value) => {
    const updated = editingSections.map((sec) => {
      if (sec.id === secId) {
        return {
          ...sec,
          content: {
            ...sec.content,
            [field]: value
          }
        };
      }
      return sec;
    });
    setEditingSections(updated);
  };

  const handleMoveSection = (index, direction) => {
    const sections = [...editingSections];
    if (direction === 'up' && index > 0) {
      const temp = sections[index];
      sections[index] = sections[index - 1];
      sections[index - 1] = temp;
    } else if (direction === 'down' && index < sections.length - 1) {
      const temp = sections[index];
      sections[index] = sections[index + 1];
      sections[index + 1] = temp;
    }
    
    // Re-index orders
    const ordered = sections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setEditingSections(ordered);
  };

  const handleDeleteSection = (secId) => {
    const filtered = editingSections.filter((sec) => sec.id !== secId);
    const ordered = filtered.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setEditingSections(ordered);
  };

  const handleSavePage = async () => {
    if (!selectedPage) return;

    // Clone sections to prevent mutating state directly during upload
    const sectionsToSave = JSON.parse(JSON.stringify(editingSections));

    // Upload any pending section background images to S3
    for (const sec of sectionsToSave) {
      const file = pendingPageUploads[sec.id];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: getHeaders(false),
            body: formData,
            credentials: 'include'
          });
          const data = await res.json();
          if (res.ok && data.success) {
            sec.content.bgImage = data.url;
          } else {
            showNotification(`Gagal mengunggah gambar untuk section ${sec.type}`, 'error');
            return;
          }
        } catch (err) {
          console.error('Section image upload error', err);
          showNotification('Error saat mengunggah gambar section.', 'error');
          return;
        }
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/pages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          id: selectedPage._id,
          title: selectedPage.title,
          slug: selectedPage.slug,
          menuId: selectedPage.menuId,
          sections: sectionsToSave
        }),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('Struktur halaman berhasil disimpan!', 'success');
        setPendingPageUploads({}); // Clear pending uploads
        setRefreshTrigger(prev => prev + 1);
      } else {
        showNotification('Gagal menyimpan halaman.', 'error');
      }
    } catch (err) {
      console.error('Failed to save page', err);
      showNotification('Error saat menghubungi server.', 'error');
    }
  };

  // --- ARTICLES LOGIC ---
  const handleSelectPageImage = (e, secId) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    handleUpdateSectionContent(secId, 'bgImage', previewUrl);
    setPendingPageUploads(prev => ({ ...prev, [secId]: file }));
  };

  const handleSelectArticleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setArticleForm(prev => ({ ...prev, thumbnailUrl: previewUrl }));
    setPendingArticleFile(file);
  };

  const handleOpenArticleCreate = () => {
    setArticleEditId(null);
    setPendingArticleFile(null);
    setArticleForm({
      title: '',
      category: 'news',
      summary: '',
      content: '',
      thumbnailUrl: '',
      eventDate: '',
      eventLocation: '',
      ticketLink: ''
    });
    setShowArticleForm(true);
  };

  const handleOpenArticleEdit = (art) => {
    setArticleEditId(art._id);
    setPendingArticleFile(null);
    setArticleForm({
      title: art.title,
      category: art.category,
      summary: art.summary,
      content: art.content,
      thumbnailUrl: art.thumbnailUrl || '',
      eventDate: art.metadata?.eventDate ? art.metadata.eventDate.split('T')[0] : '',
      eventLocation: art.metadata?.eventLocation || '',
      ticketLink: art.metadata?.ticketLink || ''
    });
    setShowArticleForm(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    let finalThumbnailUrl = articleForm.thumbnailUrl;

    if (pendingArticleFile) {
      try {
        const formData = new FormData();
        formData.append('file', pendingArticleFile);
        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: getHeaders(false),
          body: formData,
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          finalThumbnailUrl = data.url;
        } else {
          showNotification(data.error || 'Gagal mengunggah thumbnail.', 'error');
          return;
        }
      } catch (err) {
        console.error('Article image upload error', err);
        showNotification('Error saat mengunggah thumbnail.', 'error');
        return;
      }
    }

    try {
      const payload = {
        id: articleEditId,
        title: articleForm.title,
        category: articleForm.category,
        summary: articleForm.summary,
        content: articleForm.content,
        thumbnailUrl: finalThumbnailUrl,
        metadata: {
          eventDate: articleForm.eventDate || undefined,
          eventLocation: articleForm.eventLocation || undefined,
          ticketLink: articleForm.ticketLink || undefined
        }
      };

      const res = await fetch(`${API_URL}/api/articles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('Artikel berhasil disimpan!', 'success');
        setPendingArticleFile(null);
        setShowArticleForm(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        showNotification('Gagal menyimpan artikel.', 'error');
      }
    } catch (err) {
      console.error('Save article error', err);
      showNotification('Error saat menyimpan artikel.', 'error');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: getHeaders(false),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('Artikel berhasil dihapus!', 'success');
        setRefreshTrigger(prev => prev + 1);
      } else {
        const errText = await res.text();
        showNotification(`Gagal menghapus artikel: ${res.status}`, 'error');
      }
    } catch (err) {
      console.error('Delete article error', err);
      showNotification('Error saat menghubungi server.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#070708', color: 'var(--text-white)' }}>
        <h2>Memuat Panel Dashboard...</h2>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          TEATER AKHIR PEKAN
          <div style={{ fontSize: '0.65rem', color: 'var(--accent-gold)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
            ADMIN DASHBOARD
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab('pages')}
            className={`sidebar-link ${activeTab === 'pages' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <Layout size={18} />
            Page Builder
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`sidebar-link ${activeTab === 'articles' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <FileText size={18} />
            Articles (News & Shows)
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`sidebar-link ${activeTab === 'submissions' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <Inbox size={18} />
            Submissions
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`sidebar-link ${activeTab === 'footer' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <Settings size={18} />
            Footer Builder
          </button>
        </nav>

        <div className="sidebar-footer">
          <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Logged in as: <strong style={{ color: 'var(--text-white)' }}>{admin?.name}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--error-color)' }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="admin-content">
        
        {/* TAB 1: PAGE BUILDER */}
        {activeTab === 'pages' && (
          <div>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Page Builder</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>Susun layouts section dan kelola konten company profile</p>
              </div>
              <button onClick={handleSavePage} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Save size={16} /> Simpan Halaman
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.85rem', alignSelf: 'center', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>PILIH HALAMAN:</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {pages.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => handleSelectPage(p)}
                    className="btn"
                    style={{
                      padding: '0.4rem 1rem',
                      fontSize: '0.75rem',
                      border: '1px solid',
                      borderColor: selectedPage?._id === p._id ? 'var(--accent-gold)' : 'rgba(240, 240, 242, 0.1)',
                      backgroundColor: selectedPage?._id === p._id ? 'rgba(207, 168, 107, 0.1)' : 'transparent',
                      color: selectedPage?._id === p._id ? 'var(--accent-gold)' : 'var(--text-gray)'
                    }}
                  >
                    {p.title} ({p.slug === 'home' ? '/' : `/${p.slug}`})
                  </button>
                ))}
              </div>
            </div>

            {selectedPage && (
              <div className="pb-editor-grid">
                
                {/* TOOLBAR */}
                <div className="pb-sidebar">
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: '1rem', borderBottom: '1px solid rgba(207, 168, 107, 0.1)', paddingBottom: '0.5rem', letterSpacing: '0.1em' }}>
                    TAMBAH SECTION
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <button onClick={() => handleAddSection('hero')} className="btn btn-secondary" style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem' }}>
                      <Plus size={14} style={{ marginRight: '0.5rem' }} /> Hero Banner
                    </button>
                    <button onClick={() => handleAddSection('about-intro')} className="btn btn-secondary" style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem' }}>
                      <Plus size={14} style={{ marginRight: '0.5rem' }} /> About Typography
                    </button>
                    <button onClick={() => handleAddSection('showcase-grid')} className="btn btn-secondary" style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem' }}>
                      <Plus size={14} style={{ marginRight: '0.5rem' }} /> Showcase Grid (Shows)
                    </button>
                    <button onClick={() => handleAddSection('article-feed')} className="btn btn-secondary" style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem' }}>
                      <Plus size={14} style={{ marginRight: '0.5rem' }} /> Article Feed (News)
                    </button>
                    <button onClick={() => handleAddSection('contact-form')} className="btn btn-secondary" style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem' }}>
                      <Plus size={14} style={{ marginRight: '0.5rem' }} /> Contact Form
                    </button>
                    <button onClick={() => handleAddSection('collab-form')} className="btn btn-secondary" style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem' }}>
                      <Plus size={14} style={{ marginRight: '0.5rem' }} /> Collab Form
                    </button>
                  </div>
                </div>

                {/* CANVAS BUILDER */}
                <div className="pb-canvas">
                  {editingSections.length === 0 ? (
                    <div className="pb-empty-state">
                      Halaman ini kosong. Tambahkan sections untuk mulai merancang halaman!
                    </div>
                  ) : (
                    editingSections.map((sec, index) => (
                      <div key={sec.id || sec._id} className="pb-section-item">
                        <div className="pb-section-header">
                          <span className="pb-section-type">{sec.type} Section</span>
                          <div className="pb-section-controls">
                            <button onClick={() => handleMoveSection(index, 'up')} className="pb-section-btn" disabled={index === 0} title="Pindah Ke Atas">
                              <ArrowUp size={16} />
                            </button>
                            <button onClick={() => handleMoveSection(index, 'down')} className="pb-section-btn" disabled={index === editingSections.length - 1} title="Pindah Ke Bawah">
                              <ArrowDown size={16} />
                            </button>
                            <button onClick={() => handleDeleteSection(sec.id)} className="pb-section-btn pb-section-btn-delete" title="Hapus Section">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* SECTION FIELD CONFIGURATION PANEL */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          {sec.type === 'hero' && (
                            <>
                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Sub Title</label>
                                <input type="text" className="form-input" style={{ padding: '0.4rem' }} value={sec.content.subtitle || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'subtitle', e.target.value)} />
                              </div>
                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Main Title</label>
                                <input type="text" className="form-input" style={{ padding: '0.4rem' }} value={sec.content.title || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'title', e.target.value)} />
                              </div>
                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Button Text</label>
                                <input type="text" className="form-input" style={{ padding: '0.4rem' }} value={sec.content.buttonText || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'buttonText', e.target.value)} />
                              </div>
                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Button Link</label>
                                <input type="text" className="form-input" style={{ padding: '0.4rem' }} value={sec.content.buttonLink || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'buttonLink', e.target.value)} />
                              </div>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Background Image (URL or Upload)</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  <input type="text" className="form-input" style={{ padding: '0.4rem', flex: 1 }} value={sec.content.bgImage || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'bgImage', e.target.value)} placeholder="Tautan gambar atau unggah baru" />
                                  <label className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', cursor: 'pointer', margin: 0, whiteSpace: 'nowrap' }}>
                                    Pilih File
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleSelectPageImage(e, sec.id)} />
                                  </label>
                                </div>
                                {sec.content.bgImage && (
                                  <div style={{ marginTop: '0.5rem', width: '120px', height: '67px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <img src={sec.content.bgImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                )}
                              </div>
                            </>
                          )}

                          {sec.type === 'about-intro' && (
                            <>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Heading</label>
                                <input type="text" className="form-input" style={{ padding: '0.4rem' }} value={sec.content.title || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'title', e.target.value)} />
                              </div>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Teks Deskripsi</label>
                                <textarea rows="3" className="form-input" style={{ padding: '0.4rem', fontFamily: 'var(--font-sans)' }} value={sec.content.text || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'text', e.target.value)}></textarea>
                              </div>
                            </>
                          )}

                          {(sec.type === 'showcase-grid' || sec.type === 'article-feed') && (
                            <>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Judul Bagian</label>
                                <input type="text" className="form-input" style={{ padding: '0.4rem' }} value={sec.content.title || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'title', e.target.value)} />
                              </div>
                              <div style={{ padding: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.75rem', gridColumn: 'span 2' }}>
                                * Tampilan feed ini akan otomatis memuat konten artikel/show yang Anda upload di tab "Articles".
                              </div>
                            </>
                          )}

                          {(sec.type === 'contact-form' || sec.type === 'collab-form') && (
                            <>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Judul Formulir</label>
                                <input type="text" className="form-input" style={{ padding: '0.4rem' }} value={sec.content.title || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'title', e.target.value)} />
                              </div>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ fontSize: '0.65rem' }}>Teks Deskripsi</label>
                                <textarea rows="2" className="form-input" style={{ padding: '0.4rem', fontFamily: 'var(--font-sans)' }} value={sec.content.text || ''} onChange={(e) => handleUpdateSectionContent(sec.id, 'text', e.target.value)}></textarea>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARTICLES (NEWS & SHOWS) */}
        {activeTab === 'articles' && (
          <div>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Upload Articles</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>Keluarkan berita teater atau pertunjukan terbaru di sini</p>
              </div>
              {!showArticleForm && (
                <button onClick={handleOpenArticleCreate} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Plus size={16} /> Tambah Artikel
                </button>
              )}
            </div>

            {showArticleForm ? (
              <div className="admin-card">
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', marginBottom: '2rem' }}>
                  {articleEditId ? 'EDIT ARTIKEL' : 'UNGGAH ARTIKEL BARU'}
                </h3>
                
                <form onSubmit={handleSaveArticle}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Judul Artikel</label>
                      <input type="text" required className="form-input" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kategori / Menu</label>
                      <select className="form-select" value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}>
                        <option value="news">News (Halaman Berita)</option>
                        <option value="show">Our Show (Halaman Pentas / Pertunjukan)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Ringkasan / Rangkuman Singkat</label>
                    <input type="text" required className="form-input" value={articleForm.summary} onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })} placeholder="Kutipan singkat yang muncul di halaman feed grid" />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Gambar Thumbnail (URL atau Upload)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="text" className="form-input" style={{ flex: 1 }} value={articleForm.thumbnailUrl} onChange={(e) => setArticleForm({ ...articleForm, thumbnailUrl: e.target.value })} placeholder="https://images.unsplash.com/... atau pilih file baru" />
                      <label className="btn btn-secondary" style={{ padding: '0.6rem 1rem', cursor: 'pointer', margin: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                        Pilih File
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleSelectArticleImage(e)} />
                      </label>
                    </div>
                    {articleForm.thumbnailUrl && (
                      <div style={{ marginTop: '0.5rem', width: '160px', height: '90px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={articleForm.thumbnailUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  {/* SHOW-SPECIFIC METADATA FIELDS */}
                  {articleForm.category === 'show' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem', border: '1px solid rgba(207,168,107,0.1)', padding: '1.5rem', backgroundColor: 'rgba(20,20,23,0.3)' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Tanggal Pertunjukan</label>
                        <input type="date" className="form-input" value={articleForm.eventDate} onChange={(e) => setArticleForm({ ...articleForm, eventDate: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Lokasi Event</label>
                        <input type="text" className="form-input" value={articleForm.eventLocation} onChange={(e) => setArticleForm({ ...articleForm, eventLocation: e.target.value })} placeholder="e.g. Gedung Kesenian Jakarta" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Tautan Beli Tiket</label>
                        <input type="text" className="form-input" value={articleForm.ticketLink} onChange={(e) => setArticleForm({ ...articleForm, ticketLink: e.target.value })} placeholder="e.g. https://loket.com/..." />
                      </div>
                    </div>
                  )}

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">Konten Lengkap</label>
                    <textarea required rows="10" className="form-textarea" style={{ fontFamily: 'var(--font-sans)' }} value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} placeholder="Isi artikel secara mendetail..."></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary">Simpan Artikel</button>
                    <button type="button" onClick={() => setShowArticleForm(false)} className="btn btn-secondary">Batal</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="admin-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Tanggal Rilis</th>
                      <th>Detail Tambahan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                          Belum ada artikel yang diupload.
                        </td>
                      </tr>
                    ) : (
                      articles.map((art) => (
                        <tr key={art._id}>
                          <td>
                            <strong>{art.title}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>/{art.slug}</div>
                          </td>
                          <td>
                            <span className={`admin-badge admin-badge-${art.category}`}>
                              {art.category === 'show' ? 'Pertunjukan' : 'Berita'}
                            </span>
                          </td>
                          <td>
                            {new Date(art.publishedAt || art.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td>
                            {art.category === 'show' ? (
                              <div style={{ fontSize: '0.8rem' }}>
                                <div>📅 {art.metadata?.eventDate ? art.metadata.eventDate.split('T')[0] : '-'}</div>
                                <div>📍 {art.metadata?.eventLocation || '-'}</div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>-</span>
                            )}
                          </td>
                          <td>
                            <button onClick={() => handleOpenArticleEdit(art)} className="admin-btn-action" title="Edit">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteArticle(art._id)} className="admin-btn-action admin-btn-delete" title="Hapus">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Form Submissions</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>Lihat kiriman pesan kontak atau proposal kolaborasi teater</p>
              </div>

              {/* FILTERS */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setSubmissionFilter('all')} className={`btn ${submissionFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                  Semua
                </button>
                <button onClick={() => setSubmissionFilter('contact')} className={`btn ${submissionFilter === 'contact' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                  Kontak
                </button>
                <button onClick={() => setSubmissionFilter('collab')} className={`btn ${submissionFilter === 'collab' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                  Kolaborasi
                </button>
              </div>
            </div>

            <div className="admin-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Waktu Masuk</th>
                    <th>Tipe</th>
                    <th>Identitas Pengirim</th>
                    <th>Isi Pesan / Proposal</th>
                    <th>Detail Khusus</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        Tidak ditemukan pengajuan / pesan.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub._id}>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                          {new Date(sub.createdAt).toLocaleString('id-ID')}
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge-${sub.type === 'collab' ? 'show' : 'news'}`}>
                            {sub.type === 'collab' ? 'Kolaborasi' : 'Kontak'}
                          </span>
                        </td>
                        <td>
                          <strong>{sub.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{sub.email}</div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '400px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                            {sub.message}
                          </div>
                        </td>
                        <td>
                          {sub.type === 'collab' ? (
                            <div style={{ fontSize: '0.8rem' }}>
                              <div>📞 {sub.metadata?.phone || '-'}</div>
                              <div>🏢 Org: {sub.metadata?.organization || 'Individu'}</div>
                              <div>🤝 Jenis: <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 600 }}>{sub.metadata?.collabType || '-'}</span></div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FOOTER BUILDER */}
        {activeTab === 'footer' && (
          <div>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Footer Builder</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>Kelola teks logo, tagline, subtagline, copyright, dan credits di kaki halaman web</p>
              </div>
            </div>

            <div className="admin-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', marginBottom: '2rem' }}>
                PENGATURAN KONTEN FOOTER
              </h3>
              
              <form onSubmit={handleSaveFooter}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Main Logo / Big Text</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={footerForm.bigText}
                      onChange={(e) => setFooterForm({ ...footerForm, bigText: e.target.value })}
                      placeholder="e.g. TEATER AKHIR PEKAN"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tagline Utama</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={footerForm.tagline}
                      onChange={(e) => setFooterForm({ ...footerForm, tagline: e.target.value })}
                      placeholder="e.g. Di mana Sinema Bertemu Panggung Teater."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subtagline Deskripsi</label>
                    <textarea
                      required
                      rows="3"
                      className="form-textarea"
                      style={{ fontFamily: 'var(--font-sans)' }}
                      value={footerForm.subtagline}
                      onChange={(e) => setFooterForm({ ...footerForm, subtagline: e.target.value })}
                      placeholder="Tulis deskripsi detail kolektif seni pertunjukan..."
                    ></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Copyright Text</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={footerForm.copyrightText}
                        onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                        placeholder="e.g. © 2026 Teater Akhir Pekan. All rights reserved."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Credit Text / Designed By</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={footerForm.creditText}
                        onChange={(e) => setFooterForm({ ...footerForm, creditText: e.target.value })}
                        placeholder="e.g. Designed & Developed by Teater Akhir Pekan"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Save size={16} /> Simpan Footer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Sleek Toast Notification Overlay */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
