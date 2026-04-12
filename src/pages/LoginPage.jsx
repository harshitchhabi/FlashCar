/**
 * LoginPage.jsx — Sign In Page
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { harshitChhabiLoginUser } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

export default function LoginPage_HarshitChhabi() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [formData_24BCI0098, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    const redirect = searchParams.get('redirect') || '/dashboard';
    navigate(redirect, { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData_24BCI0098, [name]: type === 'checkbox' ? checked : value });
  };

  const harshitChhabiHandleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, error } = await harshitChhabiLoginUser(formData_24BCI0098.email, formData_24BCI0098.password);
      if (error) {
        addNotification(`Login failed: ${error}`, 'error');
      } else {
        addNotification('Welcome back! 🌿', 'success');
        navigate(searchParams.get('redirect') || '/dashboard');
      }
    } catch (err) {
      addNotification(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate(searchParams.get('redirect') || '/dashboard');
  };

  return (
    <div className="gr-page" style={{ minHeight: '100vh', background: 'var(--gr-bg-secondary)', display: 'flex', alignItems: 'center' }}>
      <div className="gr-container" style={{ maxWidth: '480px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--gr-accent)' }}>
              🌿 GreenRoute
            </Link>
            <h1 className="gr-heading-md" style={{ marginTop: '1.5rem' }}>Welcome Back</h1>
            <p className="gr-text-body">Sign in to your GreenRoute account</p>
          </div>

          {/* Card */}
          <div className="gr-card" style={{ padding: '2.5rem' }} id="login-form-24BCI0098">
            {/* Google Sign In */}
            <GoogleSignInButton onSuccess={handleGoogleSuccess} />

            {/* Divider */}
            <div className="gr-divider-text" style={{ margin: '1.75rem 0' }}>or sign in with email</div>

            {/* Email/Password Form */}
            <form onSubmit={harshitChhabiHandleLogin}>
              <div className="gr-input-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  className="gr-input"
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData_24BCI0098.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="gr-input-group">
                <label htmlFor="login-password">Password</label>
                <input
                  className="gr-input"
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData_24BCI0098.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--gr-text-secondary)' }}>
                  <input
                    className="gr-checkbox"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData_24BCI0098.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
              </div>

              <button
                className="gr-btn gr-btn-primary gr-btn-lg"
                type="submit"
                disabled={loading}
                style={{ width: '100%' }}
                id="login-submit-btn"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--gr-text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ fontWeight: 600 }}>Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
