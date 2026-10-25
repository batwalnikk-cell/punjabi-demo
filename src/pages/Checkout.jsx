import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, Banknote, QrCode, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { api } from '../services/api';

export const Checkout = () => {
  const { cartItems, subtotal, discountAmount, shippingFee, taxAmount, grandTotal, coupon, clearCart } = useCart();
  const { formatPrice, settings } = useStoreSettings();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    city: '',
    state: 'Punjab',
    postalCode: '',
    country: 'India',
    customerNotes: '',
    paymentMethod: 'COD',
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Your Shopping Bag is Empty</h2>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--color-gray-medium)' }}>
          Please add suits to your bag before checking out.
        </p>
        <Link to="/shop" className="btn btn-primary">Browse Collections</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !formData.customerName.trim() ||
      !formData.customerPhone.trim() ||
      !formData.shippingAddress.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim()
    ) {
      setErrorMsg('Please complete all mandatory delivery fields.');
      return;
    }

    setPlacingOrder(true);

    try {
      const payload = {
        ...formData,
        couponCode: coupon?.code || null,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          stitchingOption: item.stitchingOption,
        })),
      };

      const res = await api.placeOrder(payload);

      if (res.success && res.order) {
        if (formData.paymentMethod === 'ONLINE_RAZORPAY') {
          // Initialize Razorpay order on server
          const rzpInit = await api.createRazorpayOrder(res.order.id);
          if (!rzpInit.success) {
            setErrorMsg(
              rzpInit.message ||
                'Razorpay payment gateway is not yet configured. Please select Cash on Delivery or Manual UPI.'
            );
            setPlacingOrder(false);
            return;
          }

          // Dynamically load Razorpay SDK if not already loaded
          if (!window.Razorpay) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.onload = resolve;
              script.onerror = () => reject(new Error('Failed to load secure Razorpay payment gateway script.'));
              document.body.appendChild(script);
            });
          }

          const options = {
            key: rzpInit.keyId,
            amount: rzpInit.amount,
            currency: rzpInit.currency || 'INR',
            name: settings?.storeName || 'Punjab Royal Suits',
            description: `Payment for Order ${res.order.orderNumber}`,
            order_id: rzpInit.razorpayOrderId,
            handler: async (response) => {
              try {
                const verifyRes = await api.verifyRazorpayPayment({
                  orderId: res.order.id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                if (verifyRes.success) {
                  clearCart();
                  navigate(`/order-success/${res.order.orderNumber}`, { state: { order: verifyRes.order } });
                } else {
                  setErrorMsg('Payment verification failed on the server. Please contact boutique support.');
                }
              } catch (verifyErr) {
                setErrorMsg(verifyErr.message || 'Failed to verify payment with server.');
              }
            },
            prefill: {
              name: formData.customerName,
              email: formData.customerEmail,
              contact: formData.customerPhone,
            },
            theme: {
              color: '#721224',
            },
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.on('payment.failed', function (failRes) {
            setErrorMsg(`Payment declined: ${failRes.error?.description || 'Transaction failed.'}`);
          });
          razorpayInstance.open();
          setPlacingOrder(false);
          return;
        }

        clearCart();
        navigate(`/order-success/${res.order.orderNumber}`, { state: { order: res.order } });
      } else {
        setErrorMsg(res.message || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while confirming your order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/cart" style={{ color: 'var(--color-maroon)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Return to Shopping Bag
          </Link>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', marginTop: '0.8rem' }}>
            Checkout & Delivery
          </h1>
        </div>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
            {/* Left Column: Delivery Address & Payment Method */}
            <div style={{ flex: '2' }}>
              {/* Shipping Address Card */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.6rem' }}>
                  1. Shipping Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Navjot Kaur"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Email Address (For Tracking & Invoice)</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="navjot@example.com"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Street Address & Landmark *</label>
                    <input
                      type="text"
                      name="shippingAddress"
                      required
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="House / Apartment / Street Name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Amritsar"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Punjab"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="143001"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      readOnly
                      value={formData.country}
                      className="form-input"
                      style={{ backgroundColor: '#F8F8F8' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Delivery Notes / Tailoring Instructions (Optional)</label>
                  <textarea
                    name="customerNotes"
                    rows={2}
                    value={formData.customerNotes}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Any specific instructions for courier or custom tailoring..."
                  />
                </div>
              </div>

              {/* Payment Method Card */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.6rem' }}>
                  2. Select Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {settings?.enableCOD && (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.2rem',
                        border: formData.paymentMethod === 'COD' ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        backgroundColor: formData.paymentMethod === 'COD' ? 'var(--color-maroon-subtle)' : '#FFF',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleChange}
                        style={{ accentColor: 'var(--color-maroon)' }}
                      />
                      <Banknote size={24} color="var(--color-maroon)" />
                      <div>
                        <strong style={{ display: 'block', fontSize: '1rem' }}>Cash on Delivery (COD)</strong>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>
                          Pay in cash when your Punjabi suit is delivered to your door.
                        </span>
                      </div>
                    </label>
                  )}

                  {settings?.enableOnlinePayment && (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.2rem',
                        border: formData.paymentMethod === 'ONLINE_RAZORPAY' ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        backgroundColor: formData.paymentMethod === 'ONLINE_RAZORPAY' ? 'var(--color-maroon-subtle)' : '#FFF',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE_RAZORPAY"
                        checked={formData.paymentMethod === 'ONLINE_RAZORPAY'}
                        onChange={handleChange}
                        style={{ accentColor: 'var(--color-maroon)' }}
                      />
                      <CreditCard size={24} color="var(--color-gold)" />
                      <div>
                        <strong style={{ display: 'block', fontSize: '1rem' }}>Online Payment / Razorpay</strong>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>
                          Credit/Debit Cards, Net Banking, Wallet & UPI (Sandbox verified).
                        </span>
                      </div>
                    </label>
                  )}

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.2rem',
                      border: formData.paymentMethod === 'MANUAL_UPI' ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor: formData.paymentMethod === 'MANUAL_UPI' ? 'var(--color-maroon-subtle)' : '#FFF',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MANUAL_UPI"
                      checked={formData.paymentMethod === 'MANUAL_UPI'}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--color-maroon)' }}
                    />
                    <QrCode size={24} color="var(--color-maroon)" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem' }}>Direct UPI Transfer</strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-dark)' }}>
                        Transfer directly to boutique VPA: <strong>{settings?.manualUpiId || 'punjabroyalsuits@upi'}</strong>
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.6rem' }}>
                Order Summary ({cartItems.length} items)
              </h3>

              <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cartItems.map((item) => (
                  <div key={item.key} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '62px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flexGrow: 1, fontSize: '0.85rem' }}>
                      <strong style={{ display: 'block', color: 'var(--color-charcoal)' }}>{item.name}</strong>
                      <span style={{ color: 'var(--color-gray-light)', fontSize: '0.75rem' }}>
                        Size: {item.size} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-gray-medium)' }}>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-gray-medium)' }}>Shipping</span>
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
                  <span>Payable Total</span>
                  <span style={{ color: 'var(--color-maroon)' }}>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '1rem' }}
                disabled={placingOrder}
              >
                {placingOrder ? 'Confirming Your Order...' : `Confirm & Place Order • ${formatPrice(grandTotal)}`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>
                <Lock size={14} />
                <span>256-Bit SSL Encrypted & Concurrency-Safe Order Processing</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
