import React, { useState } from 'react';
import { Sparkles, Upload, CheckCircle2, MessageCircle, Clock, ShieldCheck, Ruler } from 'lucide-react';
import { api } from '../services/api';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const CustomOrders = () => {
  const { settings } = useStoreSettings();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    embroideryType: 'Handmade Zardozi / Adda Work',
    suitType: 'Patiala Salwar Kameez',
    fabricPreference: 'Pure Chanderi Silk',
    colorPreference: 'Custom Shade (Will provide swatch)',
    targetDate: '',
    budgetRange: '₹10,000 - ₹20,000',
    requirements: '',
  });

  const [referenceFile, setReferenceFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.requirements) {
      setErrorMsg('Please provide your name, phone number, and custom suit requirements.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((k) => data.append(k, formData[k]));
      if (referenceFile) {
        data.append('referenceImage', referenceFile);
      }

      const res = await api.submitInquiry(data);
      if (res.success && res.inquiry) {
        setSubmittedInquiry(res.inquiry);
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        setErrorMsg(res.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ maxWidth: '780px' }}>
          <span className="section-subtitle">Haute Couture Atelier</span>
          <h1 className="section-title">Bespoke Punjabi Suit Orders</h1>
          <p className="section-desc">
            Commission a one-of-a-kind heirloom suit hand-embroidered by our master artisans to your exact measurements, color palette, and design aesthetic.
          </p>
        </div>

        {/* Steps / Process Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem',
          }}
        >
          <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-maroon)', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>01</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.3rem' }}>Submit Inquiry</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>Share your dream design, reference photos, fabric choices, and occasion date.</span>
          </div>
          <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-maroon)', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>02</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.3rem' }}>WhatsApp Consultation</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>Our boutique designer discusses color swatches, embroidery motifs, and exact measurements with you.</span>
          </div>
          <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-maroon)', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>03</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.3rem' }}>Adda Frame Crafting</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>Master artisans hand-embroider your suit, followed by boutique tailoring and finishing.</span>
          </div>
          <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-maroon)', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>04</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.3rem' }}>Insured Delivery</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>Shipped securely in boutique presentation packaging with tracking across India & worldwide.</span>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {submittedInquiry ? (
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-hover)',
            }}
          >
            <CheckCircle2 size={54} color="var(--color-success)" style={{ margin: '0 auto 1.25rem' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Bespoke Inquiry Received!</h2>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              Your inquiry reference number is <strong style={{ color: 'var(--color-maroon)' }}>{submittedInquiry.inquiryNumber}</strong>.
            </p>
            <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Our master designer will review your requirements and reach out to you via WhatsApp at <strong>{submittedInquiry.customerPhone}</strong> within 24 business hours to share embroidery samples and a formal quotation.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSubmittedInquiry(null);
                  setFormData({
                    customerName: '',
                    customerPhone: '',
                    customerEmail: '',
                    embroideryType: 'Handmade Zardozi / Adda Work',
                    suitType: 'Patiala Salwar Kameez',
                    fabricPreference: 'Pure Chanderi Silk',
                    colorPreference: 'Custom Shade',
                    targetDate: '',
                    budgetRange: '₹10,000 - ₹20,000',
                    requirements: '',
                  });
                  setReferenceFile(null);
                }}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Form Area */
          <div
            style={{
              maxWidth: '840px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.6rem' }}>
                1. Your Contact Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Jasleen Kaur"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. jasleen@example.com"
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.6rem' }}>
                2. Suit & Embroidery Preferences
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Embroidery Craft Choice</label>
                  <select name="embroideryType" value={formData.embroideryType} onChange={handleChange} className="form-select">
                    <option value="Handmade Zardozi / Adda Work">Handmade Zardozi / Adda Work</option>
                    <option value="Traditional Hand Phulkari">Traditional Hand Phulkari</option>
                    <option value="Gota Patti & Dori Work">Gota Patti & Dori Work</option>
                    <option value="Computerized Ari Machine Embroidery">Computerized Ari Machine Embroidery</option>
                    <option value="Tilla Metallic Threadwork">Tilla Metallic Threadwork</option>
                    <option value="Mixed Artisan Craft">Mixed Artisan Craft</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Suit Silhouette</label>
                  <select name="suitType" value={formData.suitType} onChange={handleChange} className="form-select">
                    <option value="Patiala Salwar Kameez">Authentic Pleated Patiala Salwar Kameez</option>
                    <option value="Straight Kurta with Cigarette Trouser">Straight Kurta with Cigarette Trouser</option>
                    <option value="Floor-Length Anarkali Suit">Floor-Length Anarkali Suit</option>
                    <option value="Sharara / Gharara Suit Set">Sharara / Gharara Suit Set</option>
                    <option value="Unstitched Designer 3-Piece Set">Unstitched Designer 3-Piece Set</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Fabric Choice</label>
                  <select name="fabricPreference" value={formData.fabricPreference} onChange={handleChange} className="form-select">
                    <option value="Pure Chanderi Silk">Pure Chanderi Silk</option>
                    <option value="Mulberry Pure Silk">Mulberry Pure Silk</option>
                    <option value="Pure Viscose Georgette">Pure Viscose Georgette</option>
                    <option value="Glass Organza with Lining">Glass Organza with Lining</option>
                    <option value="Micro Velvet 9000">Micro Velvet 9000 (Winter / Wedding)</option>
                    <option value="Pure Raw Silk">Pure Raw Silk</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Color Preference</label>
                  <input
                    type="text"
                    name="colorPreference"
                    value={formData.colorPreference}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Royal Maroon, Rani Pink, Mint Green"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Completion Date</label>
                  <input
                    type="date"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Budget</label>
                  <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="form-select">
                    <option value="Under ₹8,000">Under ₹8,000</option>
                    <option value="₹8,000 - ₹15,000">₹8,000 - ₹15,000</option>
                    <option value="₹15,000 - ₹25,000">₹15,000 - ₹25,000</option>
                    <option value="₹25,000 - ₹40,000">₹25,000 - ₹40,000 (Bridal Trousseau)</option>
                    <option value="Above ₹40,000">Above ₹40,000 (Heirloom Couture)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specific Requirements, Neckline, or Dupatta Details *</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe your desired embroidery patterns, sleeve length, dupatta border width, or fitting preferences..."
                  required
                />
              </div>

              {/* Reference Image Upload */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Upload Reference Photo / Sketch (Optional)</label>
                <div
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--color-ivory)',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('reference-file-input').click()}
                >
                  <Upload size={28} color="var(--color-maroon)" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ fontSize: '0.88rem', display: 'block', fontWeight: 600 }}>
                    {referenceFile ? referenceFile.name : 'Click to select reference photo (JPEG, PNG, WebP up to 8MB)'}
                  </span>
                  <input
                    id="reference-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => setReferenceFile(e.target.files[0] || null)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={submitting}
              >
                {submitting ? 'Submitting Custom Order Inquiry...' : 'Submit Bespoke Inquiry to Master Designer'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
