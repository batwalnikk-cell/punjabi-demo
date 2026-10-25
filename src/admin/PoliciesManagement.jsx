import React, { useState, useEffect } from 'react';
import { FileText, Save, Check, Eye } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const PoliciesManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState('disclaimer');
  const [currentPolicy, setCurrentPolicy] = useState({ title: '', content: '', isPublished: true });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const fetchAllPolicies = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminPolicies();
      if (res.success && res.policies) {
        setPolicies(res.policies);
        const active = res.policies.find((p) => p.slug === selectedSlug) || res.policies[0];
        if (active) {
          setSelectedSlug(active.slug);
          setCurrentPolicy({
            title: active.title,
            content: active.content,
            isPublished: active.isPublished,
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolicies();
  }, []);

  const handleSelectPolicy = (slug) => {
    setSelectedSlug(slug);
    const target = policies.find((p) => p.slug === slug);
    if (target) {
      setCurrentPolicy({
        title: target.title,
        content: target.content,
        isPublished: target.isPublished,
      });
      setIsPreview(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      await api.updatePolicy(selectedSlug, currentPolicy);
      setNotice(`Policy "${currentPolicy.title}" updated and published live.`);
      fetchAllPolicies();
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving boutique policies..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Boutique Policies & Disclaimers</h1>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
          Edit product disclaimers, handmade variations, delivery rules, and return terms live without modifying code.
        </p>
      </div>

      {notice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {notice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Policy Selector Sidebar */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gray-light)', fontWeight: 600, padding: '0.5rem 0.75rem', display: 'block' }}>
            Available Documents
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {policies.map((p) => (
              <button
                key={p.slug}
                onClick={() => handleSelectPolicy(p.slug)}
                style={{
                  textAlign: 'left',
                  padding: '0.65rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: selectedSlug === p.slug ? 'var(--color-maroon-subtle)' : 'transparent',
                  color: selectedSlug === p.slug ? 'var(--color-maroon)' : 'var(--color-charcoal)',
                  fontWeight: selectedSlug === p.slug ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  borderLeft: selectedSlug === p.slug ? '3px solid var(--color-maroon)' : '3px solid transparent',
                }}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Editor & Preview Area */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.8rem' }}>
            <h3 style={{ fontSize: '1.3rem' }}>Editing: {currentPolicy.title}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye size={14} /> {isPreview ? 'Switch to Editor' : 'Live Preview'}
              </button>
            </div>
          </div>

          {isPreview ? (
            <div style={{ backgroundColor: 'var(--color-ivory)', padding: '2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--color-maroon)' }}>{currentPolicy.title}</h2>
              <div style={{ lineHeight: '1.8', whiteSpace: 'pre-line', color: 'var(--color-charcoal)', fontSize: '0.98rem' }}>
                {currentPolicy.content}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Document Title</label>
                <input
                  type="text"
                  required
                  value={currentPolicy.title}
                  onChange={(e) => setCurrentPolicy({ ...currentPolicy, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Policy / Disclaimer Body Content</label>
                <textarea
                  required
                  rows={12}
                  value={currentPolicy.content}
                  onChange={(e) => setCurrentPolicy({ ...currentPolicy, content: e.target.value })}
                  className="form-textarea"
                  style={{ fontFamily: 'monospace', fontSize: '0.92rem', lineHeight: '1.6' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={currentPolicy.isPublished}
                    onChange={(e) => setCurrentPolicy({ ...currentPolicy, isPublished: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-maroon)' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Published on Storefront</span>
                </label>

                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save & Publish Live'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
