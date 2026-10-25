import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';
import { sanitizeText } from '../utils/sanitize';

const router = Router();

// Public: Get Published Reviews
router.get('/', async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Customer: Submit Review
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, customerCity, rating, comment, productId } = req.body;

    if (!customerName?.trim() || !comment?.trim()) {
      res.status(400).json({ success: false, message: 'Please provide your name and your review feedback.' });
      return;
    }

    const numericRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));

    const review = await prisma.review.create({
      data: {
        customerName: sanitizeText(customerName),
        customerCity: sanitizeText(customerCity || 'Verified Customer'),
        rating: numericRating,
        comment: sanitizeText(comment),
        productId: productId || null,
        isVerified: true,
        isPublished: true, // Auto-published, admin can moderate
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      review,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: List all reviews (moderation)
router.get('/admin', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Toggle publish
router.patch('/:id/toggle-publish', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }
    const updated = await prisma.review.update({
      where: { id },
      data: { isPublished: !review.isPublished },
    });
    res.json({ success: true, isPublished: updated.isPublished });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete Review
router.delete('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
