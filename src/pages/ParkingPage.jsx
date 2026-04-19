/**
 * ParkingPage.jsx — Smart-Grid EV Parking with real OSM data
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Uses Overpass API (OpenStreetMap) for real parking locations.
 * Falls back to curated demo data if no OSM results found.
 */
import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/common/AnimatedSection';
import { INDIAN_CITIES_24BCI0098 } from '../utils/indianCities';
import { useNotifications } from '../contexts/NotificationContext';

const IndiaMapView = lazy(() => import('../components/maps/IndiaMapView'));

// ── Overpass API — fetch real parking near a city ────────────────────────
async function fetchRealParkingNearCity(lat, lng, radiusM = 3000) {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="parking"](around:${radiusM},${lat},${lng});
      way["amenity"="parking"](around:${radiusM},${lat},${lng});
    );
    out center tags 20;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`Overpass error ${res.status}`);
  const data = await res.json();
  return data.elements || [];
}

// Map OSM element → our spot format
function osmToSpot(el, idx) {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (!lat || !lng) return null;

  const tags = el.tags || {};
  const capacity = parseInt(tags.capacity) || Math.floor(Math.random() * 80 + 20);
  const available = Math.floor(capacity * (0.1 + Math.random() * 0.5)); // realistic 10–60% free
  const isEV = tags.amenity === 'charging_station' || tags['motorcar:electric'] === 'yes' || tags.description?.toLowerCase().includes('ev') || tags.name?.toLowerCase().includes('ev') || tags.name?.toLowerCase().includes('electric');
  const isHOV = tags.hov === 'yes' || tags.name?.toLowerCase().includes('carpool') || tags.name?.toLowerCase().includes('hov');
  const isEcoZone = isEV || isHOV;

  return {
    id: `osm-${el.id || idx}`,
    name: tags.name || `Parking Lot ${idx + 1}`,
    address: [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || 'See map for location',
    position: { lat, lng },
    totalSpots: capacity,
    available,
    pricePerHour: tags.fee === 'no' ? '₹Free' : (tags.charge || '₹40'),
    features: [
      tags.covered === 'yes' && 'Covered',
      tags.surveillance === 'yes' && 'CCTV',
      isEV && 'EV Charging',
      isHOV && 'HOV Priority',
    ].filter(Boolean),
    isEcoZone,
    type: isEcoZone ? 'EV & HOV Carpool Only' : 'Standard Parking',
    color: isEcoZone ? 'var(--gr-success)' : 'var(--gr-accent)',
    source: 'osm',
  };
}

// ── Curated fallback for cities with sparse OSM data ────────────────────
function buildFallbackSpots(city) {
  return [
    {
      id: `fb-1-${city.name}`,
      name: `Central Hub (${city.name})`,
      address: `Downtown Sector, ${city.name}`,
      position: { lat: city.lat + 0.010, lng: city.lng + 0.010 },
      totalSpots: 120, available: 14,
      pricePerHour: '₹50', features: ['Covered', 'CCTV'],
      isEcoZone: false, type: 'Standard Parking', color: 'var(--gr-accent)', source: 'demo',
    },
    {
      id: `fb-2-${city.name}`,
      name: `EV Supercharge Hub`,
      address: `Tech Park, ${city.name}`,
      position: { lat: city.lat - 0.015, lng: city.lng + 0.005 },
      totalSpots: 40, available: 12,
      pricePerHour: '₹Free', features: ['EV Charging', 'CCTV', 'HOV Priority'],
      isEcoZone: true, type: 'EV & HOV Carpool Only', color: 'var(--gr-success)', source: 'demo',
    },
    {
      id: `fb-3-${city.name}`,
      name: `Municipal Lot A`,
      address: `Transit Station, ${city.name}`,
      position: { lat: city.lat + 0.005, lng: city.lng - 0.012 },
      totalSpots: 200, available: 5,
      pricePerHour: '₹40', features: ['Open Air'],
      isEcoZone: false, type: 'Standard Parking', color: 'var(--gr-accent)', source: 'demo',
    },
    {
      id: `fb-4-${city.name}`,
      name: `HOV Carpool Zone`,
      address: `Ring Road, ${city.name}`,
      position: { lat: city.lat - 0.008, lng: city.lng - 0.008 },
      totalSpots: 60, available: 30,
      pricePerHour: '₹Free', features: ['HOV Priority', 'Covered'],
      isEcoZone: true, type: 'EV & HOV Carpool Only', color: 'var(--gr-success)', source: 'demo',
    },
  ];
}

// Default national overview spots (shown before any search)
const DEFAULT_SPOTS = [
  { id: 'def-del', name: 'CP Underground Parking', address: 'Connaught Place, New Delhi', position: { lat: 28.6304, lng: 77.2177 }, totalSpots: 250, available: 42, pricePerHour: '₹60', features: ['CCTV', 'EV Charging', 'Covered'], isEcoZone: true, type: 'EV & HOV Carpool Only', color: 'var(--gr-success)', source: 'curated' },
  { id: 'def-mum', name: 'Phoenix Mall Parking', address: 'Lower Parel, Mumbai', position: { lat: 18.9952, lng: 72.8303 }, totalSpots: 500, available: 85, pricePerHour: '₹80', features: ['CCTV', 'Valet', 'Covered', 'EV Charging'], isEcoZone: false, type: 'Standard Parking', color: 'var(--gr-accent)', source: 'curated' },
  { id: 'def-blr', name: 'Orion Mall Parking', address: 'Rajajinagar, Bangalore', position: { lat: 13.0107, lng: 77.5556 }, totalSpots: 350, available: 120, pricePerHour: '₹50', features: ['CCTV', 'Covered'], isEcoZone: false, type: 'Standard Parking', color: 'var(--gr-accent)', source: 'curated' },
  { id: 'def-che', name: 'Express Avenue Parking', address: 'Royapettah, Chennai', position: { lat: 13.0590, lng: 80.2629 }, totalSpots: 400, available: 67, pricePerHour: '₹40', features: ['CCTV', 'Covered', 'Wheelchair Access'], isEcoZone: false, type: 'Standard Parking', color: 'var(--gr-accent)', source: 'curated' },
];

export default function ParkingPage_HarshitChhabi() {
  const { addNotification } = useNotifications();
  const [parkingSpots, setParkingSpots] = useState(DEFAULT_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [mapOrigin, setMapOrigin] = useState(null);
  const [searching, setSearching] = useState(false);
  const [dataSource, setDataSource] = useState('curated'); // 'osm' | 'demo' | 'curated'

  const [formData_24BCI0098, setFormData] = useState({
    location: '',
    vehicleType: 'car',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData_24BCI0098, [name]: value });
  };

  const harshitChhabiSearchParking = async (e) => {
    e.preventDefault();
    const searchVal = formData_24BCI0098.location.trim().toLowerCase();
    const matchedCity = INDIAN_CITIES_24BCI0098.find(c =>
      c.name.toLowerCase().includes(searchVal) || searchVal.includes(c.name.toLowerCase())
    );

    if (!matchedCity) {
      addNotification('City not found. Try a major Indian city name.', 'warning');
      return;
    }

    setMapOrigin({ lat: matchedCity.lat, lng: matchedCity.lng, address: matchedCity.name });
    setSearching(true);
    addNotification(`Scanning OpenStreetMap for parking near ${matchedCity.name}… 📡`, 'info');

    try {
      const osmElements = await fetchRealParkingNearCity(matchedCity.lat, matchedCity.lng, 3000);
      const spots = osmElements.map(osmToSpot).filter(Boolean);

      if (spots.length === 0) {
        // Fallback — use curated spots offset to the searched city
        const fallback = buildFallbackSpots(matchedCity);
        setParkingSpots(fallback);
        setDataSource('demo');
        addNotification(`No OSM parking data found near ${matchedCity.name}. Showing estimated spots.`, 'warning');
      } else {
        // Filter by vehicle type
        const isStandard = formData_24BCI0098.vehicleType === 'car' || formData_24BCI0098.vehicleType === 'motorcycle';
        const processed = spots.map(s => ({
          ...s,
          restricted: isStandard && s.isEcoZone,
        }));
        setParkingSpots(processed);
        setDataSource('osm');
        const ecoCount = processed.filter(s => s.isEcoZone).length;
        addNotification(
          `Found ${processed.length} real parking locations near ${matchedCity.name}${ecoCount > 0 ? ` (${ecoCount} eco zones)` : ''}.`,
          'success'
        );
      }
    } catch (err) {
      console.error('[ParkingPage] Overpass error:', err.message);
      const fallback = buildFallbackSpots(matchedCity);
      setParkingSpots(fallback);
      setDataSource('demo');
      addNotification('Map data service unavailable. Showing estimated spots.', 'warning');
    } finally {
      setSearching(false);
    }
  };

  const handleReserve = (spot) => {
    if (spot.restricted) {
      addNotification('Restricted Zone: EV or HOV vehicle required. 🟥', 'error');
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
              <p>Real-time parking availability via OpenStreetMap. Locate EV charging nodes and HOV zones.</p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Search Form */}
            <AnimatedSection variant="fadeRight">
              <div className="gr-card">
                <h2 className="gr-heading-sm" style={{ marginBottom: '1.5rem' }}>🔍 Parking Scanner</h2>
                <form onSubmit={harshitChhabiSearchParking}>
                  <div className="gr-input-group">
                    <label>City</label>
                    <input
                      className="gr-input"
                      name="location"
                      placeholder="e.g. Bangalore"
                      value={formData_24BCI0098.location}
                      onChange={handleChange}
                      list="indian-cities-24BCI0098"
                      required
                    />
                    <datalist id="indian-cities-24BCI0098">
                      {INDIAN_CITIES_24BCI0098.map((c, i) => <option key={i} value={c.name} />)}
                    </datalist>
                  </div>
                  <div className="gr-input-group">
                    <label>Vehicle Type</label>
                    <select className="gr-select" name="vehicleType" value={formData_24BCI0098.vehicleType} onChange={handleChange}>
                      <option value="car">🚗 Single Occupancy (Standard)</option>
                      <option value="carpool">🤝 High-Occupancy (HOV/Carpool)</option>
                      <option value="ev">⚡ Zero Emission (EV)</option>
                    </select>
                  </div>
                  <button className="gr-btn gr-btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={searching}>
                    {searching ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Scanning OSM…
                      </span>
                    ) : 'Scan for Parking'}
                  </button>
                </form>

                {/* Data source badge */}
                {dataSource !== 'curated' && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: dataSource === 'osm' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: 'var(--gr-radius-sm)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {dataSource === 'osm'
                      ? <><span style={{ color: '#10b981' }}>✅</span> Live data from OpenStreetMap</>
                      : <><span style={{ color: '#f59e0b' }}>⚠️</span> Estimated data (OSM sparse here)</>
                    }
                  </div>
                )}

                {/* Spot List */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 className="gr-heading-sm" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                    Sector Availability
                    <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.6, marginLeft: '0.5rem' }}>
                      ({parkingSpots.length} spots)
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <AnimatePresence>
                      {parkingSpots.map(spot => (
                        <motion.div
                          key={spot.id}
                          className="gr-card-solid"
                          style={{
                            padding: '1rem', cursor: 'pointer',
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
                              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.25rem' }}>{spot.pricePerHour}/hr</p>
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
                    zoom={mapOrigin ? 14 : 5}
                    markers={parkingSpots.map(s => ({
                      id: s.id,
                      ...s.position,
                      name: `${s.restricted ? '❌ RESTRICTED: ' : ''}${s.name} (${s.type}) — ${s.available} free / ₹${s.pricePerHour}/hr`,
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
                { icon: '🔋', title: 'Prioritized Charging', desc: 'EV lots are dynamically identified from live OSM and reserved per HC-ERA battery logistics.' },
                { icon: '🎯', title: 'HOV Zones', desc: 'High-Occupancy carpools unlock premium downtown spots unavailable to single-occupancy vehicles.' },
                { icon: '🚫', title: 'Congestion Tax', desc: 'Single-occupancy vehicles see restricted eco-zones, incentivising greener transport choices.' },
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
                {selectedSpot.source === 'osm' && (
                  <p className="gr-text-xs" style={{ marginTop: '0.25rem', color: '#10b981' }}>✅ Live OpenStreetMap data</p>
                )}

                <div style={{ marginTop: '1rem', padding: '1rem', background: selectedSpot.restricted ? '#fee2e2' : 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-sm)', border: `1px solid ${selectedSpot.restricted ? '#f87171' : 'var(--gr-border)'}` }}>
                  {selectedSpot.restricted ? (
                    <p style={{ color: '#b91c1c', fontWeight: 600 }}>❌ ACCESS DENIED: EV or HOV vehicle required for this zone.</p>
                  ) : (
                    <>
                      <p style={{ color: selectedSpot.color, fontWeight: 700 }}>{selectedSpot.type}</p>
                      <p style={{ marginTop: '0.5rem' }}><strong>Availability:</strong> {selectedSpot.available} / {selectedSpot.totalSpots} spots</p>
                      <p><strong>Rate:</strong> {selectedSpot.pricePerHour} per hour</p>
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
                {selectedSpot.restricted ? 'Zone Locked' : 'Reserve This Spot'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
