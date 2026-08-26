import React, { useEffect, useState } from 'react';
import { learningService } from '../services/api';
import { BookOpen, PlusCircle, Trash2, ExternalLink } from 'lucide-react';

export const AdminLearningPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Circular Economy',
    imageUrl: '',
    externalReference: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    setLoading(true);
    learningService.getAllResources(null, '')
      .then(res => setResources(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await learningService.createResource(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        content: '',
        category: 'Circular Economy',
        imageUrl: '',
        externalReference: ''
      });
      fetchResources();
    } catch (err) {
      alert("Failed to publish educational article");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this educational article?")) {
      try {
        await learningService.deleteResource(id);
        fetchResources();
      } catch (err) {
        alert("Failed to delete article");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><BookOpen size={32} /> Manage Learning Resources</h1>
          <p className="page-subtitle">Publish educational guides, zero-waste tutorials, and sustainability articles</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Publish New Article
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#064e3b', marginBottom: '1.25rem' }}>Publish Educational Article</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input type="text" className="form-input" placeholder="e.g. Master Guide to Home Composting" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Circular Economy">Circular Economy</option>
                  <option value="Zero Waste Living">Zero Waste Living</option>
                  <option value="Organic Composting">Organic Composting</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Climate Action">Climate Action</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary / Teaser *</label>
                <textarea className="form-textarea" placeholder="Brief summary displayed on card list..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={2} />
              </div>

              <div className="form-group">
                <label className="form-label">Full Article Content *</label>
                <textarea className="form-textarea" placeholder="Complete article content..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={6} />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input type="url" className="form-input" placeholder="https://images.unsplash.com/..." value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">External Reference URL</label>
                <input type="url" className="form-input" placeholder="https://epa.gov/composting" value={formData.externalReference} onChange={(e) => setFormData({ ...formData, externalReference: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Guide</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading educational resources...</p>
        </div>
      ) : (
        <div className="grid-2">
          {resources.map(article => (
            <div key={article.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-approved">{article.category}</span>
                <button onClick={() => handleDelete(article.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.35rem' }}>{article.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', flex: 1, marginBottom: '0.75rem' }}>{article.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
