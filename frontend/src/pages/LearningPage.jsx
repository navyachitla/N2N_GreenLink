import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { learningService } from '../services/api';
import { BookOpen, Search, ArrowRight, Award } from 'lucide-react';

export const LearningPage = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    learningService.getAllResources(null, searchQuery)
      .then(res => setResources(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><BookOpen size={32} /> Sustainability Learning Center</h1>
          <p className="page-subtitle">Educational guides on circular economy, zero waste, home composting, and renewable energy</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search educational articles by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading educational guides...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <BookOpen size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Educational Resources Found</h3>
        </div>
      ) : (
        <div className="grid-2">
          {resources.map(article => (
            <div key={article.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src={article.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'}
                alt={article.title}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-approved">{article.category}</span>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Award size={14} /> +10 Reward Points
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>{article.title}</h3>

              <p style={{ color: '#64748b', fontSize: '0.9rem', flex: 1, marginBottom: '1.25rem', lineHeight: '1.6' }}>
                {article.description}
              </p>

              <Link to={`/learning/${article.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Read Full Article <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
