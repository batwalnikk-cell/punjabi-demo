import React, { useState, useEffect } from 'react';
import { Home, Save, Check, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const HomepageManagement = () => {
  const { refreshSettings } = useStoreSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroBannerUrl: '',
    heroCtaText: '',
    heroCtaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    brandStoryTitle: '',
    brandStoryText: '',
    brandStoryImage: '',
    comparisonTitle: '',
    handmadeDescription: '',
    machineDescription: '',
    customBannerTitle: '',
    customBannerText: '',
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await api.getHomepageContent();
        if (res.success && res.content) {
          setFormData(res.content);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      await api.updateHomepageContent(formData);
      setNotice('Homepage content updated and published live!');
      refreshSettings();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update homepage content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading homepage settings..." />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Homepage Visual Content Editor</h1>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
          Modify storefront hero banners, headlines, craftsmanship guides, and promotional calls to action.
        </p>
      </div>

      {notice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {notice}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Hero Section Card */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            1. Hero Showcase Banner
          </h3>

          <div className="form-group">
            <label className="form-label">Main Hero Headline</label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Subtitle & Brand Pitch</label>
            <textarea
              name="heroSubtitle"
              rows={3}
              value={formData.heroSubtitle}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Background Image Path / URL</label>
            <input
              type="text"
              name="heroBannerUrl"
              value={formData.heroBannerUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="/assets/hero_punjabi_suit.jpg"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Primary Button Text</label>
              <input
                type="text"
                name="heroCtaText"
                value={formData.heroCtaText}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Button Destination</label>
              <input
                type="text"
                name="heroCtaLink"
                value={formData.heroCtaLink}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Button Text</label>
              <input
                type="text"
                name="secondaryCtaText"
                value={formData.secondaryCtaText}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Button Destination</label>
              <input
                type="text"
                name="secondaryCtaLink"
                value={formData.secondaryCtaLink}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Brand Heritage Story Card */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            2. Brand Craftsmanship Story
          </h3>

          <div className="form-group">
            <label className="form-label">Brand Story Heading</label>
            <input
              type="text"
              name="brandStoryTitle"
              value={formData.brandStoryTitle}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand Narrative Text</label>
            <textarea
              name="brandStoryText"
              rows={4}
              value={formData.brandStoryText}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Artisan Feature Image URL</label>
            <input
              type="text"
              name="brandStoryImage"
              value={formData.brandStoryImage || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="/assets/artisan_craft.jpg"
            />
          </div>
        </div>

        {/* Embroidery Comparison Section */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            3. Handmade vs Machine Embroidery Guide
          </h3>

          <div className="form-group">
            <label className="form-label">Section Heading</label>
            <input
              type="text"
              name="comparisonTitle"
              value={formData.comparisonTitle}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Handmade Needlework Explanation</label>
            <textarea
              name="handmadeDescription"
              rows={3}
              value={formData.handmadeDescription}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Machine Ari Embroidery Explanation</label>
            <textarea
              name="machineDescription"
              rows={3}
              value={formData.machineDescription}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Custom Order Call to Action Banner */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            4. Custom Order Call-to-Action Banner
          </h3>

          <div className="form-group">
            <label className="form-label">Banner Heading</label>
            <input
              type="text"
              name="customBannerTitle"
              value={formData.customBannerTitle}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Banner Text Description</label>
            <textarea
              name="customBannerText"
              rows={2}
              value={formData.customBannerText}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={saving}>
          {saving ? 'Saving Changes...' : 'Save & Publish Live Homepage'}
        </button>
      </form>
    </div>
  );
};
