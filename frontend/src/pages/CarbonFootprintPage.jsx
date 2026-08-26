import React, { useEffect, useState } from 'react';
import { carbonService } from '../services/api';
import { CarbonChart } from '../components/CarbonChart';
import { Activity, Zap, Car, Fuel, Bus, Trash2, Award, CheckCircle2, AlertCircle } from 'lucide-react';

export const CarbonFootprintPage = () => {
  const [formData, setFormData] = useState({
    electricityUsageKwh: 120,
    transportationDistanceKm: 80,
    fuelUsageLiters: 15,
    publicTransportKm: 30,
    wasteGeneratedKg: 10
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await carbonService.getCarbonHistory();
      setHistory(res.data);
      if (res.data.length > 0) {
        setResult(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await carbonService.calculateFootprint({
        electricityUsageKwh: Number(formData.electricityUsageKwh),
        transportationDistanceKm: Number(formData.transportationDistanceKm),
        fuelUsageLiters: Number(formData.fuelUsageLiters),
        publicTransportKm: Number(formData.publicTransportKm),
        wasteGeneratedKg: Number(formData.wasteGeneratedKg)
      });

      setResult(res.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to calculate carbon footprint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Activity size={32} /> Carbon Footprint Calculator</h1>
          <p className="page-subtitle">Estimate your monthly carbon emissions, receive reduction tips, and track your progress</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Calculator Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '1.25rem' }}>Enter Monthly Consumption Data</h3>

          <form onSubmit={handleCalculate}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} color="#d97706" /> Monthly Electricity Usage (kWh)
              </label>
              <input type="number" step="0.1" min="0" className="form-input" value={formData.electricityUsageKwh} onChange={(e) => setFormData({ ...formData, electricityUsageKwh: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Car size={16} color="#0284c7" /> Personal Driving (km)
                </label>
                <input type="number" step="0.1" min="0" className="form-input" value={formData.transportationDistanceKm} onChange={(e) => setFormData({ ...formData, transportationDistanceKm: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Fuel size={16} color="#ef4444" /> Fuel Used (Liters)
                </label>
                <input type="number" step="0.1" min="0" className="form-input" value={formData.fuelUsageLiters} onChange={(e) => setFormData({ ...formData, fuelUsageLiters: e.target.value })} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bus size={16} color="#059669" /> Public Transit (km)
                </label>
                <input type="number" step="0.1" min="0" className="form-input" value={formData.publicTransportKm} onChange={(e) => setFormData({ ...formData, publicTransportKm: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Trash2 size={16} color="#64748b" /> Waste Generated (kg)
                </label>
                <input type="number" step="0.1" min="0" className="form-input" value={formData.wasteGeneratedKg} onChange={(e) => setFormData({ ...formData, wasteGeneratedKg: e.target.value })} required />
              </div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#047857', marginBottom: '1.25rem' }}>
              🌱 Calculating your carbon score awards <strong>+25 Green Points</strong> to your profile balance!
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Calculating Emission Score...' : 'Calculate Footprint (+25 Points)'}
            </button>
          </form>
        </div>

        {/* Results & Action Recommendations */}
        <div>
          {result ? (
            <div className="card" style={{ marginBottom: '2rem', border: '2px solid #10b981' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estimated Monthly Footprint
                </span>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#065f46', fontFamily: 'Outfit', margin: '0.25rem 0' }}>
                  {result.totalFootprintKgCo2e} <span style={{ fontSize: '1.2rem', color: '#059669', fontWeight: 600 }}>kg CO₂e</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Calculated on {new Date(result.calculationDate).toLocaleDateString()}
                </p>
              </div>

              <CarbonChart footprintData={result} />

              <h4 style={{ fontSize: '1.05rem', color: '#064e3b', margin: '1.5rem 0 0.75rem' }}>Personalized Reduction Suggestions:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {result.suggestions?.map((tip, idx) => (
                  <div key={idx} style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Activity size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ color: '#0f172a' }}>No Carbon Score Logged Yet</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fill out the consumption form on the left to calculate your footprint!</p>
            </div>
          )}

          {/* Historical Logs Table */}
          {history.length > 0 && (
            <div className="card">
              <h4 style={{ fontSize: '1.05rem', color: '#064e3b', marginBottom: '1rem' }}>Calculation History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {history.slice(0, 5).map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span>{new Date(item.calculationDate).toLocaleDateString()}</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{item.totalFootprintKgCo2e} kg CO₂e</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
