import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Printer, Phone } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const { formatPrice, settings } = useStoreSettings();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '4rem 1.5rem 6rem' }}>
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '3rem 2.5rem',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle2 size={44} color="#059669" />
          </div>
          <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', fontWeight: 600 }}>
            Order Confirmation
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', margin: '0.4rem 0 0.8rem' }}>
            Thank You for Your Order!
          </h1>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem' }}>
            Your order reference number is: <strong style={{ color: 'var(--color-maroon)' }}>{orderNumber}</strong>
          </p>
        </div>

        {order && (
          <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1.5rem 0', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Items Ordered</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.productImage} alt={item.productName} style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{item.productName}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)' }}>
                      Size: {item.size} • Qty: {item.quantity} • {item.stitchingOption}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-maroon)' }}>
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-medium)', marginBottom: '0.2rem' }}>Shipping To:</strong>
                <span>{order.customerName}</span><br />
                <span>{order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-medium)', marginBottom: '0.2rem' }}>Payment Method:</strong>
                <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</span><br />
                <span style={{ color: 'var(--color-maroon)', fontWeight: 700, fontSize: '1.05rem' }}>
                  Total: {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={handlePrint}>
            <Printer size={16} /> Print Receipt
          </button>
          <Link to={`/order-tracking?orderNumber=${orderNumber}`} className="btn btn-primary">
            Track Order Status <ArrowRight size={16} />
          </Link>
          <Link to="/shop" className="btn btn-gold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
