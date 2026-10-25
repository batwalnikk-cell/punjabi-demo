import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const DiscountsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [notice, setNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { formatPrice } = useStoreSettings();

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 2999,
    maxDiscount: 1000,
    usageLimit: 200,
    isActive: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getCoupons();
      if (res.success) setCoupons(res.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 2999,
      maxDiscount: 1000,
      usageLimit: 100,
      isActive: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount,
      maxDiscount: c.maxDiscount || '',
      usageLimit: c.usageLimit || '',
      isActive: c.isActive,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingCoupon) {
        await api.updateCoupon(editingCoupon.id, formData);
        setNotice(`Coupon ${formData.code} updated.`);
      } else {
        await api.createCoupon(formData);
        setNotice(`Coupon ${formData.code} created.`);
      }
      setIsModalOpen(false);
      fetchCoupons();
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.deleteCoupon(id);
      setNotice(`Coupon ${code} deleted.`);
      fetchCoupons();
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Discounts & Promo Coupons</h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
            Manage festive promo codes with server-side validation and cart thresholds.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {notice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {notice}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Retrieving discounts..." />
      ) : coupons.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', padding: '3rem', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ color: 'var(--color-gray-medium)' }}>No coupons created yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Min Cart Value</th>
                <th>Cap / Max</th>
                <th>Times Used</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-maroon)' }}>{c.code}</strong>
                  </td>
                  <td>
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                  </td>
                  <td>{formatPrice(c.minOrderAmount)}</td>
                  <td>{c.maxDiscount ? formatPrice(c.maxDiscount) : 'No Cap'}</td>
                  <td>
                    {c.timesUsed} {c.usageLimit ? `/ ${c.usageLimit}` : 'uses'}
                  </td>
                  <td>
                    <span className={`badge ${c.isActive ? 'badge-stock' : 'badge-out-of-stock'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                        onClick={() => handleDelete(c.id, c.code)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
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
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: 'var(--shadow-modal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
              {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : 'Create Promo Coupon'}
            </h3>

            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="form-input"
                  placeholder="e.g. FESTIVE15"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="form-select"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Value *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Min Cart Subtotal (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Cap Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="form-input"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-maroon)' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Active Coupon</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
