/**
 * CarpoolPage.jsx — Carpooling Page with Firestore real-time rides
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { useState, lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/common/AnimatedSection';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { INDIAN_CITIES_24BCI0098 } from '../utils/indianCities';
import { formatDate_24BCI0098 } from '../utils/dateFormatter';
import { calculateDistance, runHC_EcoRouting, runHC_EcoRoutingSync, calculateCarpoolSavings, fetchWeatherCondition_24BCI0098 } from '../utils/ecoRouting_24BCI0098';
import {
  addRide_24BCI0098,
  subscribeToRides_24BCI0098,
  addBooking_24BCI0098,
  updateUserStats_24BCI0098,
} from '../utils/firebase';

const IndiaMapView = lazy(() => import('../components/maps/IndiaMapView'));

export default function CarpoolPage_HarshitChhabi() {
  const { isAuthenticated, getUserProfile } = useAuth();
  const { addNotification } = useNotifications();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  // ── Firestore real-time rides ──
  const [offeredRides, setOfferedRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(true);

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [bookingRide, setBookingRide] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [ecoData, setEcoData] = useState(null);
  const [ecoLoading, setEcoLoading] = useState(false);
  const [weather, setWeather] = useState(null); // cached real weather

  const [formData_24BCI0098, setFormData] = useState({
    driverName: '',
    departureTime: '',
    seatsAvailable: 2,
    costPerPerson: '',
    vehicleType: '',
    fuelType: 'Petrol',
  });

  const [bookingForm, setBookingForm] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    notes: '',
  });

  // ── Subscribe to Firestore rides collection ──
  useEffect(() => {
    setRidesLoading(true);
    const unsub = subscribeToRides_24BCI0098((rides) => {
      setOfferedRides(rides);
      setRidesLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Sync inputs with selected map points ──
  useEffect(() => { if (origin) setOriginInput(origin.address); }, [origin]);
  useEffect(() => { if (destination) setDestInput(destination.address); }, [destination]);

  // ── HC-ERA with real weather whenever origin/dest/fuel changes ──
  useEffect(() => {
    if (!origin || !destination) { setEcoData(null); return; }

    let cancelled = false;
    setEcoLoading(true);

    const run = async () => {
      const dist = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
      // Fetch real weather once and cache it
      const weatherCondition = await fetchWeatherCondition_24BCI0098(origin.lat, origin.lng);
      if (cancelled) return;
      setWeather(weatherCondition);

      const hc_era = runHC_EcoRoutingSync(dist, formData_24BCI0098.fuelType, weatherCondition);
      const carpoolSavings = calculateCarpoolSavings(Number(hc_era.ecoCO2), parseInt(formData_24BCI0098.seatsAvailable));
      if (!cancelled) {
        setEcoData({ distance: dist.toFixed(0), ...hc_era, carpoolSavings });
        setEcoLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [origin, destination, formData_24BCI0098.fuelType, formData_24BCI0098.seatsAvailable]);

  // ── Booking eco data (sync, uses cached weather) ──
  const bookingEcoData = useMemo(() => {
    if (!bookingRide) return null;
    const dist = calculateDistance(
      bookingRide.startLocation.lat, bookingRide.startLocation.lng,
      bookingRide.destination.lat, bookingRide.destination.lng
    );
    const fuel = bookingRide.vehicleType?.includes('EV') ? 'EV' :
      (bookingRide.vehicleType?.includes('Diesel') ? 'Diesel' : 'Petrol');
    const hc_era = runHC_EcoRoutingSync(dist, fuel, weather);
    const carpoolSavings = calculateCarpoolSavings(Number(hc_era.ecoCO2), bookingRide.seatsTotal || 4);
    return { distance: dist.toFixed(0), ...hc_era, carpoolSavings };
  }, [bookingRide, weather]);

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

  // ── Submit a ride → write to Firestore ──
  const harshitChhabiSubmitRide = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addNotification('Please sign in to offer a ride', 'warning');
      navigate('/login?redirect=/carpool');
      return;
    }
    if (!origin || !destination) {
      addNotification('Please select both origin and destination', 'error');
      return;
    }

    const profile = getUserProfile();
    const rideData = {
      driver: formData_24BCI0098.driverName || profile?.displayName || 'Anonymous',
      driverUid: profile?.uid || null,
      startLocationAddress: origin.address,
      startLocation: { lat: origin.lat, lng: origin.lng },
      destinationAddress: destination.address,
      destination: { lat: destination.lat, lng: destination.lng },
      departureTime: formData_24BCI0098.departureTime,
      seatsAvailable: parseInt(formData_24BCI0098.seatsAvailable),
      seatsTotal: parseInt(formData_24BCI0098.seatsAvailable),
      costPerPerson: formData_24BCI0098.costPerPerson ? `₹${formData_24BCI0098.costPerPerson}` : 'Free',
      vehicleType: `${formData_24BCI0098.vehicleType} (${formData_24BCI0098.fuelType})`,
      fuelType: formData_24BCI0098.fuelType,
      rating: 5.0,
      // Embed eco data at time of offering
      ecoCO2: ecoData?.ecoCO2 ?? null,
      savedCO2: ecoData?.savedCO2 ?? null,
      distanceKm: ecoData?.distance ?? null,
      weather: ecoData?.weather ?? null,
    };

    const { id, error } = await addRide_24BCI0098(rideData);
    if (error) {
      addNotification('Failed to post ride. Please try again.', 'error');
      return;
    }

    setShowOfferForm(false);
    setFormData({ driverName: '', departureTime: '', seatsAvailable: 2, costPerPerson: '', vehicleType: '', fuelType: 'Petrol' });
    setOriginInput(''); setDestInput('');
    setOrigin(null); setDestination(null);
    addNotification('Ride posted successfully! 🎉', 'success');
    console.log('✅ Ride saved to Firestore with id:', id);
  };

  // ── Book a seat → write booking to Firestore ──
  const harshitChhabiBookRide = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addNotification('Please sign in to book a ride', 'warning');
      navigate('/login?redirect=/carpool');
      return;
    }

    const profile = getUserProfile();
    const co2Kg = parseFloat(bookingEcoData?.carpoolSavings?.perPerson ?? 0);

    const bookingData = {
      rideId: bookingRide.id,
      rideDriverUid: bookingRide.driverUid,
      passengerUid: profile?.uid || null,
      passengerName: bookingForm.passengerName,
      passengerEmail: bookingForm.passengerEmail,
      passengerPhone: bookingForm.passengerPhone,
      notes: bookingForm.notes,
      // Ride snapshot for display in dashboard
      rideSnapshot: {
        driver: bookingRide.driver,
        startLocationAddress: bookingRide.startLocationAddress,
        destinationAddress: bookingRide.destinationAddress,
        departureTime: bookingRide.departureTime,
        vehicleType: bookingRide.vehicleType,
        costPerPerson: bookingRide.costPerPerson,
      },
      co2Kg,
    };

    const { id, error } = await addBooking_24BCI0098(bookingData);
    if (error) {
      addNotification('Booking failed. Please try again.', 'error');
      return;
    }

    // Credit passenger immediately with CO₂ savings (optimistic)
    if (profile?.uid && co2Kg > 0) {
      await updateUserStats_24BCI0098(profile.uid, co2Kg);
    }

    addNotification(`Booking request sent to ${bookingRide.driver}! Awaiting approval. 🕒`, 'success');
    console.log('✅ Booking saved to Firestore:', id);
    setBookingRide(null);
    setBookingForm({ passengerName: '', passengerEmail: '', passengerPhone: '', notes: '' });
  };

  const toggleFavorite = (ride) => {
    if (isFavorite(ride.id)) {
      removeFavorite(ride.id);
      addNotification('Removed from saved routes', 'info');
    } else {
      addFavorite(ride);
      addNotification('Route saved! ⭐', 'success');
    }
  };

  return (
    <div className="gr-page" id="carpool-page-24BCI0098">
      <datalist id="indian-cities-24BCI0098">
        {INDIAN_CITIES_24BCI0098.map((city, idx) => (
          <option key={idx} value={city.name} />
        ))}
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
            {/* Left — Map */}
            <AnimatedSection variant="fadeRight" style={{ gridColumn: 'span 1' }}>
              <div className="gr-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className="gr-heading-sm">🗺️ Route Map</h2>
                  <button className="gr-btn gr-btn-primary gr-btn-sm" onClick={() => setShowOfferForm(!showOfferForm)}>
                    {showOfferForm ? 'Cancel' : '+ Offer a Ride'}
                  </button>
                </div>
                <Suspense fallback={
                  <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-md)' }}>
                    <div className="gr-animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--gr-border)', borderTopColor: 'var(--gr-accent)', borderRadius: '50%' }} />
                  </div>
                }>
                  <IndiaMapView
                    onOriginSelect={setOrigin}
                    onDestinationSelect={setDestination}
                    origin={origin}
                    destination={destination}
                    showDirections={!!(origin && destination)}
                    height="400px"
                    zoom={5}
                    markers={offeredRides.map(r => ({
                      id: r.id,
                      lat: r.startLocation?.lat,
                      lng: r.startLocation?.lng,
                      name: `${r.driver} → ${r.destinationAddress}`,
                    }))}
                  />
                </Suspense>
              </div>
            </AnimatedSection>

            {/* Right — Offer Form or Ride List */}
            <AnimatedSection variant="fadeLeft" style={{ gridColumn: 'span 1' }}>
              {showOfferForm ? (
                <div className="gr-card">
                  <h2 className="gr-heading-sm" style={{ marginBottom: '1.5rem' }}>🚗 Offer a Ride</h2>
                  <form onSubmit={harshitChhabiSubmitRide}>
                    <div className="gr-input-group">
                      <label>Your Name</label>
                      <input className="gr-input" name="driverName" placeholder="Enter your name" value={formData_24BCI0098.driverName} onChange={handleFormChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="gr-input-group">
                        <label>Origin City</label>
                        <input className="gr-input" list="indian-cities-24BCI0098" value={originInput} onChange={handleManualOrigin} placeholder="Type a city…" required />
                      </div>
                      <div className="gr-input-group">
                        <label>Destination City</label>
                        <input className="gr-input" list="indian-cities-24BCI0098" value={destInput} onChange={handleManualDest} placeholder="Type a city…" required />
                      </div>
                    </div>

                    {/* HC-ERA Eco Analysis Panel */}
                    <AnimatePresence>
                      {ecoLoading && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ padding: '0.75rem', background: 'var(--gr-bg-primary)', borderRadius: 'var(--gr-radius-sm)', marginBottom: '1rem', border: '1px solid var(--gr-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--gr-text-secondary)' }}
                        >
                          <div style={{ width: 16, height: 16, border: '2px solid var(--gr-border)', borderTopColor: 'var(--gr-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                          Fetching real weather & calculating HC-ERA…
                        </motion.div>
                      )}
                      {ecoData && !ecoLoading && (
                        <motion.div
                          key="eco"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          style={{ background: 'var(--gr-bg-primary)', padding: '1rem', borderRadius: 'var(--gr-radius-sm)', marginBottom: '1rem', border: '1px solid var(--gr-border)' }}
                        >
                          <h4 style={{ color: 'var(--gr-accent)', marginBottom: '0.5rem', fontSize: '1rem' }}>🌿 HC-ERA Eco-Route Analysis</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                            <div style={{ color: '#a78bfa', gridColumn: 'span 2' }}><strong>🌤️ Real Weather:</strong> {ecoData.weather}</div>
                            <div style={{ opacity: 0.7 }}><strong>Raw CO₂:</strong> {ecoData.nonEcoNoWeather} kg</div>
                            <div style={{ color: '#fcd34d' }}><strong>Eco (No Wthr):</strong> {ecoData.ecoNoWeather} kg</div>
                            <div style={{ color: 'var(--gr-error)' }}><strong>Std + Weather:</strong> {ecoData.standardCO2} kg</div>
                            <div style={{ color: '#3b82f6', fontWeight: 600 }}><strong>Eco + Weather:</strong> {ecoData.ecoCO2} kg</div>
                            <div style={{ color: 'var(--gr-success)', fontSize: '0.95rem', fontWeight: 700, gridColumn: 'span 2' }}>
                              Net Algorithm Saved: {ecoData.savedCO2} kg CO₂
                            </div>
                            <div><strong>Your CO₂/person:</strong> {ecoData.carpoolSavings.perPerson} kg</div>
                            {ecoData.chargingTimeMins > 0 && (
                              <div style={{ color: '#0ea5e9' }}><strong>EV Charging:</strong> {ecoData.chargingTimeMins} mins</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="gr-input-group">
                      <label>Departure Time</label>
                      <input className="gr-input" name="departureTime" type="datetime-local" value={formData_24BCI0098.departureTime} onChange={handleFormChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '1rem' }}>
                      <div className="gr-input-group">
                        <label>Vehicle Model</label>
                        <input className="gr-input" name="vehicleType" placeholder="e.g. Honda City" value={formData_24BCI0098.vehicleType} onChange={handleFormChange} required />
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
                      <input className="gr-input" name="costPerPerson" type="number" min="0" placeholder="0" value={formData_24BCI0098.costPerPerson} onChange={handleFormChange} />
                    </div>
                    <button className="gr-btn gr-btn-primary" type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Post Ride to GreenRoute
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="gr-heading-sm" style={{ marginBottom: '1rem' }}>
                    Available Rides
                    {ridesLoading && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', opacity: 0.6 }}>Loading…</span>}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {!ridesLoading && offeredRides.length === 0 && (
                      <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
                        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚗</p>
                        <p>No rides available right now.</p>
                        <p className="gr-text-sm">Be the first to offer a ride!</p>
                      </div>
                    )}
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
                          {ride.savedCO2 && (
                            <p style={{ color: 'var(--gr-success)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                              🌿 {ride.savedCO2} kg CO₂ saved • {ride.weather}
                            </p>
                          )}
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

          {/* Benefits */}
          <AnimatedSection variant="fadeUp" style={{ marginTop: '4rem' }}>
            <div className="gr-card" style={{ background: 'var(--gr-gradient-accent)', padding: '3rem', borderRadius: 'var(--gr-radius-xl)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center', color: '#fff' }}>
                {[
                  { icon: '💰', title: 'Save Up to 75%', desc: 'Share fuel costs with fellow commuters' },
                  { icon: '🌿', title: 'Reduce CO₂', desc: 'Each shared ride cuts ~0.12 kg CO₂/km' },
                  { icon: '🤝', title: 'Build Community', desc: 'Meet neighbors and colleagues on your route' },
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

      {/* Booking Modal */}
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

              {/* Ride info */}
              <div style={{ background: 'var(--gr-bg-secondary)', padding: '1rem', borderRadius: 'var(--gr-radius-md)', marginBottom: '1.5rem' }}>
                <p><strong>{bookingRide.driver}</strong> • {bookingRide.vehicleType}</p>
                <p className="gr-text-sm">📍 {bookingRide.startLocationAddress} → {bookingRide.destinationAddress}</p>
                <p className="gr-text-sm">🕐 {formatDate_24BCI0098(bookingRide.departureTime)} • {bookingRide.costPerPerson}</p>

                {bookingEcoData && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gr-border)', fontSize: '0.85rem' }}>
                    <div style={{ color: 'var(--gr-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>HC-ERA Route Analysis:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <span style={{ color: '#a78bfa', gridColumn: 'span 2' }}>🌤️ Weather: {bookingEcoData.weather}</span>
                      <span style={{ opacity: 0.7 }}>🚙 Raw CO₂: {bookingEcoData.nonEcoNoWeather} kg</span>
                      <span style={{ color: '#fcd34d' }}>🌱 Eco (No Wthr): {bookingEcoData.ecoNoWeather} kg</span>
                      <span style={{ color: 'var(--gr-error)' }}>☁️ Std + Weather: {bookingEcoData.standardCO2} kg</span>
                      <span style={{ color: '#3b82f6' }}>⚡ Eco + Weather: {bookingEcoData.ecoCO2} kg</span>
                      <span style={{ color: 'var(--gr-success)', fontWeight: 600, gridColumn: 'span 2' }}>
                        💎 Net Saved: {bookingEcoData.savedCO2} kg CO₂ | Your Footprint: {bookingEcoData.carpoolSavings.perPerson} kg
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={harshitChhabiBookRide}>
                <div className="gr-input-group">
                  <label>Your Name</label>
                  <input className="gr-input" value={bookingForm.passengerName} onChange={(e) => setBookingForm({...bookingForm, passengerName: e.target.value})} required />
                </div>
                <div className="gr-input-group">
                  <label>Email</label>
                  <input className="gr-input" type="email" value={bookingForm.passengerEmail} onChange={(e) => setBookingForm({...bookingForm, passengerEmail: e.target.value})} required />
                </div>
                <div className="gr-input-group">
                  <label>Phone</label>
                  <input className="gr-input" type="tel" value={bookingForm.passengerPhone} onChange={(e) => setBookingForm({...bookingForm, passengerPhone: e.target.value})} />
                </div>
                <div className="gr-input-group">
                  <label>Notes (optional)</label>
                  <textarea className="gr-input" rows="2" value={bookingForm.notes} onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})} style={{ resize: 'vertical' }} />
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
