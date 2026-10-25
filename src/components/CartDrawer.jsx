import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
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
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const freeShippingThreshold = settings?.freeShippingThreshold || 2999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--color-maroon)" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Boutique Bag ({cartItems.length})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-charcoal)' }}
            aria-label="Close Bag"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ backgroundColor: 'var(--color-cream)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 500 }}>
            {remainingForFreeShipping > 0 ? (
              <span>Add <strong style={{ color: 'var(--color-maroon)' }}>{formatPrice(remainingForFreeShipping)}</strong> more for <strong>FREE Delivery</strong></span>
            ) : (
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>🎉 Congratulations! You have unlocked FREE Express Shipping!</span>
            )}
            <span>{freeShippingProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E7DFD5', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: remainingForFreeShipping > 0 ? 'var(--color-gold)' : 'var(--color-success)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Body Items */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', margin: 'auto 0' }}>
              <ShoppingBag size={48} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Your Bag is Empty</h4>
              <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Explore our handmade and machine-embroidered Punjabi suits.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
              >
                Explore Suits
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.key} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)', lineHeight: '1.2' }}>
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-light)', padding: '0.2rem' }}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)', marginTop: '0.25rem' }}>
                    Size: {item.size} • {item.stitchingOption}
                  </span>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.6rem' }}>
                    {/* Quantity Selector */}
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
                        style={{ border: 'none', background: 'none', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        style={{ border: 'none', background: 'none', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 700, color: 'var(--color-maroon)', fontSize: '0.98rem' }}>
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Calculations */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Coupon Box */}
            <div style={{ marginBottom: '1.2rem' }}>
              {coupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065F46' }}>
                    <Tag size={15} />
                    <span>Coupon <strong>{coupon.code}</strong> applied (-{formatPrice(discountAmount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer', fontSize: '0.78rem', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. ROYAL10)"
                    style={{
                      flexGrow: 1,
                      padding: '0.55rem 0.8rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-outline btn-sm"
                    disabled={applying || !couponInput.trim()}
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {couponError}
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-medium)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-medium)' }}>Estimated Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-medium)' }}>Estimated GST ({settings?.taxPercentage || 5}%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid var(--color-border)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'var(--color-charcoal)',
                }}
              >
                <span>Payable Total</span>
                <span style={{ color: 'var(--color-maroon)' }}>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem' }}
              onClick={handleProceedToCheckout}
            >
              Proceed to Secure Checkout <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
