import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Customer: Subscribe to Newsletter
router.post('/subscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, consent } = req.body;

    if (!email || !email.includes('@') || !email.includes('.')) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (consent === false) {
      res.status(400).json({ success: false, message: 'Consent is required to subscribe to updates.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: { isActive: true },
      create: {
        email: cleanEmail,
        isActive: true,
        consentGiven: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to Punjab Royal Suits boutique updates and festive previews!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: List Subscribers
router.get('/', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, subscribers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
