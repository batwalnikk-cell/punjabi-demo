import React from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  Sparkles,
  Package,
  Home,
  Image,
  Tag,
  FileText,
  Settings,
  History,
  User,
  LogOut,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminLayout = () => {
  const { admin, isAuthenticated, loading, logout } = useAdminAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating Boutique Admin..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Custom Inquiries', path: '/admin/inquiries', icon: Sparkles },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Package },
    { name: 'Homepage Content', path: '/admin/homepage', icon: Home },
    { name: 'Media Library', path: '/admin/media', icon: Image },
    { name: 'Discounts & Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Policies & Disclaimers', path: '/admin/policies', icon: FileText },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
    { name: 'Activity Logs', path: '/admin/logs', icon: History },
    { name: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Crown size={24} color="var(--color-gold)" />
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                ROYAL BOUTIQUE
              </span>
              <span style={{ fontSize: '0.68rem', display: 'block', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Admin Management
              </span>
            </div>
          </div>
        </div>

        <ul className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="admin-nav-item">
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* User Info & Logout */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #2D2326', marginTop: 'auto' }}>
          <div style={{ fontSize: '0.82rem', color: '#B3A8A6', marginBottom: '0.75rem' }}>
            Logged in as <strong style={{ color: '#FFF' }}>{admin?.name}</strong>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-gold)' }}>
              {admin?.role}
            </span>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.55rem',
              backgroundColor: '#2F1A20',
              border: '1px solid #4F232D',
              borderRadius: 'var(--radius-sm)',
              color: '#F87171',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-medium)' }}>
            Punjab Royal Suits Control Center
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              to="/"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: 'var(--color-maroon)',
                fontWeight: 600,
              }}
            >
              View Public Storefront <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        {/* Page View */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
