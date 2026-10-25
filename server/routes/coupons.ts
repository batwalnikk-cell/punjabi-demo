import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Customer: Validate Coupon Code
router.post('/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, subtotal } = req.body;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
      return;
    }

    const orderSubtotal = parseFloat(subtotal) || 0;
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      res.status(404).json({ success: false, message: 'Invalid coupon code or expired.' });
      return;
    }

    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) {
      res.status(400).json({ success: false, message: 'This coupon offer has not started yet.' });
      return;
    }

    if (coupon.expiryDate && coupon.expiryDate < now) {
      res.status(400).json({ success: false, message: 'This coupon code has expired.' });
      return;
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'This coupon has reached its maximum usage limit.' });
      return;
    }

    if (orderSubtotal < coupon.minOrderAmount) {
      res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart subtotal of ₹${coupon.minOrderAmount.toLocaleString('en-IN')}.`,
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(orderSubtotal, coupon.discountValue);
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: List Coupons
router.get('/', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Create Coupon
router.post('/', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, startDate, expiryDate, isActive } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      res.status(400).json({ success: false, message: 'Code, discount type, and discount value are required.' });
      return;
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      res.status(400).json({ success: false, message: 'A coupon with this code already exists.' });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType: discountType.toUpperCase(),
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive: isActive !== false,
      },
    });

    await logAdminActivity(req.admin!.email, 'CREATE_COUPON', `Created coupon ${coupon.code}`);

    res.status(201).json({ success: true, message: 'Coupon created.', coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Coupon
router.put('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, startDate, expiryDate, isActive } = req.body;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: code ? code.trim().toUpperCase() : undefined,
        discountType: discountType ? discountType.toUpperCase() : undefined,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        minOrderAmount: minOrderAmount !== undefined ? parseFloat(minOrderAmount) : undefined,
        maxDiscount: maxDiscount !== undefined ? (maxDiscount ? parseFloat(maxDiscount) : null) : undefined,
        usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit, 10) : null) : undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        expiryDate: expiryDate !== undefined ? (expiryDate ? new Date(expiryDate) : null) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    await logAdminActivity(req.admin!.email, 'UPDATE_COUPON', `Updated coupon ${coupon.code}`);

    res.json({ success: true, message: 'Coupon updated.', coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete Coupon
router.delete('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.delete({ where: { id } });
    await logAdminActivity(req.admin!.email, 'DELETE_COUPON', `Deleted coupon ${coupon.code}`);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
