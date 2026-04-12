/**
 * BookingModal_24BCI0098.jsx — Ride Booking Modal Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Animated modal dialog for confirming a carpool ride booking.
 * Uses Framer Motion for smooth entry/exit animations.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate_24BCI0098 } from '../../utils/dateFormatter';

/**
 * class HarshitChhabiBookingModal — Booking confirmation modal
 * Registration: 24BCI0098
 * @param {Object} ride - The ride being booked
 * @param {Function} onClose - Close modal handler
 * @param {Function} onConfirm - Confirm booking handler
 */
export default function BookingModal_24BCI0098({ ride, onClose, onConfirm }) {
  // harshitChhabiBookingState — form state for passenger info
  const [harshitChhabiBookingState, setBookingState] = useState({
    passengerName_24BCI0098: '',
    passengerEmail_24BCI0098: '',
    passengerPhone_24BCI0098: '',
    notes_24BCI0098: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // harshitChhabiHandleChange — update form field
  const harshitChhabiHandleChange = (e) => {
    const { name, value } = e.target;
    setBookingState((prev) => ({ ...prev, [name]: value }));
  };

  // harshitChhabiSubmitBooking — process booking submission (24BCI0098)
  const harshitChhabiSubmitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Booking submitted by Harshit Chhabi — 24BCI0098:', harshitChhabiBookingState);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (onConfirm) {
      onConfirm({
        ...harshitChhabiBookingState,
        rideId: ride.id,
        timestamp_24BCI0098: new Date().toISOString(),
      });
    }
    setIsSubmitting(false);
  };

  if (!ride) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="gr-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        id="booking-modal-overlay-24BCI0098"
      >
        <motion.div
          className="gr-modal"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          id="booking-modal-24BCI0098"
        >
          {/* Header */}
          <div className="gr-modal-header">
            <h3>🎫 Book a Ride</h3>
            <button className="gr-modal-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          {/* Ride Summary — Harshit Chhabi (24BCI0098) */}
          <div style={{
            background: 'var(--gr-bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--gr-radius-md)',
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--gr-accent)',
          }}>
            <p style={{ fontWeight: 600 }}>👤 {ride.driver} • 🚗 {ride.vehicleType}</p>
            <p className="gr-text-sm" style={{ marginTop: '0.25rem' }}>
              📍 {ride.startLocationAddress} → {ride.destinationAddress}
            </p>
            <p className="gr-text-sm">
              🕐 {formatDate_24BCI0098(ride.departureTime)} • 💰 {ride.costPerPerson}
            </p>
            <p className="gr-text-sm">
              🪑 {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Booking Form */}
          <form onSubmit={harshitChhabiSubmitBooking}>
            <div className="gr-input-group">
              <label htmlFor="passengerName_24BCI0098">Your Name</label>
              <input
                className="gr-input"
                id="passengerName_24BCI0098"
                name="passengerName_24BCI0098"
                type="text"
                placeholder="e.g. Harshit Chhabi"
                value={harshitChhabiBookingState.passengerName_24BCI0098}
                onChange={harshitChhabiHandleChange}
                required
              />
            </div>
            <div className="gr-input-group">
              <label htmlFor="passengerEmail_24BCI0098">Email</label>
              <input
                className="gr-input"
                id="passengerEmail_24BCI0098"
                name="passengerEmail_24BCI0098"
                type="email"
                placeholder="you@example.com"
                value={harshitChhabiBookingState.passengerEmail_24BCI0098}
                onChange={harshitChhabiHandleChange}
                required
              />
            </div>
            <div className="gr-input-group">
              <label htmlFor="passengerPhone_24BCI0098">Phone (optional)</label>
              <input
                className="gr-input"
                id="passengerPhone_24BCI0098"
                name="passengerPhone_24BCI0098"
                type="tel"
                placeholder="+91 98765 43210"
                value={harshitChhabiBookingState.passengerPhone_24BCI0098}
                onChange={harshitChhabiHandleChange}
              />
            </div>
            <div className="gr-input-group">
              <label htmlFor="notes_24BCI0098">Notes (optional)</label>
              <textarea
                className="gr-input"
                id="notes_24BCI0098"
                name="notes_24BCI0098"
                rows="2"
                placeholder="Any special requirements..."
                value={harshitChhabiBookingState.notes_24BCI0098}
                onChange={harshitChhabiHandleChange}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              className="gr-btn gr-btn-primary"
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%' }}
              id="confirm-booking-btn-24BCI0098"
            >
              {isSubmitting ? (
                <>
                  <span className="gr-animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>

          {/* Developer tag */}
          <p className="gr-text-xs" style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.4 }}>
            Booking System — Harshit Chhabi (24BCI0098)
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
