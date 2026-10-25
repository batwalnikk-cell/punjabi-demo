import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { sanitizeText } from '../utils/sanitize';

const router = Router();

// Customer: Submit Custom Order / Embroidery Inquiry
router.post('/', upload.single('referenceImage'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      embroideryType,
      suitType,
      fabricPreference,
      colorPreference,
      targetDate,
      budgetRange,
      requirements,
    } = req.body;

    if (!customerName?.trim() || !customerPhone?.trim() || !requirements?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Please provide your name, contact phone number, and custom design requirements.',
      });
      return;
    }

    if (customerPhone.trim().replace(/[^0-9]/g, '').length < 8) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid phone or WhatsApp number with at least 8 digits.',
      });
      return;
    }

    const uniqueId = Math.floor(1000 + Math.random() * 9000);
    const inquiryNumber = `INQ-${new Date().getFullYear()}-${uniqueId}`;

    let referenceImageUrl = req.body.referenceImageUrl || null;
    if (req.file) {
      referenceImageUrl = `/uploads/${req.file.filename}`;
    }

    const inquiry = await prisma.customInquiry.create({
      data: {
        inquiryNumber,
        customerName: sanitizeText(customerName),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || null,
        embroideryType: sanitizeText(embroideryType || 'Handmade Zardozi / Custom'),
        suitType: sanitizeText(suitType || 'Custom Suit'),
        fabricPreference: sanitizeText(fabricPreference || 'Pure Silk'),
        colorPreference: sanitizeText(colorPreference || 'As Discussed'),
        targetDate: targetDate ? sanitizeText(targetDate) : null,
        budgetRange: budgetRange ? sanitizeText(budgetRange) : null,
        requirements: sanitizeText(requirements),
        referenceImage: referenceImageUrl,
        status: 'NEW',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your custom embroidery inquiry has been submitted! Our boutique master designer will contact you on WhatsApp/phone.',
      inquiry,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: List Inquiries
router.get('/', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const inquiries = await prisma.customInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, inquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Inquiry Status & Notes
router.patch('/:id/status', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updated = await prisma.customInquiry.update({
      where: { id },
      data: {
        status: status || undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    await logAdminActivity(
      req.admin!.email,
      'UPDATE_INQUIRY',
      `Custom inquiry ${updated.inquiryNumber} updated to status "${updated.status}"`
    );

    res.json({ success: true, message: 'Inquiry updated.', inquiry: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
