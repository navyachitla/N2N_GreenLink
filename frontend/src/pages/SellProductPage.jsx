import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, uploadService } from '../services/api';
import { PlusCircle, Upload, Leaf, AlertCircle, CheckCircle } from 'lucide-react';

export const SellProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    quantity: '1',
    imageUrl: '',
    sustainabilityInfo: '',
    condition: 'Handmade / New',
    location: ''
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    productService.getCategories()
      .then(res => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadFile(file);
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      console.error(err);
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await productService.createProduct({
        ...formData,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-listings');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit product listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title"><PlusCircle size={32} /> Create Product Listing</h1>
          <p className="page-subtitle">List your handmade, recycled, upcycled, or zero-waste product for GreenLink users</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> Listing submitted for Admin review! (+20 Green Points awarded)
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input type="text" className="form-input" placeholder="e.g. Upcycled Glass Plant Pot" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition</label>
              <input type="text" className="form-input" placeholder="e.g. Handmade / Upcycled" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" step="0.01" min="0.01" className="form-input" placeholder="250.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input type="number" min="1" className="form-input" placeholder="10" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Description *</label>
            <textarea className="form-textarea" placeholder="Describe the materials, craftsmanship, dimensions, and usage instructions..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} />
          </div>

          <div className="form-group">
            <label className="form-label">Sustainability & Eco-Impact Details</label>
            <input type="text" className="form-input" placeholder="e.g. Made from 100% recycled PET ocean plastic" value={formData.sustainabilityInfo} onChange={(e) => setFormData({ ...formData, sustainabilityInfo: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Location / Origin</label>
            <input type="text" className="form-input" placeholder="e.g. Portland, OR" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>

          {/* Image Upload Component */}
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="file-upload-input" />
              <label htmlFor="file-upload-input" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Image File'}
              </label>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>or enter image URL below</span>
            </div>
            <input type="url" className="form-input" style={{ marginTop: '0.5rem' }} placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
          </div>

          {formData.imageUrl && (
            <div style={{ marginBottom: '1.25rem' }}>
              <img src={formData.imageUrl} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting Product...' : 'Submit Listing for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
};
