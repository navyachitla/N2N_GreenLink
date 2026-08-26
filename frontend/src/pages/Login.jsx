import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, AlertCircle, Shield, User } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(usernameOrEmail, password);
      if (user.roles && user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userType) => {
    setError('');
    setLoading(true);
    let u = userType === 'admin' ? 'admin@greenlink.org' : 'user@greenlink.org';
    let p = userType === 'admin' ? 'Admin@123' : 'User@123';

    try {
      const user = await login(u, p);
      if (user.roles && user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Quick login failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px', paddingTop: '3rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#d1fae5', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Leaf size={32} color="#059669" />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#064e3b' }}>Welcome to GreenLink</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sign in to access your sustainable dashboard</p>
        </div>

        {searchParams.get('expired') && (
          <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> Session expired. Please log in again.
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter username or email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials Buttons */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed #cbd5e1' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Quick Demo Accounts
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('user')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center' }}
            >
              <User size={16} color="#059669" /> Test User
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('admin')}
              className="btn btn-accent btn-sm"
              style={{ justifyContent: 'center' }}
            >
              <Shield size={16} /> Test Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Register Now</Link>
        </div>
      </div>
    </div>
  );
};
