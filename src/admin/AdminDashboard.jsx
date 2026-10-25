import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  ClipboardList,
  IndianRupee,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  ArrowRight,
  Sparkles,
  Settings,
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useStoreSettings();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getDashboardAnalytics();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Boutique Analytics..." />;

  const stats = data?.stats;

  return (
    <div>
      {/* Top Welcome & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Boutique Dashboard</h1>
          <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
            Overview of Punjabi suit catalog, customer orders, and verified revenue.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add New Suit
          </Link>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">
            View All Orders
          </Link>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <div className="stat-grid">
        {/* Paid Revenue */}
        <div className="stat-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-title">Verified Paid Revenue</span>
            <IndianRupee size={20} color="#059669" />
          </div>
          <div className="stat-value" style={{ color: '#065F46' }}>
            {formatPrice(stats?.revenue?.actualPaidRevenue || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block', marginTop: '0.4rem' }}>
            Excludes unpaid COD & cancelled orders
          </span>
        </div>

        {/* Total Orders */}
        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-maroon)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-title">Total Orders</span>
            <ClipboardList size={20} color="var(--color-maroon)" />
          </div>
          <div className="stat-value">{stats?.orders?.total || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block', marginTop: '0.4rem' }}>
            {stats?.orders?.pending || 0} Pending • {stats?.orders?.processing || 0} Tailoring
          </span>
        </div>

        {/* Catalog Products */}
        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-title">Active Suits in Catalog</span>
            <ShoppingBag size={20} color="var(--color-gold)" />
          </div>
          <div className="stat-value">{stats?.products?.published || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block', marginTop: '0.4rem' }}>
            Out of {stats?.products?.total || 0} total listings
          </span>
        </div>

        {/* Low Stock Alert */}
        <div className="stat-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-title">Out of Stock Alert</span>
            <AlertTriangle size={20} color="#DC2626" />
          </div>
          <div className="stat-value" style={{ color: stats?.products?.outOfStock > 0 ? '#DC2626' : 'var(--color-charcoal)' }}>
            {stats?.products?.outOfStock || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block', marginTop: '0.4rem' }}>
            <Link to="/admin/inventory" style={{ color: 'var(--color-maroon)', textDecoration: 'underline' }}>
              Manage inventory stock
            </Link>
          </span>
        </div>
      </div>

      {/* Order Status Breakdown Bar */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Order Status Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '0.8rem', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: '#92400E', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Pending</span>
            <strong style={{ fontSize: '1.4rem', color: '#92400E' }}>{stats?.orders?.pending || 0}</strong>
          </div>
          <div style={{ padding: '0.8rem', backgroundColor: '#E0E7FF', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: '#3730A3', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Processing</span>
            <strong style={{ fontSize: '1.4rem', color: '#3730A3' }}>{stats?.orders?.processing || 0}</strong>
          </div>
          <div style={{ padding: '0.8rem', backgroundColor: '#E0F2FE', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: '#0369A1', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Shipped</span>
            <strong style={{ fontSize: '1.4rem', color: '#0369A1' }}>{stats?.orders?.shipped || 0}</strong>
          </div>
          <div style={{ padding: '0.8rem', backgroundColor: '#DCFCE7', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: '#15803D', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Delivered</span>
            <strong style={{ fontSize: '1.4rem', color: '#15803D' }}>{stats?.orders?.delivered || 0}</strong>
          </div>
          <div style={{ padding: '0.8rem', backgroundColor: '#FEE2E2', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: '#991B1B', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Cancelled</span>
            <strong style={{ fontSize: '1.4rem', color: '#991B1B' }}>{stats?.orders?.cancelled || 0}</strong>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders + Activity Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.82rem', color: 'var(--color-maroon)', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          {data?.recentOrders?.length === 0 ? (
            <p style={{ color: 'var(--color-gray-light)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
              No orders received yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {data?.recentOrders?.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-charcoal)' }}>{ord.orderNumber}</strong>
                    <span style={{ color: 'var(--color-gray-light)', fontSize: '0.78rem' }}>
                      {ord.customerName} • {ord.city}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block', color: 'var(--color-maroon)' }}>
                      {formatPrice(ord.totalAmount)}
                    </strong>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.68rem',
                        backgroundColor: ord.orderStatus === 'DELIVERED' ? '#D1FAE5' : '#FEF3C7',
                        color: ord.orderStatus === 'DELIVERED' ? '#065F46' : '#92400E',
                      }}
                    >
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Audit Logs */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Admin Audit Logs</h3>
            <Link to="/admin/logs" style={{ fontSize: '0.82rem', color: 'var(--color-maroon)', fontWeight: 600 }}>
              Full Audit Trail →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {data?.recentLogs?.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '0.6rem 0.8rem',
                  backgroundColor: '#FAF8F5',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--color-maroon)' }}>{log.action}</strong>
                  <span style={{ color: 'var(--color-gray-light)', fontSize: '0.72rem' }}>
                    {new Date(log.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0 }}>{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
