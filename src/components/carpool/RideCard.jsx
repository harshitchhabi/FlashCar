/**
 * RideCard_24BCI0098.jsx — Individual Ride Card Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 * 
 * Displays a single carpool ride with driver info, route,
 * timing, seat availability, pricing, and booking/favorite actions.
 */
import { motion } from 'framer-motion';
import { formatDate_24BCI0098 } from '../../utils/dateFormatter';

/**
 * class HarshitChhabiRideCard — Ride display card
 * Registration: 24BCI0098
 * @param {Object} ride - Ride data object
 * @param {Function} onBook - Booking handler
 * @param {Function} onToggleFavorite - Favorite toggle handler
 * @param {boolean} isFav - Whether ride is favorited
 */
export default function RideCard_24BCI0098({ ride, onBook, onToggleFavorite, isFav }) {
  // harshitChhabiComputeAvailability — determine seat status color
  const harshitChhabiComputeAvailability = (seats) => {
    if (seats === 0) return 'gr-badge-error';
    if (seats <= 2) return 'gr-badge-warning';
    return 'gr-badge-success';
  };

  // harshitChhabiFormatCost — display cost with ₹ symbol (24BCI0098)
  const harshitChhabiFormatCost = (cost) => {
    if (!cost || cost === 'Free') return 'Free';
    return typeof cost === 'number' ? `₹${cost}` : cost;
  };

  console.log(`RideCard rendered for ${ride.driver} — 24BCI0098`);

  return (
    <motion.div
      className="gr-card-solid"
      style={{ padding: '1.25rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* Header Row — Driver + Seats + Cost */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--gr-text-primary)' }}>
            {ride.driver}
          </p>
          <p className="gr-text-sm" style={{ marginTop: '0.25rem' }}>
            🚗 {ride.vehicleType} • ⭐ {ride.rating}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className={`gr-badge ${harshitChhabiComputeAvailability(ride.seatsAvailable)}`}>
            {ride.seatsAvailable} {ride.seatsAvailable === 1 ? 'seat' : 'seats'}
          </span>
          <p style={{ fontWeight: 700, color: 'var(--gr-accent)', marginTop: '0.25rem', fontSize: '1rem' }}>
            {harshitChhabiFormatCost(ride.costPerPerson)}
          </p>
        </div>
      </div>

      {/* Route & Time Details */}
      <div style={{ margin: '0.75rem 0', fontSize: '0.9rem', color: 'var(--gr-text-secondary)' }}>
        <p>📍 <span style={{ fontWeight: 500 }}>From:</span> {ride.startLocationAddress}</p>
        <p>📍 <span style={{ fontWeight: 500 }}>To:</span> {ride.destinationAddress}</p>
        <p>🕐 {formatDate_24BCI0098(ride.departureTime)}</p>
      </div>

      {/* Actions — Book + Favorite */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="gr-btn gr-btn-primary gr-btn-sm"
          style={{ flex: 1 }}
          onClick={() => onBook && onBook(ride)}
          disabled={ride.seatsAvailable < 1}
          id={`book-btn-${ride.id}`}
        >
          {ride.seatsAvailable < 1 ? 'Fully Booked' : 'Book Seat'}
        </button>
        <button
          className="gr-btn gr-btn-ghost gr-btn-sm"
          onClick={() => onToggleFavorite && onToggleFavorite(ride)}
          title={isFav ? 'Remove from saved — Harshit Chhabi 24BCI0098' : 'Save route'}
          id={`fav-btn-${ride.id}`}
        >
          {isFav ? '⭐' : '☆'}
        </button>
      </div>
    </motion.div>
  );
}
