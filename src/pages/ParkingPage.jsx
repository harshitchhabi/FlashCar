/**
 * ParkingPage.jsx — Smart Smart-Grid EV Parking Heatmap
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 * Integrates HOV and EV-only charging zone penalties and visualizations.
 */
import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/common/AnimatedSection';
import { MOCK_PARKING_INDIA_24BCI0098, INDIAN_CITIES_24BCI0098 } from '../utils/indianCities';
import { useNotifications } from '../contexts/NotificationContext';

const IndiaMapView = lazy(() => import('../components/maps/IndiaMapView'));

// Enhance the mock data with Smart-Grid classifications
const SMART_GRID_PARKING = MOCK_PARKING_INDIA_24BCI0098.map(spot => {
  // Pseudo-randomly assign some lots as Green-Only
  const isEcoZone = Math.random() > 0.5;
  return {
    ...spot,
    isEcoZone,
    type: isEcoZone ? 'EV & HOV Carpool Only' : 'Standard Parking',
    color: isEcoZone ? 'var(--gr-success)' : 'var(--gr-accent)',
  }
});

export default function ParkingPage_HarshitChhabi() {
  const { addNotification } = useNotifications();
  const [parkingSpots, setParkingSpots] = useState(SMART_GRID_PARKING);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [mapOrigin, setMapOrigin] = useState(null);

  const [formData_24BCI0098, setFormData] = useState({
    location: '',
    date: '',
    time: '',
    duration: '1',
    vehicleType: 'car',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData_24BCI0098, [name]: value });
  };

  const harshitChhabiSearchParking = (e) => {
    e.preventDefault();
    addNotification('Scanning Smart-Grid for availability... 📡', 'info');
    
    // Demonstrate dynamic filtering
    const isStandardVehicle = formData_24BCI0098.vehicleType === 'car' || formData_24BCI0098.vehicleType === 'motorcycle';
    
    // Check if the user searched for a specific city to zoom into
    let baseSpots = SMART_GRID_PARKING;
    const searchVal = formData_24BCI0098.location.toLowerCase();
    
    const matchedCity = INDIAN_CITIES_24BCI0098.find(c => c.name.toLowerCase().includes(searchVal) || searchVal.includes(c.name.toLowerCase()));
    
    if (matchedCity) {
      setMapOrigin({ lat: matchedCity.lat, lng: matchedCity.lng, address: matchedCity.name });
      
      // Dynamically generate spots around the searched city so the demo always works!
      baseSpots = [
        { id: `dyn-1`, name: `Central Hub (${matchedCity.name})`, address: `Downtown Sector, ${matchedCity.name}`, position: { lat: matchedCity.lat + 0.01, lng: matchedCity.lng + 0.01 }, totalSpots: 120, available: 14, pricePerHour: '₹50', features: ['Covered'], isEcoZone: false, type: 'Standard Parking', color: 'var(--gr-accent)' },
        { id: `dyn-2`, name: `EV Supercharge Grid`, address: `Tech Park, ${matchedCity.name}`, position: { lat: matchedCity.lat - 0.015, lng: matchedCity.lng + 0.005 }, totalSpots: 40, available: 12, pricePerHour: '₹Free', features: ['EV Charging', 'CCTV'], isEcoZone: true, type: 'EV & HOV Carpool Only', color: 'var(--gr-success)' },
        { id: `dyn-3`, name: `Municipal Lot A`, address: `Transit Station, ${matchedCity.name}`, position: { lat: matchedCity.lat + 0.005, lng: matchedCity.lng - 0.012 }, totalSpots: 200, available: 5, pricePerHour: '₹40', features: ['Open'], isEcoZone: false, type: 'Standard Parking', color: 'var(--gr-accent)' },
      ];
    } else {
      setMapOrigin(null); // Overview map
    }

    if (isStandardVehicle) {
       addNotification('Filtering out restricted EV/HOV Eco-Zones. Switching to Standard Map.', 'warning');
       const filtered = baseSpots.map(spot => ({
         ...spot,
         restricted: spot.isEcoZone // If standard vehicle, eco zones are restricted
       }));
       setParkingSpots(filtered);
    } else {
       addNotification('Green Vehicle Detected. All zones unlocked!', 'success');
       const filtered = baseSpots.map(spot => ({ ...spot, restricted: false }));
       setParkingSpots(filtered);
    }
  };

  const handleReserve = (spot) => {
    if (spot.restricted) {
      addNotification(`Restricted Zone: You cannot park a Standard vehicle in an EV/HOV lot. 🟥`, 'error');
      return;
    }
    addNotification(`Reserved spot at ${spot.name}! ✅`, 'success');
    setSelectedSpot(null);
  };

  return (
    <div className="gr-page" id="parking-page-24BCI0098">
      <section className="gr-section" style={{ background: 'var(--gr-bg-secondary)', paddingTop: '6rem' }}>
        <div className="gr-container">
          <AnimatedSection variant="fadeUp">
            <div className="gr-section-header">
              <span className="gr-label">Smart-Grid Parking</span>
              <h1 className="gr-heading-lg">Urban <span className="gr-text-gradient">Heatmaps</span></h1>
              <p>Locate available EV charging nodes and reserved High-Occupancy Vehicle (HOV) parking.</p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Search Form */}
            <AnimatedSection variant="fadeRight">
              <div className="gr-card">
                <h2 className="gr-heading-sm" style={{ marginBottom: '1.5rem' }}>🔍 Matrix Scanner</h2>
                <form onSubmit={harshitChhabiSearchParking}>
                  <div className="gr-input-group">
                    <label>City Sector</label>
                    <input className="gr-input" name="location" placeholder="e.g. Koramangala" value={formData_24BCI0098.location} onChange={handleChange} required />
                  </div>
                  <div className="gr-input-group">
                    <label>Vehicle Loadout</label>
                    <select className="gr-select" name="vehicleType" value={formData_24BCI0098.vehicleType} onChange={handleChange}>
                      <option value="car">🚗 Single Occupancy (Standard)</option>
                      <option value="carpool">🤝 High-Occupancy (HOV/Carpool)</option>
                      <option value="ev">⚡ Zero Emission (EV)</option>
                    </select>
                  </div>
                  <button className="gr-btn gr-btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                    Scan Grid
                  </button>
                </form>

                {/* Nearby Spots List */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 className="gr-heading-sm" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Sector Availability</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <AnimatePresence>
                      {parkingSpots.map((spot) => (
                        <motion.div
                          key={spot.id}
                          className="gr-card-solid"
                          style={{ 
                            padding: '1rem', 
                            cursor: 'pointer',
                            opacity: spot.restricted ? 0.5 : 1,
                            borderLeft: `4px solid ${spot.restricted ? '#ef4444' : spot.color}`
                          }}
                          onClick={() => setSelectedSpot(spot)}
                          whileHover={{ scale: spot.restricted ? 1 : 1.02 }}
                          layout
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{spot.name}</p>
                              <p className="gr-text-xs" style={{ color: spot.color, fontWeight: 700 }}>{spot.type}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {!spot.restricted ? (
                                <span className="gr-badge gr-badge-success">{spot.available} free</span>
                              ) : (
                                <span className="gr-badge gr-badge-error">Restricted</span>
                              )}
                              <p style={{ fontWeight: 700, color: 'var(--gr-text-primary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{spot.pricePerHour}/hr</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Map */}
            <AnimatedSection variant="fadeLeft">
              <div className="gr-card" style={{ padding: '1.5rem', height: '100%' }}>
                <h2 className="gr-heading-sm" style={{ marginBottom: '1rem' }}>🗺️ Eco-Zoning Map</h2>
                <Suspense fallback={
                  <div style={{ height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-md)' }}>
                    <div className="gr-animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--gr-border)', borderTopColor: 'var(--gr-accent)', borderRadius: '50%' }} />
                  </div>
                }>
                  <IndiaMapView
                    origin={mapOrigin}
                    height="550px"
                    zoom={mapOrigin ? 13 : 5}
                    markers={parkingSpots.map(s => ({ 
                      id: s.id, 
                      ...s.position, 
                      name: `${s.restricted ? '❌ RESTRICTED: ' : ''}${s.name} (${s.type})`
                    }))}
                  />
                </Suspense>
              </div>
            </AnimatedSection>
          </div>

          {/* Benefits */}
          <AnimatedSection variant="fadeUp" style={{ marginTop: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[
                { icon: '🔋', title: 'Prioritized Charging', desc: 'EV lots are dynamically reserved based on remaining battery levels via HC-ERA.' },
                { icon: '🎯', title: 'HOV Zones', desc: 'High-Occupancy carpools are prioritized for premium downtown spots.' },
                { icon: '🚫', title: 'Congestion Tax', desc: 'Single-occupancy vehicles are rerouted to external lots to limit urban air degradation.' },
              ].map((b, i) => (
                <AnimatedSection key={i} variant="scaleIn" delay={i * 0.1}>
                  <div className="gr-card" style={{ textAlign: 'center', padding: '2.5rem 2rem', borderTop: '4px solid var(--gr-accent)' }}>
                    <span style={{ fontSize: '2.5rem' }}>{b.icon}</span>
                    <h3 className="gr-heading-sm" style={{ marginTop: '1rem' }}>{b.title}</h3>
                    <p className="gr-text-body" style={{ marginTop: '0.5rem' }}>{b.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Spot Detail Modal */}
      <AnimatePresence>
      {selectedSpot && (
        <motion.div className="gr-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSpot(null)}>
          <motion.div className="gr-modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
            <div className="gr-modal-header">
              <h3>{selectedSpot.name}</h3>
              <button className="gr-modal-close" onClick={() => setSelectedSpot(null)}>✕</button>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p className="gr-text-body">📍 {selectedSpot.address}</p>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: selectedSpot.restricted ? '#fee2e2' : 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-sm)', border: `1px solid ${selectedSpot.restricted ? '#f87171' : 'var(--gr-border)'}` }}>
                {selectedSpot.restricted ? (
                  <p style={{ color: '#b91c1c', fontWeight: 600 }}>❌ ACCESS DENIED: High-Occupancy or EV Vehicle Required for this zone.</p>
                ) : (
                  <>
                    <p style={{ color: selectedSpot.color, fontWeight: 700 }}>{selectedSpot.type}</p>
                    <p style={{ marginTop: '0.5rem' }}><strong>Grid Availability:</strong> {selectedSpot.available} / {selectedSpot.totalSpots} spots</p>
                    <p><strong>Rate (Dynamic):</strong> {selectedSpot.pricePerHour} per hour</p>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {selectedSpot.features.map(f => <span key={f} className="gr-badge gr-badge-accent">{f}</span>)}
              </div>
            </div>
            <button 
              className="gr-btn" 
              style={{ width: '100%', background: selectedSpot.restricted ? '#9ca3af' : 'var(--gr-gradient-primary)', color: 'white' }} 
              onClick={() => handleReserve(selectedSpot)}
              disabled={selectedSpot.restricted}
            >
              {selectedSpot.restricted ? 'Zone Locked' : 'Secure Matrix Node'}
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
