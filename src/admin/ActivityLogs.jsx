import React, { useState, useEffect } from 'react';
import { History, Shield, RefreshCw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 25 };
      if (actionFilter) params.action = actionFilter;
      const res = await api.getActivityLogs(params);
      if (res && res.logs) {
        setLogs(res.logs);
        setPagination(res.pagination || { total: res.logs.length, pages: 1 });
      } else {
        setLogs(res || []);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('DELETE')) return { bg: '#FEE2E2', text: '#991B1B', border: '#F87171' };
    if (action.includes('CREATE') || action.includes('ADD')) return { bg: '#ECFDF5', text: '#065F46', border: '#34D399' };
    if (action.includes('LOGIN')) return { bg: '#EFF6FF', text: '#1E40AF', border: '#60A5FA' };
    if (action.includes('ORDER')) return { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' };
    return { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-maroon)' }}>
            Admin Audit & Activity Logs
          </h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Permanent record of administrator actions, price changes, product modifications, and order status updates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            className="form-input"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            style={{ minWidth: '180px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="">All Action Types</option>
            <option value="LOGIN">Admin Login</option>
            <option value="CREATE_PRODUCT">Create Product</option>
            <option value="UPDATE_PRODUCT">Update Product</option>
            <option value="DELETE_PRODUCT">Delete Product</option>
            <option value="UPDATE_ORDER">Order Status</option>
            <option value="UPDATE_SETTINGS">Store Settings</option>
            <option value="UPDATE_POLICY">Policy Update</option>
          </select>

          <button
            onClick={() => fetchLogs()}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving Admin Audit Trail..." />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No Logs Recorded"
          description="Administrative operations will be securely logged here as activities occur."
        />
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Timestamp</th>
                  <th style={{ width: '220px' }}>Admin Identity</th>
                  <th style={{ width: '180px' }}>Action</th>
                  <th>Details & Impact</th>
                  <th style={{ width: '130px' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const badge = getActionBadgeColor(log.action);
                  return (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.8rem', color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {log.adminEmail}
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.4' }}>
                        {log.details}
                      </td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#9CA3AF' }}>
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: '#F9FAFB'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                Showing Page <strong>{page}</strong> of <strong>{pagination.pages}</strong> ({pagination.total} total logs)
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
