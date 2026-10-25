import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Admin: Dashboard Overview Analytics
router.get('/dashboard', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalProducts,
      publishedProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      paidOrdersData,
      recentOrders,
      recentLogs,
      recentInquiries,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: 'PENDING' } }),
      prisma.order.count({ where: { orderStatus: 'PROCESSING' } }),
      prisma.order.count({ where: { orderStatus: 'SHIPPED' } }),
      prisma.order.count({ where: { orderStatus: 'DELIVERED' } }),
      prisma.order.count({ where: { orderStatus: 'CANCELLED' } }),
      // Calculate revenue strictly from verified paid orders or delivered orders
      prisma.order.aggregate({
        where: {
          OR: [{ paymentStatus: 'PAID' }, { orderStatus: 'DELIVERED' }],
          AND: [{ orderStatus: { not: 'CANCELLED' } }, { orderStatus: { not: 'REFUNDED' } }],
        },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: { take: 2 } },
      }),
      prisma.adminActivityLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customInquiry.count({ where: { status: 'NEW' } }),
    ]);

    const totalRevenue = paidOrdersData._sum.totalAmount || 0;

    res.json({
      success: true,
      stats: {
        products: {
          total: totalProducts,
          published: publishedProducts,
          outOfStock: outOfStockProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
        revenue: {
          actualPaidRevenue: totalRevenue,
          currency: '₹',
        },
        inquiries: {
          new: recentInquiries,
        },
      },
      recentOrders,
      recentLogs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
