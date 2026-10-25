import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StoreSettingsContext = createContext();

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'PUNJAB ROYAL SUITS',
    tagline: 'Exquisite Punjabi Suits & Royal Craftsmanship',
    currencySymbol: '₹',
    currencyCode: 'INR',
    freeShippingThreshold: 2999,
    standardShippingFee: 150,
    taxPercentage: 5.0,
    phone: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    businessEmail: 'contact@punjabroyalsuits.com',
    address: 'Heritage Chowk, Near Golden Temple, Amritsar, Punjab, India',
    announcementText: '✨ Festive Offer: Complimentary Bespoke Stitching on Orders Above ₹4,999! Express Worldwide Delivery.',
    showAnnouncement: true,
    enableCOD: true,
    enableOnlinePayment: true,
  });

  const [homepage, setHomepage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [settingsRes, homepageRes] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getHomepageContent().catch(() => null),
      ]);
      if (settingsRes?.settings) setSettings(settingsRes.settings);
      if (homepageRes?.content) setHomepage(homepageRes.content);
    } catch (err) {
      console.warn('Failed loading store settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPrice = (amount) => {
    const val = Number(amount) || 0;
    return `${settings.currencySymbol || '₹'}${val.toLocaleString('en-IN')}`;
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        homepage,
        loading,
        formatPrice,
        refreshSettings: loadData,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => useContext(StoreSettingsContext);
