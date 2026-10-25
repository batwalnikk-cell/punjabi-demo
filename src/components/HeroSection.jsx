import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const HeroSection = () => {
  const { homepage } = useStoreSettings();

  const title = homepage?.heroTitle || 'Royal Punjabi Elegance, Handcrafted with Heritage';
  const subtitle =
    homepage?.heroSubtitle ||
    'Discover heirloom Phulkari, intricate Zardozi, and contemporary Punjabi silhouettes tailored for weddings, festivals, and timeless celebrations.';
  const bannerImg = homepage?.heroBannerUrl || '/assets/hero_punjabi_suit.jpg';
  const ctaText = homepage?.heroCtaText || 'Explore Collection';
  const ctaLink = homepage?.heroCtaLink || '/shop';
  const secondaryText = homepage?.secondaryCtaText || 'Custom Embroidery';
  const secondaryLink = homepage?.secondaryCtaLink || '/custom-orders';

  return (
    <section className="hero-section">
      <img src={bannerImg} alt="Punjab Royal Suits Haute Couture" className="hero-bg-img" />
      <div className="hero-overlay" />
      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div className="hero-content">
          <span className="hero-tagline">
            <Sparkles size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Artisanal Punjabi Boutique Atelier
          </span>
          <h1 className="hero-heading">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          <div className="hero-actions">
            <Link to={ctaLink} className="btn btn-primary btn-lg">
              {ctaText} <ArrowRight size={18} />
            </Link>
            <Link to={secondaryLink} className="btn btn-gold btn-lg">
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
