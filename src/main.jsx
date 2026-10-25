import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import CSS Design Tokens & Stylesheets
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';

// Import Global Context Providers
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreSettingsProvider>
        <AdminAuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </AdminAuthProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
