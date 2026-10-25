import React from 'react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const PriceDisplay = ({ price, originalPrice, size = 'md' }) => {
  const { formatPrice } = useStoreSettings();

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
      <span
        style={{
          color: 'var(--color-maroon)',
          fontWeight: 700,
          fontSize: size === 'lg' ? '1.8rem' : '1.25rem',
        }}
      >
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span
            style={{
              color: 'var(--color-gray-light)',
              textDecoration: 'line-through',
              fontSize: size === 'lg' ? '1.1rem' : '0.9rem',
            }}
          >
            {formatPrice(originalPrice)}
          </span>
          {discountPercent && (
            <span
              style={{
                color: 'var(--color-success)',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              ({discountPercent}% OFF)
            </span>
          )}
        </>
      )}
    </div>
  );
};
