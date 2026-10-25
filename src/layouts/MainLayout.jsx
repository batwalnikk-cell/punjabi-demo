import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { SearchBar } from '../components/SearchBar';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const MainLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WhatsAppButton />
    </div>
  );
};
