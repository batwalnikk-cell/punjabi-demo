import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Home, ShoppingBag } from 'lucide-react';

export const NotFound = () => {
  return (
    <div style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <Crown size={52} color="var(--color-maroon)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '4rem', color: 'var(--color-maroon)', marginBottom: '0.5rem', lineHeight: '1' }}>404</h1>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          The Punjabi suit ensemble or page you are seeking may have moved to another collection or is no longer accessible.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/shop" className="btn btn-outline">
            <ShoppingBag size={16} /> Browse Suits
          </Link>
        </div>
      </div>
    </div>
  );
};
