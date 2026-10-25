import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
import { useStoreSettings } from '../context/StoreSettingsContext';
import { api } from '../services/api';

export const Footer = () => {
  const { settings } = useStoreSettings();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await api.subscribeNewsletter(newsletterEmail, true);
      setSubscribed(true);
      setNewsletterEmail('');
    } catch (err) {
      setErrorMsg(err.message || 'Subscription failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Crown size={26} color="var(--color-gold)" />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>
                {settings?.storeName || 'PUNJAB ROYAL SUITS'}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#BDB1AD' }}>
              Specialists in heirloom handmade embroidery, authentic Phulkari needlework, high-precision machine Ari borders, and bespoke bridal Punjabi suits. Handcrafted in the heart of Punjab.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--color-gold)" />
                <span>{settings?.address || 'Heritage Chowk, Near Golden Temple, Amritsar, Punjab'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="var(--color-gold)" />
                <span>{settings?.phone || '+91 98765 43210'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="var(--color-gold)" />
                <span>{settings?.businessEmail || 'contact@punjabroyalsuits.com'}</span>
              </div>
            </div>
          </div>

          {/* Boutique Navigation */}
          <div>
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-links">
              <li><Link to="/shop">Shop All Suits</Link></li>
              <li><Link to="/handmade-embroidery">Handmade Embroidery</Link></li>
              <li><Link to="/machine-embroidery">Machine Embroidery</Link></li>
              <li><Link to="/shop?category=ready-made-suits">Ready-Made Punjabi Suits</Link></li>
              <li><Link to="/shop?category=unstitched-suit-sets">Unstitched Suit Sets</Link></li>
              <li><Link to="/custom-orders">Custom Orders & Tailoring</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-links">
              <li><Link to="/order-tracking">Track Your Order</Link></li>
              <li><Link to="/shipping-policy">Shipping & Delivery Policy</Link></li>
              <li><Link to="/return-policy">Return & Exchange Policy</Link></li>
              <li><Link to="/disclaimer">Product & Color Disclaimers</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/contact">Contact Boutique Support</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="footer-heading">Royal Newsletter</h4>
            <p style={{ fontSize: '0.88rem', color: '#BDB1AD', marginBottom: '1rem', lineHeight: '1.5' }}>
              Receive exclusive bridal catalog launches, festive discount codes, and artisan stories directly in your inbox.
            </p>

            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6EE7B7', fontSize: '0.88rem' }}>
                <CheckCircle2 size={18} />
                <span>You are subscribed to our boutique updates!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      flexGrow: 1,
                      padding: '0.65rem 0.8rem',
                      background: '#241B1E',
                      border: '1px solid #3D2D32',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-gold btn-sm"
                    disabled={loading}
                    aria-label="Subscribe"
                  >
                    <Send size={15} />
                  </button>
                </div>
                {errorMsg && <span style={{ color: '#FCA5A5', fontSize: '0.78rem' }}>{errorMsg}</span>}
                <span style={{ fontSize: '0.72rem', color: '#887B78' }}>
                  By subscribing, you consent to receive periodic boutique communications. You can unsubscribe anytime.
                </span>
              </form>
            )}

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#C5A059' }}
                  aria-label="Instagram"
                >
                  <InstagramIcon size={20} />
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#C5A059' }}
                  aria-label="Facebook"
                >
                  <FacebookIcon size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {settings?.storeName || 'Punjab Royal Suits'}. All Rights Reserved.</p>
          <p style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/disclaimer">Disclaimers</Link>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-and-conditions">Terms</Link>
            <Link to="/admin">Admin Access</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
