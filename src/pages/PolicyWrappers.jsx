import React from 'react';
import { PolicyPage } from './PolicyPage';

export const ShippingPolicy = () => <PolicyPage slug="shipping-policy" fallbackTitle="Shipping & Delivery Policy" />;
export const ReturnPolicy = () => <PolicyPage slug="return-policy" fallbackTitle="Return & Exchange Policy" />;
export const Disclaimer = () => <PolicyPage slug="disclaimer" fallbackTitle="Product Disclaimers & Color Authenticity" />;
export const PrivacyPolicy = () => <PolicyPage slug="privacy-policy" fallbackTitle="Privacy Policy" />;
export const TermsAndConditions = () => <PolicyPage slug="terms-and-conditions" fallbackTitle="Terms and Conditions" />;
