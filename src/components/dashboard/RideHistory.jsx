/**
 * RideHistory_24BCI0098.jsx — Ride History Display Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Displays past and upcoming ride history with status badges.
 */
import { motion } from 'framer-motion';
import { formatDate_24BCI0098 } from '../../utils/dateFormatter';

// harshitChhabiStatusColors — status to badge class mapping (24BCI0098)
const harshitChhabiStatusColors = {
  confirmed: 'gr-badge-success',
  pending: 'gr-badge-warning',
  declined: 'gr-badge-error',
  completed: 'gr-badge-info',
  cancelled: 'gr-badge-error',
};

/**
 * class HarshitChhabiRideHistory — Ride history list
 * Registration: 24BCI0098
 * @param {Array} rides - Array of ride history entries
 * @param {string} type - 'offered' or 'booked'
 */
export default function RideHistory_24BCI0098({ rides = [], type = 'booked' }) {
  console.log(`RideHistory (${type}) rendered — Harshit Chhabi 24BCI0098, count: ${rides.length}`);

  if (rides.length === 0) {
    return (
      <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }} id="ride-history-empty-24BCI0098">
        <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚗</p>
        <p className="gr-text-body">
          No {type === 'offered' ? 'offered' : 'booked'} rides yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id={`ride-history-${type}-24BCI0098`}>
      {rides.map((entry_24BCI0098, index) => {
        const ride = type === 'booked' ? entry_24BCI0098.ride : entry_24BCI0098;
        const status = type === 'booked' ? entry_24BCI0098.status : (ride.seatsAvailable > 0 ? 'active' : 'full');

        return (
          <motion.div
            key={entry_24BCI0098.id || index}
            className="gr-card-solid"
            style={{ padding: '1.25rem' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--gr-text-primary)' }}>
                  {ride.startLocationAddress || 'Unknown'} → {ride.destinationAddress || 'Unknown'}
                </h4>
                {type === 'booked' && (
                  <p className="gr-text-sm" style={{ marginTop: '0.25rem' }}>
                    👤 Driver: {ride.driver} • 🚗 {ride.vehicleType}
                  </p>
                )}
                <p className="gr-text-sm">
                  🕐 {formatDate_24BCI0098(ride.departureTime)} • 💰 {ride.cost ? `₹${ride.cost}` : ride.costPerPerson || 'Free'}
                </p>
              </div>
              <span className={`gr-badge ${harshitChhabiStatusColors[status] || 'gr-badge-info'}`}>
                {status}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
