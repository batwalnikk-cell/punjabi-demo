import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Public: Get all published policies
router.get('/', async (_req: Request, res: Response) => {
  try {
    const policies = await prisma.policy.findMany({
      where: { isPublished: true },
      select: { slug: true, title: true, updatedAt: true },
    });
    res.json({ success: true, policies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public: Get policy by slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const policy = await prisma.policy.findUnique({ where: { slug } });
    if (!policy) {
      res.status(404).json({ success: false, message: 'Policy not found.' });
      return;
    }
    res.json({ success: true, policy });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: List all policies with full content
router.get('/admin/all', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const policies = await prisma.policy.findMany({ orderBy: { title: 'asc' } });
    res.json({ success: true, policies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update or Create Policy
router.put('/:slug', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { title, content, isPublished } = req.body;

    const policy = await prisma.policy.upsert({
      where: { slug },
      update: {
        title: title || undefined,
        content: content !== undefined ? content : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
      },
      create: {
        slug,
        title: title || slug,
        content: content || '',
        isPublished: isPublished !== false,
      },
    });

    await logAdminActivity(
      req.admin!.email,
      'UPDATE_POLICY',
      `Updated policy "${policy.title}" (${policy.slug})`
    );

    res.json({ success: true, message: 'Policy saved successfully.', policy });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
