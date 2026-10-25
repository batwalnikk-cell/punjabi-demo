import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ShieldCheck } from 'lucide-react';

export const PolicyPage = ({ slug, fallbackTitle }) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const res = await api.getPolicyBySlug(slug);
        if (res.success && res.policy) {
          setPolicy(res.policy);
        } else {
          setError('Policy document not found.');
        }
      } catch (err) {
        setError(err.message || 'Error loading policy.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [slug]);

  if (loading) return <LoadingSpinner text="Retrieving Policy Document..." />;
  if (error || !policy) return <ErrorMessage message={error || 'Policy not found.'} />;

  return (
    <div style={{ padding: '4rem 1.5rem 6rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-gold)', marginBottom: '0.8rem' }}>
          <ShieldCheck size={20} />
          <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Official Boutique Policy
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '1.5rem' }}>
          {policy.title || fallbackTitle}
        </h1>

        <div style={{ fontSize: '0.82rem', color: 'var(--color-gray-light)', marginBottom: '2.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          Last Updated: {new Date(policy.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        <div
          style={{
            lineHeight: '1.85',
            color: 'var(--color-charcoal)',
            fontSize: '1rem',
            whiteSpace: 'pre-line',
            backgroundColor: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          {policy.content}
        </div>
      </div>
    </div>
  );
};
