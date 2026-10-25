import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const { formatPrice } = useStoreSettings();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedStitching, setSelectedStitching] = useState(
    product.variants?.[0]?.stitchingOption || 'Unstitched Fabric'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const primaryImage = product.images?.[0]?.url || '/assets/hero_punjabi_suit.jpg';
  const isFavorite = isWishlisted(product.id);

  const finalPrice = product.price + (selectedVariant?.priceAdjustment || 0);

  const handleAddToCart = () => {
    addToCart(product, {
      variantId: selectedVariant?.id || null,
      size: selectedVariant?.size || 'Standard Size',
      color: product.color,
      stitchingOption: selectedStitching,
      priceAdjustment: selectedVariant?.priceAdjustment || 0,
      quantity,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 1060,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-modal)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
          aria-label="Close Preview"
        >
          <X size={20} />
        </button>

        {/* Product Image */}
        <div style={{ backgroundColor: '#FAF8F5', maxHeight: '480px' }}>
          <img
            src={primaryImage}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Product Details Form */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.1em', fontWeight: 600 }}>
            {product.category?.name || 'Exclusive Suit'}
          </span>
          <h3 style={{ fontSize: '1.5rem', margin: '0.4rem 0 0.8rem' }}>{product.name}</h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
              {formatPrice(finalPrice)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '1rem', color: 'var(--color-gray-light)', textDecoration: 'line-through' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--color-gray-medium)', marginBottom: '1.2rem', lineHeight: '1.5' }}>
            {product.shortDescription}
          </p>

          {/* Size / Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Select Size / Fit:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedStitching(v.stitchingOption);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      border: selectedVariant?.id === v.id ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                      backgroundColor: selectedVariant?.id === v.id ? 'var(--color-maroon-subtle)' : '#FFF',
                      color: selectedVariant?.id === v.id ? 'var(--color-maroon)' : 'var(--color-charcoal)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1.5rem' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Bag
                </>
              )}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => toggleWishlist(product.id)}
              title="Add to Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={18} fill={isFavorite ? 'var(--color-maroon)' : 'none'} color={isFavorite ? 'var(--color-maroon)' : 'currentColor'} />
            </button>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              style={{ fontSize: '0.85rem', color: 'var(--color-maroon)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              View Full Product Specifications <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
