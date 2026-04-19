/**
 * CarpoolPage.jsx — Carpooling Page with Map & Route Comparison
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * CO₂ calculations use real OSRM road distances from the map component —
 * not the Haversine estimate — so the comparison panel is always consistent
 * with the distances shown on the map.
 */
import { useState, lazy, Suspense, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/common/AnimatedSection';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_CARPOOLS_INDIA_24BCI0098, INDIAN_CITIES_24BCI0098 } from '../utils/indianCities';
import { formatDate_24BCI0098 } from '../utils/dateFormatter';
import { calculateDistance, runHC_EcoRouting, calculateCarpoolSavings } from '../utils/ecoRouting_24BCI0098';

const IndiaMapView = lazy(() => import('../components/maps/IndiaMapView'));

// ── Fuel cost rates (₹/km) ───────────────────────────────────────────────
const FUEL_COST_PER_KM = { Petrol: 7.5, Diesel: 5.5, EV: 1.8 };

// 1 tree absorbs ~21 kg CO₂ / year
const treesFor = (kg) => Math.max(0, (Number(kg) / 21)).toFixed(2);

// ── Build a full comparison object from real road distances ───────────────
/**
 * buildComparison — runs HC-ERA on real OSRM distances so every number
 * (distance, duration, fuel cost, CO₂) is consistent and comes from the
 * same source.
 *
 * stdDistKm  — OSRM route[0] distance (fastest "standard" path)
 * ecoDistKm  — stdDistKm × 0.974 (HC-ERA micro-path savings on same corridor)
 * stdDurMins — OSRM route[0] duration
 * ecoDurMins — stdDurMins × 0.97
 *
 * HC-ERA applies its optimisation matrix to the ECO distance:
 *   −15% stop-and-go  ✕  −5% elevation  ✕  −8% physics = ×0.7429
 * For the standard path we use the UN-optimised formula.
 */
function buildComparison(stdDistKm, ecoDistKm, stdDurMins, ecoDurMins, fuelType, seats) {
  // Standard CO₂: real road km, no HC-ERA matrix
  const stdCalc = runHC_EcoRouting(stdDistKm, fuelType);
  // Eco CO₂: shorter eco km with HC-ERA optimisation baked in
  const ecoCalc = runHC_EcoRouting(ecoDistKm, fuelType);

  const stdCO2  = parseFloat(stdCalc.standardCO2);     // normal driving, with weather
  const ecoCO2  = parseFloat(ecoCalc.ecoCO2);           // HC-ERA optimised + weather
  const distSaved = parseFloat((stdDistKm - ecoDistKm).toFixed(1));
  const timeSaved = stdDurMins - ecoDurMins;

  const costRate    = FUEL_COST_PER_KM[fuelType] ?? 7.5;
  const stdFuelCost = Math.round(stdDistKm * costRate);
  const ecoFuelCost = Math.round(ecoDistKm * costRate);

  const carpoolSavings = calculateCarpoolSavings(ecoCO2, seats);

  return {
    standard: {
      distKm:   stdDistKm,
      durMins:  stdDurMins,
      fuelCost: stdFuelCost,
      co2Raw:   parseFloat(stdCalc.nonEcoNoWeather),
      co2Wthr:  stdCO2,
      trees:    treesFor(stdCO2),
    },
    eco: {
      distKm:   ecoDistKm,
      durMins:  ecoDurMins,
      fuelCost: ecoFuelCost,
      co2Raw:   parseFloat(ecoCalc.ecoNoWeather),
      co2Wthr:  ecoCO2,
      trees:    treesFor(ecoCO2),
    },
    saved: {
      distKm:   distSaved,
      durMins:  timeSaved,
      fuelCost: stdFuelCost - ecoFuelCost,
      co2Kg:    parseFloat((stdCO2 - ecoCO2).toFixed(2)),
    },
    weather:          stdCalc.weather,
    perPersonCO2:     parseFloat(carpoolSavings.perPerson),
    chargingTimeMins: ecoCalc.chargingTimeMins,
  };
}

// ── Rich comparison panel ─────────────────────────────────────────────────
function RouteComparisonPanel({ comparison, seats }) {
  if (!comparison) return null;
  const { standard: S, eco: E, saved, weather, perPersonCO2, chargingTimeMins } = comparison;

  const colCard = (bg, border) => ({
    flex: 1, background: bg, border: `1.5px solid ${border}`,
    borderRadius: '12px', padding: '1rem',
    display: 'flex', flexDirection: 'column', gap: '0.4rem',
  });
  const Row = ({ label, val, color, bold }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, color: color ?? 'var(--gr-text-primary)' }}>{val}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      style={{
        background: 'var(--gr-bg-primary)', borderRadius: '14px',
        padding: '1.1rem', border: '1px solid var(--gr-border)', marginBottom: '1rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <span style={{ fontWeight: 700, color: 'var(--gr-accent)', fontSize: '0.95rem' }}>
          🌿 HC-ERA Route Comparison
        </span>
        <span style={{
          fontSize: '0.74rem', background: 'rgba(167,139,250,0.15)', color: '#a78bfa',
          padding: '0.2rem 0.55rem', borderRadius: '999px', fontWeight: 600,
        }}>
          🌤️ {weather}
        </span>
      </div>

      {/* Side-by-side cards */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem' }}>

        {/* 🔴 Standard */}
        <div style={colCard('rgba(239,68,68,0.07)', 'rgba(239,68,68,0.35)')}>
          <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            🔴 Standard Route
          </div>
          <Row label="Distance"       val={`${S.distKm} km`}   color="#ef4444" bold />
          <Row label="Duration"       val={`${S.durMins} min`} color="#ef4444" />
          <Row label="Fuel Cost"      val={`₹${S.fuelCost}`}  color="#ef4444" />
          <div style={{ margin: '0.3rem 0', height: 1, background: 'rgba(239,68,68,0.2)' }} />
          <Row label="CO₂ (no weather)" val={`${S.co2Raw} kg`}  color="#fca5a5" />
          <Row label="CO₂ (+weather)"   val={`${S.co2Wthr} kg`} color="#ef4444" bold />
          <Row label="Trees to offset"  val={`${S.trees} 🌳`}   color="#d1d5db" />
        </div>

        {/* 🟢 Eco */}
        <div style={colCard('rgba(16,185,129,0.07)', 'rgba(16,185,129,0.35)')}>
          <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            🟢 HC-ERA Eco Route
          </div>
          <Row label="Distance"       val={`${E.distKm} km`}   color="#10b981" bold />
          <Row label="Duration"       val={`${E.durMins} min`} color="#10b981" />
          <Row label="Fuel Cost"      val={`₹${E.fuelCost}`}  color="#10b981" />
          <div style={{ margin: '0.3rem 0', height: 1, background: 'rgba(16,185,129,0.2)' }} />
          <Row label="CO₂ (no weather)" val={`${E.co2Raw} kg`}  color="#6ee7b7" />
          <Row label="CO₂ (+weather)"   val={`${E.co2Wthr} kg`} color="#10b981" bold />
          <Row label="Trees to offset"  val={`${E.trees} 🌳`}   color="#d1d5db" />
        </div>
      </div>

      {/* Savings tiles — always positive because eco ≤ standard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '0.7rem' }}>
        {[
          { icon: '🛣️', label: 'Distance Saved', val: `${saved.distKm} km`,    color: '#34d399' },
          { icon: '⏱️', label: 'Time Saved',     val: `${saved.durMins} min`,   color: '#60a5fa' },
          { icon: '⛽', label: 'Fuel Saved',      val: `₹${saved.fuelCost}`,    color: '#fbbf24' },
          { icon: '🌿', label: 'CO₂ Saved',       val: `${saved.co2Kg} kg`,     color: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--gr-bg-secondary)', borderRadius: '10px', padding: '0.6rem 0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.95rem', color: s.color, marginTop: '0.15rem' }}>{s.val}</div>
            <div style={{ fontSize: '0.64rem', opacity: 0.6, marginTop: '0.1rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
          <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>Your footprint / person ({seats} in car)</div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.05rem', color: '#60a5fa', marginTop: '0.15rem' }}>
            {perPersonCO2} kg CO₂
          </div>
        </div>
        {chargingTimeMins > 0 ? (
          <div style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
            <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>EV Charging Stops</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.05rem', color: '#0ea5e9', marginTop: '0.15rem' }}>
              {chargingTimeMins} mins ⚡
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
            <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>HC-ERA Optimisation</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.78rem', color: '#10b981', marginTop: '0.15rem', lineHeight: 1.4 }}>
              −15% traffic · −5% elevation · −8% physics
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════════════════
export default function CarpoolPage_HarshitChhabi() {
  const { isAuthenticated, getUserProfile } = useAuth();
  const { addNotification } = useNotifications();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const [offeredRides, setOfferedRides] = useState(MOCK_CARPOOLS_INDIA_24BCI0098);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [bookingRide, setBookingRide] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');

  // routeMeta comes from the map (real OSRM road distances)
  const [routeMeta, setRouteMeta] = useState(null);
  // comparison is derived from routeMeta + HC-ERA (all numbers consistent)
  const [comparison, setComparison] = useState(null);

  const [formData_24BCI0098, setFormData] = useState({
    driverName: '',
    departureTime: '',
    seatsAvailable: 2,
    costPerPerson: '',
    vehicleType: '',
    fuelType: 'Petrol',
  });

  const [bookingForm, setBookingForm] = useState({
    passengerName: '', passengerEmail: '', passengerPhone: '', notes: '',
  });

  useEffect(() => { if (origin) setOriginInput(origin.address); }, [origin]);
  useEffect(() => { if (destination) setDestInput(destination.address); }, [destination]);

  // ── Rebuild comparison whenever route distances OR fuel/seats change ──────
  // Priority: use real OSRM distances when map has loaded them;
  // fall back to Haversine estimate while the OSRM fetch is in-flight.
  useEffect(() => {
    if (!origin || !destination) { setComparison(null); return; }

    const seats    = parseInt(formData_24BCI0098.seatsAvailable);
    const fuelType = formData_24BCI0098.fuelType;

    if (routeMeta) {
      // ✅ Real OSRM distances — use these for all numbers
      setComparison(buildComparison(
        routeMeta.standard.distKm,
        routeMeta.eco.distKm,
        routeMeta.standard.durMins,
        routeMeta.eco.durMins,
        fuelType,
        seats,
      ));
    } else {
      // ⏳ Map still loading — show Haversine-based estimate
      const havDist = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
      const havDistKm = parseFloat(havDist.toFixed(1));
      const ecoDist   = parseFloat((havDistKm * 0.974).toFixed(1));
      const estDurStd = Math.round(havDistKm / 50 * 60);
      const estDurEco = Math.round(estDurStd * 0.97);
      setComparison(buildComparison(havDistKm, ecoDist, estDurStd, estDurEco, fuelType, seats));
    }
  }, [origin, destination, routeMeta, formData_24BCI0098.fuelType, formData_24BCI0098.seatsAvailable]);

  // When routeMeta arrives from map, reset it so useEffect above re-fires
  const handleRouteData = (meta) => setRouteMeta(meta);

  // Reset routeMeta when cities change
  useEffect(() => { setRouteMeta(null); }, [origin, destination]);

  // ── Booking eco data (Haversine-based, sufficient for booking modal) ──────
  const bookingComparison = useMemo(() => {
    if (!bookingRide) return null;
    const dist    = calculateDistance(
      bookingRide.startLocation.lat, bookingRide.startLocation.lng,
      bookingRide.destination.lat,   bookingRide.destination.lng,
    );
    const distKm  = parseFloat(dist.toFixed(1));
    const ecoKm   = parseFloat((distKm * 0.974).toFixed(1));
    const durStd  = Math.round(distKm / 50 * 60);
    const durEco  = Math.round(durStd * 0.97);
    const fuel    = bookingRide.vehicleType?.includes('EV') ? 'EV'
                    : bookingRide.vehicleType?.includes('Diesel') ? 'Diesel' : 'Petrol';
    return buildComparison(distKm, ecoKm, durStd, durEco, fuel, bookingRide.seatsTotal || 4);
  }, [bookingRide]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData_24BCI0098, [name]: value });
  };

  const handleManualOrigin = (e) => {
    const val = e.target.value;
    setOriginInput(val);
    const city = INDIAN_CITIES_24BCI0098.find(c => c.name.toLowerCase() === val.toLowerCase());
    if (city) setOrigin({ lat: city.lat, lng: city.lng, address: city.name });
    else setOrigin(null);
  };

  const handleManualDest = (e) => {
    const val = e.target.value;
    setDestInput(val);
    const city = INDIAN_CITIES_24BCI0098.find(c => c.name.toLowerCase() === val.toLowerCase());
    if (city) setDestination({ lat: city.lat, lng: city.lng, address: city.name });
    else setDestination(null);
  };

  const harshitChhabiSubmitRide = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { addNotification('Please sign in to offer a ride', 'warning'); navigate('/login?redirect=/carpool'); return; }
    if (!origin || !destination) { addNotification('Please select both origin and destination', 'error'); return; }

    const newRide = {
      id: `ride-hc-${Date.now()}`,
      driver: formData_24BCI0098.driverName || getUserProfile()?.displayName || 'Anonymous',
      startLocationAddress: origin.address,
      startLocation: { lat: origin.lat, lng: origin.lng },
      destinationAddress: destination.address,
      destination: { lat: destination.lat, lng: destination.lng },
      departureTime: formData_24BCI0098.departureTime,
      seatsAvailable: parseInt(formData_24BCI0098.seatsAvailable),
      seatsTotal: parseInt(formData_24BCI0098.seatsAvailable),
      costPerPerson: formData_24BCI0098.costPerPerson ? `₹${formData_24BCI0098.costPerPerson}` : 'Free',
      vehicleType: `${formData_24BCI0098.vehicleType} (${formData_24BCI0098.fuelType})`,
      rating: 5.0,
    };
    setOfferedRides([newRide, ...offeredRides]);
    setShowOfferForm(false);
    setFormData({ driverName: '', departureTime: '', seatsAvailable: 2, costPerPerson: '', vehicleType: '', fuelType: 'Petrol' });
    setOriginInput(''); setDestInput(''); setOrigin(null); setDestination(null);
    addNotification('Ride offered successfully! 🎉', 'success');
  };

  const harshitChhabiBookRide = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { addNotification('Please sign in to book a ride', 'warning'); navigate('/login?redirect=/carpool'); return; }
    addNotification(`Booking request sent to ${bookingRide.driver}! 🕒`, 'success');
    setTimeout(() => {
      addNotification(`${bookingRide.driver} approved your ride! 🎉`, 'success');
      setOfferedRides(offeredRides.map(r =>
        r.id === bookingRide.id ? { ...r, seatsAvailable: Math.max(0, r.seatsAvailable - 1) } : r
      ));
    }, 3000);
    setBookingRide(null);
    setBookingForm({ passengerName: '', passengerEmail: '', passengerPhone: '', notes: '' });
  };

  const toggleFavorite = (ride) => {
    if (isFavorite(ride.id)) { removeFavorite(ride.id); addNotification('Removed from saved routes', 'info'); }
    else { addFavorite(ride); addNotification('Route saved! ⭐', 'success'); }
  };

  const seats = parseInt(formData_24BCI0098.seatsAvailable);

  return (
    <div className="gr-page" id="carpool-page-24BCI0098">
      <datalist id="indian-cities-24BCI0098">
        {INDIAN_CITIES_24BCI0098.map((city, idx) => <option key={idx} value={city.name} />)}
      </datalist>

      <section className="gr-section" style={{ background: 'var(--gr-bg-secondary)', paddingTop: '6rem' }}>
        <div className="gr-container">
          <AnimatedSection variant="fadeUp">
            <div className="gr-section-header">
              <span className="gr-label">Carpooling</span>
              <h1 className="gr-heading-lg">Share Your Ride Across <span className="gr-text-gradient">India</span></h1>
              <p>Connect with commuters heading your way. Save money, reduce emissions, and make friends.</p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

            {/* ── Map ── */}
            <AnimatedSection variant="fadeRight">
              <div className="gr-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className="gr-heading-sm">🗺️ Route Map</h2>
                  <button className="gr-btn gr-btn-primary gr-btn-sm" onClick={() => setShowOfferForm(!showOfferForm)}>
                    {showOfferForm ? 'Cancel' : '+ Offer a Ride'}
                  </button>
                </div>
                <Suspense fallback={
                  <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-md)' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid var(--gr-border)', borderTopColor: 'var(--gr-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                }>
                  <IndiaMapView
                    origin={origin}
                    destination={destination}
                    showDirections={!!(origin && destination)}
                    height="400px"
                    zoom={5}
                    onRouteData={handleRouteData}
                    markers={offeredRides.map(r => ({
                      id: r.id,
                      lat: r.startLocation?.lat,
                      lng: r.startLocation?.lng,
                      name: `${r.driver} → ${r.destinationAddress}`,
                    }))}
                  />
                </Suspense>

                {/* Subtle note about distances */}
                {routeMeta && (
                  <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.5rem', textAlign: 'center' }}>
                    📡 Distances sourced from OSRM real road data · CO₂ calculated on same distances
                  </p>
                )}
              </div>
            </AnimatedSection>

            {/* ── Offer Form or Ride List ── */}
            <AnimatedSection variant="fadeLeft">
              {showOfferForm ? (
                <div className="gr-card">
                  <h2 className="gr-heading-sm" style={{ marginBottom: '1.5rem' }}>🚗 Offer a Ride</h2>
                  <form onSubmit={harshitChhabiSubmitRide}>
                    <div className="gr-input-group">
                      <label>Your Name</label>
                      <input className="gr-input" name="driverName" placeholder="Enter your name"
                        value={formData_24BCI0098.driverName} onChange={handleFormChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="gr-input-group">
                        <label>Origin City</label>
                        <input className="gr-input" list="indian-cities-24BCI0098"
                          value={originInput} onChange={handleManualOrigin} placeholder="Type a city…" required />
                      </div>
                      <div className="gr-input-group">
                        <label>Destination City</label>
                        <input className="gr-input" list="indian-cities-24BCI0098"
                          value={destInput} onChange={handleManualDest} placeholder="Type a city…" required />
                      </div>
                    </div>

                    {/* ── HC-ERA Panel updates when OSRM data arrives ── */}
                    <AnimatePresence>
                      {comparison && (
                        <RouteComparisonPanel comparison={comparison} seats={seats} />
                      )}
                    </AnimatePresence>

                    <div className="gr-input-group">
                      <label>Departure Time</label>
                      <input className="gr-input" name="departureTime" type="datetime-local"
                        value={formData_24BCI0098.departureTime} onChange={handleFormChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '1rem' }}>
                      <div className="gr-input-group">
                        <label>Vehicle Model</label>
                        <input className="gr-input" name="vehicleType" placeholder="e.g. Honda City"
                          value={formData_24BCI0098.vehicleType} onChange={handleFormChange} required />
                      </div>
                      <div className="gr-input-group">
                        <label>Fuel</label>
                        <select className="gr-select" name="fuelType" value={formData_24BCI0098.fuelType} onChange={handleFormChange}>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="EV">EV</option>
                        </select>
                      </div>
                      <div className="gr-input-group">
                        <label>Seats</label>
                        <select className="gr-select" name="seatsAvailable" value={formData_24BCI0098.seatsAvailable} onChange={handleFormChange}>
                          {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="gr-input-group">
                      <label>Cost Per Person (₹)</label>
                      <input className="gr-input" name="costPerPerson" type="number" min="0" placeholder="0"
                        value={formData_24BCI0098.costPerPerson} onChange={handleFormChange} />
                    </div>
                    <button className="gr-btn gr-btn-primary" type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Offer Ride
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="gr-heading-sm" style={{ marginBottom: '1rem' }}>Available Rides</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {offeredRides.map((ride) => (
                      <motion.div
                        key={ride.id}
                        className="gr-card-solid"
                        style={{ padding: '1.25rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '1rem' }}>{ride.driver}</p>
                            <p className="gr-text-sm" style={{ marginTop: '0.25rem' }}>🚗 {ride.vehicleType} • ⭐ {ride.rating}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="gr-badge gr-badge-success">{ride.seatsAvailable} seats</span>
                            <p style={{ fontWeight: 700, color: 'var(--gr-accent)', marginTop: '0.25rem' }}>{ride.costPerPerson}</p>
                          </div>
                        </div>
                        <div style={{ margin: '0.75rem 0', fontSize: '0.9rem', color: 'var(--gr-text-secondary)' }}>
                          <p>📍 {ride.startLocationAddress}</p>
                          <p>📍 {ride.destinationAddress}</p>
                          <p>🕐 {formatDate_24BCI0098(ride.departureTime)}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="gr-btn gr-btn-primary gr-btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => setBookingRide(ride)}
                            disabled={ride.seatsAvailable < 1}
                          >
                            {ride.seatsAvailable < 1 ? 'Full' : 'Book Seat'}
                          </button>
                          <button
                            className="gr-btn gr-btn-ghost gr-btn-sm"
                            onClick={() => toggleFavorite(ride)}
                            title={isFavorite(ride.id) ? 'Remove from saved' : 'Save route'}
                          >
                            {isFavorite(ride.id) ? '⭐' : '☆'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatedSection>
          </div>

          {/* Benefits strip */}
          <AnimatedSection variant="fadeUp" style={{ marginTop: '4rem' }}>
            <div className="gr-card" style={{ background: 'var(--gr-gradient-accent)', padding: '3rem', borderRadius: 'var(--gr-radius-xl)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center', color: '#fff' }}>
                {[
                  { icon: '💰', title: 'Save Up to 75%',   desc: 'Share fuel costs with fellow commuters' },
                  { icon: '🌿', title: 'Reduce CO₂',        desc: 'Each shared ride cuts ~0.12 kg CO₂/km' },
                  { icon: '🤝', title: 'Build Community',   desc: 'Meet neighbours on your route' },
                ].map((b, i) => (
                  <div key={i}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>{b.icon}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{b.title}</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '0.5rem' }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {bookingRide && (
          <motion.div
            className="gr-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setBookingRide(null)}
          >
            <motion.div
              className="gr-modal"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gr-modal-header">
                <h3>Book a Ride</h3>
                <button className="gr-modal-close" onClick={() => setBookingRide(null)}>✕</button>
              </div>

              <div style={{ background: 'var(--gr-bg-secondary)', padding: '1rem', borderRadius: 'var(--gr-radius-md)', marginBottom: '1rem' }}>
                <p><strong>{bookingRide.driver}</strong> • {bookingRide.vehicleType}</p>
                <p className="gr-text-sm">📍 {bookingRide.startLocationAddress} → {bookingRide.destinationAddress}</p>
                <p className="gr-text-sm">🕐 {formatDate_24BCI0098(bookingRide.departureTime)} • {bookingRide.costPerPerson}</p>
              </div>

              {bookingComparison && (
                <RouteComparisonPanel comparison={bookingComparison} seats={bookingRide.seatsTotal || 4} />
              )}

              <form onSubmit={harshitChhabiBookRide}>
                <div className="gr-input-group">
                  <label>Your Name</label>
                  <input className="gr-input" value={bookingForm.passengerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, passengerName: e.target.value })} required />
                </div>
                <div className="gr-input-group">
                  <label>Email</label>
                  <input className="gr-input" type="email" value={bookingForm.passengerEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, passengerEmail: e.target.value })} required />
                </div>
                <div className="gr-input-group">
                  <label>Phone</label>
                  <input className="gr-input" type="tel" value={bookingForm.passengerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, passengerPhone: e.target.value })} />
                </div>
                <div className="gr-input-group">
                  <label>Notes (optional)</label>
                  <textarea className="gr-input" rows="2" value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    style={{ resize: 'vertical' }} />
                </div>
                <button className="gr-btn gr-btn-primary" type="submit" style={{ width: '100%' }}>
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
