import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Public: Get Homepage Content
router.get('/', async (_req: Request, res: Response) => {
  try {
    let content = await prisma.homepageContent.findUnique({ where: { id: 'default' } });
    if (!content) {
      content = await prisma.homepageContent.create({ data: { id: 'default' } });
    }
    res.json({ success: true, content });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Homepage Content
router.put('/', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const updated = await prisma.homepageContent.upsert({
      where: { id: 'default' },
      update: {
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroBannerUrl: data.heroBannerUrl,
        heroCtaText: data.heroCtaText,
        heroCtaLink: data.heroCtaLink,
        secondaryCtaText: data.secondaryCtaText,
        secondaryCtaLink: data.secondaryCtaLink,
        brandStoryTitle: data.brandStoryTitle,
        brandStoryText: data.brandStoryText,
        brandStoryImage: data.brandStoryImage,
        comparisonTitle: data.comparisonTitle,
        handmadeDescription: data.handmadeDescription,
        machineDescription: data.machineDescription,
        customBannerTitle: data.customBannerTitle,
        customBannerText: data.customBannerText,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await logAdminActivity(req.admin!.email, 'UPDATE_HOMEPAGE', 'Updated homepage visual content');

    res.json({ success: true, message: 'Homepage content updated successfully.', content: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
