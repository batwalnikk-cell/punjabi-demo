import React, { useState, useEffect } from 'react';
import { Eye, Search, Check, AlertCircle, Phone, Mail, MapPin, Truck } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const { formatPrice } = useStoreSettings();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders({
        status: selectedStatus,
        search,
      });
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, search]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true);
    try {
      const res = await api.updateOrderStatus(id, newStatus, `Status updated to ${newStatus}`);
      if (res.success) {
        setActionNotice(`Order status updated to ${newStatus}`);
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(res.order);
        }
        fetchOrders();
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async (id, paymentStatus) => {
    setUpdating(true);
    try {
      const res = await api.updatePaymentStatus(id, paymentStatus);
      if (res.success) {
        setActionNotice(`Payment status marked as ${paymentStatus}`);
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, paymentStatus });
        }
        fetchOrders();
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Order Management</h1>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
          Track, fulfill, update dispatch statuses, and verify customer payments.
        </p>
      </div>

      {actionNotice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {actionNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.5rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} color="var(--color-gray-light)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, name, phone..."
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'PROCESSING', label: 'Tailoring' },
            { id: 'SHIPPED', label: 'Shipped' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className="btn btn-sm"
              style={{
                backgroundColor: selectedStatus === tab.id ? 'var(--color-maroon)' : '#F3EFEA',
                color: selectedStatus === tab.id ? '#FFF' : 'var(--color-charcoal)',
                border: 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving orders..." />
      ) : orders.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', padding: '3rem', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ color: 'var(--color-gray-medium)' }}>No orders found matching the filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <strong style={{ color: 'var(--color-maroon)', fontSize: '0.95rem' }}>
                      {ord.orderNumber}
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-light)' }}>
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>{ord.customerName}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>
                      {ord.customerPhone} • {ord.city}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>
                      {ord.items?.length || 0} suit(s)
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-charcoal)' }}>{formatPrice(ord.totalAmount)}</strong>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: ord.paymentStatus === 'PAID' ? '#D1FAE5' : '#FEF3C7',
                        color: ord.paymentStatus === 'PAID' ? '#065F46' : '#92400E',
                      }}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusUpdate(ord.id, e.target.value)}
                      disabled={updating}
                      style={{
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.82rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontWeight: 600,
                        backgroundColor:
                          ord.orderStatus === 'DELIVERED'
                            ? '#DCFCE7'
                            : ord.orderStatus === 'CANCELLED'
                            ? '#FEE2E2'
                            : '#FFF',
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING (Tailoring)</option>
                      <option value="READY_TO_SHIP">READY TO SHIP</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--color-gray-medium)' }}>
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(ord)}>
                      <Eye size={15} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-modal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>
                  Order Details
                </span>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-maroon)' }}>{selectedOrder.orderNumber}</h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-gray-light)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', backgroundColor: 'var(--color-ivory)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
                  Customer Information
                </strong>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <div style={{ marginTop: '0.8rem' }}>
                  <a
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customerName)},%20this%20is%20Punjab%20Royal%20Suits%20regarding%20your%20order%20${selectedOrder.orderNumber}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.82rem', color: '#128C7E', fontWeight: 600 }}
                  >
                    💬 WhatsApp Customer
                  </a>
                </div>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
                  Shipping Address
                </strong>
                <p>{selectedOrder.shippingAddress}</p>
                <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postalCode}</p>
                <p>{selectedOrder.country}</p>
                {selectedOrder.customerNotes && (
                  <p style={{ marginTop: '0.6rem', color: 'var(--color-maroon)', fontStyle: 'italic' }}>
                    Note: "{selectedOrder.customerNotes}"
                  </p>
                )}
              </div>
            </div>

            {/* Status & Payment Updates Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Order Fulfillment Status</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  className="form-select"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING (In Tailoring)</option>
                  <option value="READY_TO_SHIP">READY TO SHIP</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Payment Verification Status</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handlePaymentUpdate(selectedOrder.id, e.target.value)}
                  className="form-select"
                >
                  <option value="UNPAID">UNPAID (Pending COD or Transfer)</option>
                  <option value="PAID">PAID (Verified & Confirmed)</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>

            {/* Line Items List */}
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.8rem' }}>Ordered Suits</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.8rem', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-sm)' }}>
                  <img src={item.productImage} alt={item.productName} style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{item.productName}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)' }}>
                      SKU: {item.productSku} • Size: {item.size} • Color: {item.color}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', display: 'block' }}>
                      {item.stitchingOption}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-medium)' }}>
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </span>
                    <strong style={{ display: 'block', color: 'var(--color-maroon)', fontSize: '1rem' }}>
                      {formatPrice(item.totalPrice)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount ({selectedOrder.couponCode || 'Promo'})</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping Charge</span>
                <span>{formatPrice(selectedOrder.shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST Tax</span>
                <span>{formatPrice(selectedOrder.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-maroon)' }}>{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
