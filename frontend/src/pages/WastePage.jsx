import React, { useEffect, useState } from 'react';
import { wasteService, uploadService } from '../services/api';
import { Recycle, Upload, CheckCircle, AlertCircle, Clock, Award } from 'lucide-react';

export const WastePage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    wasteType: '',
    description: '',
    imageUrl: '',
    quantity: '',
    location: '',
    preferredAction: 'RECYCLING'
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = () => {
    setLoading(true);
    wasteService.getMyWasteSubmissions()
      .then(res => setSubmissions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadFile(file);
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      console.error(err);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await wasteService.submitWaste(formData);
      setSuccess(true);
      setFormData({
        wasteType: '',
        description: '',
        imageUrl: '',
        quantity: '',
        location: '',
        preferredAction: 'RECYCLING'
      });
      fetchSubmissions();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit waste request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Recycle size={32} /> Waste Management & Recycling</h1>
          <p className="page-subtitle">Submit recyclable items, electronics, or clothes for recycling, donation, or exchange</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Submit Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '1.25rem' }}>Submit New Waste Request</h3>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> Waste request logged! (+15 Green Points awarded)
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Waste Type / Category *</label>
              <input type="text" className="form-input" placeholder="e.g. E-Waste, Batteries, Plastics, Cardboard, Clothes" value={formData.wasteType} onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Action *</label>
                <select className="form-select" value={formData.preferredAction} onChange={(e) => setFormData({ ...formData, preferredAction: e.target.value })}>
                  <option value="RECYCLING">Recycling Hub</option>
                  <option value="DONATION">Donation</option>
                  <option value="EXCHANGE">Exchange</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Quantity</label>
                <input type="text" className="form-input" placeholder="e.g. 5 kg, 2 bags, 10 items" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Item Description *</label>
              <textarea className="form-textarea" placeholder="Detail condition, brands, or specific disposal requirements..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label">Pickup Location</label>
              <input type="text" className="form-input" placeholder="Street address or drop-off point" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Item Image (Optional)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="waste-file-input" />
                <label htmlFor="waste-file-input" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Waste Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} />
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submitting}>
              {submitting ? 'Submitting Request...' : 'Submit Waste Request (+15 Points)'}
            </button>
          </form>
        </div>

        {/* User Submissions History */}
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '1.25rem' }}>My Waste Submission History</h3>

          {loading ? (
            <p style={{ color: '#059669' }}>Loading history...</p>
          ) : submissions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Recycle size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ color: '#64748b' }}>No waste requests submitted yet. Earn +50 points when completed by admin!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map(item => (
                <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{item.wasteType}</span>
                    <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>{item.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <span>Action: <strong>{item.preferredAction}</strong></span>
                    <span>Qty: {item.quantity || 'N/A'}</span>
                  </div>

                  {item.adminNotes && (
                    <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#ecfdf5', borderRadius: '6px', fontSize: '0.8rem', color: '#065f46' }}>
                      <strong>Admin Note:</strong> {item.adminNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
