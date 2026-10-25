import React, { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { QuickViewModal } from '../components/QuickViewModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const HandmadeEmbroidery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchHandmade = async () => {
      try {
        const res = await api.getProducts({ embroideryType: 'HANDMADE' });
        if (res.success) setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load handmade suits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHandmade();
  }, []);

  return (
    <div>
      {/* Editorial Banner */}
      <div
        style={{
          backgroundColor: '#1E1416',
          color: '#FFFFFF',
          padding: '4.5rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-subtitle" style={{ color: 'var(--color-gold-light)' }}>
            Master Artisan Needlecraft
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', color: '#FFFFFF', marginBottom: '1rem' }}>
            Handmade Punjabi Suit Embroidery
          </h1>
          <p style={{ color: '#E8DED9', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Every stitch is placed by hand on traditional wooden Adda frames by master artisans in Amritsar and Patiala. Discover heirloom Zardozi, traditional silk Phulkari, Dabka, and Gota Patti.
          </p>
        </div>
      </div>

      {/* Craft Details Box */}
      <div style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1px solid var(--color-border)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>Authentic Adda Frames</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>Fabric is stretched taut on wooden frames for millimeter-precise needle placement.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>Precious Metallic Threads</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>Fine gold & silver zari, real copper wire, French sequins, and lustrous silk floss.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>Heirloom Longevity</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>Passed down through generations of Punjabi families as timeless festive treasures.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container" style={{ padding: '4rem 1.5rem 6rem' }}>
        <div className="section-header">
          <span className="section-subtitle">Exquisite Creations</span>
          <h2 className="section-title">The Handmade Collection</h2>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving Handmade Punjabi Suits..." />
        ) : (
          <ProductGrid
            products={products}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
