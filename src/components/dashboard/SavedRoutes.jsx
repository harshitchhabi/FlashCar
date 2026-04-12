/**
 * SavedRoutes_24BCI0098.jsx — Favorites/Saved Routes Display
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Shows user's bookmarked/favorited routes with remove functionality.
 */
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDate_24BCI0098 } from '../../utils/dateFormatter';

/**
 * class HarshitChhabiSavedRoutes — Saved routes panel
 * Registration: 24BCI0098
 */
export default function SavedRoutes_24BCI0098() {
  const { favorites: favorites_24BCI0098, removeFavorite } = useFavorites();
  const { addNotification } = useNotifications();

  // harshitChhabiRemoveRoute — remove route from favorites
  const harshitChhabiRemoveRoute = (id) => {
    removeFavorite(id);
    addNotification('Route removed from favorites — 24BCI0098', 'info');
    console.log(`Favorite removed by Harshit Chhabi — 24BCI0098: ${id}`);
  };

  if (favorites_24BCI0098.length === 0) {
    return (
      <div className="gr-card-solid" style={{ textAlign: 'center', padding: '3rem' }} id="saved-routes-empty-24BCI0098">
        <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</p>
        <h3 className="gr-heading-sm">No Saved Routes</h3>
        <p className="gr-text-body" style={{ marginTop: '0.5rem' }}>
          Bookmark rides from the carpooling page to see them here.
        </p>
        <Link to="/carpool" className="gr-btn gr-btn-primary" style={{ marginTop: '1.25rem' }}>
          Browse Rides
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="saved-routes-24BCI0098">
      <p className="gr-text-sm" style={{ marginBottom: '0.5rem' }}>
        {favorites_24BCI0098.length} saved route{favorites_24BCI0098.length !== 1 ? 's' : ''} — Harshit Chhabi (24BCI0098)
      </p>

      <AnimatePresence>
        {favorites_24BCI0098.map((fav_24BCI0098) => (
          <motion.div
            key={fav_24BCI0098.id}
            className="gr-card-solid"
            style={{ padding: '1.25rem' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0, padding: 0, margin: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            layout
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600 }}>
                  {fav_24BCI0098.driver} • {fav_24BCI0098.vehicleType}
                </p>
                <p className="gr-text-sm" style={{ marginTop: '0.25rem' }}>
                  📍 {fav_24BCI0098.startLocationAddress} → {fav_24BCI0098.destinationAddress}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="gr-badge gr-badge-accent">{fav_24BCI0098.costPerPerson}</span>
                  {fav_24BCI0098.rating && (
                    <span className="gr-badge gr-badge-info">⭐ {fav_24BCI0098.rating}</span>
                  )}
                  {fav_24BCI0098.savedAt && (
                    <span className="gr-text-xs">Saved: {formatDate_24BCI0098(fav_24BCI0098.savedAt)}</span>
                  )}
                </div>
              </div>
              <button
                className="gr-btn gr-btn-ghost gr-btn-sm"
                onClick={() => harshitChhabiRemoveRoute(fav_24BCI0098.id)}
                title="Remove from favorites"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
