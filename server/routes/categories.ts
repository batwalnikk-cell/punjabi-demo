import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Public: List active categories with product counts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isAvailable: true } } },
        },
      },
    });
    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: List all categories (including inactive)
router.get('/admin', authenticateAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Create Category
router.post('/', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description, imageUrl, sortOrder, isActive } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.category.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      res.status(400).json({ success: false, message: 'Category slug already exists.' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        description: description?.trim() || null,
        imageUrl: imageUrl || null,
        sortOrder: parseInt(sortOrder, 10) || 0,
        isActive: isActive !== false,
      },
    });

    await logAdminActivity(req.admin!.email, 'CREATE_CATEGORY', `Created category "${category.name}"`);

    res.status(201).json({ success: true, message: 'Category created.', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Category
router.put('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, imageUrl, sortOrder, isActive } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        slug: slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined,
        description,
        imageUrl,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    await logAdminActivity(req.admin!.email, 'UPDATE_CATEGORY', `Updated category "${category.name}"`);

    res.json({ success: true, message: 'Category updated.', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete Category
router.delete('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cat = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!cat) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    if (cat._count.products > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category with ${cat._count.products} associated products. Reassign or delete the products first.`,
      });
      return;
    }

    await prisma.category.delete({ where: { id } });
    await logAdminActivity(req.admin!.email, 'DELETE_CATEGORY', `Deleted category "${cat.name}"`);

    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
