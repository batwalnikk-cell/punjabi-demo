import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useStoreSettings } from './StoreSettingsContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { settings } = useStoreSettings();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('prs_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem('prs_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('prs_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('prs_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('prs_coupon');
      }
    } catch (e) {
      console.error('Error saving coupon:', e);
    }
  }, [coupon]);

  const addToCart = (product, options = {}) => {
    const {
      variantId = null,
      size = 'Standard',
      color = product.color,
      stitchingOption = 'Unstitched Fabric',
      priceAdjustment = 0,
      quantity = 1,
    } = options;

    const finalUnitPrice = Number(product.price) + Number(priceAdjustment);
    const itemKey = `${product.id}-${variantId || size}-${stitchingOption}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += Number(quantity);
        return updated;
      }
      return [
        ...prev,
        {
          key: itemKey,
          productId: product.id,
          variantId,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          image: product.images?.[0]?.url || '/assets/hero_punjabi_suit.jpg',
          size,
          color,
          stitchingOption,
          unitPrice: finalUnitPrice,
          quantity: Number(quantity),
          stock: product.stock,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (key, qty) => {
    const newQty = parseInt(qty, 10);
    if (newQty <= 0) {
      removeFromCart(key);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success) {
        setCoupon(res.coupon);
        return { success: true, message: res.message };
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code.');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const discountAmount = coupon ? coupon.discountAmount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const threshold = settings?.freeShippingThreshold || 2999;
  const shippingFee = cartItems.length === 0 ? 0 : discountedSubtotal >= threshold ? 0 : (settings?.standardShippingFee || 150);
  const taxRate = (settings?.taxPercentage || 5.0) / 100;
  const taxAmount = Math.round(discountedSubtotal * taxRate);
  const grandTotal = Math.round(discountedSubtotal + shippingFee + taxAmount);

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        grandTotal,
        coupon,
        couponError,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
