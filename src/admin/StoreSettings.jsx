import React, { useState, useEffect } from 'react';
import {
  Save,
  Store,
  CreditCard,
  Truck,
  Bell,
  Share2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const StoreSettings = () => {
  const { refreshSettings } = useStoreSettings();
  const [formData, setFormData] = useState({
    storeName: '',
    tagline: '',
    logoUrl: '',
    faviconUrl: '',
    businessEmail: '',
    phone: '',
    whatsappNumber: '',
    address: '',
    currencyCode: 'INR',
    currencySymbol: '₹',
    freeShippingThreshold: 2999,
    standardShippingFee: 150,
    taxPercentage: 5,
    enableCOD: true,
    enableOnlinePayment: true,
    razorpayKeyId: '',
    razorpayKeySecret: '',
    manualUpiId: '',
    announcementText: '',
    showAnnouncement: true,
    isMaintenanceMode: false,
    instagramUrl: '',
    facebookUrl: '',
    pinterestUrl: '',
    youtubeUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
          freeShippingThreshold: data.freeShippingThreshold ?? 2999,
          standardShippingFee: data.standardShippingFee ?? 150,
          taxPercentage: data.taxPercentage ?? 5,
          enableCOD: data.enableCOD ?? true,
          enableOnlinePayment: data.enableOnlinePayment ?? true,
          showAnnouncement: data.showAnnouncement ?? true,
          isMaintenanceMode: data.isMaintenanceMode ?? false,
        }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      setErrorMsg('');

      await api.updateSettings(formData);
      await refreshSettings();
      setSuccessMsg('Store settings updated successfully and applied to public storefront.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Boutique Store Settings..." />;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-maroon)' }}>
            Store Configuration & Settings
          </h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Configure your boutique brand name, contact details, shipping rules, payment gateways, and announcements.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #10B981',
          color: '#065F46',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} color="#10B981" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #EF4444',
          color: '#991B1B',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} color="#EF4444" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Brand & Identity */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <Store size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-maroon)', margin: 0 }}>
              Brand Identity & Details
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Store Brand Name *</label>
              <input
                type="text"
                name="storeName"
                className="form-input"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g. PUNJAB ROYAL SUITS"
                required
              />
              <small style={{ color: 'var(--color-gray-medium)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Displayed across headers, footers, SEO tags, invoices, and titles.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Brand Tagline</label>
              <input
                type="text"
                name="tagline"
                className="form-input"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Exquisite Punjabi Suits & Royal Craftsmanship"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Logo Image URL</label>
              <input
                type="text"
                name="logoUrl"
                className="form-input"
                value={formData.logoUrl || ''}
                onChange={handleChange}
                placeholder="/assets/logo.png or uploaded image URL"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Favicon URL</label>
              <input
                type="text"
                name="faviconUrl"
                className="form-input"
                value={formData.faviconUrl || ''}
                onChange={handleChange}
                placeholder="/favicon.ico"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <Bell size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-maroon)', margin: 0 }}>
              Boutique Contact & WhatsApp
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Business Email *</label>
              <input
                type="email"
                name="businessEmail"
                className="form-input"
                value={formData.businessEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer Support Phone</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official WhatsApp Number *</label>
              <input
                type="text"
                name="whatsappNumber"
                className="form-input"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+919876543210 (include country code without + for API)"
                required
              />
              <small style={{ color: 'var(--color-gray-medium)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Used by floating WhatsApp button & custom order inquiries.
              </small>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Physical Boutique Address</label>
              <textarea
                name="address"
                className="form-input"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Heritage Chowk, Near Golden Temple, Amritsar, Punjab, India"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Shipping & Taxation */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <Truck size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-maroon)', margin: 0 }}>
              Shipping, Currency & Taxes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Currency Code</label>
              <input
                type="text"
                name="currencyCode"
                className="form-input"
                value={formData.currencyCode}
                onChange={handleChange}
                placeholder="INR"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                name="currencySymbol"
                className="form-input"
                value={formData.currencySymbol}
                onChange={handleChange}
                placeholder="₹"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                name="standardShippingFee"
                className="form-input"
                value={formData.standardShippingFee}
                onChange={handleNumberChange}
                min="0"
                step="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                className="form-input"
                value={formData.freeShippingThreshold}
                onChange={handleNumberChange}
                min="0"
                step="100"
              />
              <small style={{ color: 'var(--color-gray-medium)', fontSize: '0.75rem' }}>
                Orders above this amount get free shipping.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">GST / Tax Percentage (%)</label>
              <input
                type="number"
                name="taxPercentage"
                className="form-input"
                value={formData.taxPercentage}
                onChange={handleNumberChange}
                min="0"
                max="100"
                step="0.5"
              />
              <small style={{ color: 'var(--color-gray-medium)', fontSize: '0.75rem' }}>
                E.g. 5% for ready-made apparel.
              </small>
            </div>
          </div>
        </div>

        {/* Section 4: Payment Gateways */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <CreditCard size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-maroon)', margin: 0 }}>
              Payment Methods & Gateway Config
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <input
                type="checkbox"
                id="enableCOD"
                name="enableCOD"
                checked={formData.enableCOD}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-maroon)' }}
              />
              <label htmlFor="enableCOD" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                Enable Cash on Delivery (COD)
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-medium)', fontWeight: 400 }}>
                  Allows customers to pay when their suit arrives.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <input
                type="checkbox"
                id="enableOnlinePayment"
                name="enableOnlinePayment"
                checked={formData.enableOnlinePayment}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-maroon)' }}
              />
              <label htmlFor="enableOnlinePayment" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                Enable Online Gateway (Razorpay / UPI)
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-medium)', fontWeight: 400 }}>
                  Provides instant UPI, Cards, NetBanking, and Wallets.
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Razorpay Key ID</label>
              <input
                type="text"
                name="razorpayKeyId"
                className="form-input"
                value={formData.razorpayKeyId || ''}
                onChange={handleChange}
                placeholder="rzp_test_... or rzp_live_..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Razorpay Key Secret</label>
              <input
                type="password"
                name="razorpayKeySecret"
                className="form-input"
                value={formData.razorpayKeySecret || ''}
                onChange={handleChange}
                placeholder="Keep secure (will not be leaked to public)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Manual UPI VPA / ID</label>
              <input
                type="text"
                name="manualUpiId"
                className="form-input"
                value={formData.manualUpiId || ''}
                onChange={handleChange}
                placeholder="punjabroyalsuits@upi"
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E5E7EB', display: 'flex', gap: '0.6rem', marginTop: '1rem', fontSize: '0.82rem', color: '#4B5563' }}>
            <Info size={18} color="#3B82F6" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              If Razorpay keys are left empty, the storefront displays an informative notice that online gateway credentials are not yet configured, and provides Cash on Delivery or Manual UPI payment options safely without throwing runtime errors.
            </span>
          </div>
        </div>

        {/* Section 5: Announcements & Store Modes */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <Bell size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-maroon)', margin: 0 }}>
              Top Announcement Bar & Maintenance
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="showAnnouncement"
              name="showAnnouncement"
              checked={formData.showAnnouncement}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-maroon)' }}
            />
            <label htmlFor="showAnnouncement" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
              Enable Top Announcement Banner
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Banner Text</label>
            <input
              type="text"
              name="announcementText"
              className="form-input"
              value={formData.announcementText || ''}
              onChange={handleChange}
              placeholder="✨ Festive Offer: Complimentary Bespoke Stitching on Orders Above ₹4,999! Express Worldwide Delivery available."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', padding: '1rem', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-sm)' }}>
            <input
              type="checkbox"
              id="isMaintenanceMode"
              name="isMaintenanceMode"
              checked={formData.isMaintenanceMode}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', accentColor: '#DC2626' }}
            />
            <label htmlFor="isMaintenanceMode" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: '#991B1B' }}>
              Maintenance Mode (Temporarily disables storefront checkout)
            </label>
          </div>
        </div>

        {/* Section 6: Social Media Links */}
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <Share2 size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-maroon)', margin: 0 }}>
              Social Media Links
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Instagram Profile URL</label>
              <input
                type="url"
                name="instagramUrl"
                className="form-input"
                value={formData.instagramUrl || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/punjabroyalsuits"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Page URL</label>
              <input
                type="url"
                name="facebookUrl"
                className="form-input"
                value={formData.facebookUrl || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/punjabroyalsuits"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pinterest Gallery URL</label>
              <input
                type="url"
                name="pinterestUrl"
                className="form-input"
                value={formData.pinterestUrl || ''}
                onChange={handleChange}
                placeholder="https://pinterest.com/punjabroyalsuits"
              />
            </div>

            <div className="form-group">
              <label className="form-label">YouTube Channel URL</label>
              <input
                type="url"
                name="youtubeUrl"
                className="form-input"
                value={formData.youtubeUrl || ''}
                onChange={handleChange}
                placeholder="https://youtube.com/@punjabroyalsuits"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2.25rem' }}
          >
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
