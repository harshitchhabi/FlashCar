/**
 * ProtectedRoute.jsx — Auth Guard for protected pages
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute_24BCI0098({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="gr-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="gr-animate-spin" style={{
            width: 48, height: 48,
            border: '3px solid var(--gr-border)',
            borderTopColor: 'var(--gr-accent)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
          }} />
          <p className="gr-text-body">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
