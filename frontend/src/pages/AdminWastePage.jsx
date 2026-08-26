import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { Recycle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const AdminWastePage = () => {
  const [wasteList, setWasteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('ACCEPTED');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchWaste();
  }, []);

  const fetchWaste = () => {
    setLoading(true);
    adminService.getAllWaste()
      .then(res => setWasteList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id) => {
    try {
      await adminService.updateWasteStatus(id, status, adminNotes);
      setEditingId(null);
      setAdminNotes('');
      fetchWaste();
    } catch (err) {
      alert("Failed to update waste request status");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Recycle size={32} /> Admin Waste Processing Console</h1>
          <p className="page-subtitle">Review waste recycling & donation requests, assign status, and credit completion rewards</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '1rem' }}>User / Member</th>
              <th style={{ padding: '1rem' }}>Waste Type & Details</th>
              <th style={{ padding: '1rem' }}>Action & Qty</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Process Request</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading waste requests...</td></tr>
            ) : wasteList.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No waste requests logged.</td></tr>
            ) : (
              wasteList.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.userName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Submitted {new Date(item.createdAt).toLocaleDateString()}</div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#059669' }}>{item.wasteType}</div>
                    <div style={{ fontSize: '0.85rem', color: '#475569' }}>{item.description}</div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div><strong>{item.preferredAction}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity || 'N/A'}</div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {editingId === item.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <select className="form-select" style={{ fontSize: '0.8rem', padding: '0.3rem' }} value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="COMPLETED">COMPLETED (+50 PTS)</option>
                        </select>

                        <input
                          type="text"
                          className="form-input"
                          style={{ fontSize: '0.8rem', padding: '0.3rem', width: '180px' }}
                          placeholder="Admin Notes..."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                        />

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button onClick={() => handleUpdateStatus(item.id)} className="btn btn-primary btn-sm">Save</button>
                          <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(item.id); setStatus(item.status); setAdminNotes(item.adminNotes || ''); }}
                        className="btn btn-secondary btn-sm"
                      >
                        Update Status
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
