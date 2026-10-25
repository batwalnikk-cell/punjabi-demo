import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductGrid } from '../components/ProductGrid';
import { QuickViewModal } from '../components/QuickViewModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';
import { useWishlist } from '../context/WishlistContext';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useWishlist();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states derived from URL search params
  const currentCategory = searchParams.get('category') || 'all';
  const currentEmbroidery = searchParams.get('embroidery') || 'all';
  const currentSuitType = searchParams.get('suitType') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentMaxPrice = searchParams.get('maxPrice') || '30000';
  const currentAvailableOnly = searchParams.get('availableOnly') === 'true';
  const isWishlistView = searchParams.get('wishlist') === 'true';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          limit: 30,
        };

        if (currentSearch) params.search = currentSearch;
        if (currentCategory !== 'all') params.category = currentCategory;
        if (currentEmbroidery !== 'all') params.embroideryType = currentEmbroidery;
        if (currentSuitType !== 'all') params.suitType = currentSuitType;
        if (currentMaxPrice) params.maxPrice = currentMaxPrice;
        if (currentAvailableOnly) params.availableOnly = 'true';
        if (currentSort) params.sort = currentSort;

        const res = await api.getProducts(params);
        if (res.success) {
          let list = res.products || [];
          if (isWishlistView) {
            list = list.filter((p) => wishlist.includes(p.id));
          }
          setProducts(list);
        }
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentCategory,
    currentEmbroidery,
    currentSuitType,
    currentSearch,
    currentSort,
    currentMaxPrice,
    currentAvailableOnly,
    isWishlistView,
    wishlist,
  ]);

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val || val === 'all' || val === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, val);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '0.4rem' }}>
            {isWishlistView
              ? 'Your Saved Wishlist'
              : currentSearch
              ? `Search Results for "${currentSearch}"`
              : 'The Boutique Collection'}
          </h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.98rem' }}>
            Showing {products.length} {products.length === 1 ? 'Punjabi suit' : 'Punjabi suits'}
          </p>
        </div>

        {/* Top Controls: Sorting & Mobile Filter Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-border)',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            className="btn btn-outline btn-sm mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
            style={{ display: 'none' }}
          >
            <SlidersHorizontal size={15} /> Filter Suits
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)', fontWeight: 500 }}>Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 1.8rem 0.45rem 0.8rem', fontSize: '0.88rem' }}
            >
              <option value="featured">Signature & Featured</option>
              <option value="new">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'flex-start' }} className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <div className="desktop-filters">
            <FilterSidebar
              categories={categories}
              selectedCategory={currentCategory}
              onSelectCategory={(cat) => updateParam('category', cat)}
              selectedEmbroidery={currentEmbroidery}
              onSelectEmbroidery={(emb) => updateParam('embroidery', emb)}
              selectedSuitType={currentSuitType}
              onSelectSuitType={(st) => updateParam('suitType', st)}
              maxPrice={currentMaxPrice}
              onMaxPriceChange={(pr) => updateParam('maxPrice', pr)}
              availableOnly={currentAvailableOnly}
              onAvailableOnlyChange={(avail) => updateParam('availableOnly', avail ? 'true' : '')}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div>
            {loading ? (
              <LoadingSpinner text="Retrieving Punjabi Suits..." />
            ) : (
              <ProductGrid
                products={products}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 900px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-filters {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};
