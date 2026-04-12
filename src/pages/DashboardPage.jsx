/**
 * DashboardPage.jsx — User Dashboard & Green Tokenomics
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 * Integrates Indian Government "Green Credit Programme (GCP)" and "CCTS".
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/common/AnimatedSection';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNotifications } from '../contexts/NotificationContext';
import { harshitChhabiLogoutUser } from '../utils/firebase';
import { formatDate_24BCI0098 } from '../utils/dateFormatter';
import { DEVELOPER_24BCI0098 } from '../utils/constants_24BCI0098';

// Mock dashboard data — Harshit Chhabi (24BCI0098)
const mockOfferedRides_24BCI0098 = [
  {
    id: 'dash-ride-1',
    startLocationAddress: 'Connaught Place, Delhi',
    destinationAddress: 'Cyber Hub, Gurugram',
    departureTime: '2026-04-15T08:30:00',
    seatsAvailable: 2,
    seatsTotal: 4,
    vehicleType: 'Maruti Baleno',
    cost: 150,
    bookings: [
      { id: 'b1', passengerName: 'Arjun Kumar', passengerEmail: 'arjun@example.com', status: 'confirmed', createdAt: '2026-04-14T14:30:00' },
      { id: 'b2', passengerName: 'Sanya Gupta', passengerEmail: 'sanya@example.com', status: 'pending', createdAt: '2026-04-14T16:45:00' },
    ],
  },
];

const mockBookedRides_24BCI0098 = [
  {
    id: 'b3',
    ride: { driver: 'Vikram Patel', startLocationAddress: 'Koramangala, Bangalore', destinationAddress: 'HITEC City, Hyderabad', departureTime: '2026-04-17T09:00:00', vehicleType: 'Toyota Innova', cost: 800 },
    status: 'confirmed',
    createdAt: '2026-04-15T11:20:00',
  },
];

export default function DashboardPage_HarshitChhabi() {
  const { getUserProfile } = useAuth();
  const { favorites, removeFavorite } = useFavorites();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tokenomics');
  const [offeredRides, setOfferedRides] = useState(mockOfferedRides_24BCI0098);
  const [bookedRides, setBookedRides] = useState(mockBookedRides_24BCI0098);

  const profile = getUserProfile();

  const handleLogout = async () => {
    const { success } = await harshitChhabiLogoutUser();
    if (success) {
      addNotification('Logged out successfully', 'success');
      navigate('/');
    }
  };

  const handleApprove = (rideId, bookingId) => {
    setOfferedRides(offeredRides.map(r => r.id === rideId ? {
      ...r,
      bookings: r.bookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b),
      seatsAvailable: r.seatsAvailable - 1,
    } : r));
    addNotification('Booking approved! ✅', 'success');
  };

  const handleDecline = (rideId, bookingId) => {
    setOfferedRides(offeredRides.map(r => r.id === rideId ? {
      ...r,
      bookings: r.bookings.map(b => b.id === bookingId ? { ...b, status: 'declined' } : b),
    } : r));
    addNotification('Booking declined', 'warning');
  };

  const handleCancelBooking = (bookingId) => {
    setBookedRides(bookedRides.filter(b => b.id !== bookingId));
    addNotification('Booking cancelled', 'info');
  };

  const tabs = [
    { key: 'tokenomics', label: 'Tokenomics & Rewards' },
    { key: 'rides', label: 'My Rides', count: offeredRides.length },
    { key: 'bookings', label: 'My Bookings', count: bookedRides.length },
    { key: 'favorites', label: 'Saved Routes', count: favorites.length },
  ];

  // Tokenomics Mock Variables - Now using state for the demo
  const [totalCO2Saved] = useState(142.5); // kg
  const [greenTokens, setGreenTokens] = useState(Math.floor(142.5 * 10)); // 1 kg = 10 GRT
  const [gcpCertificates, setGcpCertificates] = useState(1);
  const gcpThreshold = 1000;
  const progressPercent = Math.min((greenTokens / gcpThreshold) * 100, 100);

  const handleMintGCP = () => {
    if (greenTokens >= gcpThreshold) {
      addNotification('Minting Government Recognized GCP Certificate... 📜', 'info');
      setTimeout(() => {
        setGreenTokens(prev => prev - gcpThreshold);
        setGcpCertificates(prev => prev + 1);
        addNotification('Successfully Minted 1 GCP Certificate! 🎉', 'success');
      }, 1500);
    }
  };

  const handleAccessMarket = () => {
    addNotification('Connecting to Bureau of Energy Efficiency CCTS Network... 🔗', 'info');
    setTimeout(() => {
      addNotification(`Market Live! You can trade your ${gcpCertificates} certificates for ₹${(gcpCertificates * 1240).toLocaleString('en-IN')}`, 'success');
    }, 2000);
  };

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

        {/* User Info Card */}
        <AnimatedSection variant="fadeUp">
          <div className="gr-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="gr-avatar gr-avatar-lg">
                {profile?.photoURL ?
                  <img src={profile.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> :
                  profile?.displayName?.charAt(0) || 'U'
                }
              </div>
              <div style={{ flex: 1 }}>
                <h2 className="gr-heading-sm">{profile?.displayName || "Green Commuter"}</h2>
                <p className="gr-text-sm">{profile?.email || "harshit.chhabi@example.com"}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="gr-badge gr-badge-success">🌿 Level 4 Validator</span>
                  <span className="gr-badge gr-badge-accent">{greenTokens} GRT Mined</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Summary Stats */}
        <AnimatedSection variant="fadeUp" delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { value: `${totalCO2Saved} kg`, label: 'Total CO₂ Saved', icon: '🌱', color: 'var(--gr-success)' },
              { value: `${greenTokens}`, label: 'GreenRoute Tokens (GRT)', icon: '💎', color: '#a78bfa' },
              { value: `${gcpCertificates}`, label: 'GCP Certificates', icon: '📜', color: '#f59e0b' },
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

        {/* Tabs Navigation */}
        <div className="gr-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`gr-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'tokenomics' && (
          <AnimatedSection variant="fadeUp">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              
              {/* Tokenomics Left Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="gr-card">
                  <h3 className="gr-heading-sm" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#10b981' }}>🟢</span> Green Credit Programme (GCP)
                  </h3>
                  <p className="gr-text-body" style={{ marginBottom: '1.5rem' }}>
                    Your saved CO₂ emissions are actively verified by the HC-ERA algorithm and converted into GreenRoute Tokens (GRT). 
                    Collect 1,000 GRT to mint a tradable government-recognized Green Credit under the Ministry of Environment framework.
                  </p>
                  
                  <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span className="gr-text-sm" style={{ fontWeight: 600 }}>Progress to Next GCP Certificate</span>
                    <span className="gr-text-sm" style={{ color: 'var(--gr-accent)' }}>{greenTokens} / {gcpThreshold} GRT</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: 'var(--gr-bg-tertiary)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--gr-gradient-accent)', transition: 'width 1s ease-in-out' }}></div>
                  </div>
                  
                  <button className="gr-btn gr-btn-primary" style={{ marginTop: '1.5rem', opacity: progressPercent >= 100 ? 1 : 0.5 }} disabled={progressPercent < 100} onClick={handleMintGCP}>
                    Mint GCP Certificate
                  </button>
                </div>

                <div className="gr-card">
                  <h3 className="gr-heading-sm" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#3b82f6' }}>📈</span> Carbon Credit Trading Scheme (CCTS)
                  </h3>
                  <p className="gr-text-body" style={{ fontSize: '0.95rem' }}>
                    GreenRoute integrates with the Bureau of Energy Efficiency. You can sell your unlocked GCP Certificates on the open CCTS market to industries required to offset their emissions (PAT Scheme).
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
                    <button className="gr-btn gr-btn-outline gr-btn-sm" style={{ width: '100%', marginTop: '1rem' }} onClick={handleAccessMarket}>Access Open Market</button>
                  </div>
                </div>
              </div>

              {/* Government Schemes Subsidies Panel */}
              <div className="gr-card" style={{ background: 'var(--gr-bg-primary)' }}>
                <h3 className="gr-heading-sm" style={{ marginBottom: '1.5rem' }}>🏛️ Govt. Incentives</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--gr-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gr-text-primary)' }}>EV Subsidies</h4>
                    <p className="gr-text-xs" style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                      Unlock priority waitlists for EV subsidies based on your ride-sharing history.
                    </p>
                    <span className="gr-badge gr-badge-success">Eligible</span>
                  </div>

                  <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--gr-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gr-text-primary)' }}>Solar Incentives</h4>
                    <p className="gr-text-xs" style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                      PM Surya Ghar: Muft Bijli Yojana cross-qualification through Green Credits.
                    </p>
                    <span className="gr-badge gr-badge-info">In Progress (75%)</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gr-text-primary)' }}>Local Body Rewards</h4>
                    <p className="gr-text-xs" style={{ marginTop: '0.25rem' }}>
                      Your token contribution boosts your district's rank for Carbon Neutral Panchayat awards.
                    </p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--gr-text-secondary)' }}>
                      Current City Rank: <strong>#4</strong>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </AnimatedSection>
        )}

        {/* Existing Rides / Bookings / Favorites Content */}
        {activeTab === 'rides' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {offeredRides.length === 0 ? (
              <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }}>
                <p className="gr-text-body">No rides offered yet.</p>
                <Link to="/carpool" className="gr-btn gr-btn-primary" style={{ marginTop: '1rem' }}>Offer a Ride</Link>
              </div>
            ) : offeredRides.map((ride) => (
              <motion.div key={ride.id} className="gr-card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 className="gr-heading-sm" style={{ fontSize: '1rem' }}>{ride.startLocationAddress} → {ride.destinationAddress}</h3>
                    <p className="gr-text-sm">🕐 {formatDate_24BCI0098(ride.departureTime)} • 🚗 {ride.vehicleType} • ₹{ride.cost}/person</p>
                    <p className="gr-text-sm" style={{ marginTop: '0.25rem' }}>Seats: {ride.seatsAvailable}/{ride.seatsTotal}</p>
                  </div>
                  <span className={`gr-badge ${ride.seatsAvailable > 0 ? 'gr-badge-success' : 'gr-badge-error'}`}>
                    {ride.seatsAvailable > 0 ? 'Active' : 'Full'}
                  </span>
                </div>
                {ride.bookings.length > 0 && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--gr-border)', paddingTop: '1rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Booking Requests ({ride.bookings.length})</p>
                    {ride.bookings.map((b) => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-sm)', marginBottom: '0.5rem' }}>
                        <div>
                          <p style={{ fontWeight: 500 }}>{b.passengerName}</p>
                          <p className="gr-text-xs">{b.passengerEmail} • {formatDate_24BCI0098(b.createdAt)}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className={`gr-badge ${b.status === 'confirmed' ? 'gr-badge-success' : b.status === 'pending' ? 'gr-badge-warning' : 'gr-badge-error'}`}>
                            {b.status}
                          </span>
                          {b.status === 'pending' && (
                            <>
                              <button className="gr-btn gr-btn-primary gr-btn-sm" style={{ padding: '0.35rem 0.75rem' }} onClick={() => handleApprove(ride.id, b.id)}>✓</button>
                              <button className="gr-btn gr-btn-danger gr-btn-sm" style={{ padding: '0.35rem 0.75rem' }} onClick={() => handleDecline(ride.id, b.id)}>✕</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookedRides.length === 0 ? (
              <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }}>
                <p className="gr-text-body">No bookings yet.</p>
                <Link to="/carpool" className="gr-btn gr-btn-primary" style={{ marginTop: '1rem' }}>Find a Ride</Link>
              </div>
            ) : bookedRides.map((booking) => (
              <motion.div key={booking.id} className="gr-card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 className="gr-heading-sm" style={{ fontSize: '1rem' }}>{booking.ride.startLocationAddress} → {booking.ride.destinationAddress}</h3>
                    <p className="gr-text-sm">👤 {booking.ride.driver} • 🚗 {booking.ride.vehicleType} • ₹{booking.ride.cost}</p>
                    <p className="gr-text-sm">🕐 {formatDate_24BCI0098(booking.ride.departureTime)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`gr-badge ${booking.status === 'confirmed' ? 'gr-badge-success' : 'gr-badge-warning'}`}>{booking.status}</span>
                    <button className="gr-btn gr-btn-danger gr-btn-sm" onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Favorites Tab Content */}
        {activeTab === 'favorites' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {favorites.length === 0 ? (
              <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</p>
                <p className="gr-text-body">No saved routes yet.</p>
                <Link to="/carpool" className="gr-btn gr-btn-primary" style={{ marginTop: '1rem' }}>Browse Rides</Link>
              </div>
            ) : favorites.map((fav) => (
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

        {/* Developer tag */}
        <p className="gr-text-xs" style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5 }}>
          Tokenomics Dashboard by {DEVELOPER_24BCI0098.fullIdentity}
        </p>
      </div>
    </div>
  );
}
