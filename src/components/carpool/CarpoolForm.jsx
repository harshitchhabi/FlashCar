/**
 * CarpoolForm_24BCI0098.jsx — Ride Offer Form Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Form for offering a new carpool ride with origin/destination,
 * departure time, seats, cost, and vehicle type.
 */
import { useState } from 'react';
import { APP_CONFIG_24BCI0098 } from '../../utils/constants_24BCI0098';

/**
 * class HarshitChhabiCarpoolForm — Ride offering form
 * Registration: 24BCI0098
 * @param {Object} origin - Selected origin location
 * @param {Object} destination - Selected destination location
 * @param {Function} onSubmit - Form submission handler
 */
export default function CarpoolForm_24BCI0098({ origin, destination, onSubmit }) {
  // harshitChhabiFormData — form state (24BCI0098)
  const [harshitChhabiFormData, setFormData] = useState({
    driverName_24BCI0098: '',
    departureTime_24BCI0098: '',
    seatsAvailable_24BCI0098: 2,
    costPerPerson_24BCI0098: '',
    vehicleType_24BCI0098: '',
  });

  // harshitChhabiHandleInputChange — update field value
  const harshitChhabiHandleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // harshitChhabiProcessSubmit — validate and submit form (24BCI0098)
  const harshitChhabiProcessSubmit = (e) => {
    e.preventDefault();
    console.log('CarpoolForm submitted — Harshit Chhabi 24BCI0098:', harshitChhabiFormData);

    if (onSubmit) {
      onSubmit({
        driverName: harshitChhabiFormData.driverName_24BCI0098,
        departureTime: harshitChhabiFormData.departureTime_24BCI0098,
        seatsAvailable: parseInt(harshitChhabiFormData.seatsAvailable_24BCI0098),
        costPerPerson: harshitChhabiFormData.costPerPerson_24BCI0098,
        vehicleType: harshitChhabiFormData.vehicleType_24BCI0098,
        origin,
        destination,
      });
    }

    // Reset form
    setFormData({
      driverName_24BCI0098: '',
      departureTime_24BCI0098: '',
      seatsAvailable_24BCI0098: 2,
      costPerPerson_24BCI0098: '',
      vehicleType_24BCI0098: '',
    });
  };

  return (
    <div className="gr-card" id="carpool-form-24BCI0098">
      <h2 className="gr-heading-sm" style={{ marginBottom: '1.5rem' }}>🚗 Offer a Ride</h2>
      <form onSubmit={harshitChhabiProcessSubmit}>
        <div className="gr-input-group">
          <label htmlFor="driverName_24BCI0098">Your Name</label>
          <input
            className="gr-input"
            id="driverName_24BCI0098"
            name="driverName_24BCI0098"
            placeholder="e.g. Harshit Chhabi"
            value={harshitChhabiFormData.driverName_24BCI0098}
            onChange={harshitChhabiHandleInputChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="gr-input-group">
            <label>Origin</label>
            <input
              className="gr-input"
              value={origin?.address || ''}
              readOnly
              placeholder="Select on map ↑"
              style={{ cursor: 'default', opacity: origin ? 1 : 0.6 }}
            />
          </div>
          <div className="gr-input-group">
            <label>Destination</label>
            <input
              className="gr-input"
              value={destination?.address || ''}
              readOnly
              placeholder="Select on map ↑"
              style={{ cursor: 'default', opacity: destination ? 1 : 0.6 }}
            />
          </div>
        </div>

        <div className="gr-input-group">
          <label htmlFor="departureTime_24BCI0098">Departure Time</label>
          <input
            className="gr-input"
            id="departureTime_24BCI0098"
            name="departureTime_24BCI0098"
            type="datetime-local"
            value={harshitChhabiFormData.departureTime_24BCI0098}
            onChange={harshitChhabiHandleInputChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="gr-input-group">
            <label htmlFor="seatsAvailable_24BCI0098">Seats</label>
            <select
              className="gr-select"
              id="seatsAvailable_24BCI0098"
              name="seatsAvailable_24BCI0098"
              value={harshitChhabiFormData.seatsAvailable_24BCI0098}
              onChange={harshitChhabiHandleInputChange}
            >
              {Array.from({ length: APP_CONFIG_24BCI0098.maxSeatsPerRide }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="gr-input-group">
            <label htmlFor="costPerPerson_24BCI0098">Cost (₹)</label>
            <input
              className="gr-input"
              id="costPerPerson_24BCI0098"
              name="costPerPerson_24BCI0098"
              type="number"
              min="0"
              placeholder="0"
              value={harshitChhabiFormData.costPerPerson_24BCI0098}
              onChange={harshitChhabiHandleInputChange}
            />
          </div>
          <div className="gr-input-group">
            <label htmlFor="vehicleType_24BCI0098">Vehicle</label>
            <input
              className="gr-input"
              id="vehicleType_24BCI0098"
              name="vehicleType_24BCI0098"
              placeholder="e.g. Honda City"
              value={harshitChhabiFormData.vehicleType_24BCI0098}
              onChange={harshitChhabiHandleInputChange}
              required
            />
          </div>
        </div>

        <button
          className="gr-btn gr-btn-primary"
          type="submit"
          style={{ width: '100%', marginTop: '0.5rem' }}
          id="submit-ride-btn-24BCI0098"
        >
          Offer Ride — Harshit Chhabi (24BCI0098)
        </button>
      </form>
    </div>
  );
}
