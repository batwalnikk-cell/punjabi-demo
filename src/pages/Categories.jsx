import React, { useState, useEffect } from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { api } from '../services/api';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Boutique Categories..." />;

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Artisan Collections</span>
          <h1 className="section-title">Shop by Category</h1>
          <p className="section-desc">
            Explore our curated departments ranging from heirloom handmade needlework to unstitched silk sets.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
};
