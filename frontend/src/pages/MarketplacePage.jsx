import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { ShoppingBag, Search, PlusCircle, Tag, MapPin, Star } from 'lucide-react';

export const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    productService.getApprovedProducts(selectedCategory, searchQuery)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><ShoppingBag size={32} /> Sustainable Marketplace</h1>
          <p className="page-subtitle">Buy and sell handmade, upcycled, recycled, and eco-friendly products</p>
        </div>
        <Link to="/sell-product" className="btn btn-primary">
          <PlusCircle size={18} /> Sell a Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search sustainable products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`btn btn-sm ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading approved products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <ShoppingBag size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#334155' }}>No products found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Try clearing your search filters or be the first to list a product!</p>
        </div>
      ) : (
        <div className="grid-3">
          {products.map(product => (
            <div key={product.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'}
                alt={product.name}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-approved">{product.categoryName || 'Eco Product'}</span>
                <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.3rem' }}>₹{Number(product.price).toFixed(2)}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', color: '#0f172a' }}>{product.name}</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Star size={14} fill="#f59e0b" /> {product.averageRating || 5.0} ({product.reviewCount || 1} reviews)
              </div>

              <p style={{ color: '#64748b', fontSize: '0.85rem', flex: 1, marginBottom: '1rem', lineHeight: '1.5' }}>
                {product.description.length > 90 ? `${product.description.substring(0, 90)}...` : product.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Tag size={14} /> Stock: {product.quantity}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={14} /> {product.location || 'Local Delivery'}
                </span>
              </div>

              <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                View & Buy
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
