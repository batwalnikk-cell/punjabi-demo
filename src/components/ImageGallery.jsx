import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

export const ImageGallery = ({ images = [], productName = 'Punjabi Suit' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const displayImages = images.length > 0 ? images : [{ url: '/assets/hero_punjabi_suit.jpg', altText: productName }];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div>
      {/* Main Image */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          backgroundColor: '#FAF8F5',
          border: '1px solid var(--color-border)',
          aspectRatio: '3 / 4',
          cursor: 'zoom-in',
        }}
        onClick={() => setIsZoomOpen(true)}
      >
        <img
          src={currentImage.url}
          alt={currentImage.altText || productName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-subtle)',
          }}
          title="Zoom Image"
          aria-label="Zoom Image"
        >
          <ZoomIn size={18} color="var(--color-charcoal)" />
        </button>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: '72px',
                height: '90px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: selectedIndex === idx ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                padding: 0,
                background: 'none',
                cursor: 'pointer',
                opacity: selectedIndex === idx ? 1 : 0.7,
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
              }}
            >
              <img src={img.url} alt={img.altText || `${productName} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              color: '#FFF',
              cursor: 'pointer',
            }}
            aria-label="Close Zoom"
          >
            <X size={32} />
          </button>
          <img
            src={currentImage.url}
            alt={currentImage.altText || productName}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
