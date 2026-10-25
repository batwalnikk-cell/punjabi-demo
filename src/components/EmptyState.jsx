import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No Items Available',
  message = 'Check back shortly for new boutique arrivals.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 1.5rem',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-cream)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--color-maroon)',
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{title}</h3>
      <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.95rem', marginBottom: '1.8rem', lineHeight: '1.5' }}>
        {message}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
