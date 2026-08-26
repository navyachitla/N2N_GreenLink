import React from 'react';
import { Zap, Car, Fuel, Bus, Trash2 } from 'lucide-react';

export const CarbonChart = ({ footprintData }) => {
  if (!footprintData) return null;

  const elecCo2 = (footprintData.electricityUsageKwh || 0) * 0.85;
  const driveCo2 = (footprintData.transportationDistanceKm || 0) * 0.17;
  const fuelCo2 = (footprintData.fuelUsageLiters || 0) * 2.31;
  const transitCo2 = (footprintData.publicTransportKm || 0) * 0.05;
  const wasteCo2 = (footprintData.wasteGeneratedKg || 0) * 0.50;

  const total = Math.max(1, elecCo2 + driveCo2 + fuelCo2 + transitCo2 + wasteCo2);

  const categories = [
    { label: 'Electricity', val: elecCo2, color: '#f59e0b', icon: <Zap size={16} /> },
    { label: 'Driving', val: driveCo2, color: '#0284c7', icon: <Car size={16} /> },
    { label: 'Fuel', val: fuelCo2, color: '#ef4444', icon: <Fuel size={16} /> },
    { label: 'Public Transit', val: transitCo2, color: '#10b981', icon: <Bus size={16} /> },
    { label: 'Waste', val: wasteCo2, color: '#64748b', icon: <Trash2 size={16} /> }
  ];

  return (
    <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
      <h4 style={{ fontSize: '1.1rem', color: '#064e3b', marginBottom: '1rem' }}>
        Emission Breakdown Analysis
      </h4>

      {/* Visual Stacked Bar Chart */}
      <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid #cbd5e1' }}>
        {categories.map((cat, idx) => {
          const pct = ((cat.val / total) * 100).toFixed(1);
          if (cat.val <= 0) return null;
          return (
            <div
              key={idx}
              title={`${cat.label}: ${cat.val.toFixed(1)} kg CO2e (${pct}%)`}
              style={{
                width: `${pct}%`,
                backgroundColor: cat.color,
                transition: 'width 0.3s ease'
              }}
            />
          );
        })}
      </div>

      {/* Category Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
        {categories.map((cat, idx) => {
          const pct = ((cat.val / total) * 100).toFixed(1);
          return (
            <div key={idx} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: cat.color, fontWeight: 700, fontSize: '0.85rem' }}>
                {cat.icon} {cat.label}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
                {cat.val.toFixed(1)} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
