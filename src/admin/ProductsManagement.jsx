import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Copy, Star, Eye, AlertCircle, Check } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const { formatPrice } = useStoreSettings();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ search, limit: 50 });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleToggleFeatured = async (id) => {
    try {
      const res = await api.toggleFeatured(id);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: res.isFeatured } : p))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle featured status');
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const res = await api.toggleAvailability(id);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAvailable: res.isAvailable } : p))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle availability');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.duplicateProduct(id);
      if (res.success) {
        setActionNotice(`Product duplicated successfully as "${res.product.name}"`);
        fetchProducts();
        setTimeout(() => setActionNotice(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to duplicate product');
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      const res = await api.deleteProduct(deleteCandidate.id);
      if (res.success) {
        setActionNotice(`Product "${deleteCandidate.name}" removed.`);
        setDeleteCandidate(null);
        fetchProducts();
        setTimeout(() => setActionNotice(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Product Catalog Management</h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
            Add, update, duplicate, and configure Punjabi suit specifications and stock.
          </p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={16} /> Add New Suit
        </Link>
      </div>

      {actionNotice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {actionNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--color-gray-light)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by suit title, SKU, fabric, or color..."
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving catalog..." />
      ) : products.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', padding: '3rem', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ color: 'var(--color-gray-medium)', marginBottom: '1rem' }}>No products found matching your search.</p>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Suit</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Embroidery</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images?.[0]?.url || '/assets/hero_punjabi_suit.jpg';
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img src={img} alt={p.name} style={{ width: '42px', height: '54px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)' }}>
                            {p.fabric} • {p.color}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.82rem', backgroundColor: '#F3EFEA', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>
                        {p.sku}
                      </code>
                    </td>
                    <td>{p.category?.name || 'Unassigned'}</td>
                    <td>
                      <span className={`badge ${p.embroideryType === 'HANDMADE' ? 'badge-handmade' : 'badge-machine'}`}>
                        {p.embroideryType}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-maroon)' }}>{formatPrice(p.price)}</strong>
                      {p.originalPrice && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-light)', textDecoration: 'line-through' }}>
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td>
                      {p.stock <= 0 ? (
                        <span className="badge badge-out-of-stock">Sold Out</span>
                      ) : p.stock <= 3 ? (
                        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                          Low ({p.stock})
                        </span>
                      ) : (
                        <span className="badge badge-stock">{p.stock} units</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailability(p.id)}
                        className={`badge ${p.isAvailable ? 'badge-stock' : 'badge-out-of-stock'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Click to toggle publish status"
                      >
                        {p.isAvailable ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(p.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.isFeatured ? '#F59E0B' : 'var(--color-gray-light)' }}
                        title="Toggle Featured on Homepage"
                      >
                        <Star size={18} fill={p.isFeatured ? '#F59E0B' : 'none'} />
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Preview Product"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Edit Suit Details"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => handleDuplicate(p.id)}
                          title="Duplicate as new draft"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.5rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                          onClick={() => setDeleteCandidate(p)}
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
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
          onClick={() => setDeleteCandidate(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow-modal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#DC2626', marginBottom: '1rem' }}>
              <AlertCircle size={28} />
              <h3 style={{ fontSize: '1.3rem' }}>Confirm Deletion</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-gray-dark)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Are you certain you want to permanently delete <strong>"{deleteCandidate.name}"</strong> (SKU: {deleteCandidate.sku})? This action cannot be reversed.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteCandidate(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}
                onClick={handleDelete}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
