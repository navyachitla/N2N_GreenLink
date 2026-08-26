import React from 'react';
import { Leaf, Recycle, ShieldCheck, HeartHandshake, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <div style={{ background: '#d1fae5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#059669' }}>
          <Leaf size={36} />
        </div>
        <h1 className="page-title" style={{ justifyContent: 'center' }}>About GreenLink</h1>
        <p className="page-subtitle" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
          Building a unified digital ecosystem for circular economy, waste reduction, eco-commerce, and community action.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        <div className="card">
          <h2 style={{ color: '#064e3b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={24} color="#10b981" /> Our Core Mission
          </h2>
          <p style={{ color: '#475569', lineHeight: 1.7 }}>
            GreenLink addresses fragmented sustainability efforts by combining sustainable commerce, waste management, educational learning, carbon tracking, eco-rewards, and community engagement under one modern digital platform.
          </p>
          <p style={{ color: '#475569', lineHeight: 1.7, marginTop: '1rem' }}>
            Our goal is to lower the barrier for individuals to adopt zero-waste practices and support small-scale local sellers producing eco-friendly goods.
          </p>
        </div>

        <div className="card" id="circular">
          <h2 style={{ color: '#064e3b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Recycle size={24} color="#10b981" /> The Circular Economy Model
          </h2>
          <p style={{ color: '#475569', lineHeight: 1.7 }}>
            In traditional linear economies, materials are extracted, converted into goods, used, and discarded into landfills. GreenLink promotes the <strong>Circular Economy</strong>:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', color: '#475569', lineHeight: 1.8 }}>
            <li><strong>Reduce</strong> single-use plastic through zero-waste alternative products.</li>
            <li><strong>Upcycle & Reuse</strong> by giving second-hand items and handmade goods a marketplace.</li>
            <li><strong>Recycle & Exchange</strong> waste items through verified collection programs.</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ background: '#f8fafc', padding: '3rem 2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#064e3b', marginBottom: '2rem' }}>Platform Principles</h2>
        <div className="grid-3">
          <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={36} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Admin Verified Quality</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Every product listing is reviewed by administrators before being displayed publicly.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <HeartHandshake size={36} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Empowering Local Sellers</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Supporting small artisans crafting organic soaps, upcycled totes, and bamboo essentials.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Leaf size={36} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Gamified Eco-Rewards</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Earn points for calculating your carbon footprint, reading articles, and recycling waste.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
