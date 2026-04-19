/**
 * firebase.js — Firebase Configuration, Auth & Firestore Helpers
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
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

// ── Firebase init ─────────────────────────────────────────────────────────
const firebaseConfig_24BCI0098 = {
  apiKey: 'AIzaSyCohKVwJMMiMd4HMj9KCobhLkNR0_GUbIw',
  authDomain: 'green-route-58b67.firebaseapp.com',
  projectId: 'green-route-58b67',
  storageBucket: 'green-route-58b67.firebasestorage.app',
  messagingSenderId: '155676635789',
  appId: '1:155676635789:web:72cf28e4eb3caf96e6e8c4',
  measurementId: 'G-NSQGN03C6N',
};

const app = !getApps().length ? initializeApp(firebaseConfig_24BCI0098) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const GoogleProvider_24BCI0098 = new GoogleAuthProvider();

export { app, auth, db };

// ═══════════════════════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export const harshitChhabiRegisterUser = async (email, password, displayName = '') => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && cred.user) {
      await updateProfile(cred.user, { displayName });
    }
    // Create Firestore user profile doc
    await setDoc(doc(db, 'users', cred.user.uid), {
      displayName: displayName || '',
      email,
      co2SavedKg: 0,
      greenTokens: 0,
      gcpCertificates: 0,
      createdAt: serverTimestamp(),
    });
    console.log('✅ User registered — 24BCI0098');
    return { user: cred.user, error: null };
  } catch (error) {
    console.error('❌ Registration error (24BCI0098):', error.message);
    return { user: null, error: error.message };
  }
};

export const harshitChhabiLoginUser = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User logged in — 24BCI0098');
    return { user: cred.user, error: null };
  } catch (error) {
    console.error('❌ Login error (24BCI0098):', error.message);
    return { user: null, error: error.message };
  }
};

export const harshitChhabiGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, GoogleProvider_24BCI0098);
    // Ensure user doc exists in Firestore (idempotent)
    const userRef = doc(db, 'users', result.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        displayName: result.user.displayName || '',
        email: result.user.email || '',
        co2SavedKg: 0,
        greenTokens: 0,
        gcpCertificates: 0,
        createdAt: serverTimestamp(),
      });
    }
    console.log('✅ Google sign-in — 24BCI0098');
    return { user: result.user, error: null };
  } catch (error) {
    console.error('❌ Google sign-in error (24BCI0098):', error.message);
    return { user: null, error: error.message };
  }
};

export const harshitChhabiLogoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ Logged out — 24BCI0098');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Logout error (24BCI0098):', error.message);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser_24BCI0098 = () =>
  new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => { unsub(); resolve(user); }, reject);
  });

// ═══════════════════════════════════════════════════════════════════════════
// RIDES — Firestore collection: /rides
// ═══════════════════════════════════════════════════════════════════════════

/**
 * addRide_24BCI0098 — Write a new offered ride to Firestore
 * @param {Object} rideData
 * @returns {Promise<{id, error}>}
 */
export const addRide_24BCI0098 = async (rideData) => {
  try {
    const ref = await addDoc(collection(db, 'rides'), {
      ...rideData,
      seatsBooked: 0,
      active: true,
      createdAt: serverTimestamp(),
    });
    console.log('✅ Ride added to Firestore:', ref.id);
    return { id: ref.id, error: null };
  } catch (error) {
    console.error('❌ addRide error:', error.message);
    return { id: null, error: error.message };
  }
};

/**
 * subscribeToRides_24BCI0098 — Real-time listener for all active rides
 * @param {Function} callback  Called with array of ride objects on every update
 * @returns {Function} Unsubscribe function
 */
export const subscribeToRides_24BCI0098 = (callback) => {
  const q = query(
    collection(db, 'rides'),
    where('active', '==', true),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const rides = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(rides);
  }, (err) => {
    console.error('❌ subscribeToRides error:', err.message);
    callback([]);
  });
};

/**
 * subscribeToMyRides_24BCI0098 — Real-time listener for rides offered by a specific driver
 * @param {string} driverUid
 * @param {Function} callback
 * @returns {Function} Unsubscribe
 */
