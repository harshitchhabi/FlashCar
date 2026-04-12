/**
 * IndiaMapView.jsx — React-Leaflet Map Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 * 
 * Replaced Google Maps with free, open-source Leaflet map.
 * Now integrated with OSRM (Open Source Routing Machine) for real driving paths!
 */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { APP_CONFIG_24BCI0098 } from '../../utils/constants_24BCI0098';

// Custom Icon for GreenRoute
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Auto-zoom to fit route
function MapRefresher({ origin, destination, routeCoords }) {
  const map = useMap();
  
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.flyToBounds(bounds, { padding: [50, 50] });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng]
      ]);
      map.flyToBounds(bounds, { padding: [50, 50] });
    } else if (origin) {
      map.flyTo([origin.lat, origin.lng], 10);
    }
  }, [origin, destination, routeCoords, map]);

  return null;
}

export default function IndiaMapView_Leaflet_24BCI0098({
  origin = null,
  destination = null,
  markers = [],
  showDirections = false,
  height = '450px',
  zoom = 5,
}) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [altRouteCoords, setAltRouteCoords] = useState([]);
  const center = origin ? [origin.lat, origin.lng] : [APP_CONFIG_24BCI0098.defaultMapCenter.lat, APP_CONFIG_24BCI0098.defaultMapCenter.lng];
  
  // Real Road Geometry fetching using OSRM Free API
  useEffect(() => {
    if (showDirections && origin && destination) {
      const fetchRoute = async () => {
        try {
          // OSRM requires "Lng,Lat" order
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&alternatives=3&geometries=geojson`;
          const response = await fetch(osrmUrl);
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            // Standard Route (Base)
            const coords0 = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteCoords(coords0);

            // Eco Route (Alternative if exists, or slight visual offset for demo)
            if (data.routes.length > 1) {
              const coords1 = data.routes[1].geometry.coordinates.map(coord => [coord[1], coord[0]]);
              setAltRouteCoords(coords1);
            } else {
              // Forced visual offset demo
              const offsetCoords = coords0.map(coord => [coord[0] + 0.002, coord[1] + 0.002]);
              setAltRouteCoords(offsetCoords);
            }
          } else {
            setRouteCoords([[origin.lat, origin.lng], [destination.lat, destination.lng]]);
            setAltRouteCoords([]);
          }
        } catch (error) {
          console.error("OSRM Route Fetch Failed:", error);
          setRouteCoords([[origin.lat, origin.lng], [destination.lat, destination.lng]]);
          setAltRouteCoords([]);
        }
      };
      
      fetchRoute();
    } else {
      setRouteCoords([]);
    }
  }, [origin, destination, showDirections]);

  return (
    <div style={{ position: 'relative', height, width: '100%', borderRadius: 'var(--gr-radius-md)', overflow: 'hidden', border: '1px solid var(--gr-border)' }}>
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
              <strong>Origin (A)</strong><br />
              {origin.address}
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={redIcon}>
            <Popup>
              <strong>Destination (B)</strong><br />
              {destination.address}
            </Popup>
          </Marker>
        )}

        {/* Extra markers for offered rides */}
        {markers.map((marker, idx) => (
          <Marker 
            key={marker.id || idx} 
            position={[marker.lat || marker.position?.lat, marker.lng || marker.position?.lng]}
          >
            <Popup>{marker.name || marker.title}</Popup>
          </Marker>
        ))}

        {/* The Standard Route visual path */}
        {showDirections && origin && destination && routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            color="#ef4444" // Red for standard
            weight={4} 
            opacity={0.6}
            dashArray="8, 8"
          />
        )}

        {/* The "Eco-friendly" optimized road path */}
        {showDirections && origin && destination && altRouteCoords.length > 0 && (
          <Polyline 
            positions={altRouteCoords} 
            color="#10b981" // Green for eco
            weight={6} 
            opacity={0.9}
          />
        )}
      </MapContainer>
    </div>
  );
}
