/**
 * FavoritesContext.jsx — Saved Routes / Favorites
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext_24BCI0098 = createContext();

export const useFavorites = () => useContext(FavoritesContext_24BCI0098);

export function FavoritesProvider_HarshitChhabi({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('greenroute_favorites_24BCI0098');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('greenroute_favorites_24BCI0098', JSON.stringify(favorites));
    } catch (err) {
      console.error('Error saving favorites (24BCI0098):', err);
    }
  }, [favorites]);

  // addFavorite_24BCI0098 — Save a route/ride to favorites
  const addFavorite = useCallback((item) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === item.id)) return prev; // already saved
      return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  // removeFavorite_24BCI0098 — Remove from favorites
  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // isFavorite — check if an item is saved
  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext_24BCI0098.Provider value={value}>
      {children}
    </FavoritesContext_24BCI0098.Provider>
  );
}
