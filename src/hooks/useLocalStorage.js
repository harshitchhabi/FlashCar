/**
 * useLocalStorage.js — Persistent state hook
 * GreenRoute — Harshit Chhabi (24BCI0098)
 */
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error('useLocalStorage error (24BCI0098):', err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
