import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  const imageUrl = category.imageUrl || '/assets/hero_punjabi_suit.jpg';

  return (
    <Link to={`/shop?category=${category.slug}`} className="category-card">
      <img src={imageUrl} alt={category.name} loading="lazy" />
      <div className="category-overlay">
        <h3>{category.name}</h3>
        {category.description && <p>{category.description}</p>}
        <span className="category-link-text">
          Explore Collection <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};
