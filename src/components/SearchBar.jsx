import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { formatPrice } = useStoreSettings();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query, limit: 5 });
        if (res.success) {
          setResults(res.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '650px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            gap: '1rem',
          }}
        >
          <Search size={22} color="var(--color-maroon)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by embroidery (Zardozi, Phulkari), color, or fabric..."
            style={{
              flexGrow: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              color: 'var(--color-charcoal)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-light)' }}
            >
              <X size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-charcoal)',
              marginLeft: '0.5rem',
            }}
          >
            <X size={22} />
          </button>
        </form>

        {/* Live Suggestions */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem 0' }}>
          {loading && (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-gray-light)' }}>
              Searching collections...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
              No suits found for "{query}". Try "Zardozi", "Phulkari", "Silk", or "Velvet".
            </div>
          )}

          {!loading && results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate(`/product/${item.slug}`);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                borderBottom: '1px solid var(--color-border-light)',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <img
                src={item.images?.[0]?.url || '/assets/hero_punjabi_suit.jpg'}
                alt={item.name}
                style={{ width: '45px', height: '58px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{item.name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-light)' }}>
                  {item.embroideryType} • {item.fabric}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-maroon)', fontSize: '0.95rem' }}>
                {formatPrice(item.price)}
              </span>
            </div>
          ))}

          {results.length > 0 && (
            <div style={{ padding: '1rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--color-border-light)' }}>
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-maroon)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                }}
              >
                View all results for "{query}" <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
