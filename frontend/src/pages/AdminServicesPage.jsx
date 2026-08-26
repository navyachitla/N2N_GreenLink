import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/api';
import { Wrench, PlusCircle, Trash2, MapPin, Phone, Clock } from 'lucide-react';

export const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'E-Waste Collection',
    location: '',
    contactInfo: '',
    availability: 'Mon - Sat (9am - 6pm)',
    imageUrl: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    serviceService.getActiveServices(null, '')
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await serviceService.createService(formData);
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'E-Waste Collection',
        location: '',
        contactInfo: '',
        availability: 'Mon - Sat (9am - 6pm)',
        imageUrl: ''
      });
      fetchServices();
    } catch (err) {
      alert("Failed to create service entry");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sustainability service?")) {
      try {
        await serviceService.deleteService(id);
        fetchServices();
      } catch (err) {
        alert("Failed to delete service");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Wrench size={32} /> Manage Sustainability Services Directory</h1>
          <p className="page-subtitle">Add certified recycling centers, repair hubs, and eco services</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Add New Service
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#064e3b', marginBottom: '1.25rem' }}>Create Sustainability Service Entry</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input type="text" className="form-input" placeholder="e.g. EcoTech Certified E-Waste Recycling Hub" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="E-Waste Collection">E-Waste Collection</option>
                    <option value="Composting Hub">Composting Hub</option>
                    <option value="Bicycle & Appliance Repair">Bicycle & Appliance Repair</option>
                    <option value="Textile Recycling">Textile Recycling</option>
                    <option value="Solar & Clean Energy">Solar & Clean Energy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Availability / Hours</label>
                  <input type="text" className="form-input" placeholder="e.g. Mon - Sat (9am - 6pm)" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" placeholder="Detailed service description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Location / Address *</label>
                  <input type="text" className="form-input" placeholder="e.g. 104 Eco Way, Suite 2" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone / Email *</label>
                  <input type="text" className="form-input" placeholder="+1 555-019-2834" value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input type="url" className="form-input" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Service Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#059669', fontWeight: 600 }}>Loading services...</p>
        </div>
      ) : (
        <div className="grid-2">
          {services.map(service => (
            <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <img src={service.imageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'} alt={service.name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px' }} />
                <div style={{ flex: 1 }}>
                  <span className="badge badge-approved" style={{ marginBottom: '0.25rem' }}>{service.category}</span>
                  <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>{service.name}</h3>
                </div>
                <button onClick={() => handleDelete(service.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', height: 'fit-content' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', flex: 1, marginBottom: '0.75rem' }}>{service.description}</p>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> {service.location} • <Phone size={14} style={{ display: 'inline', margin: '0 4px' }} /> {service.contactInfo}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