export const subscribeToMyRides_24BCI0098 = (driverUid, callback) => {
  const q = query(
    collection(db, 'rides'),
    where('driverUid', '==', driverUid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => {
    console.error('❌ subscribeToMyRides error:', err.message);
    callback([]);
  });
};

/**
 * decrementRideSeat_24BCI0098 — Reduce available seats when a booking is confirmed
 */
export const decrementRideSeat_24BCI0098 = async (rideId) => {
  try {
    const rideRef = doc(db, 'rides', rideId);
    await updateDoc(rideRef, {
      seatsAvailable: increment(-1),
      seatsBooked: increment(1),
    });
  } catch (error) {
    console.error('❌ decrementRideSeat error:', error.message);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// BOOKINGS — Firestore collection: /bookings
// ═══════════════════════════════════════════════════════════════════════════

/**
 * addBooking_24BCI0098 — Create a new booking request in Firestore
 * @param {Object} bookingData  Must include: rideId, rideDriverUid, passengerUid, co2Kg
 * @returns {Promise<{id, error}>}
 */
export const addBooking_24BCI0098 = async (bookingData) => {
  try {
    const ref = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    console.log('✅ Booking created:', ref.id);
    return { id: ref.id, error: null };
  } catch (error) {
    console.error('❌ addBooking error:', error.message);
    return { id: null, error: error.message };
  }
};

/**
 * subscribeToMyBookings_24BCI0098 — Real-time bookings made BY the passenger
 */
export const subscribeToMyBookings_24BCI0098 = (passengerUid, callback) => {
  const q = query(
    collection(db, 'bookings'),
    where('passengerUid', '==', passengerUid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => {
    console.error('❌ subscribeToMyBookings error:', err.message);
    callback([]);
  });
};

/**
 * subscribeToRideBookings_24BCI0098 — Real-time bookings FOR a specific ride (for driver)
 */
export const subscribeToRideBookings_24BCI0098 = (rideId, callback) => {
  const q = query(
    collection(db, 'bookings'),
    where('rideId', '==', rideId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => {
    console.error('❌ subscribeToRideBookings error:', err.message);
    callback([]);
  });
};

/**
 * updateBookingStatus_24BCI0098 — Driver approves or declines a booking
 * When approved, decrements the ride seat count and credits passenger with CO₂ stats
 */
export const updateBookingStatus_24BCI0098 = async (bookingId, status, rideId, passengerUid, co2Kg) => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { status });
    if (status === 'confirmed') {
      await decrementRideSeat_24BCI0098(rideId);
      await updateUserStats_24BCI0098(passengerUid, co2Kg);
    }
    console.log(`✅ Booking ${bookingId} → ${status}`);
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ updateBookingStatus error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * cancelBooking_24BCI0098 — Passenger cancels their booking
 */
export const cancelBooking_24BCI0098 = async (bookingId, rideId) => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
    // Re-increment seat
    await updateDoc(doc(db, 'rides', rideId), {
      seatsAvailable: increment(1),
      seatsBooked: increment(-1),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ cancelBooking error:', error.message);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// USER STATS — Firestore collection: /users/{uid}
// ═══════════════════════════════════════════════════════════════════════════

/**
 * getUserStats_24BCI0098 — Fetch user profile + stats from Firestore (one-time)
 */
export const getUserStats_24BCI0098 = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return { data: snap.data(), error: null };
    return { data: null, error: 'User doc not found' };
  } catch (error) {
    console.error('❌ getUserStats error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * subscribeToUserStats_24BCI0098 — Real-time listener for user stats
 */
export const subscribeToUserStats_24BCI0098 = (uid, callback) => {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (snap.exists()) callback(snap.data());
    else callback({ co2SavedKg: 0, greenTokens: 0, gcpCertificates: 0 });
  }, (err) => {
    console.error('❌ subscribeToUserStats error:', err.message);
    callback({ co2SavedKg: 0, greenTokens: 0, gcpCertificates: 0 });
  });
};

/**
 * updateUserStats_24BCI0098 — Add CO₂ saved and compute GRT tokens for a user
 * Rule: 1 kg CO₂ saved = 10 GRT tokens
 */
export const updateUserStats_24BCI0098 = async (uid, co2KgToAdd) => {
  if (!uid || !co2KgToAdd || co2KgToAdd <= 0) return;
  try {
    const tokensToAdd = Math.floor(co2KgToAdd * 10);
    await updateDoc(doc(db, 'users', uid), {
      co2SavedKg: increment(co2KgToAdd),
      greenTokens: increment(tokensToAdd),
    });
    console.log(`✅ User ${uid}: +${co2KgToAdd} kg CO₂, +${tokensToAdd} GRT`);
  } catch (error) {
    // If doc doesn't exist yet (e.g. Google sign-in without prior registration)
    try {
      const tokensToAdd = Math.floor(co2KgToAdd * 10);
      await setDoc(doc(db, 'users', uid), {
        co2SavedKg: co2KgToAdd,
        greenTokens: tokensToAdd,
        gcpCertificates: 0,
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (err2) {
      console.error('❌ updateUserStats error:', err2.message);
    }
  }
};

/**
 * mintGcpCertificate_24BCI0098 — Deduct 1000 GRT and increment GCP certificates
 */
export const mintGcpCertificate_24BCI0098 = async (uid) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      greenTokens: increment(-1000),
      gcpCertificates: increment(1),
    });
    console.log('✅ GCP Certificate minted for', uid);
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ mintGcpCertificate error:', error.message);
    return { success: false, error: error.message };
  }
};
