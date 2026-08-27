import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('SIMULATED_ECO_PAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = getTotalAmount();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setError('');
    setLoading(true);

    const orderPayload = {
      shippingAddress,
      contactPhone,
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    try {
      await orderService.createOrder(orderPayload);
      clearCart();
      navigate('/my-orders?success=true');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', textAlign: 'center', paddingTop: '4rem' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <ShoppingCart size={54} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Discover recycled goods and handmade eco products in the marketplace.</p>
          <Link to="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><ShoppingCart size={32} /> Shopping Cart & Checkout</h1>
          <p className="page-subtitle">Review your eco-friendly items and complete checkout</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items List */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '1.25rem' }}>Selected Products</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.product.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <img
                  src={item.product.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'}
                  alt={item.product.name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px' }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>{item.product.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                    ₹{Number(item.product.price).toFixed(2)} each
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ padding: '0.25rem 0.6rem', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}>-</button>
                  <span style={{ padding: '0.25rem 0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ padding: '0.25rem 0.6rem', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}>+</button>
                </div>

                <div style={{ fontWeight: 800, minWidth: '70px', textAlign: 'right' }}>
                  ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                </div>

                <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0', fontSize: '1.2rem', fontWeight: 800 }}>
            <span>Subtotal</span>
            <span style={{ color: '#059669' }}>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Shipping Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '1.25rem' }}>Shipping & Checkout</h3>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label className="form-label">Shipping Address *</label>
              <textarea
                className="form-textarea"
                placeholder="Street address, city, state, zip"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 555-019-2834"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="SIMULATED_ECO_PAY">Simulated Eco Pay (Instant Confirmation)</option>
                <option value="CASH_ON_DELIVERY">Cash on Eco Delivery</option>
              </select>
            </div>

            <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#047857', marginBottom: '1.25rem' }}>
              🌱 Completing this purchase awards <strong>+15 Green Points</strong> to your account!
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing Order...' : `Place Order (₹${totalAmount.toFixed(2)})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
