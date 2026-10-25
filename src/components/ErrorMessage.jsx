import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => {
  return (
    <div
      style={{
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '2rem auto',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      <AlertCircle size={36} color="var(--color-danger)" style={{ margin: '0 auto 0.75rem' }} />
      <h4 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
        Unable to Load Content
      </h4>
      <p style={{ color: '#7F1D1D', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{message}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          <RotateCcw size={14} /> Try Again
        </button>
      )}
    </div>
  );
};
