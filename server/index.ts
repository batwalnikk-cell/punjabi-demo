import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

import authRouter from './routes/auth';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import ordersRouter from './routes/orders';
import customInquiriesRouter from './routes/customInquiries';
import settingsRouter from './routes/settings';
import homepageRouter from './routes/homepage';
import policiesRouter from './routes/policies';
import couponsRouter from './routes/coupons';
import reviewsRouter from './routes/reviews';
import newsletterRouter from './routes/newsletter';
import mediaRouter from './routes/media';
import analyticsRouter from './routes/analytics';
import logsRouter from './routes/logs';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev servers or same-origin
      if (!origin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directories
const uploadsDir = path.resolve(process.cwd(), 'uploads');
const publicDir = path.resolve(process.cwd(), 'public');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(path.join(publicDir, 'assets')));

// Rate Limiter for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter for Order Checkout (Anti-spam / Anti-overselling)
const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 checkout attempts per 10 mins
  message: { success: false, message: 'Too many checkout requests. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter for Custom Embroidery Inquiries
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { success: false, message: 'Too many inquiry submissions. Please wait a few minutes before submitting again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter for Newsletter Signups
const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many newsletter requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount API Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', checkoutLimiter, ordersRouter);
app.use('/api/custom-inquiries', inquiryLimiter, customInquiriesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/homepage', homepageRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/newsletter', newsletterLimiter, newsletterRouter);
app.use('/api/media', mediaRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/logs', logsRouter);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    store: 'Punjab Royal Suits API',
  });
});

// Production: Serve Frontend SPA Build
const clientDist = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`👑 Punjab Royal Suits Backend Server running on http://localhost:${PORT}`);
});

export default app;
