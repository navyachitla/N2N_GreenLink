import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, eventService, learningService } from '../services/api';
import { 
  Leaf, ShoppingBag, Recycle, Activity, Award, BookOpen, 
  Calendar, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    productService.getApprovedProducts()
      .then(res => setFeaturedProducts(res.data.slice(0, 3)))
      .catch(err => console.error(err));

    eventService.getAllEvents()
      .then(res => setUpcomingEvents(res.data.slice(0, 2)))
      .catch(err => console.error(err));

    learningService.getAllResources()
      .then(res => setArticles(res.data.slice(0, 2)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            backdropFilter: 'blur(4px)'
          }}>
            <Sparkles size={16} /> Empowering Circular Living & Zero Waste 2026
          </div>
          
          <h1 style={{ fontSize: '3.25rem', fontFamily: 'Outfit', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: '#ffffff' }}>
            Empowering Your Journey to <span style={{ color: '#6ee7b7' }}>Sustainable Living</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: '#a7f3d0', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            GreenLink unites eco-friendly commerce, waste recycling management, carbon tracking, educational guides, and community eco-events in one digital ecosystem.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/marketplace" className="btn btn-primary btn-lg" style={{ background: '#10b981', borderColor: '#10b981', color: '#ffffff' }}>
              <ShoppingBag size={20} /> Explore Marketplace
            </Link>
            <Link to="/recycling" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
              <Recycle size={20} /> Recycle Waste
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Overview */}
      <section className="page-container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#064e3b', marginBottom: '0.5rem' }}>One Platform for Environmental Action</h2>
          <p style={{ color: '#64748b' }}>Discover how GreenLink helps individuals and small sellers make a positive environmental impact every day.</p>
        </div>

        <div className="grid-4">
          <div className="card card-interactive" style={{ textAlign: 'center' }}>
            <div style={{ background: '#d1fae5', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#059669' }}>
              <ShoppingBag size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Eco Marketplace</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Buy and sell handmade, recycled, organic, and zero-waste verified products.</p>
            <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 600 }}>
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card card-interactive" style={{ textAlign: 'center' }}>
            <div style={{ background: '#fef3c7', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#d97706' }}>
              <Recycle size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Waste Management</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Upload waste items for recycling, donation, or exchange and earn eco-points.</p>
            <Link to="/recycling" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 600 }}>
              Submit Waste <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card card-interactive" style={{ textAlign: 'center' }}>
            <div style={{ background: '#e0f2fe', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#0284c7' }}>
              <Activity size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Carbon Calculator</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track energy, driving, and waste footprint with personalized reduction tips.</p>
            <Link to="/carbon" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 600 }}>
              Calculate Footprint <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card card-interactive" style={{ textAlign: 'center' }}>
            <div style={{ background: '#f3e8ff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#9333ea' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Reward System</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Earn points for every green action and unlock achievement badges.</p>
            <Link to="/rewards" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 600 }}>
              View Badges <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section style={{ backgroundColor: '#ffffff', padding: '4rem 1.5rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="page-container" style={{ padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', color: '#064e3b' }}>Featured Eco-Products</h2>
                <p style={{ color: '#64748b' }}>Curated sustainable items verified by platform administrators.</p>
              </div>
              <Link to="/marketplace" className="btn btn-secondary btn-sm">View All Products</Link>
            </div>

            <div className="grid-3">
              {featuredProducts.map(product => (
                <div key={product.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'} 
                    alt={product.name} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-approved">{product.categoryName || 'Eco Product'}</span>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.2rem' }}>₹{Number(product.price).toFixed(2)}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', flex: 1, marginBottom: '1rem' }}>
                    {product.description.substring(0, 90)}...
                  </p>
                  <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    View Product Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="page-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '24px', padding: '3.5rem 2rem' }}>
          <Leaf size={48} color="#059669" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '2.25rem', color: '#064e3b', marginBottom: '1rem' }}>Ready to Make a Difference?</h2>
          <p style={{ color: '#047857', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Join thousands of individuals and small businesses making sustainable living seamless and rewarding.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};
