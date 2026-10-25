import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';
import { sanitizeText } from '../utils/sanitize';

const router = Router();

// Customer: Place an Order (Secure Server-Side Price, Duplicate Prevention & Stock Verification)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      state,
      postalCode,
      country = 'India',
      customerNotes,
      paymentMethod = 'COD',
      couponCode,
      items, // array of { productId, variantId, quantity, size, color, stitchingOption }
    } = req.body;

    // Validate required fields
    if (
      !customerName?.trim() ||
      !customerPhone?.trim() ||
      !shippingAddress?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !postalCode?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: 'Please fill in all required shipping details and select at least one suit.',
      });
      return;
    }

    const cleanPhone = customerPhone.trim();

    // Duplicate Order Prevention: check if the exact same customer submitted an identical order in the last 15 seconds
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
    const existingRecentOrder = await prisma.order.findFirst({
      where: {
        customerPhone: cleanPhone,
        paymentMethod,
        createdAt: { gte: fifteenSecondsAgo },
      },
      include: { items: true, statusHistory: true },
    });

    if (existingRecentOrder) {
      res.status(200).json({
        success: true,
        message: 'Your order was already received. Duplicate submission avoided.',
        order: existingRecentOrder,
        isDuplicate: true,
      });
      return;
    }

    // Fetch store settings for shipping & tax rates
    const settings = (await prisma.storeSettings.findUnique({ where: { id: 'default' } })) || {
      freeShippingThreshold: 2999,
      standardShippingFee: 150,
      taxPercentage: 5.0,
      enableCOD: true,
      enableOnlinePayment: true,
    };

    if (paymentMethod === 'COD' && !settings.enableCOD) {
      res.status(400).json({ success: false, message: 'Cash on Delivery is currently disabled by boutique.' });
      return;
    }

    // Use Prisma transaction to ensure atomic stock validation and reservation
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const verifiedItems: any[] = [];

      for (const item of items) {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
        });

        if (!product || !product.isAvailable) {
          throw new Error(`Product "${item.productName || 'selected'}" is no longer available.`);
        }

        if (product.stock < qty) {
          throw new Error(
            `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`
          );
        }

        // Calculate variant price adjustment if variant is selected
        let unitPrice = product.price;
        let selectedSize = item.size || 'Standard';
        let selectedColor = item.color || product.color;
        let selectedStitching = item.stitchingOption || 'Unstitched Fabric';

        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
          if (variant) {
            if (variant.stock < qty) {
              throw new Error(`Size/Style "${variant.size}" for "${product.name}" is out of stock.`);
            }
            unitPrice += variant.priceAdjustment;
            selectedSize = variant.size;
            selectedColor = variant.color;
            selectedStitching = variant.stitchingOption;

            // Decrement variant stock
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stock: { decrement: qty } },
            });
          }
        }

        // Decrement product overall stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: qty } },
        });

        const lineTotal = unitPrice * qty;
        subtotal += lineTotal;

        verifiedItems.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productImage: product.images[0]?.url || '/assets/hero_punjabi_suit.jpg',
          variantId: item.variantId || null,
          size: selectedSize,
          color: selectedColor,
          stitchingOption: selectedStitching,
          unitPrice,
          quantity: qty,
          totalPrice: lineTotal,
        });
      }

      // Calculate discount if coupon applied
      let discountAmount = 0;
      let verifiedCouponCode: string | null = null;

      if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.trim().toUpperCase() },
        });

        if (coupon && coupon.isActive) {
          const now = new Date();
          const isStarted = !coupon.startDate || coupon.startDate <= now;
          const isNotExpired = !coupon.expiryDate || coupon.expiryDate >= now;
          const isUnderLimit = !coupon.usageLimit || coupon.timesUsed < coupon.usageLimit;
          const meetsMinAmount = subtotal >= coupon.minOrderAmount;

          if (isStarted && isNotExpired && isUnderLimit && meetsMinAmount) {
            verifiedCouponCode = coupon.code;
            if (coupon.discountType === 'PERCENTAGE') {
              discountAmount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
              }
            } else {
              discountAmount = Math.min(subtotal, coupon.discountValue);
            }

            // Increment coupon usage
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { timesUsed: { increment: 1 } },
            });
          }
        }
      }

      // Calculate shipping
      const discountedSubtotal = Math.max(0, subtotal - discountAmount);
      const shippingFee =
        discountedSubtotal >= (settings.freeShippingThreshold || 2999)
          ? 0
          : (settings.standardShippingFee || 150);

      // Calculate tax (GST in India)
      const taxRate = (settings.taxPercentage || 5.0) / 100;
      const tax = Math.round(discountedSubtotal * taxRate);

      const totalAmount = Math.round(discountedSubtotal + shippingFee + tax);

      const uniqueOrderSuffix = `${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderNumber = `PRS-${new Date().getFullYear()}-${uniqueOrderSuffix}`;

      // Create order record with sanitized fields
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: sanitizeText(customerName),
          customerEmail: customerEmail?.trim() || `${cleanPhone}@customer.punjabroyalsuits.com`,
          customerPhone: cleanPhone,
          shippingAddress: sanitizeText(shippingAddress),
          city: sanitizeText(city),
          state: sanitizeText(state),
          postalCode: sanitizeText(postalCode),
          country: sanitizeText(country),
          customerNotes: customerNotes ? sanitizeText(customerNotes) : null,
          subtotal,
          discount: discountAmount,
          shippingFee,
          tax,
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'PENDING_VERIFICATION',
          orderStatus: 'PENDING',
          couponCode: verifiedCouponCode,
          items: {
            create: verifiedItems,
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              note: 'Order placed by customer via online boutique checkout.',
              changedBy: 'Customer',
            },
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });

      return createdOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Your order has been received successfully!',
      order,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to place order.' });
  }
});

// Razorpay: Public Config (Key ID only, NEVER the secret)
router.get('/razorpay/config', async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const keyId = process.env.RAZORPAY_KEY_ID || settings?.razorpayKeyId || null;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || settings?.razorpayKeySecret || null;
    const isConfigured = Boolean(keyId && keySecret && keyId.trim() && keySecret.trim());

    res.json({
      success: true,
      configured: isConfigured,
      keyId: isConfigured ? keyId : null,
      currency: settings?.currencyCode || 'INR',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Razorpay: Create Server Order
router.post('/razorpay/create-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ success: false, message: 'Order ID is required.' });
      return;
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const keyId = process.env.RAZORPAY_KEY_ID || settings?.razorpayKeyId;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || settings?.razorpayKeySecret;

    if (!keyId || !keySecret || !keyId.trim() || !keySecret.trim()) {
      res.status(400).json({
        success: false,
        configured: false,
        message:
          'Razorpay online payment gateway credentials are not yet configured. Please select Cash on Delivery or Manual UPI, or configure Razorpay keys in Store Settings.',
      });
      return;
    }

    const amountInPaise = Math.round(order.totalAmount * 100);
    const authHeader = 'Basic ' + Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString('base64');

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          boutiqueOrderNumber: order.orderNumber,
          customerPhone: order.customerPhone,
        },
      }),
    });

    const rzpData = (await rzpRes.json()) as any;
    if (!rzpRes.ok) {
      res.status(400).json({
        success: false,
        message: rzpData.error?.description || 'Failed to initialize payment with Razorpay.',
      });
      return;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentReference: rzpData.id },
    });

    res.json({
      success: true,
      keyId: keyId.trim(),
      razorpayOrderId: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency,
      orderNumber: order.orderNumber,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Razorpay: Verify Payment Signature
router.post('/razorpay/verify-payment', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ success: false, message: 'Missing payment signature verification parameters.' });
      return;
    }

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const keySecret = process.env.RAZORPAY_KEY_SECRET || settings?.razorpayKeySecret;

    if (!keySecret) {
      res.status(500).json({ success: false, message: 'Server payment verification secret is not configured.' });
      return;
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret.trim())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    let isMatch = false;
    try {
      isMatch = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf8'),
        Buffer.from(razorpay_signature, 'utf8')
      );
    } catch {
      isMatch = false;
    }

    if (!isMatch) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
          statusHistory: {
            create: {
              status: 'PENDING',
              note: `Payment signature verification failed for Payment ID: ${razorpay_payment_id}`,
              changedBy: 'Razorpay Gateway',
            },
          },
        },
      });
      res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
      return;
    }

    // Payment successfully verified
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        paymentReference: razorpay_payment_id,
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            note: `Payment verified via Razorpay (Payment ID: ${razorpay_payment_id})`,
            changedBy: 'Razorpay Gateway',
          },
        },
      },
      include: { items: true, statusHistory: true },
    });

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order: updatedOrder,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Razorpay: Webhook Handler
router.post('/razorpay/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || settings?.razorpayKeySecret;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret.trim())
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
        return;
      }
    }

    const event = req.body?.event;
    if (event === 'payment.captured') {
      const payment = req.body.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;
      if (razorpayOrderId) {
        const order = await prisma.order.findFirst({
          where: { paymentReference: razorpayOrderId },
        });
        if (order && order.paymentStatus !== 'PAID') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'PAID',
              orderStatus: 'CONFIRMED',
              statusHistory: {
                create: {
                  status: 'CONFIRMED',
                  note: `Payment verified via Razorpay Webhook (Payment ID: ${payment.id})`,
                  changedBy: 'Razorpay Webhook',
                },
              },
            },
          });
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Customer: Track Order by Order Number & Phone
router.get('/track', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderNumber, phone } = req.query;

    if (!orderNumber || !phone) {
      res.status(400).json({ success: false, message: 'Please provide both Order Number and Phone Number.' });
      return;
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: (orderNumber as string).trim(),
        customerPhone: { contains: (phone as string).trim().slice(-10) },
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'No matching order found with these details.' });
      return;
    }

    // Mask sensitive details for tracking view
    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        city: order.city,
        state: order.state,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          productName: i.productName,
          productImage: i.productImage,
          size: i.size,
          stitchingOption: i.stitchingOption,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        statusHistory: order.statusHistory,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: List Orders with Filtering, Search & Pagination
router.get('/', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, paymentStatus, search, page = '1', limit = '15' } = req.query;

    const where: any = {};
    if (status && status !== 'all') {
      where.orderStatus = status;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus;
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
        { customerEmail: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 15));
    const skip = (pageNum - 1) * take;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: pageNum,
        limit: take,
        totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Get Single Order Details
router.get('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Order Status (With Atomic Inventory Restoration on Cancellation)
router.patch('/:id/status', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, note } = req.body;

    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'READY_TO_SHIP',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'REFUNDED',
    ];

    if (!validStatuses.includes(orderStatus)) {
      res.status(400).json({ success: false, message: 'Invalid order status specified.' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const previousStatus = order.orderStatus;
    const isCancelling =
      (orderStatus === 'CANCELLED' || orderStatus === 'REFUNDED') &&
      previousStatus !== 'CANCELLED' &&
      previousStatus !== 'REFUNDED';

    const isReinstating =
      (previousStatus === 'CANCELLED' || previousStatus === 'REFUNDED') &&
      orderStatus !== 'CANCELLED' &&
      orderStatus !== 'REFUNDED';

    const updated = await prisma.$transaction(async (tx) => {
      // 1. If cancelling an active order: restore product and variant inventory
      if (isCancelling) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }

      // 2. If reinstating a previously cancelled order: verify stock and decrement again
      if (isReinstating) {
        for (const item of order.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product || product.stock < item.quantity) {
            throw new Error(`Cannot reinstate order: "${item.productName}" has insufficient inventory.`);
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }
      }

      // 3. If order is marked DELIVERED and payment is COD, auto-mark paymentStatus as PAID
      let paymentStatusUpdate = undefined;
      if (orderStatus === 'DELIVERED' && order.paymentMethod === 'COD' && order.paymentStatus === 'UNPAID') {
        paymentStatusUpdate = 'PAID';
      }

      return tx.order.update({
        where: { id },
        data: {
          orderStatus,
          paymentStatus: paymentStatusUpdate,
          statusHistory: {
            create: {
              status: orderStatus,
              note:
                note ||
                (isCancelling
                  ? `Order marked ${orderStatus} and stock restored by ${req.admin!.name}`
                  : `Status updated to ${orderStatus} by ${req.admin!.name}`),
              changedBy: req.admin!.name,
            },
          },
        },
        include: { statusHistory: { orderBy: { createdAt: 'desc' } }, items: true },
      });
    });

    await logAdminActivity(
      req.admin!.email,
      'UPDATE_ORDER_STATUS',
      `Order ${order.orderNumber} status changed from ${order.orderStatus} to ${orderStatus}${
        isCancelling ? ' (Stock restored)' : ''
      }`
    );

    res.json({ success: true, message: 'Order status updated successfully.', order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Payment Status
router.patch('/:id/payment', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentReference } = req.body;

    const validPaymentStatuses = ['UNPAID', 'PAID', 'FAILED', 'REFUNDED', 'PENDING_VERIFICATION'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      res.status(400).json({ success: false, message: 'Invalid payment status.' });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        paymentReference: paymentReference || undefined,
      },
    });

    await logAdminActivity(
      req.admin!.email,
      'UPDATE_PAYMENT_STATUS',
      `Order ${order.orderNumber} payment marked as ${paymentStatus}`
    );

    res.json({ success: true, message: 'Payment status updated.', order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
