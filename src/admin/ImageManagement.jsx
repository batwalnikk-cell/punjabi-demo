import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ImageManagement = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMediaLibrary();
      if (res.success) {
        setMedia(res.media || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const res = await api.uploadMedia(files);
      if (res.success) {
        setNotice(`Uploaded ${res.files?.length || 1} image(s) successfully.`);
        fetchMedia();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete image "${filename}"?`)) return;
    try {
      const res = await api.deleteMedia(filename);
      if (res.success) {
        setNotice(`Image deleted.`);
        fetchMedia();
        setTimeout(() => setNotice(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete file');
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Media Library & Photo Assets</h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
            Persistent storage of suit photographs, artisan craftsmanship shots, and campaign banners.
          </p>
        </div>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {notice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {notice}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Retrieving image assets..." />
      ) : media.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', padding: '3rem', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <ImageIcon size={44} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-gray-medium)' }}>No media files uploaded yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {media.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ aspectRatio: '3 / 4', backgroundColor: '#FAF8F5', overflow: 'hidden' }}>
                <img
                  src={item.url}
                  alt={item.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.filename}>
                  {item.filename}
                </span>
                <span style={{ color: 'var(--color-gray-light)' }}>
                  {(item.size / 1024).toFixed(1)} KB • {item.type}
                </span>

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => handleCopy(item.url)}
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check size={12} color="#059669" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy Path
                      </>
                    )}
                  </button>

                  {item.type === 'uploaded' && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.35rem 0.5rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                      onClick={() => handleDelete(item.filename)}
                      title="Delete Image"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
