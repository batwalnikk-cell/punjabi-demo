import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    sortOrder: 0,
    isActive: true,
  });

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCategories();
      if (res.success) setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        setNotice(`Category "${formData.name}" updated successfully.`);
      } else {
        await api.createCategory(formData);
        setNotice(`Category "${formData.name}" created successfully.`);
      }
      setIsModalOpen(false);
      fetchCats();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      const res = await api.deleteCategory(cat.id);
      if (res.success) {
        setNotice(`Category "${cat.name}" deleted.`);
        fetchCats();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Category Management</h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
            Organize Punjabi suits into distinct collections, bridal departments, and embroidery types.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {notice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {notice}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Products Count</th>
                <th>Display Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      {c.imageUrl && (
                        <img src={c.imageUrl} alt={c.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      )}
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>{c.name}</strong>
                        {c.description && <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>{c.description}</span>}
                      </div>
                    </div>
                  </td>
                  <td><code>{c.slug}</code></td>
                  <td><strong>{c._count?.products || 0}</strong> suits</td>
                  <td>{c.sortOrder}</td>
                  <td>
                    <span className={`badge ${c.isActive ? 'badge-stock' : 'badge-out-of-stock'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEditModal(c)}>
                        <Edit2 size={15} /> Edit
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                        onClick={() => handleDelete(c)}
                      >
                        <Trash2 size={15} />
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
              maxWidth: '520px',
              width: '100%',
              boxShadow: 'var(--shadow-modal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>

            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Wedding & Bridal Wear"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="form-input"
                  placeholder="wedding-bridal"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  placeholder="Brief overview"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="form-input"
                  placeholder="/assets/navy_velvet_suit.jpg"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-maroon)' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Active</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
