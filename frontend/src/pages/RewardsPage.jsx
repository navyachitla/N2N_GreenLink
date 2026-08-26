import React, { useEffect, useState } from 'react';
import { rewardService } from '../services/api';
import { Award, ShieldCheck, CheckCircle2, Clock, Sparkles, Star } from 'lucide-react';

export const RewardsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rewardService.getMyRewards()
      .then(res => setSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#059669', fontWeight: 600 }}>Loading Eco-Rewards...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Award size={32} /> GreenLink Rewards & Badges</h1>
          <p className="page-subtitle">Earn reward points for performed eco-friendly actions and collect achievements</p>
        </div>
      </div>

      {/* Points Balance Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: '#ffffff',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        marginBottom: '2.5rem',
        borderRadius: '20px'
      }}>
        <Sparkles size={36} color="#fef08a" style={{ margin: '0 auto 0.75rem' }} />
        <span style={{ fontSize: '0.9rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          Your Green Eco-Point Balance
        </span>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff', margin: '0.25rem 0' }}>
          {summary?.totalPoints || 0} <span style={{ fontSize: '1.5rem', color: '#fef08a' }}>PTS</span>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#d1fae5', maxWidth: '600px', margin: '0 auto' }}>
          Points are automatically awarded by backend business logic when you recycle waste, list products, track your carbon footprint, read guides, or register for eco-events.
        </p>
      </div>

      {/* Badges Collection Gallery */}
      <h2 style={{ fontSize: '1.5rem', color: '#064e3b', marginBottom: '1.25rem' }}>Achievement Badges</h2>
      <div className="grid-4" style={{ marginBottom: '3rem' }}>
        {summary?.badges.map(badge => (
          <div key={badge.id} className="card" style={{
            textAlign: 'center',
            border: badge.earned ? '2px solid #10b981' : '1px solid #e2e8f0',
            background: badge.earned ? '#f0fdf4' : '#ffffff',
            opacity: badge.earned ? 1 : 0.7
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {badge.iconUrl || '🏆'}
            </div>

            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.35rem' }}>{badge.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.4' }}>
              {badge.description}
            </p>

            {badge.earned ? (
              <span className="badge badge-approved">
                <CheckCircle2 size={12} /> Earned ({new Date(badge.earnedAt).toLocaleDateString()})
              </span>
            ) : (
              <span className="badge badge-pending">
                Requires {badge.pointsRequired} Points
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Transaction History Log */}
      <h2 style={{ fontSize: '1.5rem', color: '#064e3b', marginBottom: '1.25rem' }}>Reward Activity Log</h2>
      <div className="card">
        {summary?.transactions.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '1.5rem' }}>No point activity recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {summary?.transactions.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{t.description}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Type: {t.activityType} • {new Date(t.timestamp).toLocaleString()}
                  </div>
                </div>

                <div style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem', background: '#d1fae5', padding: '0.3rem 0.75rem', borderRadius: '9999px' }}>
                  +{t.points} PTS
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
