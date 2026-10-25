import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Save, Check } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockChanges, setStockChanges] = useState({});
  const [notice, setNotice] = useState('');

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleStockInputChange = (id, value) => {
    setStockChanges({
      ...stockChanges,
      [id]: parseInt(value, 10) || 0,
    });
  };

  const handleSaveStock = async (product) => {
    const newStock = stockChanges[product.id];
    if (newStock === undefined) return;

    try {
      await api.updateProduct(product.id, {
        stock: newStock,
        isAvailable: newStock > 0 ? product.isAvailable : false,
      });
      setNotice(`Updated inventory for "${product.name}" to ${newStock} units.`);
      setStockChanges((prev) => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
      fetchStock();
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Inventory & Stock Management</h1>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
          Real-time stock reservation, low inventory warnings, and instant unit count adjustments.
        </p>
      </div>

      {notice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {notice}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Retrieving stock levels..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Suit</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Adjust Inventory</th>
                <th>Stock Status</th>
                <th style={{ textAlign: 'right' }}>Save</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images?.[0]?.url || '/assets/hero_punjabi_suit.jpg';
                const currentVal = stockChanges[p.id] !== undefined ? stockChanges[p.id] : p.stock;
                const isDirty = stockChanges[p.id] !== undefined && stockChanges[p.id] !== p.stock;

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img src={img} alt={p.name} style={{ width: '40px', height: '52px', objectFit: 'cover', borderRadius: '4px' }} />
                        <strong style={{ fontSize: '0.92rem' }}>{p.name}</strong>
                      </div>
                    </td>
                    <td><code>{p.sku}</code></td>
                    <td>{p.category?.name || 'Unassigned'}</td>
                    <td>
                      <strong style={{ fontSize: '1.1rem' }}>{p.stock}</strong> units
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={currentVal}
                        onChange={(e) => handleStockInputChange(p.id, e.target.value)}
                        className="form-input"
                        style={{ width: '90px', padding: '0.4rem 0.6rem' }}
                      />
                    </td>
                    <td>
                      {p.stock <= 0 ? (
                        <span className="badge badge-out-of-stock">Out of Stock</span>
                      ) : p.stock <= 3 ? (
                        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                          <AlertTriangle size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          Low Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="badge badge-stock">Healthy Stock</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!isDirty}
                        onClick={() => handleSaveStock(p)}
                      >
                        <Save size={14} /> Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
