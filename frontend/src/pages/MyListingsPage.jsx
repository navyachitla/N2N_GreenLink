import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, PlusCircle, Trash2, AlertCircle, Bell, MapPin, Store, UserCheck, CheckCircle, Clock, User } from 'lucide-react';

export const MyListingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('MY_LISTINGS');
  const [myListings, setMyListings] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, orderRes, allRes] = await Promise.all([
        productService.getMyListings().catch(err => { console.error("getMyListings error:", err); return { data: [] }; }),
        orderService.getSellerOrders().catch(err => { console.error("getSellerOrders error:", err); return { data: [] }; }),
        productService.getApprovedProducts(null, '').catch(err => { console.error("getApprovedProducts error:", err); return { data: [] }; })
      ]);
      setMyListings(listRes.data || []);
      setSalesOrders(orderRes.data || []);
      setAllProducts(allRes.data || []);
    } catch (err) {
      console.error("fetchData error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product listing?")) {
      try {
        await productService.deleteProduct(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete product listing");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Store size={32} /> Seller Hub & Orders Console</h1>
          <p className="page-subtitle">Track listing verification status and receive notifications when customers buy your products</p>
        </div>
        <Link to="/sell-product" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Listing
        </Link>
      </div>

      {/* User Account Context Banner */}
      {user && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.9rem', color: '#047857' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="#059669" />
            <span>Logged in as: <strong>{user.fullName}</strong> (@{user.username})</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#065f46' }}>
            {myListings.length} product(s) created by your account
          </span>
        </div>
      )}

      {/* Customer Sales Orders Notification Section */}
      <div className="card" style={{ marginBottom: '2.5rem', border: salesOrders.length > 0 ? '2px solid #10b981' : '1px solid #e2e8f0', background: salesOrders.length > 0 ? '#f0fdf4' : '#ffffff' }}>
        <h3 style={{ fontSize: '1.2rem', color: salesOrders.length > 0 ? '#065f46' : '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} color={salesOrders.length > 0 ? '#059669' : '#64748b'} /> Customer Sales Orders Received ({salesOrders.length})
        </h3>

        {salesOrders.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            No customer orders received yet. When users purchase products listed by you, their shipping details and order items will appear here instantly!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {salesOrders.map(order => (
              <div key={order.id} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Order #{order.id} — Customer: {order.userName}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '8px' }}>({new Date(order.createdAt).toLocaleDateString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem' }}>₹{Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                      <span>• <strong>{item.productName}</strong> (Qty: {item.quantity})</span>
                      <span style={{ fontWeight: 600 }}>₹{Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} color="#059669" /> <strong>Ship To:</strong> {order.shippingAddress} (Phone: {order.contactPhone})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('MY_LISTINGS')}
            className={`btn ${activeTab === 'MY_LISTINGS' ? 'btn-primary' : 'btn-secondary'}`}
          >
            My Listed Products ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('ALL_PRODUCTS')}
            className={`btn ${activeTab === 'ALL_PRODUCTS' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Marketplace Products ({allProducts.length})
          </button>
        </div>
      </div>

      {/* Product List View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading listings...</p>
        </div>
      ) : activeTab === 'MY_LISTINGS' ? (
        myListings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <ShoppingBag size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3>No Product Listings Created By Your Account Yet</h3>
            <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>List your handmade, recycled, or organic products to start selling!</p>
            <Link to="/sell-product" className="btn btn-primary">List Product Now</Link>
          </div>
        ) : (
          <div className="grid-3">
            {myListings.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.2rem' }}>₹{Number(item.price).toFixed(2)}</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{item.name}</h3>

                {item.status === 'PENDING' && (
                  <div style={{ background: '#fef3c7', border: '1px solid #fde047', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#854d0e', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} /> Pending Admin Verification before appearing on public Marketplace
                  </div>
                )}

                {item.status === 'REJECTED' && item.rejectionReason && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#991b1b', marginBottom: '0.75rem' }}>
                    <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> Reason: {item.rejectionReason}
                  </div>
                )}

                <p style={{ color: '#64748b', fontSize: '0.85rem', flex: 1, marginBottom: '1rem' }}>
                  Category: {item.categoryName} | Stock: {item.quantity}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                    <Trash2 size={16} /> Delete Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* All Marketplace Products View */
        <div className="grid-3">
          {allProducts.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'}
                alt={item.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.2rem' }}>₹{Number(item.price).toFixed(2)}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{item.name}</h3>

              <div style={{ fontSize: '0.85rem', color: '#475569', flex: 1, marginBottom: '0.75rem' }}>
                <div>Seller: <strong>{item.sellerName}</strong></div>
                <div>Category: {item.categoryName} | Stock: {item.quantity}</div>
              </div>

              <Link to={`/products/${item.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
