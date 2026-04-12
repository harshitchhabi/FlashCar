/**
 * App.jsx — Main Application Router & Provider Wrapper
 * GreenRoute v2.0.0
 * Developed by Harshit Chhabi — Registration: 24BCI0098
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers — developed by Harshit Chhabi (24BCI0098)
import { ThemeProvider_HarshitChhabi } from './contexts/ThemeContext';
import { AuthProvider_HarshitChhabi } from './contexts/AuthContext';
import { NotificationProvider_HarshitChhabi } from './contexts/NotificationContext';
import { FavoritesProvider_HarshitChhabi } from './contexts/FavoritesContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import NotificationCenter from './components/notifications/NotificationCenter';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded Pages — code splitting for performance (24BCI0098)
const HomePage = lazy(() => import('./pages/HomePage'));
const CarpoolPage = lazy(() => import('./pages/CarpoolPage'));
const ParkingPage = lazy(() => import('./pages/ParkingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Page loading fallback — Harshit Chhabi (24BCI0098)
function HarshitChhabiPageLoader() {
  return (
    <div className="gr-page" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div className="gr-animate-spin" style={{
        width: 48,
        height: 48,
        border: '3px solid var(--gr-border)',
        borderTopColor: 'var(--gr-accent)',
        borderRadius: '50%',
      }} />
      <p className="gr-text-body">Loading GreenRoute...</p>
    </div>
  );
}

/**
 * HarshitChhabiApp — Root Application Component
 * Registration: 24BCI0098
 */
export default function HarshitChhabiApp() {
  return (
    <Router>
      <ThemeProvider_HarshitChhabi>
        <AuthProvider_HarshitChhabi>
          <NotificationProvider_HarshitChhabi>
            <FavoritesProvider_HarshitChhabi>
              {/* Global Components */}
              <ScrollToTop />
              <Navbar />
              <NotificationCenter />

              {/* Routes with Lazy Loading */}
              <Suspense fallback={<HarshitChhabiPageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/carpool" element={<CarpoolPage />} />
                  <Route path="/parking" element={<ParkingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* 404 fallback */}
                  <Route path="*" element={
                    <div className="gr-page" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <div>
                        <h1 style={{ fontSize: '6rem', fontFamily: 'Outfit', color: 'var(--gr-accent)' }}>404</h1>
                        <p className="gr-heading-md" style={{ marginTop: '1rem' }}>Page Not Found</p>
                        <p className="gr-text-body" style={{ marginTop: '0.5rem' }}>The page you're looking for doesn't exist.</p>
                        <a href="/" className="gr-btn gr-btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>Go Home</a>
                      </div>
                    </div>
                  } />
                </Routes>
              </Suspense>

              {/* Footer */}
              <Footer />
            </FavoritesProvider_HarshitChhabi>
          </NotificationProvider_HarshitChhabi>
        </AuthProvider_HarshitChhabi>
      </ThemeProvider_HarshitChhabi>
    </Router>
  );
}
