/**
 * Navbar.jsx — Main Navigation Component
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { harshitChhabiLogoutUser } from '../../utils/firebase';
import { useNotifications } from '../../contexts/NotificationContext';
import { NAV_LINKS_24BCI0098 } from '../../utils/constants_24BCI0098';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar_HarshitChhabi() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, getUserProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track scroll position for navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const { success, error } = await harshitChhabiLogoutUser();
    if (success) {
      addNotification('Logged out successfully', 'success');
      navigate('/');
    } else {
      addNotification(`Logout failed: ${error}`, 'error');
    }
  };

  const profile = getUserProfile();

  return (
    <>
      <nav className={`gr-navbar ${scrolled ? 'scrolled' : ''}`} id="navbar-24BCI0098">
        <div className="gr-navbar-inner">
          {/* Brand */}
          <Link to="/" className="gr-navbar-brand" aria-label="GreenRoute Home">
            <span style={{ fontSize: '1.6rem' }}>🌿</span>
            GreenRoute
          </Link>

          {/* Desktop Nav Links */}
          <div className="gr-navbar-links">
            {NAV_LINKS_24BCI0098.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                id={link.id}
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="gr-navbar-actions">
            <DarkModeToggle />
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/dashboard" className="gr-btn gr-btn-ghost gr-btn-sm" id="nav-dashboard">
                  {profile?.displayName?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="gr-btn gr-btn-secondary gr-btn-sm" id="nav-logout">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="gr-btn gr-btn-primary gr-btn-sm" id="nav-signin">
                Sign In
              </Link>
            )}
            {/* Hamburger */}
            <div
              className={`gr-hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`gr-mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {NAV_LINKS_24BCI0098.map((link) => (
          <Link
            key={link.id}
            to={link.path}
            className={location.pathname === link.path ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
        <div className="gr-divider" />
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="gr-btn gr-btn-secondary" style={{ marginTop: '0.5rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register" className="gr-btn gr-btn-primary" style={{ marginTop: '0.5rem' }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </>
  );
}
