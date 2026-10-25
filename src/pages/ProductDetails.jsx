import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
} from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { PriceDisplay } from '../components/PriceDisplay';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';

export const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { formatPrice, settings } = useStoreSettings();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedStitching, setSelectedStitching] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
          const firstVariant = res.product.variants?.[0] || null;
          setSelectedVariant(firstVariant);
          setSelectedStitching(firstVariant?.stitchingOption || 'Unstitched Fabric');
        } else {
          setError('Product not found or has been retired.');
        }
      } catch (err) {
        setError(err.message || 'Error loading product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading Bespoke Suit Details..." />;
  if (error || !product) return <ErrorMessage message={error || 'Product not found'} onRetry={() => window.location.reload()} />;

  const isFavorite = isWishlisted(product.id);
  const finalUnitPrice = product.price + (selectedVariant?.priceAdjustment || 0);

  const handleAddToCart = () => {
    addToCart(product, {
      variantId: selectedVariant?.id || null,
      size: selectedVariant?.size || 'Standard Size',
      color: product.color,
      stitchingOption: selectedStitching,
      priceAdjustment: selectedVariant?.priceAdjustment || 0,
      quantity,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, {
      variantId: selectedVariant?.id || null,
      size: selectedVariant?.size || 'Standard Size',
      color: product.color,
      stitchingOption: selectedStitching,
      priceAdjustment: selectedVariant?.priceAdjustment || 0,
      quantity,
    });
    navigate('/checkout');
  };

  const productShareUrl = window.location.href;
  const whatsappInquiryUrl = `https://wa.me/${(settings?.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Punjab Royal Suits, I am inquiring about "${product.name}" (${product.sku}): ${productShareUrl}`
  )}`;

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav style={{ fontSize: '0.82rem', color: 'var(--color-gray-light)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--color-charcoal)' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <Link to="/shop" style={{ color: 'var(--color-charcoal)' }}>Shop</Link>
          {product.category && (
            <>
              <span style={{ margin: '0 0.5rem' }}>/</span>
              <Link to={`/shop?category=${product.category.slug}`} style={{ color: 'var(--color-charcoal)' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: 'var(--color-maroon)' }}>{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
            marginBottom: '5rem',
          }}
        >
          {/* Left Column: Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Information & Options */}
          <div>
            {/* Category & Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.1em', fontWeight: 600 }}>
                {product.category?.name || 'Exclusive Suit'}
              </span>
              {product.embroideryType === 'HANDMADE' && (
                <span className="badge badge-handmade">Handmade Zardozi</span>
              )}
              {product.embroideryType === 'MACHINE' && (
                <span className="badge badge-machine">Computerized Ari</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', marginBottom: '0.8rem', lineHeight: '1.2' }}>
              {product.name}
            </h1>

            <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-light)', marginBottom: '1.2rem' }}>
              SKU: <strong>{product.sku}</strong> • Stock:{' '}
              {product.stock > 0 ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                  In Stock ({product.stock} units ready to ship)
                </span>
              ) : (
                <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>Out of Stock</span>
              )}
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1.8rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <PriceDisplay price={finalUnitPrice} originalPrice={product.originalPrice} size="lg" />
              <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)', marginTop: '0.3rem', display: 'block' }}>
                Inclusive of all boutique tailoring and domestic delivery charges on qualifying orders.
              </span>
            </div>

            {/* Size / Fit Selection */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Select Size / Silhouette:
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', cursor: 'pointer' }}>
                    Standard Size Chart
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setSelectedStitching(v.stitchingOption);
                      }}
                      style={{
                        padding: '0.6rem 1.2rem',
                        border: selectedVariant?.id === v.id ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                        backgroundColor: selectedVariant?.id === v.id ? 'var(--color-maroon-subtle)' : '#FFFFFF',
                        color: selectedVariant?.id === v.id ? 'var(--color-maroon)' : 'var(--color-charcoal)',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {v.size}
                      {v.priceAdjustment > 0 && ` (+${formatPrice(v.priceAdjustment)})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stitching Option Selection */}
            <div style={{ marginBottom: '1.8rem' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Tailoring & Stitching Service:
              </label>
              <select
                value={selectedStitching}
                onChange={(e) => setSelectedStitching(e.target.value)}
                className="form-select"
              >
                <option value="Unstitched Fabric">Unstitched Fabric (3-Piece with Dupatta)</option>
                <option value="Standard Ready-to-Wear Stitched">Standard Ready-to-Wear Stitched (with 2-inch margin)</option>
                <option value="Custom Boutique Fit (Tailored on WhatsApp Consultation)">
                  Custom Boutique Fit (Measurements confirmed via WhatsApp)
                </option>
              </select>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFF',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ border: 'none', background: 'none', padding: '0.75rem 1rem', cursor: 'pointer' }}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span style={{ padding: '0 0.8rem', fontWeight: 600, fontSize: '0.95rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ border: 'none', background: 'none', padding: '0.75rem 1rem', cursor: 'pointer' }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '170px' }}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>

              <button
                className="btn btn-gold"
                style={{ flex: 1, minWidth: '150px' }}
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>

              <button
                className="btn btn-outline"
                onClick={() => toggleWishlist(product.id)}
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart size={20} fill={isFavorite ? 'var(--color-maroon)' : 'none'} color={isFavorite ? 'var(--color-maroon)' : 'currentColor'} />
              </button>
            </div>

            {addedNotice && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>Added to your bag! Open bag to checkout or continue shopping.</span>
              </div>
            )}

            {/* WhatsApp Direct Inquiry */}
            <div style={{ marginBottom: '2rem' }}>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ width: '100%', borderColor: '#25D366', color: '#128C7E' }}
              >
                <MessageCircle size={18} color="#25D366" /> Inquire About This Suit on WhatsApp
              </a>
            </div>

            {/* Highlighted Value Props */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                backgroundColor: 'var(--color-ivory)',
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} color="var(--color-maroon)" />
                <span>Dispatch: {product.processingTime || '2-3 Business Days'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--color-maroon)" />
                <span>100% Authentic Needlework</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={18} color="var(--color-maroon)" />
                <span>7-Day Return on Unstitched Sets</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-maroon)" />
                <span>Custom Embroidery Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div style={{ marginBottom: '5rem', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {[
              { id: 'description', label: 'Description & Craft' },
              { id: 'specs', label: 'Fabric & Specifications' },
              { id: 'shipping', label: 'Shipping & Delivery' },
              { id: 'disclaimer', label: 'Important Disclaimers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem 0',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: activeTab === tab.id ? 'var(--color-maroon)' : 'var(--color-gray-light)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--color-maroon)' : 'none',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'description' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Artisan Craftsmanship</h3>
                <p style={{ lineHeight: '1.7', color: 'var(--color-gray-dark)', whiteSpace: 'pre-line' }}>
                  {product.fullDescription || product.shortDescription}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)', textTransform: 'uppercase' }}>Fabric</span>
                  <p style={{ fontWeight: 600 }}>{product.fabric}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)', textTransform: 'uppercase' }}>Color Palette</span>
                  <p style={{ fontWeight: 600 }}>{product.color}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)', textTransform: 'uppercase' }}>Embroidery Type</span>
                  <p style={{ fontWeight: 600 }}>{product.embroideryType}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)', textTransform: 'uppercase' }}>Silhouette / Cut</span>
                  <p style={{ fontWeight: 600 }}>{product.suitType}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)', textTransform: 'uppercase' }}>Wash & Care</span>
                  <p style={{ fontWeight: 600 }}>Dry Clean Only</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Shipping & Dispatch Timeline</h3>
                <p style={{ lineHeight: '1.7', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
                  {product.shippingInfo || 'Dispatched via premium courier partners across India and internationally.'}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-medium)' }}>
                  Ready-to-ship items are handed over to couriers within 2-3 business days. Tracking updates will be shared via email and SMS.
                </p>
              </div>
            )}

            {activeTab === 'disclaimer' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-maroon)', marginBottom: '0.8rem' }}>
                  <AlertCircle size={20} />
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Authenticity & Variation Disclaimers</h3>
                </div>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--color-gray-dark)', fontSize: '0.92rem' }}>
                  <li>{product.disclaimer || 'Product colors may vary slightly depending on monitor and screen settings.'}</li>
                  <li>Handmade embroidery features slight manual variations that authenticate genuine artisan handiwork.</li>
                  <li>All metallic Zardozi, Tilla, and Gota work should strictly be dry cleaned and preserved in muslin wraps.</li>
                  <li>Custom-tailored or bespoke embroidery suits are non-returnable once tailored to individual body measurements.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <span className="section-subtitle">Complementary Ensembles</span>
              <h2 className="section-title">You May Also Admire</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
