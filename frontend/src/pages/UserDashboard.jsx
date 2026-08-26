import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService, wasteService, orderService, carbonService, rewardService, eventService } from '../services/api';
import { 
  User, Award, Activity, ShoppingBag, Recycle, Calendar, 
  PlusCircle, ArrowRight, ShieldCheck, CheckCircle2, Clock
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myListingsCount: 0,
    ordersCount: 0,
    wasteCount: 0,
    carbonFootprint: null,
    rewardPoints: 0,
    registeredEventsCount: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentWaste, setRecentWaste] = useState([]);
  const [recentBadges, setRecentBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [listingsRes, ordersRes, wasteRes, carbonRes, rewardsRes, eventsRes] = await Promise.all([
          productService.getMyListings(),
          orderService.getMyOrders(),
          wasteService.getMyWasteSubmissions(),
          carbonService.getLatestFootprint(),
          rewardService.getMyRewards(),
          eventService.getMyEvents()
        ]);

        setStats({
          myListingsCount: listingsRes.data.length,
          ordersCount: ordersRes.data.length,
          wasteCount: wasteRes.data.length,
          carbonFootprint: carbonRes.data ? carbonRes.data.totalFootprintKgCo2e : null,
          rewardPoints: rewardsRes.data.totalPoints,
          registeredEventsCount: eventsRes.data.length
        });

        setRecentOrders(ordersRes.data.slice(0, 3));
        setRecentWaste(wasteRes.data.slice(0, 3));
        setRecentBadges(rewardsRes.data.badges.filter(b => b.earned));
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#059669', fontWeight: 600 }}>Loading User Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
            Standard User Member
          </span>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '0.5rem' }}>
            Welcome back, {user?.fullName || user?.username}!
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '0.95rem' }}>
            Manage your sustainable product listings, waste requests, carbon tracking, and eco-rewards.
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1rem 1.5rem', borderRadius: '16px', backdropFilter: 'blur(4px)', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fef08a' }}>
            <Award size={24} />
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.rewardPoints}</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#ffffff', opacity: 0.9 }}>Green Points Earned</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <Activity size={28} />
          </div>
          <div>
            <div className="stat-value">
              {stats.carbonFootprint !== null ? `${stats.carbonFootprint} kg` : 'N/A'}
            </div>
            <div className="stat-label">Latest Carbon Score</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <div className="stat-value">{stats.myListingsCount}</div>
            <div className="stat-label">Listed Eco-Products</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Recycle size={28} />
          </div>
          <div>
            <div className="stat-value">{stats.wasteCount}</div>
            <div className="stat-label">Waste Requests</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Calendar size={28} />
          </div>
          <div>
            <div className="stat-value">{stats.registeredEventsCount}</div>
            <div className="stat-label">Registered Events</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <Link to="/sell-product" className="btn btn-primary">
          <PlusCircle size={18} /> List New Sustainable Product
        </Link>
        <Link to="/recycling" className="btn btn-secondary">
          <Recycle size={18} /> Submit Waste for Recycling
        </Link>
        <Link to="/carbon" className="btn btn-secondary">
          <Activity size={18} /> Recalculate Carbon Footprint
        </Link>
      </div>

      {/* Dashboard Lists */}
      <div className="grid-2">
        {/* Waste Submissions Status */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#064e3b' }}>Recent Waste Submissions</h3>
            <Link to="/recycling" style={{ fontSize: '0.85rem', fontWeight: 600 }}>View All</Link>
          </div>

          {recentWaste.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No waste submissions logged yet. Submit waste to earn +50 points!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentWaste.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.wasteType}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Action: {item.preferredAction}</div>
                  </div>
                  <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#064e3b' }}>Recent Purchases</h3>
            <Link to="/my-orders" style={{ fontSize: '0.85rem', fontWeight: 600 }}>View All</Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>You haven't placed any orders yet. Visit the Marketplace!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Order #{order.id}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total: ${Number(order.totalAmount).toFixed(2)}</div>
                  </div>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
