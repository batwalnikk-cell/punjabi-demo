import React from 'react';
import { Crown } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading Royal Collection...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        minHeight: '280px',
        gap: '1rem',
      }}
    >
      <div style={{ position: 'relative', width: '50px', height: '50px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-maroon)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Crown size={20} color="var(--color-gold)" />
        </div>
      </div>
      {text && (
        <span
          style={{
            fontSize: '0.92rem',
            color: 'var(--color-gray-medium)',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.04em',
          }}
        >
          {text}
        </span>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
