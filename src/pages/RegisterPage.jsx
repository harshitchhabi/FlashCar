/**
 * RegisterPage.jsx — Sign Up Page
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { harshitChhabiRegisterUser } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

export default function RegisterPage_HarshitChhabi() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [formData_24BCI0098, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData_24BCI0098, [name]: type === 'checkbox' ? checked : value });
  };

  const harshitChhabiValidateForm = () => {
    if (!formData_24BCI0098.fullName.trim()) {
      addNotification('Please enter your full name', 'error');
      return false;
    }
    if (formData_24BCI0098.password.length < 6) {
      addNotification('Password must be at least 6 characters', 'error');
      return false;
    }
    if (formData_24BCI0098.password !== formData_24BCI0098.confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return false;
    }
    if (!formData_24BCI0098.agreeTerms) {
      addNotification('Please agree to the Terms of Service', 'error');
      return false;
    }
    return true;
  };

  const harshitChhabiHandleRegister = async (e) => {
    e.preventDefault();
    if (!harshitChhabiValidateForm()) return;

    setLoading(true);
    try {
      const { user, error } = await harshitChhabiRegisterUser(
        formData_24BCI0098.email,
        formData_24BCI0098.password,
        formData_24BCI0098.fullName
      );
      if (error) {
        addNotification(`Registration failed: ${error}`, 'error');
      } else {
        addNotification('Account created successfully! 🎉', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addNotification(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gr-page" style={{ minHeight: '100vh', background: 'var(--gr-bg-secondary)', display: 'flex', alignItems: 'center', padding: '2rem 0' }}>
      <div className="gr-container" style={{ maxWidth: '480px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--gr-accent)' }}>
              🌿 GreenRoute
            </Link>
            <h1 className="gr-heading-md" style={{ marginTop: '1.5rem' }}>Create Account</h1>
            <p className="gr-text-body">Join the sustainable commuting revolution</p>
          </div>

          <div className="gr-card" style={{ padding: '2.5rem' }} id="register-form-24BCI0098">
            <GoogleSignInButton onSuccess={() => navigate('/dashboard')} label="Sign up with Google" />

            <div className="gr-divider-text" style={{ margin: '1.75rem 0' }}>or create with email</div>

            <form onSubmit={harshitChhabiHandleRegister}>
              <div className="gr-input-group">
                <label htmlFor="reg-name">Full Name</label>
                <input className="gr-input" id="reg-name" name="fullName" type="text" placeholder="Harshit Chhabi" value={formData_24BCI0098.fullName} onChange={handleChange} required />
              </div>

              <div className="gr-input-group">
                <label htmlFor="reg-email">Email Address</label>
                <input className="gr-input" id="reg-email" name="email" type="email" placeholder="you@example.com" value={formData_24BCI0098.email} onChange={handleChange} required autoComplete="email" />
              </div>

              <div className="gr-input-group">
                <label htmlFor="reg-password">Password</label>
                <input className="gr-input" id="reg-password" name="password" type="password" placeholder="Min 6 characters" value={formData_24BCI0098.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
              </div>

              <div className="gr-input-group">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <input className="gr-input" id="reg-confirm" name="confirmPassword" type="password" placeholder="••••••••" value={formData_24BCI0098.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--gr-text-secondary)' }}>
                <input className="gr-checkbox" name="agreeTerms" type="checkbox" checked={formData_24BCI0098.agreeTerms} onChange={handleChange} style={{ marginTop: '3px' }} />
                <span>I agree to the <Link to="/about">Terms of Service</Link> and <Link to="/about">Privacy Policy</Link></span>
              </label>

              <button className="gr-btn gr-btn-primary gr-btn-lg" type="submit" disabled={loading} style={{ width: '100%' }} id="register-submit-btn">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--gr-text-secondary)' }}>
              Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
