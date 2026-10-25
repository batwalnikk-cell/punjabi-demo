import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const uploadsDir = path.resolve(process.cwd(), 'uploads');
const assetsDir = path.resolve(process.cwd(), 'public', 'assets');

// Admin: Upload Media File (Single or Multiple)
router.post(
  '/upload',
  authenticateAdmin,
  upload.array('images', 10),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'No image file uploaded.' });
        return;
      }

      const uploadedFiles = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      }));

      await logAdminActivity(
        req.admin!.email,
        'UPLOAD_MEDIA',
        `Uploaded ${files.length} media file(s)`
      );

      res.status(201).json({
        success: true,
        message: 'File(s) uploaded successfully.',
        files: uploadedFiles,
        // Also support single file upload response
        url: uploadedFiles[0].url,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Admin: List Media Library
router.get('/', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const mediaList: any[] = [];

    // 1. Files in uploads/
    if (fs.existsSync(uploadsDir)) {
      const uploadFiles = fs.readdirSync(uploadsDir);
      for (const file of uploadFiles) {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          mediaList.push({
            url: `/uploads/${file}`,
            filename: file,
            size: stats.size,
            updatedAt: stats.mtime,
            type: 'uploaded',
          });
        }
      }
    }

    // 2. Built-in sample assets in public/assets/
    if (fs.existsSync(assetsDir)) {
      const assetFiles = fs.readdirSync(assetsDir);
      for (const file of assetFiles) {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          mediaList.push({
            url: `/assets/${file}`,
            filename: file,
            size: stats.size,
            updatedAt: stats.mtime,
            type: 'asset',
          });
        }
      }
    }

    mediaList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    res.json({ success: true, media: mediaList });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete Media File
router.delete('/:filename', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const cleanFilename = path.basename(filename);
    const targetPath = path.join(uploadsDir, cleanFilename);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      await logAdminActivity(req.admin!.email, 'DELETE_MEDIA', `Deleted file ${cleanFilename}`);
      res.json({ success: true, message: 'File deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'File not found in uploaded media.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
