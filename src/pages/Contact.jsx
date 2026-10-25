import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const Contact = () => {
  const { settings } = useStoreSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Get in Touch</span>
          <h1 className="section-title">Contact Our Boutique</h1>
          <p className="section-desc">
            We are here to assist with styling advice, measurements, order inquiries, and custom embroidery consultations.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          {/* Contact Details */}
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>Boutique Atelier</h3>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Whether you are looking for ready-to-ship salwar suits or wish to consult directly with our master embroiderer, reach out to us through any of the channels below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MapPin size={22} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>Heritage Boutique Address</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)' }}>
                    {settings?.address || 'Heritage Chowk, Near Golden Temple, Amritsar, Punjab, India'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Phone size={22} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>Telephone Helpline</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)' }}>
                    {settings?.phone || '+91 98765 43210'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MessageCircle size={22} color="#25D366" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>WhatsApp Stylist Support</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', display: 'block', marginBottom: '0.4rem' }}>
                    {settings?.whatsappNumber || '+91 98765 43210'}
                  </span>
                  <a
                    href={`https://wa.me/${(settings?.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.85rem', color: '#128C7E', fontWeight: 600 }}
                  >
                    Start WhatsApp Chat →
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Mail size={22} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>Direct Email</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)' }}>
                    {settings?.businessEmail || 'contact@punjabroyalsuits.com'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Clock size={22} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>Operating Hours</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)' }}>
                    Monday - Saturday: 10:00 AM - 8:00 PM IST<br />
                    Sunday: 11:00 AM - 5:00 PM IST
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Message Transmitted</h3>
                <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Thank you for writing to Punjab Royal Suits. Our client concierge team will respond within 24 business hours.
                </p>
                <button className="btn btn-outline" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Send Us a Direct Message</h3>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Your Name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topic / Inquiry Nature</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status / Tracking">Order Status / Tracking</option>
                    <option value="Custom Embroidery Tailoring">Custom Embroidery Tailoring</option>
                    <option value="Fabric & Sizing Advice">Fabric & Sizing Advice</option>
                    <option value="Wholesale / Bridal Trousseau">Wholesale / Bridal Trousseau</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                    placeholder="How may our boutique assist you today?"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
