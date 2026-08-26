import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Users, CheckCircle2, Award } from 'lucide-react';

export const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleRegister = async (eventId) => {
    if (!user) {
      alert("Please login to register for events");
      return;
    }

    try {
      await eventService.registerForEvent(eventId);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Event registration failed");
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (window.confirm("Are you sure you want to cancel your event registration?")) {
      try {
        await eventService.cancelRegistration(eventId);
        fetchEvents();
      } catch (err) {
        alert("Failed to cancel registration");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Calendar size={32} /> Eco-Events & Workshops</h1>
          <p className="page-subtitle">Participate in beach cleanups, tree planting drives, and zero-waste workshops</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading eco-events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Upcoming Eco-Events</h3>
          <p style={{ color: '#64748b' }}>Check back soon for new community activities!</p>
        </div>
      ) : (
        <div className="grid-2">
          {events.map(event => {
            const isFull = event.registeredCount >= event.capacity;
            return (
              <div key={event.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                <img
                  src={event.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'}
                  alt={event.title}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-approved">{event.status}</span>
                  <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Award size={14} /> +20 Reward Points
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>{event.title}</h3>

                <p style={{ color: '#64748b', fontSize: '0.9rem', flex: 1, marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  {event.description}
                </p>

                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={16} color="#059669" /> Date: {new Date(event.eventDate).toLocaleDateString()} {event.eventTime ? `at ${event.eventTime}` : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={16} color="#059669" /> Location: {event.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Users size={16} color="#059669" /> Registered: <strong>{event.registeredCount} / {event.capacity} seats</strong>
                  </div>
                </div>

                {/* Event Action Button */}
                {event.registered ? (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, background: '#d1fae5', color: '#065f46', borderColor: '#10b981' }} disabled>
                      <CheckCircle2 size={16} /> Registered
                    </button>
                    <button onClick={() => handleCancelRegistration(event.id)} className="btn btn-danger btn-sm">
                      Cancel
                    </button>
                  </div>
                ) : isFull ? (
                  <button className="btn btn-secondary" style={{ width: '100%', cursor: 'not-allowed', color: '#94a3b8' }} disabled>
                    Capacity Full
                  </button>
                ) : (
                  <button onClick={() => handleRegister(event.id)} className="btn btn-primary" style={{ width: '100%' }}>
                    Register for Event (+20 Points)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
