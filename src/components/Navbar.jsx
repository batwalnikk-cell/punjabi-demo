import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Crown, Shield } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ onOpenSearch }) => {
  const { settings } = useStoreSettings();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Handmade Embroidery', path: '/handmade-embroidery' },
    { name: 'Machine Embroidery', path: '/machine-embroidery' },
    { name: 'New Arrivals', path: '/shop?sort=new' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {settings?.showAnnouncement && settings?.announcementText && (
        <div className="announcement-bar">
          <div className="container">
            <span>{settings.announcementText}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="site-header">
        <div className="nav-container">
          {/* Mobile Menu Toggle Button */}
          <button
            className="nav-icon-btn mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
            style={{ display: 'none' }}
          >
            <Menu size={24} />
          </button>

          {/* Logo & Brand Name */}
          <Link to="/" className="brand-logo-container">
            <Crown size={28} color="var(--color-maroon)" strokeWidth={2} />
            <div>
              <span className="brand-title">{settings?.storeName || 'PUNJAB ROYAL SUITS'}</span>
              <span className="brand-subtitle">{settings?.tagline || 'Royal Craftsmanship & Heritage'}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Icons */}
          <div className="nav-icons">
            <button
              className="nav-icon-btn"
              onClick={onOpenSearch}
              title="Search Punjabi Suits"
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            <Link to="/shop?wishlist=true" className="nav-icon-btn" title="Saved Wishlist" aria-label="Wishlist">
              <Heart size={22} />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>

            <button
              className="nav-icon-btn"
              onClick={() => setIsCartOpen(true)}
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={22} />
              {totalItemCount > 0 && <span className="cart-badge">{totalItemCount}</span>}
            </button>

            <Link
              to="/admin"
              className="nav-icon-btn"
              title="Admin Portal"
              style={{ color: 'var(--color-gray-light)', marginLeft: '0.2rem' }}
            >
              <Shield size={19} />
            </Link>

            {/* Mobile Hamburger (visible on small screens) */}
            <button
              className="nav-icon-btn mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`cart-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={22} color="var(--color-maroon)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-maroon)' }}>
              {settings?.storeName || 'PUNJAB ROYAL SUITS'}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={24} />
          </button>
        </div>

        <ul className="mobile-menu-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="mobile-menu-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <Link
              to="/order-tracking"
              className="mobile-menu-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '0.92rem', color: 'var(--color-gray-medium)' }}
            >
              📦 Track Your Order
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="mobile-menu-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '0.92rem', color: 'var(--color-maroon)' }}
            >
              🔐 Admin Panel
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
