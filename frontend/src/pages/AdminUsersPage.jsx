import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { Users, UserCheck, UserX, Search, Shield } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminService.getAllUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle user status");
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Users size={32} /> User Management</h1>
          <p className="page-subtitle">View all registered GreenLink accounts, roles, reward points, and toggle activation status</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search users by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Email & Phone</th>
              <th style={{ padding: '1rem' }}>Roles</th>
              <th style={{ padding: '1rem' }}>Reward Points</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No users match criteria.</td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>@{u.username}</div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div>{u.email}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.phone || 'No phone'}</div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    {u.roles?.map(r => (
                      <span key={r} className="badge badge-approved" style={{ marginRight: '4px', fontSize: '0.7rem' }}>
                        {r.replace('ROLE_', '')}
                      </span>
                    ))}
                  </td>

                  <td style={{ padding: '1rem', fontWeight: 700, color: '#059669' }}>
                    {u.rewardPoints} PTS
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${u.active ? 'active' : 'inactive'}`}>
                      {u.active ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-primary'}`}
                    >
                      {u.active ? <UserX size={14} /> : <UserCheck size={14} />}
                      {u.active ? ' Deactivate' : ' Activate'}
                    </button>
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
