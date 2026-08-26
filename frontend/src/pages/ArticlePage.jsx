import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { learningService } from '../services/api';
import { BookOpen, ArrowLeft, ExternalLink, Award, CheckCircle } from 'lucide-react';

export const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(false);

  useEffect(() => {
    learningService.getResourceById(id)
      .then(res => {
        setArticle(res.data);
        setPointsEarned(true);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#059669', fontWeight: 600 }}>Loading educational guide...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Article Not Found</h2>
        <Link to="/learning" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Learning Center</Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Guides
      </button>

      {pointsEarned && (
        <div style={{ background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="#059669" /> +10 Green Points awarded for reading this environmental guide!
        </div>
      )}

      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>{article.category}</span>
        <h1 style={{ fontSize: '2.25rem', color: '#0f172a', marginBottom: '1rem', lineHeight: 1.25 }}>{article.title}</h1>

        <p style={{ color: '#64748b', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '1.5rem', borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
          {article.description}
        </p>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem' }}
          />
        )}

        <div style={{ fontSize: '1.05rem', color: '#334155', lineHeight: '1.8', whitespace: 'pre-line' }}>
          {article.content}
        </div>

        {article.externalReference && (
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.5rem' }}>External Reference & Sources:</h4>
            <a href={article.externalReference} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              {article.externalReference} <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
