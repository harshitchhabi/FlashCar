/**
 * AboutPage.jsx — About GreenRoute
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { Link } from 'react-router-dom';
import AnimatedSection, { StaggerContainer_24BCI0098 } from '../components/common/AnimatedSection';
import { DEVELOPER_24BCI0098 } from '../utils/constants_24BCI0098';

export default function AboutPage_HarshitChhabi() {
  return (
    <div className="gr-page" id="about-page-24BCI0098">
      {/* Hero */}
      <section style={{ background: 'var(--gr-gradient-hero)', padding: '8rem 0 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: '-50px', right: '-50px', filter: 'blur(60px)' }} />
        <div className="gr-container" style={{ position: 'relative', textAlign: 'center' }}>
          <AnimatedSection variant="fadeUp">
            <span className="gr-label" style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 1rem', borderRadius: '999px' }}>About Us</span>
            <h1 className="gr-heading-xl" style={{ color: '#fff', marginTop: '1.5rem' }}>
              Building India's <span style={{ background: 'linear-gradient(135deg, #6ee7b7, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Greenest</span> Commute
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '1.5rem auto 0', fontSize: '1.1rem' }}>
              Our mission is to create sustainable transportation solutions that connect communities, reduce emissions, and make every commute count.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision */}
      <section className="gr-section">
        <div className="gr-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <AnimatedSection variant="fadeRight">
              <span className="gr-label">Our Vision</span>
              <h2 className="gr-heading-lg" style={{ marginTop: '0.5rem' }}>A Future Where Every Ride <span className="gr-text-gradient">Matters</span></h2>
              <p className="gr-text-body" style={{ marginTop: '1rem' }}>
                At GreenRoute, we envision a world where transportation is sustainable, efficient, and community-focused.
                We believe that by optimizing daily commutes through carpooling and smart parking across Indian cities,
                we can significantly reduce carbon emissions while building stronger communities.
              </p>
              <p className="gr-text-body" style={{ marginTop: '1rem' }}>
                Our platform makes sustainable transportation easy and rewarding, helping commuters,
                businesses, and cities work together toward a greener India.
              </p>
            </AnimatedSection>
            <AnimatedSection variant="fadeLeft">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { icon: '🌿', value: '500+', label: 'Tons CO₂ Saved' },
                  { icon: '🏙️', value: '25+', label: 'Indian Cities' },
                  { icon: '🚗', value: '10K+', label: 'Rides Shared' },
                  { icon: '⭐', value: '4.8', label: 'Avg Rating' },
                ].map((s, i) => (
                  <div key={i} className="gr-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                    <div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 800, color: 'var(--gr-accent)', marginTop: '0.5rem' }}>{s.value}</div>
                    <p className="gr-text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="gr-section" style={{ background: 'var(--gr-bg-secondary)' }}>
        <div className="gr-container">
          <AnimatedSection variant="fadeUp">
            <div className="gr-section-header">
              <span className="gr-label">Impact</span>
              <h2 className="gr-heading-lg">Environmental <span className="gr-text-gradient">Impact</span></h2>
            </div>
          </AnimatedSection>

          <StaggerContainer_24BCI0098 className="gr-features-grid" staggerDelay={0.1}>
            {[
              { icon: '⚡', title: 'Carbon Reduction', desc: 'Each shared ride reduces CO₂ by ~0.12kg per km compared to individual trips.' },
              { icon: '📊', title: 'Real-Time Tracking', desc: 'Track your personal and community environmental impact metrics in real-time.' },
              { icon: '🌐', title: 'UN SDG Aligned', desc: 'We contribute to UN Sustainable Development Goals for urban sustainability and climate action.' },
            ].map((item, i) => (
              <AnimatedSection key={i} variant="fadeUp" delay={i * 0.1}>
                <div className="gr-card gr-feature-card">
                  <div className="gr-feature-icon"><span style={{ fontSize: '1.5rem' }}>{item.icon}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </StaggerContainer_24BCI0098>
        </div>
      </section>

      {/* How It Works */}
      <section className="gr-section">
        <div className="gr-container">
          <AnimatedSection variant="fadeUp">
            <div className="gr-section-header">
              <span className="gr-label">How It Works</span>
              <h2 className="gr-heading-lg">Simple Steps to <span className="gr-text-gradient">Green Commuting</span></h2>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <AnimatedSection variant="fadeRight">
              <div className="gr-card-solid" style={{ padding: '2rem' }}>
                <h3 className="gr-heading-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🚗 Carpooling</h3>
                <ol style={{ marginTop: '1rem', paddingLeft: '1.25rem', listStyle: 'decimal', color: 'var(--gr-text-secondary)', lineHeight: 2 }}>
                  <li>Create your profile and set your commute routes</li>
                  <li>Choose to be a driver or passenger</li>
                  <li>Browse carpools matching your route across India</li>
                  <li>Connect with commuters and share rides</li>
                  <li>Track your environmental impact over time</li>
                </ol>
              </div>
            </AnimatedSection>
            <AnimatedSection variant="fadeLeft">
              <div className="gr-card-solid" style={{ padding: '2rem' }}>
                <h3 className="gr-heading-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🅿️ Smart Parking</h3>
                <ol style={{ marginTop: '1rem', paddingLeft: '1.25rem', listStyle: 'decimal', color: 'var(--gr-text-secondary)', lineHeight: 2 }}>
                  <li>Enter your destination and parking preferences</li>
                  <li>View available parking spots in real-time</li>
                  <li>Compare options by price, location, and features</li>
                  <li>Reserve your spot in advance</li>
                  <li>Navigate directly to your parking space</li>
                </ol>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Developer Section — Harshit Chhabi (24BCI0098) */}
      <section className="gr-section" style={{ background: 'var(--gr-bg-secondary)' }}>
        <div className="gr-container">
          <AnimatedSection variant="scaleIn">
            <div className="gr-card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
              <div className="gr-avatar gr-avatar-lg" style={{ margin: '0 auto 1.5rem', fontSize: '2rem' }}>HC</div>
              <h2 className="gr-heading-md">{DEVELOPER_24BCI0098.name}</h2>
              <p className="gr-text-body" style={{ marginTop: '0.5rem' }}>
                Registration: <strong style={{ color: 'var(--gr-accent)' }}>{DEVELOPER_24BCI0098.registrationNumber}</strong>
              </p>
              <p className="gr-text-body" style={{ marginTop: '1rem' }}>
                Full-stack developer passionate about sustainable technology and building solutions
                that make a real difference in how India commutes. GreenRoute is designed to demonstrate
                modern web development with React, Firebase authentication, Google Maps integration,
                and responsive design principles.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {['React.js', 'Firebase', 'Google Maps', 'Framer Motion', 'Vite'].map((tech) => (
                  <span key={tech} className="gr-badge gr-badge-accent">{tech}</span>
                ))}
              </div>

              {/* Portfolio Hyperlink — Assignment Requirement #8 */}
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://github.com/harshitchhabi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gr-btn gr-btn-primary gr-btn-sm"
                  id="portfolio-link-24BCI0098"
                  style={{ gap: '0.5rem' }}
                >
                  🔗 Portfolio — Harshit Chhabi
                </a>
                <a
                  href="https://github.com/harshitchhabi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gr-btn gr-btn-secondary gr-btn-sm"
                  style={{ gap: '0.5rem' }}
                >
                  GitHub Profile
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="gr-section">
        <div className="gr-container">
          <AnimatedSection variant="scaleIn">
            <div style={{
              background: 'var(--gr-gradient-dark)', borderRadius: 'var(--gr-radius-xl)',
              padding: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <h2 className="gr-heading-lg" style={{ color: '#fff' }}>Join the Green Commute Movement</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '1rem auto 0' }}>
                Be part of the solution. Together we can build a greener, more connected India.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="gr-btn gr-btn-lg" style={{ background: '#fff', color: '#064e3b', fontWeight: 700 }}>Sign Up Now</Link>
                <Link to="/carpool" className="gr-btn gr-btn-lg gr-btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>Explore Rides</Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
