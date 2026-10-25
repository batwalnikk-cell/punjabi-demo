import React from 'react';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';
import { ShoppingBag } from 'lucide-react';

export const ProductGrid = ({ products, onQuickView }) => {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No Punjabi Suits Found"
        message="We could not find any suits matching your criteria. Try adjusting your filters or search keywords."
        actionText="View All Collections"
        actionLink="/shop"
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
};
