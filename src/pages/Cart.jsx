import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { EmptyState } from '../components/EmptyState';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    grandTotal,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { formatPrice, settings } = useStoreSettings();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const freeShippingThreshold = settings?.freeShippingThreshold || 2999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponCodeInput.trim());
    setApplying(false);
    setCouponCodeInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '6rem 0' }}>
        <EmptyState
          icon={ShoppingBag}
          title="Your Boutique Shopping Bag is Empty"
          message="Discover our royal Punjabi suits, authentic Phulkari, and master Zardozi embroidery."
          actionText="Explore Suits"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', marginBottom: '2rem' }}>
          Your Shopping Bag ({cartItems.length})
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Items Table */}
          <div style={{ flex: '2' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {cartItems.map((item, idx) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      gap: '1.5rem',
                      padding: '1.5rem',
                      borderBottom: idx < cartItems.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '90px', height: '115px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />

                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Link to={`/product/${item.slug}`}>
                            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-charcoal)', marginBottom: '0.25rem' }}>
                              {item.name}
                            </h3>
                          </Link>
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-light)', display: 'block' }}>
                            Size: {item.size} • Color: {item.color}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-gold)', display: 'block', fontWeight: 500 }}>
                            {item.stitchingOption}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.key)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-gray-light)', cursor: 'pointer', padding: '0.4rem' }}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                        {/* Quantity Controls */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#FFF',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            style={{ border: 'none', background: 'none', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ padding: '0 0.8rem', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            style={{ border: 'none', background: 'none', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <Link to="/shop" style={{ color: 'var(--color-maroon)', fontWeight: 600, fontSize: '0.92rem' }}>
                ← Continue Browsing
              </Link>
              <button
                onClick={clearCart}
                style={{ background: 'none', border: 'none', color: 'var(--color-gray-light)', cursor: 'pointer', fontSize: '0.88rem' }}
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem' }}>
              Order Summary
            </h3>

            {/* Coupon Box */}
            <div style={{ marginBottom: '1.5rem' }}>
              {coupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46' }}>
                    <Tag size={16} />
                    <span>Coupon <strong>{coupon.code}</strong> applied</span>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#065F46', textDecoration: 'underline', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. ROYAL10)"
                    style={{ flexGrow: 1, padding: '0.65rem 0.8rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm" disabled={applying || !couponCodeInput.trim()}>
                    {applying ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <span style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>{couponError}</span>}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-medium)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-medium)' }}>Estimated Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-medium)' }}>GST Tax ({settings?.taxPercentage || 5}%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.8rem',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-maroon)' }}>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-gray-light)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} />
              <span>Safe & Secure E-Commerce Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
