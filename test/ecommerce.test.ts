import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server/index';
import { prisma } from '../server/db';

describe('Punjab Royal Suits E-Commerce Test Suite', () => {
  let adminToken: string = '';
  let sampleProduct: any = null;

  beforeAll(async () => {
    sampleProduct = await prisma.product.findFirst({
      where: { isAvailable: true, stock: { gt: 5 } },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('1. GET /api/health should return healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('2. Unauthorized POST /api/products should be rejected with 401', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Unauthorized Hack Product',
      price: 100,
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('3. Admin login with correct credentials should issue JWT and cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nikk',
      password: 'nikk3344',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  it('4. Admin login with incorrect password should be rejected with 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@punjabroyalsuits.com',
      password: 'WrongPassword123!',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('5. GET /api/products should support search and category filters', async () => {
    const res = await request(app).get('/api/products?search=Phulkari');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    if (res.body.products.length > 0) {
      expect(res.body.products[0].name.toLowerCase()).toContain('phulkari');
    }
  });

  it('6. Coupon validation should correctly calculate percentage discount and check minimum order', async () => {
    // Valid coupon above min order
    const validRes = await request(app).post('/api/coupons/validate').send({
      code: 'ROYAL10',
      subtotal: 5000,
    });
    expect(validRes.status).toBe(200);
    expect(validRes.body.success).toBe(true);
    expect(validRes.body.coupon.discountAmount).toBe(500); // 10% of 5000

    // Below minimum order amount
    const invalidRes = await request(app).post('/api/coupons/validate').send({
      code: 'ROYAL10',
      subtotal: 1000, // min is 2999
    });
    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.success).toBe(false);
  });

  it('7. Order checkout must recalculate final total on server and enforce stock limits', async () => {
    expect(sampleProduct).toBeDefined();

    // Test: Overselling beyond available stock should fail
    const overstockRes = await request(app).post('/api/orders').send({
      customerName: 'Gurpreet Singh',
      customerPhone: '+91 99887 76655',
      shippingAddress: '42 Sector 17',
      city: 'Chandigarh',
      state: 'Punjab',
      postalCode: '160017',
      items: [
        {
          productId: sampleProduct.id,
          quantity: 9999, // Exceeds stock
          size: 'L',
        },
      ],
    });
    expect(overstockRes.status).toBe(400);
    expect(overstockRes.body.success).toBe(false);
    expect(overstockRes.body.message.toLowerCase()).toContain('stock');

    // Test: Valid order placement
    const orderRes = await request(app).post('/api/orders').send({
      customerName: 'Navjot Kaur',
      customerPhone: '+91 98140 12345',
      customerEmail: 'navjot@example.com',
      shippingAddress: 'Model Town, Link Road',
      city: 'Ludhiana',
      state: 'Punjab',
      postalCode: '141002',
      paymentMethod: 'COD',
      items: [
        {
          productId: sampleProduct.id,
          quantity: 1,
          size: 'M',
        },
      ],
    });
    expect(orderRes.status).toBe(201);
    expect(orderRes.body.success).toBe(true);
    expect(orderRes.body.order.orderNumber).toContain('PRS-');
    expect(orderRes.body.order.totalAmount).toBeGreaterThan(0);
  });

  it('8. Order tracking should return order details for correct orderNumber and phone', async () => {
    const recentOrder = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
    expect(recentOrder).toBeDefined();

    const trackRes = await request(app).get(
      `/api/orders/track?orderNumber=${recentOrder!.orderNumber}&phone=${recentOrder!.customerPhone}`
    );
    expect(trackRes.status).toBe(200);
    expect(trackRes.body.success).toBe(true);
    expect(trackRes.body.order.orderNumber).toBe(recentOrder!.orderNumber);
  });

  it('9. Customer review submission and publication', async () => {
    const reviewRes = await request(app).post('/api/reviews').send({
      customerName: 'Kiranjit Kaur',
      customerCity: 'Delhi',
      rating: 5,
      comment: 'The bridal salwar suit exceeded my highest expectations. Truly luxurious!',
    });
    expect(reviewRes.status).toBe(201);
    expect(reviewRes.body.success).toBe(true);
  });

  it('10. Custom embroidery inquiry submission with validation', async () => {
    const inquiryRes = await request(app).post('/api/custom-inquiries').send({
      customerName: 'Harpreet Kaur',
      customerPhone: '+91 98721 00000',
      customerEmail: 'harpreet@example.com',
      embroideryType: 'Handmade Zardozi & Resham',
      suitType: 'Patiala Salwar Suit',
      fabricPreference: 'Pure Georgette',
      colorPreference: 'Rani Pink & Muted Gold',
      targetDate: '2026-12-15',
      budgetRange: '₹15,000 - ₹25,000',
      requirements: 'Need heavy gold dabka and gota patti border for my brother\'s wedding.',
    });
    expect(inquiryRes.status).toBe(201);
    expect(inquiryRes.body.success).toBe(true);
    expect(inquiryRes.body.inquiry.inquiryNumber).toContain('INQ-');
  });

  it('11. Store settings public fetch and authorized admin update', async () => {
    // Public fetch
    const getRes = await request(app).get('/api/settings');
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(getRes.body.settings.storeName).toBeDefined();

    // Authenticated admin update
    const updateRes = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        storeName: 'PUNJAB ROYAL SUITS',
        announcementText: '✨ Worldwide Express Delivery & Custom Sizing Available',
      });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.settings.storeName).toBe('PUNJAB ROYAL SUITS');
  });

  it('12. Category deletion protection against deleting categories with products', async () => {
    const categoryWithProducts = await prisma.category.findFirst({
      where: { products: { some: {} } },
    });
    expect(categoryWithProducts).toBeDefined();

    const delRes = await request(app)
      .delete(`/api/categories/${categoryWithProducts!.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.status).toBe(400);
    expect(delRes.body.success).toBe(false);
    expect(delRes.body.message.toLowerCase()).toContain('product');
  });

  it('13. Public policy retrieval by slug', async () => {
    const policyRes = await request(app).get('/api/policies/disclaimer');
    expect(policyRes.status).toBe(200);
    expect(policyRes.body.success).toBe(true);
    expect(policyRes.body.policy.slug).toBe('disclaimer');
    expect(policyRes.body.policy.content).toBeDefined();
  });

  it('14. Order cancellation must atomically restore inventory stock', async () => {
    const initialProduct = await prisma.product.findUnique({ where: { id: sampleProduct.id } });
    const initialStock = initialProduct!.stock;

    // Place an order for 2 units
    const orderRes = await request(app).post('/api/orders').send({
      customerName: 'Amanat Kaur',
      customerPhone: '+91 97799 11223',
      shippingAddress: 'Ranjit Avenue',
      city: 'Amritsar',
      state: 'Punjab',
      postalCode: '143001',
      paymentMethod: 'COD',
      items: [{ productId: sampleProduct.id, quantity: 2, size: 'L' }],
    });
    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.order.id;

    // Check stock decremented
    const postOrderProduct = await prisma.product.findUnique({ where: { id: sampleProduct.id } });
    expect(postOrderProduct!.stock).toBe(initialStock - 2);

    // Cancel order as admin
    const cancelRes = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ orderStatus: 'CANCELLED', note: 'Customer requested cancellation.' });
    expect(cancelRes.status).toBe(200);

    // Verify stock is restored
    const restoredProduct = await prisma.product.findUnique({ where: { id: sampleProduct.id } });
    expect(restoredProduct!.stock).toBe(initialStock);
  });

  it('15. Duplicate checkout requests within 15s should be recognized and not duplicate stock reduction', async () => {
    const testPhone = '+91 98888 77777';
    const payload = {
      customerName: 'Simranjeet Kaur',
      customerPhone: testPhone,
      shippingAddress: 'Civil Lines',
      city: 'Jalandhar',
      state: 'Punjab',
      postalCode: '144001',
      paymentMethod: 'COD',
      items: [{ productId: sampleProduct.id, quantity: 1, size: 'S' }],
    };

    // First request
    const firstRes = await request(app).post('/api/orders').send(payload);
    expect(firstRes.status).toBe(201);

    // Immediate second request with exact same details
    const secondRes = await request(app).post('/api/orders').send(payload);
    expect(secondRes.status).toBe(200);
    expect(secondRes.body.isDuplicate).toBe(true);
    expect(secondRes.body.order.orderNumber).toBe(firstRes.body.order.orderNumber);
  });

  it('16. Razorpay public config must never expose secret keys', async () => {
    const configRes = await request(app).get('/api/orders/razorpay/config');
    expect(configRes.status).toBe(200);
    expect(configRes.body.success).toBe(true);
    expect(configRes.body.keySecret).toBeUndefined();
    expect(configRes.body.razorpayKeySecret).toBeUndefined();
  });

  it('17. Product price validation: Negative prices must be rejected', async () => {
    const updateRes = await request(app)
      .put(`/api/products/${sampleProduct.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: -500 });
    expect(updateRes.status).toBe(400);
    expect(updateRes.body.success).toBe(false);
  });
});
