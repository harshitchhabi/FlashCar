/**
 * RouteVisualizer_24BCI0098.jsx — Route Display Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Displays a route summary with origin, destination, distance,
 * duration, CO₂ savings calculation, and cost breakdown.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG_24BCI0098 } from '../../utils/constants_24BCI0098';

/**
 * class HarshitChhabiRouteVisualizer — Route information display
 * Registration: 24BCI0098
 * @param {Object} origin - {lat, lng, address}
 * @param {Object} destination - {lat, lng, address}
 * @param {Object} routeInfo - Optional route details from Directions API
 */
export default function RouteVisualizer_24BCI0098({ origin, destination, routeInfo = null }) {
  const [distance_24BCI0098, setDistance] = useState(null);
  const [duration_24BCI0098, setDuration] = useState(null);
  const [co2Saved_24BCI0098, setCo2Saved] = useState(null);

  // harshitChhabiCalculateEcoImpact — calculate CO₂ savings (24BCI0098)
  const harshitChhabiCalculateEcoImpact = (distanceKm) => {
    const co2 = distanceKm * APP_CONFIG_24BCI0098.co2PerKmSaved;
    return co2.toFixed(2);
  };

  // harshitChhabiEstimateDistance — estimate straight-line km between two coords
  const harshitChhabiEstimateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c * 1.3).toFixed(1); // multiply by 1.3 for road factor
  };

  useEffect(() => {
    if (routeInfo) {
      // Use Directions API data if available
      const leg = routeInfo.routes?.[0]?.legs?.[0];
      if (leg) {
        setDistance(leg.distance?.text || 'Unknown');
        setDuration(leg.duration?.text || 'Unknown');
        const km = (leg.distance?.value || 0) / 1000;
        setCo2Saved(harshitChhabiCalculateEcoImpact(km));
      }
    } else if (origin && destination) {
      // Estimate from coordinates
      const km = harshitChhabiEstimateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
      setDistance(`~${km} km`);
      setDuration(`~${Math.ceil(km / 50)} hrs`); // assume 50 km/h avg
      setCo2Saved(harshitChhabiCalculateEcoImpact(parseFloat(km)));
    }
  }, [origin, destination, routeInfo]);

  if (!origin || !destination) {
    return (
      <div className="gr-card-solid" style={{ padding: '1.5rem', textAlign: 'center' }} id="route-viz-empty-24BCI0098">
        <p className="gr-text-sm">Select origin and destination to view route details</p>
      </div>
    );
  }

  return (
    <motion.div
      className="gr-card"
      style={{ padding: '1.5rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      id="route-visualizer-24BCI0098"
    >
      <h3 className="gr-heading-sm" style={{ marginBottom: '1rem' }}>🛣️ Route Summary</h3>

      {/* Route Endpoints */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          <div>
            <p className="gr-text-xs" style={{ textTransform: 'uppercase' }}>Origin</p>
            <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{origin.address || 'Selected location'}</p>
          </div>
        </div>
        <div style={{ width: 2, height: 20, background: 'var(--gr-border)', marginLeft: 5 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
          <div>
            <p className="gr-text-xs" style={{ textTransform: 'uppercase' }}>Destination</p>
            <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{destination.address || 'Selected location'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-sm)' }}>
          <p className="gr-text-xs">Distance</p>
          <p style={{ fontWeight: 700, color: 'var(--gr-accent)', fontFamily: 'Outfit', fontSize: '1.1rem' }}>
            {distance_24BCI0098 || '—'}
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-sm)' }}>
          <p className="gr-text-xs">Duration</p>
          <p style={{ fontWeight: 700, color: 'var(--gr-accent)', fontFamily: 'Outfit', fontSize: '1.1rem' }}>
            {duration_24BCI0098 || '—'}
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--gr-bg-secondary)', borderRadius: 'var(--gr-radius-sm)' }}>
          <p className="gr-text-xs">CO₂ Saved</p>
          <p style={{ fontWeight: 700, color: '#84cc16', fontFamily: 'Outfit', fontSize: '1.1rem' }}>
            {co2Saved_24BCI0098 ? `${co2Saved_24BCI0098} kg` : '—'}
          </p>
        </div>
      </div>

      {/* Developer credit */}
      <p className="gr-text-xs" style={{ textAlign: 'right', marginTop: '1rem', opacity: 0.3 }}>
        Route computed by Harshit Chhabi — 24BCI0098
      </p>
    </motion.div>
  );
}
