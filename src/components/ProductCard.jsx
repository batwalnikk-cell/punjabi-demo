import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { formatPrice } = useStoreSettings();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isFavorite = isWishlisted(product.id);
  const primaryImage = product.images?.[0]?.url || '/assets/hero_punjabi_suit.jpg';

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant if present
    const firstVariant = product.variants?.[0];
    addToCart(product, {
      variantId: firstVariant?.id || null,
      size: firstVariant?.size || 'Standard',
      color: product.color,
      stitchingOption: firstVariant?.stitchingOption || 'Unstitched Fabric',
      priceAdjustment: firstVariant?.priceAdjustment || 0,
      quantity: 1,
    });
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link to={`/product/${product.slug}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="product-badges">
          {product.embroideryType === 'HANDMADE' && (
            <span className="badge badge-handmade">Handmade</span>
          )}
          {product.embroideryType === 'MACHINE' && (
            <span className="badge badge-machine">Machine Ari</span>
          )}
          {discountPercent && (
            <span className="badge badge-sale">{discountPercent}% OFF</span>
          )}
          {product.stock <= 0 && (
            <span className="badge badge-out-of-stock">Sold Out</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isFavorite ? 'var(--color-maroon)' : 'none'} />
        </button>

        {/* Quick Action Buttons on Hover */}
        <div className="product-quick-actions">
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.92)' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
          >
            <Eye size={15} /> Quick View
          </button>
          {product.stock > 0 && (
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={15} /> Add to Bag
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        {product.category && (
          <span className="product-category-name">{product.category.name}</span>
        )}
        <Link to={`/product/${product.slug}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <span className="product-meta-tags">{product.fabric} • {product.color}</span>

        <div className="product-pricing">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
