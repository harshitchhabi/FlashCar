/**
 * AuthContext.jsx — Firebase Auth Provider
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext_24BCI0098 = createContext();

export const useAuth = () => useContext(AuthContext_24BCI0098);

export function AuthProvider_HarshitChhabi({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔐 Auth state listener initialized — Harshit Chhabi (24BCI0098)');
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (err) => {
        console.error('Auth state error (24BCI0098):', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!currentUser;

  // getUserProfile_24BCI0098 — get user profile data
  const getUserProfile_24BCI0098 = () => {
    if (!currentUser) return null;
    return {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'GreenRoute User',
      photoURL: currentUser.photoURL,
    };
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    getUserProfile: getUserProfile_24BCI0098,
  };

  return (
    <AuthContext_24BCI0098.Provider value={value}>
      {children}
    </AuthContext_24BCI0098.Provider>
  );
}
