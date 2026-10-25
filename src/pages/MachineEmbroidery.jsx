import React, { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { QuickViewModal } from '../components/QuickViewModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CheckCircle2, Cpu } from 'lucide-react';
import { api } from '../services/api';

export const MachineEmbroidery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await api.getProducts({ embroideryType: 'MACHINE' });
        if (res.success) setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load machine embroidery suits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMachine();
  }, []);

  return (
    <div>
      {/* Editorial Banner */}
      <div
        style={{
          backgroundColor: '#171B24',
          color: '#FFFFFF',
          padding: '4.5rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-subtitle" style={{ color: '#93C5FD' }}>
            High Precision Textile Innovation
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', color: '#FFFFFF', marginBottom: '1rem' }}>
            Machine Embroidery Punjabi Suits
          </h1>
          <p style={{ color: '#D1D5DB', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Computerized multi-head Ari and Schiffli embroidery delivering flawless mathematical symmetry, reinforced durability, and contemporary elegance on sheer organzas, georgettes, and silks.
          </p>
        </div>
      </div>

      {/* Craft Details Box */}
      <div style={{ backgroundColor: '#F0F4F8', borderBottom: '1px solid #DCE3EA', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="#1E40AF" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>Flawless Symmetry</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>Every floral petal and scallop border mirrors mathematically for crisp modern aesthetics.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="#1E40AF" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>Reinforced Thread Retention</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>High-density lock stitches resist thread pulling and snagging during festivities.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="#1E40AF" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>Attractive Value</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>Enjoy rich embroidered aesthetics and fast dispatch at accessible price points.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container" style={{ padding: '4rem 1.5rem 6rem' }}>
        <div className="section-header">
          <span className="section-subtitle">Contemporary Grace</span>
          <h2 className="section-title">The Machine Embroidery Collection</h2>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving Machine Embroidered Suits..." />
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
