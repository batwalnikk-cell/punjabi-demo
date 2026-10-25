import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

export const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedEmbroidery,
  onSelectEmbroidery,
  selectedSuitType,
  onSelectSuitType,
  maxPrice,
  onMaxPriceChange,
  availableOnly,
  onAvailableOnlyChange,
  onResetFilters,
  onCloseMobile,
}) => {
  return (
    <aside style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: 'var(--color-charcoal)' }}>
          <Filter size={18} color="var(--color-maroon)" />
          <span>Filters</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-light)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
            title="Reset Filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
              className="mobile-close-filter"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="form-group" style={{ marginBottom: '1.8rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Category</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="category"
              checked={!selectedCategory || selectedCategory === 'all'}
              onChange={() => onSelectCategory('all')}
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.slug}
                onChange={() => onSelectCategory(cat.slug)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Embroidery Type */}
      <div className="form-group" style={{ marginBottom: '1.8rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Embroidery Craft</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'All Embroidery', value: 'all' },
            { label: 'Handmade Needlework', value: 'HANDMADE' },
            { label: 'Machine Computerized', value: 'MACHINE' },
          ].map((opt) => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="embroidery"
                checked={selectedEmbroidery === opt.value}
                onChange={() => onSelectEmbroidery(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Suit Type */}
      <div className="form-group" style={{ marginBottom: '1.8rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Suit Type</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'All Silhouettes', value: 'all' },
            { label: 'Ready-Made Suits', value: 'READY_MADE' },
            { label: 'Unstitched Fabric Sets', value: 'UNSTITCHED' },
            { label: 'Bespoke Custom Orders', value: 'CUSTOM' },
          ].map((opt) => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="suitType"
                checked={selectedSuitType === opt.value}
                onChange={() => onSelectSuitType(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="form-group" style={{ marginBottom: '1.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Max Price</h4>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
            ₹{Number(maxPrice || 25000).toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="3000"
          max="30000"
          step="500"
          value={maxPrice || 25000}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          style={{ width: '100%', accentColor: 'var(--color-maroon)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-gray-light)', marginTop: '0.3rem' }}>
          <span>₹3,000</span>
          <span>₹30,000</span>
        </div>
      </div>

      {/* Availability */}
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-maroon)' }}
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};
