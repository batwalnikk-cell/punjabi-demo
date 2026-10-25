import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const { formatPrice } = useStoreSettings();

  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setErrorMsg('Please enter both your Order Number and Contact Phone.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.trackOrder(orderNumber.trim(), phone.trim());
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setErrorMsg(res.message || 'No matching order found.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to locate order.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'Boutique Tailoring' },
    { key: 'SHIPPED', label: 'In Transit' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const getStepStatus = (stepKey) => {
    const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'];
    const currentIdx = statusOrder.indexOf(order?.orderStatus || 'PENDING');
    const stepIdx = statusOrder.indexOf(stepKey);

    if (currentIdx >= stepIdx) return 'completed';
    return 'pending';
  };

  return (
    <div style={{ padding: '4rem 1.5rem 6rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-header">
          <span className="section-subtitle">Real-Time Dispatch Updates</span>
          <h1 className="section-title">Track Your Order</h1>
          <p className="section-desc">
            Enter your order reference number and phone number to monitor your boutique tailoring and shipping progress.
          </p>
        </div>

        {/* Tracking Input Form */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <form onSubmit={handleTrack} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Order Number *</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="e.g. PRS-2026-1001"
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone used during checkout"
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '48px' }} disabled={loading}>
              <Search size={16} /> {loading ? 'Locating...' : 'Track Suit'}
            </button>
          </form>

          {errorMsg && <div className="alert alert-error" style={{ marginTop: '1.25rem', marginBottom: 0 }}>{errorMsg}</div>}
        </div>

        {/* Tracking Result View */}
        {order && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>
                  Order Details
                </span>
                <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0' }}>{order.orderNumber}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-light)' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: order.orderStatus === 'DELIVERED' ? '#D1FAE5' : 'var(--color-maroon-subtle)',
                    color: order.orderStatus === 'DELIVERED' ? '#065F46' : 'var(--color-maroon)',
                    fontSize: '0.88rem',
                    padding: '0.4rem 0.8rem',
                  }}
                >
                  {order.orderStatus}
                </span>
                <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-gray-light)', marginTop: '0.3rem' }}>
                  Payment: <strong>{order.paymentStatus}</strong>
                </span>
              </div>
            </div>

            {/* Stepper Progression */}
            <div style={{ marginBottom: '3rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                  marginBottom: '1rem',
                }}
              >
                {steps.map((st) => {
                  const isDone = getStepStatus(st.key) === 'completed';
                  return (
                    <div
                      key={st.key}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 2,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? 'var(--color-maroon)' : '#F3EFEA',
                          color: isDone ? '#FFF' : 'var(--color-gray-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '0.5rem',
                          border: isDone ? 'none' : '2px solid var(--color-border)',
                        }}
                      >
                        {isDone ? <CheckCircle2 size={20} /> : <Clock size={18} />}
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, textAlign: 'center', color: isDone ? 'var(--color-charcoal)' : 'var(--color-gray-light)' }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Summary */}
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Items in this Dispatch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--color-ivory)', borderRadius: 'var(--radius-sm)' }}>
                  <img src={item.productImage} alt={item.productName} style={{ width: '45px', height: '58px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ fontSize: '0.92rem', display: 'block' }}>{item.productName}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>
                      Size: {item.size} • Qty: {item.quantity} • {item.stitchingOption}
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-maroon)', fontSize: '0.92rem' }}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Status History Logs */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>Timeline Updates</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.statusHistory.map((h, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', display: 'flex', gap: '1rem' }}>
                      <span style={{ color: 'var(--color-gray-light)', minWidth: '120px' }}>
                        {new Date(h.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>
                        <strong style={{ color: 'var(--color-maroon)' }}>{h.status}</strong>: {h.note || 'Status updated'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
