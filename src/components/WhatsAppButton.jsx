import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const WhatsAppButton = ({ message = 'Hello Punjab Royal Suits, I am interested in your luxury Punjabi suits and embroidery designs!' }) => {
  const { settings } = useStoreSettings();
  const rawNumber = settings?.whatsappNumber || '+91 98765 43210';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-floating"
      title="Chat with Boutique Stylist on WhatsApp"
      aria-label="WhatsApp Stylist Chat"
    >
      <MessageCircle size={28} />
    </a>
  );
};
