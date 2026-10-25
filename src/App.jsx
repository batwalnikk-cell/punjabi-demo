import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Storefront Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Categories } from './pages/Categories';
import { HandmadeEmbroidery } from './pages/HandmadeEmbroidery';
import { MachineEmbroidery } from './pages/MachineEmbroidery';
import { CustomOrders } from './pages/CustomOrders';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderTracking } from './pages/OrderTracking';
import { PolicyPage } from './pages/PolicyPage';
import {
  ShippingPolicy,
  ReturnPolicy,
  Disclaimer,
  PrivacyPolicy,
  TermsAndConditions
} from './pages/PolicyWrappers';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProductsManagement } from './admin/ProductsManagement';
import { ProductForm } from './admin/ProductForm';
import { CategoriesManagement } from './admin/CategoriesManagement';
import { OrdersManagement } from './admin/OrdersManagement';
import { CustomInquiriesManagement } from './admin/CustomInquiriesManagement';
import { InventoryManagement } from './admin/InventoryManagement';
import { HomepageManagement } from './admin/HomepageManagement';
import { ImageManagement } from './admin/ImageManagement';
import { DiscountsManagement } from './admin/DiscountsManagement';
import { PoliciesManagement } from './admin/PoliciesManagement';
import { StoreSettings } from './admin/StoreSettings';
import { ActivityLogs } from './admin/ActivityLogs';
import { AdminProfile } from './admin/AdminProfile';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Routes wrapped in MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="handmade-embroidery" element={<HandmadeEmbroidery />} />
          <Route path="machine-embroidery" element={<MachineEmbroidery />} />
          <Route path="custom-orders" element={<CustomOrders />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderNumber" element={<OrderSuccess />} />
          <Route path="order-tracking" element={<OrderTracking />} />

          {/* Legal and Disclaimer Policies */}
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="return-policy" element={<ReturnPolicy />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="policies/:slug" element={<PolicyPage />} />

          {/* 404 Public Page */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Login Route (Independent Full Screen) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="inquiries" element={<CustomInquiriesManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="homepage" element={<HomepageManagement />} />
          <Route path="media" element={<ImageManagement />} />
          <Route path="coupons" element={<DiscountsManagement />} />
          <Route path="policies" element={<PoliciesManagement />} />
          <Route path="settings" element={<StoreSettings />} />
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </>
  );
}
