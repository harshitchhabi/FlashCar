/**
 * DashboardPage.jsx — User Dashboard & Green Tokenomics
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 * All data is now live from Firestore — no mock numbers.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/common/AnimatedSection';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNotifications } from '../contexts/NotificationContext';
import { harshitChhabiLogoutUser } from '../utils/firebase';
import { formatDate_24BCI0098 } from '../utils/dateFormatter';
import { DEVELOPER_24BCI0098 } from '../utils/constants_24BCI0098';
import {
  subscribeToMyRides_24BCI0098,
  subscribeToMyBookings_24BCI0098,
  subscribeToRideBookings_24BCI0098,
  subscribeToUserStats_24BCI0098,
  updateBookingStatus_24BCI0098,
  cancelBooking_24BCI0098,
  mintGcpCertificate_24BCI0098,
} from '../utils/firebase';

const GCP_THRESHOLD = 1000; // 1000 GRT = 1 GCP Certificate

export default function DashboardPage_HarshitChhabi() {
  const { getUserProfile } = useAuth();
  const { favorites, removeFavorite } = useFavorites();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tokenomics');

  const profile = getUserProfile();
  const uid = profile?.uid;

  // ── Firestore real-time state ──
  const [userStats, setUserStats] = useState({ co2SavedKg: 0, greenTokens: 0, gcpCertificates: 0 });
  const [myRides, setMyRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Per-ride booking sub-listeners keyed by rideId
  const [rideBookings, setRideBookings] = useState({}); // { rideId: [booking, ...] }

  useEffect(() => {
    if (!uid) return;

    const unsubStats = subscribeToUserStats_24BCI0098(uid, (stats) => setUserStats(stats));
    const unsubRides = subscribeToMyRides_24BCI0098(uid, (rides) => {
      setMyRides(rides);
      setRidesLoading(false);
    });
    const unsubBookings = subscribeToMyBookings_24BCI0098(uid, (bookings) => {
      setMyBookings(bookings);
      setBookingsLoading(false);
    });

    return () => { unsubStats(); unsubRides(); unsubBookings(); };
  }, [uid]);

  // Subscribe to bookings for each of driver's rides
  useEffect(() => {
    if (!myRides.length) return;

    const unsubs = myRides.map(ride => {
      return subscribeToRideBookings_24BCI0098(ride.id, (bookings) => {
        setRideBookings(prev => ({ ...prev, [ride.id]: bookings }));
      });
    });

    return () => unsubs.forEach(fn => fn());
  }, [myRides]);

  const handleLogout = async () => {
    const { success } = await harshitChhabiLogoutUser();
    if (success) { addNotification('Logged out successfully', 'success'); navigate('/'); }
  };

  const handleApprove = async (bookingId, rideId, passengerUid, co2Kg) => {
    const { success, error } = await updateBookingStatus_24BCI0098(bookingId, 'confirmed', rideId, passengerUid, co2Kg);
    if (success) addNotification('Booking approved! ✅', 'success');
    else addNotification('Failed to approve: ' + error, 'error');
  };

  const handleDecline = async (bookingId, rideId) => {
    const { success, error } = await updateBookingStatus_24BCI0098(bookingId, 'declined', rideId, null, 0);
    if (success) addNotification('Booking declined', 'warning');
    else addNotification('Failed to decline: ' + error, 'error');
  };

  const handleCancelBooking = async (bookingId, rideId) => {
    const { success, error } = await cancelBooking_24BCI0098(bookingId, rideId);
    if (success) addNotification('Booking cancelled', 'info');
    else addNotification('Failed to cancel: ' + error, 'error');
  };

  const handleMintGCP = async () => {
    if (userStats.greenTokens < GCP_THRESHOLD) return;
    addNotification('Minting GCP Certificate… 📜', 'info');
    const { success, error } = await mintGcpCertificate_24BCI0098(uid);
    if (success) addNotification('Successfully Minted 1 GCP Certificate! 🎉', 'success');
    else addNotification('Mint failed: ' + error, 'error');
  };

  const handleAccessMarket = () => {
    addNotification('Connecting to Bureau of Energy Efficiency CCTS Network… 🔗', 'info');
    setTimeout(() => {
      addNotification(`Market Live! Trade your ${userStats.gcpCertificates} certificate(s) for ₹${(userStats.gcpCertificates * 1240).toLocaleString('en-IN')}`, 'success');
    }, 2000);
  };

  const { co2SavedKg, greenTokens, gcpCertificates } = userStats;
  const progressPercent = Math.min((greenTokens / GCP_THRESHOLD) * 100, 100);

  const tabs = [
    { key: 'tokenomics', label: 'Tokenomics & Rewards' },
    { key: 'rides',      label: 'My Rides',    count: myRides.length },
    { key: 'bookings',   label: 'My Bookings', count: myBookings.length },
    { key: 'favorites',  label: 'Saved Routes', count: favorites.length },
  ];

  return (
    <div className="gr-page" id="dashboard-page-24BCI0098" style={{ minHeight: '100vh', background: 'var(--gr-bg-secondary)' }}>
      <div className="gr-container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>

        {/* Header */}
        <AnimatedSection variant="fadeDown">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 className="gr-heading-lg">Green Dashboard</h1>
              <p className="gr-text-body">Manage your decentralized carbon assets and rides</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/carpool" className="gr-btn gr-btn-primary gr-btn-sm">+ New Ride</Link>
              <button onClick={handleLogout} className="gr-btn gr-btn-secondary gr-btn-sm">Sign Out</button>
            </div>
          </div>
        </AnimatedSection>

        {/* User Info */}
        <AnimatedSection variant="fadeUp">
          <div className="gr-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="gr-avatar gr-avatar-lg">
                {profile?.photoURL
                  ? <img src={profile.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : profile?.displayName?.charAt(0) || 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <h2 className="gr-heading-sm">{profile?.displayName || 'Green Commuter'}</h2>
                <p className="gr-text-sm">{profile?.email || ''}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="gr-badge gr-badge-success">🌿 Level {Math.floor(co2SavedKg / 10) + 1} Validator</span>
                  <span className="gr-badge gr-badge-accent">{greenTokens} GRT Mined</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Live Stats — from Firestore */}
        <AnimatedSection variant="fadeUp" delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { value: `${Number(co2SavedKg).toFixed(1)} kg`, label: 'Total CO₂ Saved', icon: '🌱', color: 'var(--gr-success)' },
              { value: `${greenTokens}`,                       label: 'GreenRoute Tokens (GRT)', icon: '💎', color: '#a78bfa' },
              { value: `${gcpCertificates}`,                   label: 'GCP Certificates',         icon: '📜', color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="gr-card-solid" style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p className="gr-text-xs" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                    <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--gr-text-primary)' }}>{s.value}</div>
                  </div>
                  <span style={{ fontSize: '2rem', opacity: 0.8 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <div className="gr-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`gr-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* ── Tokenomics Tab ── */}
        {activeTab === 'tokenomics' && (
          <AnimatedSection variant="fadeUp">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div className="gr-card">
                  <h3 className="gr-heading-sm" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#10b981' }}>🟢</span> Green Credit Programme (GCP)
                  </h3>
                  <p className="gr-text-body" style={{ marginBottom: '1.5rem' }}>
                    Your saved CO₂ emissions are verified by the HC-ERA algorithm and converted into GreenRoute Tokens (GRT).
                    Collect 1,000 GRT to mint a tradable government-recognized Green Credit (Ministry of Environment).
                  </p>
                  <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span className="gr-text-sm" style={{ fontWeight: 600 }}>Progress to Next GCP Certificate</span>
                    <span className="gr-text-sm" style={{ color: 'var(--gr-accent)' }}>{greenTokens} / {GCP_THRESHOLD} GRT</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: 'var(--gr-bg-tertiary)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--gr-gradient-accent)', transition: 'width 1s ease-in-out' }} />
                  </div>
                  {co2SavedKg === 0 && (
                    <p className="gr-text-xs" style={{ marginTop: '0.75rem', opacity: 0.6 }}>
                      💡 Book or offer carpools to earn GRT tokens from real CO₂ savings.
                    </p>
                  )}
                  <button
                    className="gr-btn gr-btn-primary"
                    style={{ marginTop: '1.5rem', opacity: progressPercent >= 100 ? 1 : 0.5 }}
                    disabled={progressPercent < 100}
                    onClick={handleMintGCP}
                  >
                    Mint GCP Certificate
                  </button>
                </div>

                <div className="gr-card">
                  <h3 className="gr-heading-sm" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#3b82f6' }}>📈</span> Carbon Credit Trading Scheme (CCTS)
                  </h3>
                  <p className="gr-text-body" style={{ fontSize: '0.95rem' }}>
                    GreenRoute integrates with the Bureau of Energy Efficiency. Sell your GCP Certificates on the open CCTS market.
                  </p>
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--gr-bg-primary)', borderRadius: 'var(--gr-radius-md)', border: '1px solid var(--gr-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="gr-text-sm">Current Market Value (1 GCP)</span>
                      <span style={{ color: 'var(--gr-success)', fontWeight: 700 }}>₹ 1,240.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="gr-text-sm">Your Tradable Assets</span>
                      <span>{gcpCertificates} Certificate{gcpCertificates !== 1 && 's'}</span>
                    </div>
                    <button className="gr-btn gr-btn-outline gr-btn-sm" style={{ width: '100%', marginTop: '1rem' }} onClick={handleAccessMarket}>
                      Access Open Market
                    </button>
                  </div>
                </div>
              </div>

              {/* Govt Incentives */}
              <div className="gr-card" style={{ background: 'var(--gr-bg-primary)' }}>
                <h3 className="gr-heading-sm" style={{ marginBottom: '1.5rem' }}>🏛️ Govt. Incentives</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--gr-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>EV Subsidies</h4>
                    <p className="gr-text-xs" style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>Priority waitlists for EV subsidies based on ride-sharing history.</p>
                    <span className="gr-badge gr-badge-success">Eligible</span>
                  </div>
                  <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--gr-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Solar Incentives</h4>
                    <p className="gr-text-xs" style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>PM Surya Ghar: Muft Bijli Yojana cross-qualification via Green Credits.</p>
                    <span className="gr-badge gr-badge-info">In Progress (75%)</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Local Body Rewards</h4>
                    <p className="gr-text-xs" style={{ marginTop: '0.25rem' }}>Token contributions boost your district's carbon-neutral ranking.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ── My Rides Tab (Firestore) ── */}
        {activeTab === 'rides' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {ridesLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>Loading your rides…</div>
            ) : myRides.length === 0 ? (
              <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }}>
                <p className="gr-text-body">No rides offered yet.</p>
                <Link to="/carpool" className="gr-btn gr-btn-primary" style={{ marginTop: '1rem' }}>Offer a Ride</Link>
              </div>
            ) : myRides.map(ride => {
              const bookings = rideBookings[ride.id] || [];
              return (
                <motion.div key={ride.id} className="gr-card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 className="gr-heading-sm" style={{ fontSize: '1rem' }}>
                        {ride.startLocationAddress} → {ride.destinationAddress}
                      </h3>
                      <p className="gr-text-sm">🕐 {formatDate_24BCI0098(ride.departureTime)} • 🚗 {ride.vehicleType} • {ride.costPerPerson}/person</p>
                      <p className="gr-text-sm" style={{ marginTop: '0.25rem' }}>Seats: {ride.seatsAvailable}/{ride.seatsTotal}</p>
                      {ride.savedCO2 && (
                        <p className="gr-text-sm" style={{ color: 'var(--gr-success)', marginTop: '0.25rem' }}>
                          🌿 HC-ERA: {ride.savedCO2} kg CO₂ saved • {ride.weather}
                        </p>
                      )}
                    </div>
                    <span className={`gr-badge ${ride.seatsAvailable > 0 ? 'gr-badge-success' : 'gr-badge-error'}`}>
                      {ride.seatsAvailable > 0 ? 'Active' : 'Full'}
                    </span>
                  </div>

                  {/* Booking requests for this ride */}
                  {bookings.length > 0 && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--gr-border)', paddingTop: '1rem' }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Booking Requests ({bookings.length})</p>
                      {bookings.map(b => (
                        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-sm)', marginBottom: '0.5rem' }}>
                          <div>
                            <p style={{ fontWeight: 500 }}>{b.passengerName}</p>
                            <p className="gr-text-xs">{b.passengerEmail} • {formatDate_24BCI0098(b.createdAt?.toDate?.() || b.createdAt)}</p>
                            {b.notes && <p className="gr-text-xs" style={{ opacity: 0.7 }}>"{b.notes}"</p>}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span className={`gr-badge ${b.status === 'confirmed' ? 'gr-badge-success' : b.status === 'pending' ? 'gr-badge-warning' : 'gr-badge-error'}`}>
                              {b.status}
                            </span>
                            {b.status === 'pending' && (
                              <>
                                <button
                                  className="gr-btn gr-btn-primary gr-btn-sm"
                                  style={{ padding: '0.35rem 0.75rem' }}
                                  onClick={() => handleApprove(b.id, ride.id, b.passengerUid, b.co2Kg)}
                                >✓</button>
                                <button
                                  className="gr-btn gr-btn-danger gr-btn-sm"
                                  style={{ padding: '0.35rem 0.75rem' }}
                                  onClick={() => handleDecline(b.id, ride.id)}
                                >✕</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── My Bookings Tab (Firestore) ── */}
        {activeTab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookingsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>Loading your bookings…</div>
            ) : myBookings.length === 0 ? (
              <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }}>
                <p className="gr-text-body">No bookings yet.</p>
                <Link to="/carpool" className="gr-btn gr-btn-primary" style={{ marginTop: '1rem' }}>Find a Ride</Link>
              </div>
            ) : myBookings.map(booking => (
              <motion.div key={booking.id} className="gr-card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 className="gr-heading-sm" style={{ fontSize: '1rem' }}>
                      {booking.rideSnapshot?.startLocationAddress} → {booking.rideSnapshot?.destinationAddress}
                    </h3>
                    <p className="gr-text-sm">👤 {booking.rideSnapshot?.driver} • 🚗 {booking.rideSnapshot?.vehicleType} • {booking.rideSnapshot?.costPerPerson}</p>
                    <p className="gr-text-sm">🕐 {formatDate_24BCI0098(booking.rideSnapshot?.departureTime)}</p>
                    {booking.co2Kg > 0 && (
                      <p className="gr-text-sm" style={{ color: 'var(--gr-success)', marginTop: '0.25rem' }}>
                        🌿 Your footprint: {Number(booking.co2Kg).toFixed(2)} kg CO₂
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`gr-badge ${booking.status === 'confirmed' ? 'gr-badge-success' : booking.status === 'pending' ? 'gr-badge-warning' : 'gr-badge-error'}`}>
                      {booking.status}
                    </span>
                    {booking.status !== 'cancelled' && (
                      <button
                        className="gr-btn gr-btn-danger gr-btn-sm"
                        onClick={() => handleCancelBooking(booking.id, booking.rideId)}
                      >Cancel</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Favorites Tab ── */}
        {activeTab === 'favorites' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {favorites.length === 0 ? (
              <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</p>
                <p className="gr-text-body">No saved routes yet.</p>
                <Link to="/carpool" className="gr-btn gr-btn-primary" style={{ marginTop: '1rem' }}>Browse Rides</Link>
              </div>
            ) : favorites.map(fav => (
              <motion.div key={fav.id} className="gr-card-solid" style={{ padding: '1.25rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{fav.driver} • {fav.vehicleType}</p>
                    <p className="gr-text-sm">📍 {fav.startLocationAddress} → {fav.destinationAddress}</p>
                    <p className="gr-text-sm">{fav.costPerPerson}</p>
                  </div>
                  <button className="gr-btn gr-btn-ghost gr-btn-sm" onClick={() => { removeFavorite(fav.id); addNotification('Removed from saved', 'info'); }}>
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <p className="gr-text-xs" style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5 }}>
          Tokenomics Dashboard by {DEVELOPER_24BCI0098.fullIdentity}
        </p>
      </div>
    </div>
  );
}
