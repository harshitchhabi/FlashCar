/**
 * HomePage.jsx — Landing Page
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection, { StaggerContainer_24BCI0098 } from '../components/common/AnimatedSection';
import { DEVELOPER_24BCI0098 } from '../utils/constants_24BCI0098';

// Feature data — designed by Harshit Chhabi (24BCI0098)
const features_24BCI0098 = [
  {
    icon: '🚗',
    title: 'Smart Carpooling',
    description: 'Connect with commuters heading your way. Share rides across Indian cities, reduce costs by up to 75%, and cut carbon emissions.',
    link: '/carpool',
    color: '#10b981',
  },
  {
    icon: '🅿️',
    title: 'Smart Parking Finder',
    description: 'Locate available parking spots in real-time across busy Indian metros. Save time, fuel, and reduce parking stress.',
    link: '/parking',
    color: '#0ea5e9',
  },
  {
    icon: '🌍',
    title: 'Environmental Impact',
    description: 'Track your carbon footprint reduction. Every shared ride contributes to cleaner air and a greener India.',
    link: '/about',
    color: '#84cc16',
  },
  {
    icon: '🗺️',
    title: 'India-Wide Routes',
    description: 'Google Maps integration with Indian city search, route visualization, and real-time directions across 25+ major cities.',
    link: '/carpool',
    color: '#f59e0b',
  },
  {
    icon: '🔐',
    title: 'Secure Authentication',
    description: 'Sign in securely with Google or email. Your data is protected with Firebase authentication and encrypted sessions.',
    link: '/login',
    color: '#8b5cf6',
  },
  {
    icon: '⭐',
    title: 'Saved Routes',
    description: 'Bookmark your favorite routes and rides. Quick access to your regular commute patterns from your personal dashboard.',
    link: '/dashboard',
    color: '#ec4899',
  },
];

const stats_24BCI0098 = [
  { value: '25+', label: 'Indian Cities' },
  { value: '10K+', label: 'Rides Shared' },
  { value: '500+', label: 'Tons CO₂ Saved' },
  { value: '4.8★', label: 'User Rating' },
];

export default function HomePage_HarshitChhabi() {
  return (
    <div className="gr-page" id="homepage-24BCI0098">
      {/* ── Hero Section ──────────────────────────────── */}
      <section className="gr-hero">
        <div className="gr-hero-bg gr-animate-gradient" />
        <div className="gr-hero-blob gr-hero-blob-1" />
        <div className="gr-hero-blob gr-hero-blob-2" />
        <div className="gr-hero-blob gr-hero-blob-3" />

        <div className="gr-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="gr-label" style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 1rem', borderRadius: '999px' }}>
              🌿 Sustainable Transportation for India
            </span>
            <h1 className="gr-heading-xl" style={{ marginTop: '1.5rem' }}>
              Share Rides,<br />
              <span style={{ background: 'linear-gradient(135deg, #6ee7b7, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Save The Planet
              </span>
            </h1>
            <p>
              GreenRoute connects commuters across India for smarter, greener travel.
              Carpool to work, find parking instantly, and track your environmental impact — all in one platform.
            </p>

            <div className="gr-hero-actions">
              <Link to="/carpool" className="gr-btn gr-btn-lg" style={{ background: '#fff', color: '#059669', fontWeight: 700 }}>
                Find a Ride →
              </Link>
              <Link to="/register" className="gr-btn gr-btn-lg gr-btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                Get Started Free
              </Link>
            </div>

            <div className="gr-hero-stats">
              {stats_24BCI0098.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="gr-hero-stat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="gr-hero-stat-value">{stat.value}</div>
                  <div className="gr-hero-stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="gr-hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="gr-hero-map-preview" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem',
              padding: '2rem',
            }}>
              <span style={{ fontSize: '4rem' }}>🗺️</span>
              <p style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontWeight: 500 }}>
                India-Wide Route Planning
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center' }}>
                Delhi • Mumbai • Bangalore • Chennai • Hyderabad & more
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────── */}
      <section className="gr-section" style={{ background: 'var(--gr-bg-secondary)' }}>
        <div className="gr-container">
          <AnimatedSection variant="fadeUp">
            <div className="gr-section-header">
              <span className="gr-label">Features</span>
              <h2 className="gr-heading-lg">Everything You Need for <span className="gr-text-gradient">Smarter Commuting</span></h2>
              <p>GreenRoute provides innovative solutions to make your daily commute efficient, affordable, and eco-friendly across India.</p>
            </div>
          </AnimatedSection>

          <StaggerContainer_24BCI0098 className="gr-features-grid" staggerDelay={0.1}>
            {features_24BCI0098.map((feature, index) => (
              <AnimatedSection key={index} variant="fadeUp" delay={index * 0.1}>
                <Link to={feature.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="gr-card gr-feature-card">
                    <div className="gr-feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                      <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </StaggerContainer_24BCI0098>
        </div>
      </section>

      {/* ── How It Works Section ──────────────────────── */}
      <section className="gr-section">
        <div className="gr-container">
          <AnimatedSection variant="fadeUp">
            <div className="gr-section-header">
              <span className="gr-label">How It Works</span>
              <h2 className="gr-heading-lg">Start in <span className="gr-text-gradient">3 Simple Steps</span></h2>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your account with Google sign-in or email in seconds.', icon: '👤' },
              { step: '02', title: 'Find or Offer', desc: 'Search for rides along your route or offer seats in your vehicle.', icon: '🔍' },
              { step: '03', title: 'Ride & Save', desc: 'Share your commute, split costs, and track your environmental impact.', icon: '🎯' },
            ].map((item, i) => (
              <AnimatedSection key={i} variant="fadeUp" delay={i * 0.15}>
                <div className="gr-card-solid" style={{ textAlign: 'center', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: '-10px', right: '-10px',
                    fontSize: '6rem', fontWeight: 900, opacity: 0.04,
                    fontFamily: 'Outfit, sans-serif', lineHeight: 1,
                  }}>
                    {item.step}
                  </div>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{item.icon}</span>
                  <span className="gr-badge gr-badge-accent" style={{ marginBottom: '1rem' }}>Step {item.step}</span>
                  <h3 className="gr-heading-sm" style={{ marginTop: '0.75rem' }}>{item.title}</h3>
                  <p className="gr-text-body" style={{ marginTop: '0.5rem' }}>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────── */}
      <section className="gr-section" style={{ background: 'var(--gr-bg-secondary)' }}>
        <div className="gr-container">
          <AnimatedSection variant="fadeUp">
            <div className="gr-section-header">
              <span className="gr-label">Impact</span>
              <h2 className="gr-heading-lg">Making India's Commute <span className="gr-text-gradient">Greener</span></h2>
            </div>
          </AnimatedSection>

          <div className="gr-stats-grid">
            {[
              { value: '25+', label: 'Cities Connected', icon: '🏙️' },
              { value: '10,000+', label: 'Rides Shared', icon: '🚗' },
              { value: '500+', label: 'Tons CO₂ Saved', icon: '🌱' },
              { value: '₹50L+', label: 'Money Saved', icon: '💰' },
            ].map((stat, i) => (
              <AnimatedSection key={i} variant="scaleIn" delay={i * 0.1}>
                <div className="gr-card gr-stat-card">
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{stat.icon}</span>
                  <div className="gr-stat-value">{stat.value}</div>
                  <div className="gr-stat-label">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────── */}
      <section className="gr-section">
        <div className="gr-container">
          <AnimatedSection variant="scaleIn">
            <div style={{
              background: 'var(--gr-gradient-dark)',
              borderRadius: 'var(--gr-radius-xl)',
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.1)', filter: 'blur(60px)' }} />
              <h2 className="gr-heading-lg" style={{ color: '#fff' }}>Ready to Transform Your Commute?</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '1rem auto 0', fontSize: '1.05rem' }}>
                Join thousands of users making a positive impact on India's environment.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="gr-btn gr-btn-lg" style={{ background: '#fff', color: '#064e3b', fontWeight: 700 }}>
                  Sign Up for Free
                </Link>
                <Link to="/about" className="gr-btn gr-btn-lg gr-btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                  Learn More
                </Link>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: '1.5rem', fontSize: '0.8rem' }}>
                Developed by {DEVELOPER_24BCI0098.fullIdentity}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
