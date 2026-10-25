import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Admin: List Activity Logs
router.get('/', authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * take;

    const [logs, totalCount] = await Promise.all([
      prisma.adminActivityLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.adminActivityLog.count(),
    ]);

    res.json({
      success: true,
      logs,
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

export default router;
