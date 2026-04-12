/**
 * firebase.js — Firebase Configuration & Auth Helpers
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration — GreenRoute project (24BCI0098)
const firebaseConfig_24BCI0098 = {
  apiKey: 'AIzaSyCohKVwJMMiMd4HMj9KCobhLkNR0_GUbIw',
  authDomain: 'green-route-58b67.firebaseapp.com',
  projectId: 'green-route-58b67',
  storageBucket: 'green-route-58b67.firebasestorage.app',
  messagingSenderId: '155676635789',
  appId: '1:155676635789:web:72cf28e4eb3caf96e6e8c4',
  measurementId: 'G-NSQGN03C6N',
};

// Initialize Firebase — Harshit Chhabi (24BCI0098)
const app = !getApps().length ? initializeApp(firebaseConfig_24BCI0098) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const GoogleProvider_24BCI0098 = new GoogleAuthProvider();

export { app, auth, db };

/**
 * harshitChhabiRegisterUser — Register new user with email/password
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<{user, error}>}
 */
export const harshitChhabiRegisterUser = async (email, password, displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    console.log('✅ User registered successfully — 24BCI0098');
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('❌ Registration error (24BCI0098):', error.message);
    return { user: null, error: error.message };
  }
};

/**
 * harshitChhabiLoginUser — Login with email/password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user, error}>}
 */
export const harshitChhabiLoginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User logged in — 24BCI0098');
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('❌ Login error (24BCI0098):', error.message);
    return { user: null, error: error.message };
  }
};

/**
 * harshitChhabiGoogleSignIn — Sign in with Google popup
 * @returns {Promise<{user, error}>}
 */
export const harshitChhabiGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, GoogleProvider_24BCI0098);
    console.log('✅ Google sign-in successful — Harshit Chhabi 24BCI0098');
    return { user: result.user, error: null };
  } catch (error) {
    console.error('❌ Google sign-in error (24BCI0098):', error.message);
    return { user: null, error: error.message };
  }
};

/**
 * harshitChhabiLogoutUser — Sign out current user
 * @returns {Promise<{success, error}>}
 */
export const harshitChhabiLogoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ User logged out — 24BCI0098');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Logout error (24BCI0098):', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * getCurrentUser_24BCI0098 — Get current authenticated user
 * @returns {Promise<User|null>}
 */
export const getCurrentUser_24BCI0098 = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};
