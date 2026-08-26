import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { User, Mail, Phone, MapPin, Key, Award, CheckCircle, AlertCircle } from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    try {
      await userService.updateProfile(profile);
      await refreshUser();
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    try {
      await userService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMsg({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.message || 'Current password incorrect', type: 'error' });
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title"><User size={32} /> My Account Profile</h1>
          <p className="page-subtitle">Manage personal information, shipping addresses, and security credentials</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Personal Details */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '1.25rem' }}>Personal Information</h3>

          {profileMsg.text && (
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              fontSize: '0.85rem', 
              marginBottom: '1rem',
              background: profileMsg.type === 'success' ? '#d1fae5' : '#fee2e2',
              color: profileMsg.type === 'success' ? '#065f46' : '#991b1b',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Username (Read-only)</label>
              <input type="text" className="form-input" value={user?.username || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Shipping & Contact Address</label>
              <textarea className="form-textarea" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={3} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '1.25rem' }}>Security & Password</h3>

          {passwordMsg.text && (
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              fontSize: '0.85rem', 
              marginBottom: '1rem',
              background: passwordMsg.type === 'success' ? '#d1fae5' : '#fee2e2',
              color: passwordMsg.type === 'success' ? '#065f46' : '#991b1b',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {passwordMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required minLength={6} />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', borderColor: '#10b981', color: '#059669' }}>
              Update Password
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#065f46', marginBottom: '0.25rem' }}>
              <Award size={18} /> Role & Privileges
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Assigned Role: <strong>{user?.roles?.join(', ')}</strong>. Note: Roles can only be modified by system administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
