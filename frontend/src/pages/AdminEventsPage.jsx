import React, { useEffect, useState } from 'react';
import { eventService } from '../services/api';
import { Calendar, PlusCircle, Trash2, MapPin, Users } from 'lucide-react';

export const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '09:00',
    location: '',
    capacity: 50,
    organizer: 'GreenLink Eco Team',
    imageUrl: '',
    status: 'UPCOMING'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    eventService.getAllEvents()
      .then(res => setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventService.createEvent({
        ...formData,
        capacity: Number(formData.capacity)
      });
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '09:00',
        location: '',
        capacity: 50,
        organizer: 'GreenLink Eco Team',
        imageUrl: '',
        status: 'UPCOMING'
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this eco event?")) {
      try {
        await eventService.deleteEvent(id);
        fetchEvents();
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Calendar size={32} /> Manage Eco-Events & Workshops</h1>
          <p className="page-subtitle">Schedule cleanups, tree planting drives, and zero-waste workshops</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Create New Event
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#064e3b', marginBottom: '1.25rem' }}>Create New Eco-Event</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input type="text" className="form-input" placeholder="e.g. Waterfront Beach Cleanup" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-input" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input type="time" className="form-input" value={formData.eventTime} onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" className="form-input" placeholder="Pier 1 Park" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Capacity (Max Seats) *</label>
                  <input type="number" min="1" className="form-input" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Organizer</label>
                <input type="text" className="form-input" placeholder="GreenLink Eco Team" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" placeholder="Event details and guidelines..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input type="url" className="form-input" placeholder="https://images.unsplash.com/..." value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading eco-events...</p>
        </div>
      ) : (
        <div className="grid-2">
          {events.map(event => (
            <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-approved">{event.status}</span>
                <button onClick={() => handleDelete(event.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.35rem' }}>{event.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', flex: 1, marginBottom: '0.75rem' }}>{event.description}</p>
              <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> {new Date(event.eventDate).toLocaleDateString()} • <Users size={14} style={{ display: 'inline', margin: '0 4px' }} /> {event.registeredCount} / {event.capacity} seats
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
