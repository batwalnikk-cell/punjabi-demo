import React, { useState } from 'react';
import { User, Lock, KeyRound, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../services/api';

export const AdminProfile = () => {
  const { admin, checkAuth } = useAdminAuth();
  const [name, setName] = useState(admin?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      const payload = { name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await api.updateAdminProfile(payload);
      setSuccessMsg('Profile and security credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (checkAuth) await checkAuth();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update admin profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-maroon)' }}>
          Admin Profile & Security
        </h1>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Manage your administrator account details and update your secure password.
        </p>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #10B981',
          color: '#065F46',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
        }}>
          <CheckCircle size={20} color="#10B981" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #EF4444',
          color: '#991B1B',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
        }}>
          <AlertCircle size={20} color="#EF4444" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <User size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-maroon)', margin: 0 }}>
              Account Information
            </h2>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-input"
              value={admin?.email || ''}
              disabled
              style={{ backgroundColor: '#F3F4F6', color: '#6B7280', cursor: 'not-allowed' }}
            />
            <small style={{ color: 'var(--color-gray-medium)', fontSize: '0.75rem' }}>
              Role: <strong style={{ color: 'var(--color-maroon)' }}>{admin?.role || 'SUPER_ADMIN'}</strong>
            </small>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Master Sartorial Admin"
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <Lock size={22} color="var(--color-maroon)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-maroon)', margin: 0 }}>
              Change Password
            </h2>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--color-gray-medium)', marginBottom: '1.25rem' }}>
            Leave password fields empty if you only wish to update your name.
          </p>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password to authorize changes"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <KeyRound size={18} />}
            <span>{loading ? 'Updating Credentials...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
