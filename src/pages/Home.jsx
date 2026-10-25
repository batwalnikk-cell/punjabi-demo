import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck, RefreshCw, Star, Heart } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { api } from '../services/api';

export const Home = () => {
  const { settings, homepage } = useStoreSettings();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes, revsRes] = await Promise.all([
          api.getCategories().catch(() => ({ categories: [] })),
          api.getProducts({ featuredOnly: 'true', limit: 8 }).catch(() => ({ products: [] })),
          api.getReviews().catch(() => ({ reviews: [] })),
        ]);
        setCategories(catsRes.categories || []);
        setFeaturedProducts(prodsRes.products || []);
        setReviews(revsRes.reviews || []);
      } catch (err) {
        console.error('Home page load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Unveiling Punjab Royal Suits Collection..." />;
  }

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Boutique Trust Badges */}
      <section style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid var(--color-border)', padding: '2rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              <Sparkles size={24} color="var(--color-maroon)" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--color-charcoal)' }}>Artisanal Embroidery</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>Hand Zardozi & Ari Needlework</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              <ShieldCheck size={24} color="var(--color-maroon)" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--color-charcoal)' }}>Pure Heritage Fabrics</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>Mulberry Silk, Chanderi & Organza</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              <Truck size={24} color="var(--color-maroon)" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--color-charcoal)' }}>Express Worldwide Shipping</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>Free domestic shipping over ₹2,999</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              <RefreshCw size={24} color="var(--color-maroon)" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--color-charcoal)' }}>Bespoke Custom Tailoring</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>Tailored to your exact measurements</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Curated Boutiques</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-desc">
              From historic handcrafted Phulkari to crisp machine embroidery and opulent bridal velvets.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-cream)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Royal Creations</span>
            <h2 className="section-title">Featured Punjabi Suits</h2>
            <p className="section-desc">
              Hand-selected signature suits reflecting the pinnacle of Punjabi needlecraft and royal grace.
            </p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Explore Complete Catalog <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Brand Craftsmanship Story */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="section-subtitle">Heritage & Needlework</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                {homepage?.brandStoryTitle || 'Preserving the Royal Art of Punjabi Needlework'}
              </h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {homepage?.brandStoryText ||
                  'At Punjab Royal Suits, every ensemble is a tribute to centuries-old Punjabi sartorial royalty. Rooted in the artisan traditions of Amritsar, Patiala, and Ludhiana, our master craftsmen hand-weave intricate Zardozi, Resham threadwork, Gota Patti, and traditional Phulkari motifs onto the finest pure silks, georgettes, and chanderis.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--color-maroon)" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>Traditional wooden Adda needlework frames</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--color-maroon)" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>Authentic metallic Zari, Dabka, and French wire</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--color-maroon)" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>2-inch inner margins on all stitched suits for future ease</span>
                </div>
              </div>
              <Link to="/about" className="btn btn-outline">
                Read Our Heritage Story
              </Link>
            </div>

            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-hover)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <img
                  src={homepage?.brandStoryImage || '/assets/artisan_craft.jpg'}
                  alt="Punjabi Master Artisan Hand Embroidery"
                  style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Handmade vs Machine Embroidery Comparison Section */}
      <section className="comparison-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Craftsmanship Guide</span>
            <h2 className="section-title">
              {homepage?.comparisonTitle || 'Handmade vs Machine Embroidery'}
            </h2>
            <p className="section-desc">
              Understand the artistry, technique, and distinct beauty behind both forms of Punjabi embroidery.
            </p>
          </div>

          <div className="comparison-grid">
            {/* Handmade Craft Card */}
            <div className="craft-card">
              <img src="/assets/artisan_craft.jpg" alt="Handmade Embroidery" className="craft-img" />
              <div className="craft-body">
                <span className="badge badge-handmade" style={{ marginBottom: '0.8rem' }}>
                  Heirloom Artistry
                </span>
                <h3>Handmade Needlework</h3>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {homepage?.handmadeDescription ||
                    'Each handmade motif is painstakingly created by master artisans over days or weeks using traditional needlework, wooden embroidery frames (Adda), and fine gold & silk threads. Every piece possesses unique human character and heirloom value.'}
                </p>
                <ul className="craft-features">
                  <li><CheckCircle2 size={16} color="var(--color-maroon)" /> Created individually stitch-by-stitch by artisans</li>
                  <li><CheckCircle2 size={16} color="var(--color-maroon)" /> Uses metallic Dabka, Zardozi, and Gota wire</li>
                  <li><CheckCircle2 size={16} color="var(--color-maroon)" /> Subtle variations that celebrate hand craftsmanship</li>
                  <li><CheckCircle2 size={16} color="var(--color-maroon)" /> Ideal for weddings, bridal wear, and family heirlooms</li>
                </ul>
                <div style={{ marginTop: '1.8rem' }}>
                  <Link to="/handmade-embroidery" className="btn btn-outline btn-sm">
                    View Handmade Collection
                  </Link>
                </div>
              </div>
            </div>

            {/* Machine Craft Card */}
            <div className="craft-card">
              <img src="/assets/machine_craft.jpg" alt="Machine Embroidery" className="craft-img" />
              <div className="craft-body">
                <span className="badge badge-machine" style={{ marginBottom: '0.8rem' }}>
                  Precision & Durability
                </span>
                <h3>Machine Ari Embroidery</h3>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {homepage?.machineDescription ||
                    'High-precision computerized multi-head embroidery ensures exact symmetry, crisp borders, and durable thread retention at accessible price points, perfect for contemporary festive and everyday ethnic elegance.'}
                </p>
                <ul className="craft-features">
                  <li><CheckCircle2 size={16} color="var(--color-gold)" /> Mathematical floral symmetry & sharp repetitive borders</li>
                  <li><CheckCircle2 size={16} color="var(--color-gold)" /> Tight high-density lock stitching with high snag-resistance</li>
                  <li><CheckCircle2 size={16} color="var(--color-gold)" /> Faster dispatch and attractive accessible pricing</li>
                  <li><CheckCircle2 size={16} color="var(--color-gold)" /> Ideal for festive gatherings, sangeet, and gift sets</li>
                </ul>
                <div style={{ marginTop: '1.8rem' }}>
                  <Link to="/machine-embroidery" className="btn btn-outline btn-sm">
                    View Machine Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Custom Order CTA Banner */}
      <section className="container">
        <div className="custom-cta-banner">
          <span style={{ color: 'var(--color-gold-light)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.6rem' }}>
            Bespoke Atelier Service
          </span>
          <h2>{homepage?.customBannerTitle || 'Have a Dream Punjabi Suit in Mind?'}</h2>
          <p>
            {homepage?.customBannerText ||
              'From bespoke bridal suits to personalized color palettes and custom embroidery patterns, our master designers bring your vision to life.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/custom-orders" className="btn btn-gold btn-lg">
              Start Custom Suit Inquiry <ArrowRight size={17} />
            </Link>
            <a
              href={`https://wa.me/${(settings?.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}?text=Hello,%20I%20would%20like%20to%20inquire%20about%20a%20custom%20Punjabi%20suit.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Consult via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews */}
      {reviews.length > 0 && (
        <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Patron Testimonials</span>
              <h2 className="section-title">Words from Our Clients</h2>
              <p className="section-desc">
                Genuine feedback from customers in India and across the world.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    padding: '2rem',
                    backgroundColor: 'var(--color-ivory)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.2rem', color: '#F59E0B', marginBottom: '1rem' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={17} fill="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--color-charcoal)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
                    "{rev.comment}"
                  </p>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{rev.customerName}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>
                      {rev.customerCity || 'Verified Patron'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
