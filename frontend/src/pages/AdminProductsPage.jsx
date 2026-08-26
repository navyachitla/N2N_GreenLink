import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { ShoppingBag, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  const [rejectModalId, setRejectModalId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = () => {
    setLoading(true);
    const apiCall = activeTab === 'PENDING' ? adminService.getPendingProducts() : adminService.getAllProducts();
    apiCall
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveOrRejectProduct(id, 'APPROVED', null);
      fetchProducts();
    } catch (err) {
      alert("Failed to approve product");
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalId) return;

    try {
      await adminService.approveOrRejectProduct(rejectModalId, 'REJECTED', rejectionReason);
      setRejectModalId(null);
      setRejectionReason('');
      fetchProducts();
    } catch (err) {
      alert("Failed to reject product");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><ShoppingBag size={32} /> Admin Product Approval & Verification</h1>
          <p className="page-subtitle">Verify eco-credentials, review seller products, and approve or reject listings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`btn ${activeTab === 'PENDING' ? 'btn-accent' : 'btn-secondary'}`}
          >
            <Clock size={16} /> Pending Approvals ({activeTab === 'PENDING' ? products.length : ''})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`btn ${activeTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Products Catalogue
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#991b1b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} /> Reject Product Listing
            </h3>
            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label className="form-label">Rejection Reason for Seller</label>
                <textarea
                  className="form-textarea"
                  placeholder="Explain why this listing does not meet GreenLink eco-standards..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setRejectModalId(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-danger">Confirm Rejection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 1rem' }} />
          <h3>No Pending Products for Review</h3>
          <p style={{ color: '#64748b' }}>All seller product submissions have been processed!</p>
        </div>
      ) : (
        <div className="grid-3">
          {products.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'}
                alt={item.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.2rem' }}>${Number(item.price).toFixed(2)}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{item.name}</h3>

              <p style={{ color: '#64748b', fontSize: '0.85rem', flex: 1, marginBottom: '0.75rem' }}>
                {item.description}
              </p>

              <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', marginBottom: '1rem' }}>
                <div>Seller: <strong>{item.sellerName}</strong></div>
                <div>Category: {item.categoryName}</div>
                {item.sustainabilityInfo && <div>Impact: {item.sustainabilityInfo}</div>}
              </div>

              {item.status === 'PENDING' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                  <button onClick={() => handleApprove(item.id)} className="btn btn-primary btn-sm">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => setRejectModalId(item.id)} className="btn btn-danger btn-sm">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
