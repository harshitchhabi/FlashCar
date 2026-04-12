/**
 * Footer.jsx — Site Footer
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { Link } from 'react-router-dom';
import { DEVELOPER_24BCI0098, FOOTER_LINKS_24BCI0098 } from '../../utils/constants_24BCI0098';

export default function Footer_HarshitChhabi() {
  return (
    <footer className="gr-footer" id="footer-24BCI0098">
      <div className="gr-container">
        <div className="gr-footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
              🌿 GreenRoute
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Making sustainable transportation accessible across India. Share rides, reduce emissions,
              and build a greener future together.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.85rem',
                    transition: 'all 0.3s',
                  }}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4>Product</h4>
            <div className="gr-footer-links">
              {FOOTER_LINKS_24BCI0098.product.map((link) => (
                <Link key={link.label} to={link.path}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4>Company</h4>
            <div className="gr-footer-links">
              {FOOTER_LINKS_24BCI0098.company.map((link, i) => (
                <Link key={`${link.label}-${i}`} to={link.path}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact</h4>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 2 }}>
              <p>📧 harshit.chhabi@greenroute.in</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 New Delhi, India</p>
              <p>
                🔗{' '}
                <a
                  href="https://github.com/harshitchhabi"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#34d399' }}
                  id="footer-portfolio-link-24BCI0098"
                >
                  Portfolio — Harshit Chhabi
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar — HarshitChhabiFooterBadge */}
        <div className="gr-footer-bottom" id="HarshitChhabiFooterBadge">
          <p>© {new Date().getFullYear()} GreenRoute. All rights reserved.</p>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            Developed with 💚 by{' '}
            <a href="https://github.com/harshitchhabi" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', fontWeight: 600 }}>
              {DEVELOPER_24BCI0098.name}
            </a>
            <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>({DEVELOPER_24BCI0098.registrationNumber})</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
