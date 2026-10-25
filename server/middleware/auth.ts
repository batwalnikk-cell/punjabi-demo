import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'punjab_royal_suits_jwt_fallback_secret_2026';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.prs_admin_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!admin || !admin.isActive) {
      res.status(403).json({ success: false, message: 'Account is inactive or does not exist.' });
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    return;
  }
};

export const logAdminActivity = async (
  adminEmail: string,
  action: string,
  details: string,
  ipAddress?: string
) => {
  try {
    await prisma.adminActivityLog.create({
      data: {
        adminEmail,
        action,
        details,
        ipAddress: ipAddress || 'Internal',
      },
    });
  } catch (err) {
    console.error('Failed to log admin activity:', err);
  }
};
