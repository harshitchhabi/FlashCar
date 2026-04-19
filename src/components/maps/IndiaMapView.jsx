/**
 * IndiaMapView.jsx — React-Leaflet Map Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Uses OSRM (Open Source Routing Machine) for real driving paths.
 * Displays ONE clean green eco-route — no fake offsets or red standard lines.
 */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { APP_CONFIG_24BCI0098 } from '../../utils/constants_24BCI0098';

// ── Icons ──────────────────────────────────────────────────────────────────
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33],
});

// ── Auto-zoom to fit route or bounds ──────────────────────────────────────
function MapRefresher({ origin, destination, routeCoords }) {
  const map = useMap();

  useEffect(() => {
    if (routeCoords && routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.2 });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ]);
      map.flyToBounds(bounds, { padding: [60, 60], duration: 1.2 });
    } else if (origin) {
      map.flyTo([origin.lat, origin.lng], 12, { duration: 1.0 });
    }
  }, [origin, destination, routeCoords, map]);

  return null;
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function IndiaMapView_Leaflet_24BCI0098({
  origin = null,
  destination = null,
  markers = [],
  showDirections = false,
  height = '450px',
  zoom = 5,
  onRouteInfo = null, // optional callback: (distanceKm, durationMins) => void
}) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeMeta, setRouteMeta] = useState(null); // { distanceKm, durationMins }
  const [loading, setLoading] = useState(false);

  const center = origin
    ? [origin.lat, origin.lng]
    : [APP_CONFIG_24BCI0098.defaultMapCenter.lat, APP_CONFIG_24BCI0098.defaultMapCenter.lng];

  // ── Fetch real road geometry from OSRM ──────────────────────────────────
  useEffect(() => {
    if (!showDirections || !origin || !destination) {
      setRouteCoords([]);
      setRouteMeta(null);
      return;
    }

    let cancelled = false;

    const fetchRoute = async () => {
      setLoading(true);
      try {
        // OSRM expects "lng,lat" order; alternatives=true gives up to 3 routes
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
          `?overview=full&alternatives=true&geometries=geojson&steps=false`;

        const res = await fetch(url);
        const data = await res.json();

        if (cancelled) return;

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          // Pick the route with the lowest distance (eco-optimal)
          const best = data.routes.reduce((a, b) =>
            a.distance <= b.distance ? a : b
          );

          const coords = best.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          const distKm = (best.distance / 1000).toFixed(1);
          const durMins = Math.round(best.duration / 60);

          setRouteCoords(coords);
          setRouteMeta({ distanceKm: distKm, durationMins: durMins });

          if (onRouteInfo) onRouteInfo(parseFloat(distKm), durMins);

          console.log(
            `%c[IndiaMapView] Real OSRM route: ${distKm} km, ${durMins} mins` +
            ` (${data.routes.length} alternative(s) evaluated)`,
            'color: #10b981; font-weight: bold;'
          );
        } else {
          // Fallback: straight line between the two points
          setRouteCoords([
            [origin.lat, origin.lng],
            [destination.lat, destination.lng],
          ]);
          setRouteMeta(null);
          console.warn('[IndiaMapView] OSRM returned no route — showing straight-line fallback.');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[IndiaMapView] OSRM fetch error:', err);
          setRouteCoords([
            [origin.lat, origin.lng],
            [destination.lat, destination.lng],
          ]);
          setRouteMeta(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRoute();
    return () => { cancelled = true; };
  }, [origin, destination, showDirections]);

  return (
    <div style={{ position: 'relative', height, width: '100%', borderRadius: 'var(--gr-radius-md)', overflow: 'hidden', border: '1px solid var(--gr-border)' }}>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)',
          borderRadius: 'var(--gr-radius-md)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Finding eco-route…</span>
          </div>
        </div>
      )}

      {/* Route info badge */}
      {routeMeta && !loading && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 999,
          background: 'rgba(16, 185, 129, 0.95)', color: '#fff',
          padding: '0.4rem 0.75rem', borderRadius: '999px',
          fontSize: '0.78rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          display: 'flex', gap: '0.5rem',
        }}>
          <span>🛣️ {routeMeta.distanceKm} km</span>
          <span>•</span>
          <span>⏱ {routeMeta.durationMins} min</span>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Routing by OSRM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRefresher origin={origin} destination={destination} routeCoords={routeCoords} />

        {/* Origin Marker */}
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={customIcon}>
            <Popup>
              <strong>🟢 Origin</strong><br />{origin.address}
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={redIcon}>
            <Popup>
              <strong>🔴 Destination</strong><br />{destination.address}
            </Popup>
          </Marker>
        )}

        {/* Extra markers (carpool pickup points, parking spots, etc.) */}
        {markers.map((marker, idx) => {
          const lat = marker.lat ?? marker.position?.lat;
          const lng = marker.lng ?? marker.position?.lng;
          if (!lat || !lng) return null;
          return (
            <Marker key={marker.id || idx} position={[lat, lng]} icon={blueIcon}>
              <Popup>{marker.name || marker.title || 'Point'}</Popup>
            </Marker>
          );
        })}

        {/* ✅ Single real eco-route — solid green, no fake second line */}
        {showDirections && routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            color="#10b981"
            weight={5}
            opacity={0.9}
          />
        )}
      </MapContainer>
    </div>
  );
}
