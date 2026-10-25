import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateAdmin, logAdminActivity, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Public: List Products with filters & search
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      embroideryType,
      suitType,
      minPrice,
      maxPrice,
      availableOnly,
      featuredOnly,
      newArrivalsOnly,
      sort,
      page = '1',
      limit = '12',
    } = req.query;

    const where: any = {};

    // Search query
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { shortDescription: { contains: q } },
        { tags: { contains: q } },
        { fabric: { contains: q } },
        { color: { contains: q } },
      ];
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'all') {
      where.category = { slug: category };
    }

    // Embroidery Type filter: HANDMADE, MACHINE, MIXED
    if (embroideryType && typeof embroideryType === 'string' && embroideryType !== 'all') {
      where.embroideryType = embroideryType.toUpperCase();
    }

    // Suit Type filter: READY_MADE, UNSTITCHED, CUSTOM
    if (suitType && typeof suitType === 'string' && suitType !== 'all') {
      where.suitType = suitType.toUpperCase();
    }

    // Price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    // Availability
    if (availableOnly === 'true') {
      where.isAvailable = true;
      where.stock = { gt: 0 };
    }

    if (featuredOnly === 'true') {
      where.isFeatured = true;
    }

    if (newArrivalsOnly === 'true') {
      where.isNewArrival = true;
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'name-asc') orderBy = { name: 'asc' };
    else if (sort === 'name-desc') orderBy = { name: 'desc' };
    else if (sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * take;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: take,
        totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public: Get Single Product by Slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { priceAdjustment: 'asc' } },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isAvailable: true,
      },
      take: 4,
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    });

    res.json({ success: true, product, relatedProducts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Create Product
router.post('/', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      sku,
      shortDescription,
      fullDescription,
      categoryId,
      embroideryType,
      suitType,
      price,
      originalPrice,
      fabric,
      color,
      stock,
      isAvailable,
      isFeatured,
      isNewArrival,
      processingTime,
      shippingInfo,
      customizationAvailable,
      tags,
      disclaimer,
      seoTitle,
      seoDescription,
      videoUrl,
      images,
      variants,
    } = req.body;

    if (!name || !price || !categoryId || !embroideryType || !suitType) {
      res.status(400).json({ success: false, message: 'Please provide all required product details.' });
      return;
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const generatedSku = (sku || `PRS-${Date.now().toString().slice(-6)}`).toUpperCase();

    // Check duplicate slug/sku
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug: cleanSlug }, { sku: generatedSku }] },
    });
    if (existing) {
      res.status(400).json({ success: false, message: 'A product with this slug or SKU already exists.' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        sku: generatedSku,
        shortDescription: shortDescription || '',
        fullDescription: fullDescription || '',
        categoryId,
        embroideryType: embroideryType.toUpperCase(),
        suitType: suitType.toUpperCase(),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        fabric: fabric || 'Pure Silk',
        color: color || 'Multi',
        stock: parseInt(stock, 10) || 10,
        isAvailable: isAvailable !== false,
        isFeatured: isFeatured === true,
        isNewArrival: isNewArrival === true,
        processingTime: processingTime || '2-4 Business Days',
        shippingInfo: shippingInfo || 'Standard boutique delivery',
        customizationAvailable: customizationAvailable !== false,
        tags: tags || '',
        disclaimer: disclaimer || null,
        seoTitle: seoTitle || name,
        seoDescription: seoDescription || shortDescription,
        videoUrl: videoUrl || null,
        images: {
          create: (images || []).map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            altText: img.altText || name,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
        variants: {
          create: (variants && variants.length > 0 ? variants : [
            { size: 'Standard Size', color: color || 'Multi', stitchingOption: 'Unstitched Fabric', priceAdjustment: 0, stock: parseInt(stock, 10) || 5 }
          ]).map((v: any) => ({
            size: v.size || 'M',
            color: v.color || color || 'Default',
            stitchingOption: v.stitchingOption || 'Unstitched Fabric',
            priceAdjustment: parseFloat(v.priceAdjustment) || 0,
            stock: parseInt(v.stock, 10) || 5,
            sku: v.sku || `${generatedSku}-${(v.size || 'STD').replace(/[^a-zA-Z0-9]/g, '')}`,
          })),
        },
      },
      include: { images: true, variants: true, category: true },
    });

    await logAdminActivity(
      req.admin!.email,
      'CREATE_PRODUCT',
      `Created product "${product.name}" (SKU: ${product.sku})`
    );

    res.status(201).json({ success: true, message: 'Product created successfully.', product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update Product
router.put('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      sku,
      shortDescription,
      fullDescription,
      categoryId,
      embroideryType,
      suitType,
      price,
      originalPrice,
      fabric,
      color,
      stock,
      isAvailable,
      isFeatured,
      isNewArrival,
      processingTime,
      shippingInfo,
      customizationAvailable,
      tags,
      disclaimer,
      seoTitle,
      seoDescription,
      videoUrl,
      images,
      variants,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      res.status(400).json({ success: false, message: 'Price must be a valid non-negative number.' });
      return;
    }
    if (stock !== undefined && (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0)) {
      res.status(400).json({ success: false, message: 'Stock must be a non-negative integer.' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Update images if provided
      if (images && Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            url: typeof img === 'string' ? img : img.url,
            altText: img.altText || name || existingProduct.name,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        });
      }

      // Update variants if provided
      if (variants && Array.isArray(variants)) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: id,
            size: v.size || 'M',
            color: v.color || color || existingProduct.color,
            stitchingOption: v.stitchingOption || 'Unstitched Fabric',
            priceAdjustment: parseFloat(v.priceAdjustment) || 0,
            stock: parseInt(v.stock, 10) || 5,
            sku: v.sku || `${existingProduct.sku}-${(v.size || 'VAR').replace(/[^a-zA-Z0-9]/g, '')}`,
          })),
        });
      }

      return tx.product.update({
        where: { id },
        data: {
          name,
          slug: slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined,
          sku: sku?.toUpperCase(),
          shortDescription,
          fullDescription,
          categoryId,
          embroideryType: embroideryType?.toUpperCase(),
          suitType: suitType?.toUpperCase(),
          price: price !== undefined ? parseFloat(price) : undefined,
          originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
          fabric,
          color,
          stock: stock !== undefined ? parseInt(stock, 10) : undefined,
          isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
          isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : undefined,
          processingTime,
          shippingInfo,
          customizationAvailable: customizationAvailable !== undefined ? Boolean(customizationAvailable) : undefined,
          tags,
          disclaimer,
          seoTitle,
          seoDescription,
          videoUrl,
        },
        include: { images: true, variants: true, category: true },
      });
    });

    await logAdminActivity(
      req.admin!.email,
      'UPDATE_PRODUCT',
      `Updated product "${updated.name}" (SKU: ${updated.sku})`
    );

    res.json({ success: true, message: 'Product updated successfully.', product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete Product
router.delete('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    await prisma.product.delete({ where: { id } });

    await logAdminActivity(
      req.admin!.email,
      'DELETE_PRODUCT',
      `Deleted product "${product.name}" (SKU: ${product.sku})`
    );

    res.json({ success: true, message: `Product "${product.name}" deleted successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Duplicate Product
router.post('/:id/duplicate', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const original = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });

    if (!original) {
      res.status(404).json({ success: false, message: 'Original product not found.' });
      return;
    }

    const uniqueTag = Date.now().toString().slice(-4);
    const newName = `${original.name} (Copy ${uniqueTag})`;
    const newSlug = `${original.slug}-copy-${uniqueTag}`;
    const newSku = `${original.sku}-CPY${uniqueTag}`;

    const duplicated = await prisma.product.create({
      data: {
        name: newName,
        slug: newSlug,
        sku: newSku,
        shortDescription: original.shortDescription,
        fullDescription: original.fullDescription,
        categoryId: original.categoryId,
        embroideryType: original.embroideryType,
        suitType: original.suitType,
        price: original.price,
        originalPrice: original.originalPrice,
        fabric: original.fabric,
        color: original.color,
        stock: original.stock,
        isAvailable: false, // Default to draft/unavailable until reviewed
        isFeatured: false,
        isNewArrival: false,
        processingTime: original.processingTime,
        shippingInfo: original.shippingInfo,
        customizationAvailable: original.customizationAvailable,
        tags: original.tags,
        disclaimer: original.disclaimer,
        images: {
          create: original.images.map((img) => ({
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
        variants: {
          create: original.variants.map((v) => ({
            size: v.size,
            color: v.color,
            stitchingOption: v.stitchingOption,
            priceAdjustment: v.priceAdjustment,
            stock: v.stock,
            sku: `${newSku}-${v.size.replace(/[^a-zA-Z0-9]/g, '')}`,
          })),
        },
      },
      include: { images: true, variants: true, category: true },
    });

    await logAdminActivity(
      req.admin!.email,
      'DUPLICATE_PRODUCT',
      `Duplicated "${original.name}" to "${duplicated.name}"`
    );

    res.status(201).json({ success: true, message: 'Product duplicated successfully.', product: duplicated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Toggle Featured status
router.patch('/:id/toggle-featured', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    const updated = await prisma.product.update({
      where: { id },
      data: { isFeatured: !prod.isFeatured },
    });
    res.json({ success: true, isFeatured: updated.isFeatured });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Toggle Availability
router.patch('/:id/toggle-availability', authenticateAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const prod = await prisma.product.findUnique({ where: { id } });
    if (!prod) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    const updated = await prisma.product.update({
      where: { id },
      data: { isAvailable: !prod.isAvailable },
    });
    res.json({ success: true, isAvailable: updated.isAvailable });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
