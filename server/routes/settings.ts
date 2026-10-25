import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Public: Get Store Settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: 'default' },
      });
    }

    // Sanitize sensitive fields for public storefront
    const publicSettings = {
      storeName: settings.storeName,
      tagline: settings.tagline,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      businessEmail: settings.businessEmail,
      phone: settings.phone,
      whatsappNumber: settings.whatsappNumber,
      address: settings.address,
      currencyCode: settings.currencyCode,
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold,
      standardShippingFee: settings.standardShippingFee,
      taxPercentage: settings.taxPercentage,
      enableCOD: settings.enableCOD,
      enableOnlinePayment: settings.enableOnlinePayment,
      manualUpiId: settings.manualUpiId,
      announcementText: settings.announcementText,
      showAnnouncement: settings.showAnnouncement,
      isMaintenanceMode: settings.isMaintenanceMode,
      instagramUrl: settings.instagramUrl,
      facebookUrl: settings.facebookUrl,
      pinterestUrl: settings.pinterestUrl,
      youtubeUrl: settings.youtubeUrl,
    };

    res.json({ success: true, settings: publicSettings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Get Full Settings (including payment credentials config)
router.get('/admin', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    if (!settings) {
      settings = await prisma.storeSettings.create({ data: { id: 'default' } });
    }
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Settings
router.put('/', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const updated = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        storeName: data.storeName || undefined,
        tagline: data.tagline || undefined,
        logoUrl: data.logoUrl !== undefined ? data.logoUrl : undefined,
        faviconUrl: data.faviconUrl !== undefined ? data.faviconUrl : undefined,
        businessEmail: data.businessEmail || undefined,
        phone: data.phone || undefined,
        whatsappNumber: data.whatsappNumber || undefined,
        address: data.address || undefined,
        currencyCode: data.currencyCode || undefined,
        currencySymbol: data.currencySymbol || undefined,
        freeShippingThreshold: data.freeShippingThreshold !== undefined ? parseFloat(data.freeShippingThreshold) : undefined,
        standardShippingFee: data.standardShippingFee !== undefined ? parseFloat(data.standardShippingFee) : undefined,
        taxPercentage: data.taxPercentage !== undefined ? parseFloat(data.taxPercentage) : undefined,
        enableCOD: data.enableCOD !== undefined ? Boolean(data.enableCOD) : undefined,
        enableOnlinePayment: data.enableOnlinePayment !== undefined ? Boolean(data.enableOnlinePayment) : undefined,
        razorpayKeyId: data.razorpayKeyId !== undefined ? data.razorpayKeyId : undefined,
        razorpayKeySecret: data.razorpayKeySecret !== undefined ? data.razorpayKeySecret : undefined,
        manualUpiId: data.manualUpiId !== undefined ? data.manualUpiId : undefined,
        announcementText: data.announcementText !== undefined ? data.announcementText : undefined,
        showAnnouncement: data.showAnnouncement !== undefined ? Boolean(data.showAnnouncement) : undefined,
        isMaintenanceMode: data.isMaintenanceMode !== undefined ? Boolean(data.isMaintenanceMode) : undefined,
        instagramUrl: data.instagramUrl !== undefined ? data.instagramUrl : undefined,
        facebookUrl: data.facebookUrl !== undefined ? data.facebookUrl : undefined,
        pinterestUrl: data.pinterestUrl !== undefined ? data.pinterestUrl : undefined,
        youtubeUrl: data.youtubeUrl !== undefined ? data.youtubeUrl : undefined,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await logAdminActivity(req.admin!.email, 'UPDATE_SETTINGS', 'Updated store settings');

    res.json({ success: true, message: 'Store settings saved successfully.', settings: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
