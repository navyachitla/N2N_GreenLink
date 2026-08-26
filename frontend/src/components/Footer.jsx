import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Leaf size={24} color="#10b981" />
            <h3 style={{ margin: 0, color: '#ffffff' }}>GreenLink</h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            A unified digital ecosystem encouraging circular economy practices, sustainable product commerce, recycling drives, environmental learning, and carbon tracking.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Ecosystem</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/marketplace" style={{ color: '#94a3b8' }}>Sustainable Marketplace</Link></li>
            <li><Link to="/recycling" style={{ color: '#94a3b8' }}>Waste & Recycling Hub</Link></li>
            <li><Link to="/services" style={{ color: '#94a3b8' }}>Green Services Directory</Link></li>
            <li><Link to="/carbon" style={{ color: '#94a3b8' }}>Carbon Footprint Calculator</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Community & Learning</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/learning" style={{ color: '#94a3b8' }}>Education & Articles</Link></li>
            <li><Link to="/community" style={{ color: '#94a3b8' }}>Eco Discussions Forum</Link></li>
            <li><Link to="/events" style={{ color: '#94a3b8' }}>Eco-Events & Workshops</Link></li>
            <li><Link to="/rewards" style={{ color: '#94a3b8' }}>Eco Reward System</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>About GreenLink</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/about" style={{ color: '#94a3b8' }}>Our Mission</Link></li>
            <li><Link to="/about#circular" style={{ color: '#94a3b8' }}>Circular Economy</Link></li>
            <li><Link to="/register" style={{ color: '#94a3b8' }}>Join the Platform</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          Made with <Heart size={16} color="#ef4444" fill="#ef4444" /> for a greener planet. &copy; 2026 GreenLink Ecosystem. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
