import React from 'react';
import { Crown, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const About = () => {
  const { settings } = useStoreSettings();

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-header">
          <span className="section-subtitle">Heritage & Artistry</span>
          <h1 className="section-title">About {settings?.storeName || 'Punjab Royal Suits'}</h1>
          <p className="section-desc">
            Preserving centuries of Punjabi textile excellence, master Adda needlework, and royal silhouette tailoring.
          </p>
        </div>

        <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '3rem', boxShadow: 'var(--shadow-card)' }}>
          <img
            src="/assets/artisan_craft.jpg"
            alt="Artisan embroidering Punjabi suit"
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
          />
        </div>

        <div style={{ lineHeight: '1.8', color: 'var(--color-charcoal)', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>
            Welcome to <strong>{settings?.storeName || 'Punjab Royal Suits'}</strong>. Born from a profound reverence for the majestic sartorial heritage of Punjab, our boutique represents the bridge between age-old artisan craftsmanship and contemporary ethnic fashion.
          </p>
          <p>
            In an era of mass-produced, fast-fashion garments, we champion the slow, thoughtful art of Punjabi embroidery. From the historic Phulkari geometric Bagh motifs woven by village women in rural Punjab to the imperial gold Zardozi, Tilla, and Dabka needlework mastered over generations on traditional wooden Adda frames, each piece in our atelier is created with reverence for human touch.
          </p>
          <p>
            Every suit fabric is personally sourced from certified textile mills—pure Chanderi silks, mulberry raw silks, delicate glass organzas, and supple velvets. Whether you choose an unstitched set to tailor locally or commission a bespoke bridal ensemble measured to your exact proportions, our boutique promises uncompromising standards of craftsmanship, generous seam margins, and transparent pricing.
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.8rem',
            marginTop: '3.5rem',
          }}
        >
          <div style={{ padding: '1.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <Crown size={28} color="var(--color-gold)" style={{ marginBottom: '0.8rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Imperial Heritage</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-gray-medium)' }}>
              Inspired by the royal courts of Patiala, Kapurthala, and Amritsar, our cuts honor authentic Punjabi pride.
            </p>
          </div>
          <div style={{ padding: '1.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <Heart size={28} color="var(--color-maroon)" style={{ marginBottom: '0.8rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Artisan Empowerment</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-gray-medium)' }}>
              We work directly with master karigars (craftsmen) and women embroidery collectives, ensuring fair wages and cultural respect.
            </p>
          </div>
          <div style={{ padding: '1.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <ShieldCheck size={28} color="var(--color-maroon)" style={{ marginBottom: '0.8rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Purity Guaranteed</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-gray-medium)' }}>
              Zero synthetic blends disguised as pure silk. Full transparency on embroidery materials and fabric compositions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
