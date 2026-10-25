const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  const token = localStorage.getItem('prs_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Server returned invalid response' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Store Settings & Homepage
  getSettings: () => fetchJson('/settings'),
  getAdminSettings: () => fetchJson('/settings/admin'),
  updateSettings: (data) => fetchJson('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getHomepageContent: () => fetchJson('/homepage'),
  updateHomepageContent: (data) => fetchJson('/homepage', { method: 'PUT', body: JSON.stringify(data) }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/products${query ? `?${query}` : ''}`);
  },
  getProductBySlug: (slug) => fetchJson(`/products/${slug}`),
  createProduct: (data) => fetchJson('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => fetchJson(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => fetchJson(`/products/${id}`, { method: 'DELETE' }),
  duplicateProduct: (id) => fetchJson(`/products/${id}/duplicate`, { method: 'POST' }),
  toggleFeatured: (id) => fetchJson(`/products/${id}/toggle-featured`, { method: 'PATCH' }),
  toggleAvailability: (id) => fetchJson(`/products/${id}/toggle-availability`, { method: 'PATCH' }),

  // Categories
  getCategories: () => fetchJson('/categories'),
  getAdminCategories: () => fetchJson('/categories/admin'),
  createCategory: (data) => fetchJson('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => fetchJson(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => fetchJson(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (data) => fetchJson('/orders', { method: 'POST', body: JSON.stringify(data) }),
  trackOrder: (orderNumber, phone) => fetchJson(`/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`),
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id) => fetchJson(`/orders/${id}`),
  updateOrderStatus: (id, orderStatus, note) =>
    fetchJson(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ orderStatus, note }) }),
  updatePaymentStatus: (id, paymentStatus, paymentReference) =>
    fetchJson(`/orders/${id}/payment`, { method: 'PATCH', body: JSON.stringify({ paymentStatus, paymentReference }) }),

  // Razorpay Payment Integration
  getRazorpayConfig: () => fetchJson('/orders/razorpay/config'),
  createRazorpayOrder: (orderId) =>
    fetchJson('/orders/razorpay/create-order', { method: 'POST', body: JSON.stringify({ orderId }) }),
  verifyRazorpayPayment: (data) =>
    fetchJson('/orders/razorpay/verify-payment', { method: 'POST', body: JSON.stringify(data) }),

  // Custom Orders / Inquiries
  submitInquiry: async (formData) => {
    const token = localStorage.getItem('prs_admin_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/custom-inquiries`, {
      method: 'POST',
      headers,
      body: formData, // FormData directly
    });
    return res.json();
  },
  getInquiries: () => fetchJson('/custom-inquiries'),
  updateInquiryStatus: (id, status, adminNotes) =>
    fetchJson(`/custom-inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, adminNotes }) }),

  // Coupons
  validateCoupon: (code, subtotal) => fetchJson('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  getCoupons: () => fetchJson('/coupons'),
  createCoupon: (data) => fetchJson('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id, data) => fetchJson(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id) => fetchJson(`/coupons/${id}`, { method: 'DELETE' }),

  // Policies
  getPolicies: () => fetchJson('/policies'),
  getPolicyBySlug: (slug) => fetchJson(`/policies/${slug}`),
  getAdminPolicies: () => fetchJson('/policies/admin/all'),
  updatePolicy: (slug, data) => fetchJson(`/policies/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Reviews
  getReviews: () => fetchJson('/reviews'),
  submitReview: (data) => fetchJson('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getAdminReviews: () => fetchJson('/reviews/admin'),
  toggleReviewPublish: (id) => fetchJson(`/reviews/${id}/toggle-publish`, { method: 'PATCH' }),
  deleteReview: (id) => fetchJson(`/reviews/${id}`, { method: 'DELETE' }),

  // Newsletter
  subscribeNewsletter: (email, consent = true) => fetchJson('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email, consent }) }),
  getNewsletterSubscribers: () => fetchJson('/newsletter'),

  // Media
  uploadMedia: async (fileList) => {
    const formData = new FormData();
    for (const f of fileList) {
      formData.append('images', f);
    }
    const token = localStorage.getItem('prs_admin_token');
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return res.json();
  },
  getMediaLibrary: () => fetchJson('/media'),
  deleteMedia: (filename) => fetchJson(`/media/${filename}`, { method: 'DELETE' }),

  // Analytics & Activity Logs
  getDashboardAnalytics: () => fetchJson('/analytics/dashboard'),
  getActivityLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/logs${query ? `?${query}` : ''}`);
  },

  // Auth
  checkSetup: () => fetchJson('/auth/check-setup'),
  setupInitialAdmin: (data) => fetchJson('/auth/setup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchJson('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchJson('/auth/logout', { method: 'POST' }),
  getCurrentAdmin: () => fetchJson('/auth/me'),
  updateAdminProfile: (data) => fetchJson('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
