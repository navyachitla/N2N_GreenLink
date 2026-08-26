import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { 
  ShieldAlert, Users, ShoppingBag, Recycle, Package, 
  MessageSquare, Calendar, Award, Clock, ArrowRight, Wrench, BookOpen 
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#059669', fontWeight: 600 }}>Loading Administrator Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        borderRadius: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldAlert size={28} color="#f59e0b" />
          <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>Administrator Control Console</h1>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Monitor user accounts, verify product listings, process waste requests, manage directory services, and publish learning content.
        </p>
      </div>

      {/* Primary Statistics Grid */}
      <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.25rem' }}>System Platform Overview</h2>
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users size={28} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Registered Users ({stats?.activeUsers} Active)</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={28} />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#d97706' }}>{stats?.pendingProducts || 0}</div>
            <div className="stat-label">Pending Product Approvals</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalProducts || 0}</div>
            <div className="stat-label">Total Products Listed</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Recycle size={28} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalWasteSubmissions || 0}</div>
            <div className="stat-label">Waste Requests ({stats?.pendingWasteRequests} Pending)</div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
            <Package size={28} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalOrders || 0}</div>
            <div className="stat-label">Marketplace Orders</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            <MessageSquare size={28} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalCommunityPosts || 0}</div>
            <div className="stat-label">Community Posts</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fdf2f8', color: '#be185d' }}>
            <Calendar size={28} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalEcoEvents || 0}</div>
            <div className="stat-label">Active Eco-Events</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
            <Award size={28} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalRewardPointsAwarded || 0}</div>
            <div className="stat-label">Eco-Points Awarded</div>
          </div>
        </div>
      </div>

      {/* Admin Shortcuts Grid */}
      <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.25rem' }}>Administrative Management Consoles</h2>
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock color="#d97706" /> Approve Pending Products
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Review seller submissions and approve or reject listings with reasons.
          </p>
          <Link to="/admin/products" className="btn btn-accent btn-sm" style={{ width: '100%' }}>
            Review Pending Products ({stats?.pendingProducts}) <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Recycle color="#059669" /> Process Waste Submissions
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Update waste collection status to COMPLETED and credit user reward points.
          </p>
          <Link to="/admin/waste" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            Manage Waste Submissions <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users color="#0284c7" /> Manage Registered Users
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            View member profiles and activate or deactivate user accounts.
          </p>
          <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            View User Directory <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid-3">
        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench color="#059669" /> Directory Services Console
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Add, update, or remove certified recycling hubs, composting sites, and repair centers.
          </p>
          <Link to="/admin/services" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Services Directory <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen color="#0284c7" /> Educational Guides Hub
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Publish sustainability articles, zero waste guides, and circular economy tutorials.
          </p>
          <Link to="/admin/learning" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Learning Articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar color="#be185d" /> Schedule Eco-Events
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Organize beach cleanups, tree plantation drives, and workshops with registration limits.
          </p>
          <Link to="/admin/events" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Eco-Events <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
