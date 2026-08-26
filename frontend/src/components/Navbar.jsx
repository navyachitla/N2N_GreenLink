import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { 
  Leaf, ShoppingBag, Recycle, Wrench, BookOpen, Activity, 
  Award, MessageSquare, Calendar, User, LogOut, ShieldAlert,
  ShoppingCart, PlusCircle, LayoutDashboard, Bell, Store
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [sellerOrderCount, setSellerOrderCount] = useState(0);

  const cartCount = getItemCount();

  useEffect(() => {
    if (user) {
      orderService.getSellerOrders()
        .then(res => setSellerOrderCount(res.data.length))
        .catch(err => console.error(err));
    } else {
      setSellerOrderCount(0);
    }
  }, [user, location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo">
          <Leaf size={28} className="text-emerald-600" />
          <span>GreenLink</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/marketplace" className={`nav-link ${isActive('/marketplace')}`}>
            <ShoppingBag size={18} /> Marketplace
          </Link>
          <Link to="/recycling" className={`nav-link ${isActive('/recycling')}`}>
            <Recycle size={18} /> Recycling
          </Link>
          <Link to="/services" className={`nav-link ${isActive('/services')}`}>
            <Wrench size={18} /> Services
          </Link>
          <Link to="/learning" className={`nav-link ${isActive('/learning')}`}>
            <BookOpen size={18} /> Learn
          </Link>
          <Link to="/carbon" className={`nav-link ${isActive('/carbon')}`}>
            <Activity size={18} /> Carbon
          </Link>
          <Link to="/rewards" className={`nav-link ${isActive('/rewards')}`}>
            <Award size={18} /> Rewards
          </Link>
          <Link to="/community" className={`nav-link ${isActive('/community')}`}>
            <MessageSquare size={18} /> Community
          </Link>
          <Link to="/events" className={`nav-link ${isActive('/events')}`}>
            <Calendar size={18} /> Events
          </Link>
        </div>

        {/* Action Buttons & Profile */}
        <div className="nav-actions">
          <Link to="/cart" className="btn btn-secondary btn-sm" style={{ position: 'relative' }} title="Shopping Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="badge badge-approved" style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Seller Sales & Notifications Link */}
              <Link to="/my-listings" className="btn btn-secondary btn-sm" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.35rem' }} title="Seller Console & Orders">
                <Store size={16} />
                <span>My Seller Hub</span>
                {sellerOrderCount > 0 && (
                  <span className="badge badge-approved" style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '0.15rem 0.45rem', borderRadius: '9999px' }}>
                    <Bell size={12} style={{ display: 'inline', marginRight: '2px' }} /> {sellerOrderCount}
                  </span>
                )}
              </Link>

              <Link to="/sell-product" className="btn btn-primary btn-sm">
                <PlusCircle size={16} /> Sell Product
              </Link>

              {isAdmin ? (
                <Link to="/admin/dashboard" className="btn btn-accent btn-sm">
                  <ShieldAlert size={16} /> Admin
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn-secondary btn-sm">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
                <Link to="/profile" title="View Profile" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#047857' }}>
                  <User size={18} />
                  <span>{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout" style={{ padding: '0.4rem' }}>
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
