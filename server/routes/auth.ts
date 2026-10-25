import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'punjab_royal_suits_jwt_fallback_secret_2026';

// Check if any admin exists (for first-time initial setup wizard)
router.get('/check-setup', async (_req: Request, res: Response) => {
  try {
    const adminCount = await prisma.adminUser.count();
    res.json({ setupNeeded: adminCount === 0 });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Setup Initial Admin (ONLY allowed if no admin currently exists)
router.post('/setup', async (req: Request, res: Response): Promise<void> => {
  try {
    const adminCount = await prisma.adminUser.count();
    if (adminCount > 0) {
      res.status(403).json({ success: false, message: 'Initial admin setup is already completed.' });
      return;
    }

    const { email, password, name } = req.body;
    if (!email || !password || password.length < 8) {
      res.status(400).json({ success: false, message: 'A valid email and password (minimum 8 characters) are required.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name?.trim() || 'Store Administrator',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    await logAdminActivity(newAdmin.email, 'INITIAL_SETUP', 'Created initial Super Admin account');

    const token = jwt.sign(
      { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('prs_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Initial administrator created successfully.',
      admin: { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name, role: newAdmin.role },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Login (supports username or email)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').toLowerCase().trim();
    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Please provide both username/email and password.' });
      return;
    }

    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: identifier },
          { email: `${identifier}@punjabroyalsuits.com` },
          { name: identifier },
        ],
      },
    });

    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('prs_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logAdminActivity(admin.email, 'LOGIN', 'Admin logged in', req.ip);

    res.json({
      success: true,
      message: 'Welcome back!',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('prs_admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Get Current Logged-in Admin Profile
router.get('/me', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, admin: req.admin });
});

// Update Profile or Password
router.put('/profile', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const adminId = req.admin!.id;

    const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found.' });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ success: false, message: 'Current password is required to change password.' });
        return;
      }
      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        return;
      }
      if (newPassword.length < 8) {
        res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
        return;
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.adminUser.update({
      where: { id: adminId },
      data: updateData,
      select: { id: true, email: true, name: true, role: true },
    });

    await logAdminActivity(admin.email, 'UPDATE_PROFILE', 'Updated profile/password');

    res.json({ success: true, message: 'Profile updated successfully.', admin: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
