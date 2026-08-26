import React, { useEffect, useState } from 'react';
import { communityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ThumbsUp, MessageCircle, PlusCircle, User, Trash2, Send } from 'lucide-react';

export const CommunityPage = () => {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Sustainable Lifestyle' });
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = () => {
    setLoading(true);
    communityService.getAllPosts(selectedCategory)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await communityService.createPost(newPost);
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', category: 'Sustainable Lifestyle' });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await communityService.likePost(postId);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      await communityService.addComment(postId, { content: text });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await communityService.deletePost(postId);
        fetchPosts();
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><MessageSquare size={32} /> Community Discussions</h1>
          <p className="page-subtitle">Connect with eco-conscious members, share green tips, and ask questions</p>
        </div>
        {user && (
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <PlusCircle size={18} /> New Discussion Post
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['', 'Recycling', 'Sustainable Lifestyle', 'Green Technology', 'Eco Products', 'Climate', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat === '' ? 'All Topics' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#064e3b', marginBottom: '1.25rem' }}>Create Community Post</h3>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}>
                  <option value="Recycling">Recycling</option>
                  <option value="Sustainable Lifestyle">Sustainable Lifestyle</option>
                  <option value="Green Technology">Green Technology</option>
                  <option value="Eco Products">Eco Products</option>
                  <option value="Climate">Climate</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" className="form-input" placeholder="Discussion title..." value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Content *</label>
                <textarea className="form-textarea" placeholder="Share your experience or green ideas..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} required rows={4} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Post (+15 Points)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading community discussions...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <MessageSquare size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Discussions Yet</h3>
          <p style={{ color: '#64748b' }}>Be the first to start a conversation in this topic!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map(post => (
            <div key={post.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: '#d1fae5', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 700 }}>
                    {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{post.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-approved">{post.category}</span>
                  {(isAdmin || (user && user.id === post.userId)) && (
                    <button onClick={() => handleDeletePost(post.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>{post.title}</h3>
              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {post.content}
              </p>

              {/* Action Bar */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => handleLike(post.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem' }}>
                  <ThumbsUp size={16} color="#059669" /> {post.likesCount} Likes
                </button>

                <button onClick={() => toggleComments(post.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem' }}>
                  <MessageCircle size={16} color="#0284c7" /> {post.commentsCount} Comments
                </button>
              </div>

              {/* Expandable Comments Section */}
              {expandedComments[post.id] && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                  {/* Comments list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {post.comments?.map(c => (
                      <div key={c.id} style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, color: '#065f46' }}>{c.userName}</span>
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#334155' }}>{c.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment input */}
                  {user && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Write a comment (+5 points)..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      />
                      <button onClick={() => handleAddComment(post.id)} className="btn btn-primary btn-sm">
                        <Send size={16} /> Post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
