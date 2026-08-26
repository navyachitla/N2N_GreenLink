import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/api';
import { Wrench, Search, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    serviceService.getActiveServices(null, searchQuery)
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Wrench size={32} /> Sustainability Services Directory</h1>
          <p className="page-subtitle">Discover certified e-waste centers, organic composting hubs, bicycle repair shops, and eco-services</p>
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
            placeholder="Search services by name, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading sustainability services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Wrench size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Services Found</h3>
          <p style={{ color: '#64748b' }}>Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid-2">
          {services.map(service => (
            <div key={service.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem' }}>
                <img
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'}
                  alt={service.name}
                  style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '12px' }}
                />
                <div>
                  <span className="badge badge-approved" style={{ marginBottom: '0.35rem' }}>{service.category}</span>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{service.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <Clock size={14} /> {service.availability || 'Available Daily'}
                  </div>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', flex: 1, marginBottom: '1rem', lineHeight: '1.5' }}>
                {service.description}
              </p>

              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} color="#059669" /> {service.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={16} color="#059669" /> {service.contactInfo}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
