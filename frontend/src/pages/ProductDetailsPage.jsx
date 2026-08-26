import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Leaf, MapPin, ArrowLeft, Star, MessageSquare, Award, CheckCircle } from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const fetchProductAndReviews = async () => {
    setLoading(true);
    try {
      const [prodRes, revRes] = await Promise.all([
        productService.getProductById(id),
        productService.getReviews(id)
      ]);
      setProduct(prodRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      await productService.addReview(id, { rating: Number(rating), comment });
      setComment('');
      setReviewSuccess(true);
      fetchProductAndReviews();
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#059669', fontWeight: 600 }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Product Not Found</h2>
        <Link to="/marketplace" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="grid-2" style={{ gap: '2.5rem', alignItems: 'start', marginBottom: '3rem' }}>
        {/* Product Image */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
          />
        </div>

        {/* Product Info */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-approved">{product.categoryName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700 }}>
              <Star size={18} fill="#f59e0b" /> {product.averageRating || 5.0} ({reviews.length} reviews)
            </div>
          </div>

          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>{product.name}</h1>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', marginBottom: '1.25rem' }}>
            ${Number(product.price).toFixed(2)}
          </div>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #a7f3d0' }}>
            <div style={{ fontWeight: 700, color: '#065f46', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Leaf size={18} color="#059669" /> Eco-Impact & Sustainability
            </div>
            <div style={{ fontSize: '0.85rem', color: '#047857' }}>
              {product.sustainabilityInfo || '100% Recycled & Eco-Certified Materials'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            <div>Condition: <strong>{product.condition || 'New / Handmade'}</strong></div>
            <div>Seller: <strong>{product.sellerName}</strong></div>
            <div>Location: <MapPin size={14} style={{ display: 'inline' }} /> {product.location || 'Local Pickup Available'}</div>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={product.quantity === 0}
          >
            <ShoppingCart size={20} /> {added ? '✓ Added to Cart!' : product.quantity === 0 ? 'Out of Stock' : 'Add to Shopping Cart'}
          </button>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#064e3b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={22} /> Verified Eco Reviews ({reviews.length})
        </h3>

        {/* Review Form */}
        {user ? (
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.75rem' }}>Write a Review (+10 Green Points)</h4>

            {reviewSuccess && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} /> Review submitted! +10 Points added to your profile.
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Rating</label>
                <select className="form-select" style={{ width: '150px' }} value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="5">★★★★★ (5/5)</option>
                  <option value="4">★★★★☆ (4/5)</option>
                  <option value="3">★★★☆☆ (3/5)</option>
                  <option value="2">★★☆☆☆ (2/5)</option>
                  <option value="1">★☆☆☆☆ (1/5)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <textarea
                  className="form-textarea"
                  placeholder="Share your experience with this eco product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                {submittingReview ? 'Posting Review...' : 'Submit Review (+10 Points)'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#475569' }}>
            <Link to="/login" style={{ fontWeight: 600, color: '#059669' }}>Login</Link> to post an eco-review and earn +10 Green Points!
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p style={{ color: '#64748b' }}>No customer reviews yet. Be the first to leave a review!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(rev => (
              <div key={rev.id} style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{rev.userName}</div>
                  <div style={{ display: 'flex', color: '#f59e0b', fontSize: '0.9rem' }}>
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155' }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
