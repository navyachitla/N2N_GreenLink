import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { ShoppingBag, CheckCircle, Package, MapPin, Printer, FileText, Leaf, X } from 'lucide-react';

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  useEffect(() => {
    orderService.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Package size={32} /> My Order History</h1>
          <p className="page-subtitle">Track status and print receipts of eco-friendly products purchased from the marketplace</p>
        </div>
      </div>

      {searchParams.get('success') && (
        <div style={{ background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={24} color="#059669" />
          <div>
            <div style={{ fontWeight: 700 }}>Order Successfully Placed!</div>
            <div style={{ fontSize: '0.9rem' }}>+15 Green Reward points have been credited to your account.</div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', background: '#ffffff', position: 'relative' }}>
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            {/* Receipt Header */}
            <div style={{ borderBottom: '2px dashed #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '1.4rem', fontWeight: 800 }}>
                  <Leaf size={24} /> GreenLink Eco Receipt
                </div>
                <span className="badge badge-approved">PAID & VERIFIED</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                Invoice #: <strong>GL-INV-{selectedReceiptOrder.id}</strong> | Date: {new Date(selectedReceiptOrder.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Shipping Info */}
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '1.25rem' }}>
              <div><strong>Delivery Address:</strong> {selectedReceiptOrder.shippingAddress}</div>
              <div><strong>Contact Phone:</strong> {selectedReceiptOrder.contactPhone}</div>
              <div><strong>Payment Method:</strong> {selectedReceiptOrder.paymentMethod}</div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0' }}>Item</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedReceiptOrder.items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem 0', fontWeight: 600, color: '#0f172a' }}>{item.productName}</td>
                    <td style={{ padding: '0.6rem 0', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '0.6rem 0', textAlign: 'right' }}>${Number(item.pricePerUnit).toFixed(2)}</td>
                    <td style={{ padding: '0.6rem 0', textAlign: 'right', fontWeight: 700 }}>${Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Summary */}
            <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
              <span>Grand Total</span>
              <span style={{ color: '#059669' }}>${Number(selectedReceiptOrder.totalAmount).toFixed(2)}</span>
            </div>

            <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#065f46', textAlign: 'center', marginBottom: '1.5rem' }}>
              🌱 Thank you for choosing sustainable products! <strong>+15 Green Points</strong> awarded.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Printer size={16} /> Print Receipt
              </button>
              <button onClick={() => setSelectedReceiptOrder(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <ShoppingBag size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>You haven't placed any sustainable product orders yet.</p>
          <Link to="/marketplace" className="btn btn-primary">Visit Marketplace</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Order #{order.id}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#059669' }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                  <button onClick={() => setSelectedReceiptOrder(order)} className="btn btn-secondary btn-sm">
                    <FileText size={16} /> Receipt
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <img
                      src={item.productImageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'}
                      alt={item.productName}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Qty: {item.quantity} × ${Number(item.pricePerUnit).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      ${Number(item.subtotal).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} /> Shipping Address: {order.shippingAddress} ({order.contactPhone})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
