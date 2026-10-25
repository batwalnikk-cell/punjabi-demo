import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, Mail, ShieldAlert, KeyRound, User } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../services/api';

export const AdminLogin = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Setup mode check
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [setupName, setSetupName] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const checkSetupState = async () => {
      try {
        const res = await api.checkSetup();
        if (res.setupNeeded) {
          setSetupNeeded(true);
        }
      } catch (err) {
        console.warn('Check setup check failed:', err);
      }
    };
    checkSetupState();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (setupNeeded) {
        // Initial Admin Setup
        const res = await api.setupInitialAdmin({
          email,
          password,
          name: setupName || 'Store Master Admin',
        });
        if (res.success && res.token) {
          localStorage.setItem('prs_admin_token', res.token);
          window.location.href = '/admin';
        }
      } else {
        await login(email, password);
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#171113',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-maroon-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Crown size={32} color="var(--color-maroon)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)', marginBottom: '0.4rem' }}>
            {setupNeeded ? 'Initial Admin Setup' : 'Boutique Admin Portal'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-light)', display: 'block' }}>
            {setupNeeded
              ? 'Configure your initial master administrative credentials.'
              : 'Secure access to Punjab Royal Suits control panel.'}
          </span>
        </div>

        {errorMsg && (
          <div className="alert alert-error" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {setupNeeded && (
            <div className="form-group">
              <label className="form-label">Administrator Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--color-gray-light)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                <input
                  type="text"
                  required
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Master Admin"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Administrator Username or Email</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--color-gray-light)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="nikk or admin@punjabroyalsuits.com"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--color-gray-light)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder={setupNeeded ? 'Minimum 8 characters' : 'Enter password'}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : setupNeeded ? 'Create Master Admin' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '1.25rem' }}>
          <a
            href="/"
            style={{ fontSize: '0.85rem', color: 'var(--color-gray-medium)', textDecoration: 'none' }}
          >
            ← Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
};
