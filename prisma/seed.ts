import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Punjab Royal Suits database...');

  // 1. Initial Admin User
  const adminPassword = await bcrypt.hash('nikk3344', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'nikk' },
    update: { passwordHash: adminPassword },
    create: {
      email: 'nikk',
      passwordHash: adminPassword,
      name: 'nikk',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('Admin account ready: nikk / nikk3344');

  // 2. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'PUNJAB ROYAL SUITS',
      tagline: 'Exquisite Punjabi Suits & Royal Craftsmanship',
      businessEmail: 'contact@punjabroyalsuits.com',
      phone: '+91 98765 43210',
      whatsappNumber: '+91 98765 43210',
      address: 'Heritage Chowk, Near Golden Temple, Amritsar, Punjab, India',
      currencyCode: 'INR',
      currencySymbol: '₹',
      freeShippingThreshold: 2999,
      standardShippingFee: 150,
      taxPercentage: 5.0,
      enableCOD: true,
      enableOnlinePayment: true,
      manualUpiId: 'punjabroyalsuits@upi',
      announcementText: '✨ Festive Elegance: Complimentary Custom Fitting on orders above ₹4,999! Express Shipping Across India & Worldwide.',
      showAnnouncement: true,
      isMaintenanceMode: false,
      instagramUrl: 'https://instagram.com/punjabroyalsuits',
      facebookUrl: 'https://facebook.com/punjabroyalsuits',
    },
  });

  // 3. Homepage Content
  await prisma.homepageContent.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroTitle: 'Royal Punjabi Elegance, Handcrafted with Heritage',
      heroSubtitle: 'Discover heirloom Phulkari, intricate Zardozi, and contemporary Punjabi silhouettes tailored for weddings, festive galas, and timeless elegance.',
      heroBannerUrl: '/assets/hero_punjabi_suit.jpg',
      heroCtaText: 'Explore Collection',
      heroCtaLink: '/shop',
      secondaryCtaText: 'Custom Embroidery Order',
      secondaryCtaLink: '/custom-orders',
      brandStoryTitle: 'Preserving the Royal Art of Punjabi Needlework',
      brandStoryText: 'At Punjab Royal Suits, every ensemble is a tribute to centuries-old Punjabi sartorial royalty. Rooted in the artisan traditions of Amritsar, Patiala, and Ludhiana, our master craftsmen hand-weave intricate Zardozi, Resham threadwork, Gota Patti, and traditional Phulkari motifs onto the finest pure silks, georgettes, and chanderis.',
      brandStoryImage: '/assets/artisan_craft.jpg',
      comparisonTitle: 'Handmade vs Machine Embroidery: Craftsmanship Guide',
      handmadeDescription: 'Each handmade motif is painstakingly created by master artisans over days or weeks using traditional needlework, wooden embroidery frames (Adda), and fine gold & silk threads. Every piece possesses unique human character and heirloom value.',
      machineDescription: 'High-precision computerized multi-head embroidery ensures exact symmetry, crisp borders, and durable thread retention at accessible price points, perfect for contemporary festive and everyday ethnic elegance.',
      customBannerTitle: 'Have a Dream Punjabi Suit in Mind?',
      customBannerText: 'From bespoke bridal lehenga-suits to personalized color palettes and custom embroidery patterns, our master designers bring your vision to life.',
    },
  });

  // 4. Policies
  const policies = [
    {
      slug: 'disclaimer',
      title: 'General Disclaimer & Product Authenticity',
      content: `Welcome to Punjab Royal Suits. Please review the following disclaimers regarding our products:

1. Color Accuracy: Product colors and hues displayed on our website may vary slightly depending on your monitor settings, device brightness, and color calibration. While we strive to photograph our collections under balanced natural daylight studio lighting, subtle shifts can occur.
2. Artisanal Nature: Our collections celebrate traditional Indian textile craftsmanship. Minor variations in dye lots, weave textures, and thread placements are intrinsic characteristics of authentic ethnic fabrics.
3. Pricing & Availability: All prices are listed in Indian Rupees (INR) and are inclusive or exclusive of taxes as indicated during checkout. Stock status is updated in real time, but during peak wedding seasons, rare inventory overlaps may occur.`,
    },
    {
      slug: 'handmade-disclaimer',
      title: 'Handmade Embroidery Disclaimer',
      content: `Our handmade embroidery suits (including Zardozi, Gota Patti, Adda needlework, Dabka, Tilla, and Phulkari) are crafted individually by master artisans with decades of inherited heritage:

- Handcrafted Uniqueness: Because every stitch is placed by hand, no two suits are 100% identical. Minor irregularities in bead placement, sequin alignment, or thread knots are hallmarks of genuine manual artistry, not manufacturing defects.
- Fabric Care: Due to the delicate nature of real metallic threads and silk embroidery, handmade suits must strictly be professionally dry cleaned. Avoid direct spraying of perfume or moisture onto metallic zari work.`,
    },
    {
      slug: 'machine-disclaimer',
      title: 'Machine Embroidery Information',
      content: `Our machine-embroidered collections feature cutting-edge multi-head computerized embroidery:

- Precision & Consistency: Machine embroidery offers crisp mathematical symmetry, flawless repetitive geometric borders, and reinforced lock-stitch durability.
- Value & Everyday Elegance: Ideal for lightweight daily wear, office festive celebrations, and contemporary ethnic gatherings where easy care and sharp aesthetics are desired.`,
    },
    {
      slug: 'shipping-policy',
      title: 'Shipping & Delivery Policy',
      content: `We ship across all pin codes in India and offer worldwide delivery:

- Processing Time: Ready-to-ship suits are dispatched within 2-3 business days. Semi-stitched or unstitched sets ship within 24-48 hours. Custom tailored orders require 7-14 business days.
- Delivery Timelines: Domestic metro orders typically arrive in 3-5 business days. Non-metro locations take 5-7 business days. International orders take 7-10 business days via DHL/FedEx Express.
- Free Shipping: Orders totaling ₹2,999 or more qualify for free standard domestic shipping. A flat fee of ₹150 applies for orders below this threshold.
- Tracking: A tracking number is shared via SMS and email upon courier handover.`,
    },
    {
      slug: 'return-policy',
      title: 'Return & Exchange Policy',
      content: `Customer satisfaction is our utmost priority:

- Unstitched & Standard Ready-to-Wear Suits: Eligible for exchange or return within 7 calendar days of delivery, provided the garment is unworn, unwashed, unaltered, and all original security tags and packaging remain intact.
- Custom Tailored / Bespoke Embroidery Orders: Because custom garments are tailored to individual body measurements and custom embroidery specifications, they are non-returnable and non-refundable unless there is a verified craftsmanship defect.
- Return Process: To initiate a return, contact our support team at contact@punjabroyalsuits.com or via WhatsApp with your Order ID and photo proof.`,
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: `Punjab Royal Suits respects your personal privacy. We collect personal information (name, address, phone number, and email) solely for fulfilling orders, managing customer support inquiries, and delivering a personalized boutique experience. We never sell, rent, or trade your personal data with third-party advertising brokers. Payment processing is handled through secure encrypted gateway partners complying with RBI regulations.`,
    },
    {
      slug: 'terms-and-conditions',
      title: 'Terms and Conditions',
      content: `By browsing or placing an order on Punjab Royal Suits, you agree to our terms of service. Orders are subject to inventory verification and fraud screening. We reserve the right to cancel any suspicious or unauthorized transactions. Intellectual property including brand photographs, logos, suit designs, and descriptive texts are exclusively owned by Punjab Royal Suits.`,
    },
    {
      slug: 'custom-order-terms',
      title: 'Custom Embroidery & Bespoke Tailoring Terms',
      content: `For customers commissioning personalized bespoke Punjabi suits:

1. Consultation & Design Approval: We confirm all fabric choices, color swatches, and embroidery motifs with you via WhatsApp or video consultation before cutting begins.
2. Measurements: Accurate measurements must be provided using our boutique measurement guide. We provide a 2-inch inner margin on all stitched suits to allow future alterations.
3. Advance Payment: Bespoke orders require a minimum 50% advance booking deposit, with the remaining balance due prior to dispatch.`,
    },
  ];

  for (const pol of policies) {
    await prisma.policy.upsert({
      where: { slug: pol.slug },
      update: { title: pol.title, content: pol.content },
      create: pol,
    });
  }

  // 5. Categories
  const catData = [
    {
      name: 'Handmade Embroidery Suits',
      slug: 'handmade-embroidery',
      description: 'Exclusive Punjabi suits with authentic hand needlework: Zardozi, Gota Patti, Adda work, and Phulkari.',
      imageUrl: '/assets/artisan_craft.jpg',
      sortOrder: 1,
    },
    {
      name: 'Machine Embroidery Suits',
      slug: 'machine-embroidery',
      description: 'High-precision computerized embroidery on georgette, organza, and cotton silks for effortless charm.',
      imageUrl: '/assets/machine_craft.jpg',
      sortOrder: 2,
    },
    {
      name: 'Ready-Made Punjabi Suits',
      slug: 'ready-made-suits',
      description: 'Pre-stitched authentic Patiala salwar kameez, straight cut suits, and Pakistani silhouette suits.',
      imageUrl: '/assets/mustard_suit.jpg',
      sortOrder: 3,
    },
    {
      name: 'Unstitched Suit Sets',
      slug: 'unstitched-suit-sets',
      description: 'Premium 3-piece unstitched fabric sets featuring pure silk, organza, or chanderi dupattas.',
      imageUrl: '/assets/hero_punjabi_suit.jpg',
      sortOrder: 4,
    },
    {
      name: 'Wedding & Bridal Wear',
      slug: 'wedding-bridal',
      description: 'Heavy heirloom bridal suits in royal velvet, raw silk, and pure tissue for the Punjabi bride.',
      imageUrl: '/assets/navy_velvet_suit.jpg',
      sortOrder: 5,
    },
    {
      name: 'Festive Collection',
      slug: 'festive-collection',
      description: 'Vibrant celebratory suits adorned with mirror-work, resham thread, and scalloped dupattas.',
      imageUrl: '/assets/pink_organza_suit.jpg',
      sortOrder: 6,
    },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of catData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoriesMap[cat.slug] = c.id;
  }

  // 6. Products
  const products = [
    {
      name: 'Royal Emerald Hand-Embroidered Zardozi Suit',
      slug: 'royal-emerald-zardozi-suit',
      sku: 'PRS-HE-001',
      shortDescription: 'Regal emerald green pure Chanderi silk suit with intricate antique gold Zardozi neck work and heavy Gota dupatta.',
      fullDescription: 'Crafted for the royal Punjabi woman, this emerald green ensemble features pure Chanderi silk kurti lavishly embellished with authentic handmade Zardozi, French wire needlework, and Dabka motifs across the neckline and cuffs. Paired with a tailored cigarette pant or traditional salwar and a hand-worked organza dupatta bordered with antique Gota Patti.',
      categoryId: categoriesMap['handmade-embroidery'],
      embroideryType: 'HANDMADE',
      suitType: 'READY_MADE',
      price: 8499,
      originalPrice: 10999,
      fabric: 'Pure Chanderi Silk with Pure Organza Dupatta',
      color: 'Emerald Green',
      stock: 8,
      isAvailable: true,
      isFeatured: true,
      isNewArrival: true,
      processingTime: '2-3 Business Days',
      shippingInfo: 'Complimentary Express Shipping Across India',
      customizationAvailable: true,
      tags: 'handmade, zardozi, emerald green, silk, wedding, festive',
      disclaimer: 'Pure handmade Zardozi; slight artistic variations enhance authentic craftsmanship.',
      seoTitle: 'Emerald Green Hand-Embroidered Zardozi Punjabi Suit | Punjab Royal Suits',
      seoDescription: 'Shop pure Chanderi silk emerald green Punjabi suit with authentic antique gold hand Zardozi embroidery and heavy dupatta.',
      image: '/assets/emerald_suit.jpg',
      variants: [
        { size: 'S (36)', color: 'Emerald Green', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 2 },
        { size: 'M (38)', color: 'Emerald Green', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 3 },
        { size: 'L (40)', color: 'Emerald Green', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 2 },
        { size: 'XL (42)', color: 'Emerald Green', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 1 },
      ],
    },
    {
      name: 'Heritage Amritsari Phulkari Silk Patiala Suit',
      slug: 'heritage-phulkari-patiala-suit',
      sku: 'PRS-HE-002',
      shortDescription: 'Iconic mustard yellow pure silk Patiala salwar suit with vibrant geometric hand Phulkari and mirror-work dupatta.',
      fullDescription: 'Celebrating authentic Punjabi heritage, this radiant mustard yellow suit is adorned with genuine traditional Phulkari silk needlework. The kurti features mirror accents and subtle hem borders, accompanied by an authentic voluminous 4.5-meter pleated Patiala salwar and an opulent heavy Bagh-style embroidered dupatta.',
      categoryId: categoriesMap['handmade-embroidery'],
      embroideryType: 'HANDMADE',
      suitType: 'READY_MADE',
      price: 7299,
      originalPrice: 8999,
      fabric: 'Pure Mulberry Silk with Georgette Phulkari Dupatta',
      color: 'Mustard Gold',
      stock: 12,
      isAvailable: true,
      isFeatured: true,
      isNewArrival: false,
      processingTime: '1-2 Business Days',
      shippingInfo: 'Ships within 48 hours',
      customizationAvailable: true,
      tags: 'phulkari, patiala suit, handmade, mustard yellow, sangeet, baisakhi',
      disclaimer: 'Each Phulkari dupatta is hand-stitched by Punjabi village craftswomen with fine silk threads.',
      seoTitle: 'Mustard Yellow Pure Silk Phulkari Patiala Suit | Punjab Royal Suits',
      seoDescription: 'Authentic Amritsari hand Phulkari silk Patiala suit with heavy mirror-work dupatta and traditional pleated salwar.',
      image: '/assets/mustard_suit.jpg',
      variants: [
        { size: 'S (36)', color: 'Mustard Gold', stitchingOption: 'Patiala Salwar Stitched', priceAdjustment: 0, stock: 3 },
        { size: 'M (38)', color: 'Mustard Gold', stitchingOption: 'Patiala Salwar Stitched', priceAdjustment: 0, stock: 4 },
        { size: 'L (40)', color: 'Mustard Gold', stitchingOption: 'Patiala Salwar Stitched', priceAdjustment: 0, stock: 3 },
        { size: 'XL (42)', color: 'Mustard Gold', stitchingOption: 'Patiala Salwar Stitched', priceAdjustment: 0, stock: 2 },
      ],
    },
    {
      name: 'Blush Pink Organza Machine Ari Embroidered Suit',
      slug: 'blush-pink-organza-ari-suit',
      sku: 'PRS-ME-003',
      shortDescription: 'Delicate pastel pink organza suit with computerized multi-needle floral Ari threadwork, pearl edges, and scalloped dupatta.',
      fullDescription: 'A dreamy modern silhouette tailored in ethereal glass organza. Features computerized high-density floral Ari embroidery along the neckline, front panel, and scalloped sleeves. Comes complete with a soft santoon inner lining, straight palazzo pants, and a scalloped embroidered organza dupatta with subtle pearl droplets.',
      categoryId: categoriesMap['machine-embroidery'],
      embroideryType: 'MACHINE',
      suitType: 'READY_MADE',
      price: 5499,
      originalPrice: 6499,
      fabric: 'Sheer Glass Organza with Santoon Silk Lining',
      color: 'Blush Pink',
      stock: 15,
      isAvailable: true,
      isFeatured: true,
      isNewArrival: true,
      processingTime: '2-3 Business Days',
      shippingInfo: 'Express Delivery Available',
      customizationAvailable: false,
      tags: 'machine embroidery, organza, pastel pink, party wear, scalloped dupatta',
      disclaimer: 'Reinforced computerized embroidery for enhanced durability and snag resistance.',
      seoTitle: 'Blush Pink Organza Embroidered Punjabi Suit | Punjab Royal Suits',
      seoDescription: 'Elegant pastel pink organza Punjabi suit with fine machine Ari embroidery, scalloped borders, and cigarette pants.',
      image: '/assets/pink_organza_suit.jpg',
      variants: [
        { size: 'XS (34)', color: 'Blush Pink', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 3 },
        { size: 'S (36)', color: 'Blush Pink', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 4 },
        { size: 'M (38)', color: 'Blush Pink', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 5 },
        { size: 'L (40)', color: 'Blush Pink', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 3 },
      ],
    },
    {
      name: 'Royal Midnight Navy Velvet Wedding Salwar Suit',
      slug: 'royal-navy-velvet-wedding-suit',
      sku: 'PRS-HE-004',
      shortDescription: 'Opulent midnight blue micro-velvet bridal suit with heavy gold Tilla needlework, Dabka embroidery, and rich velvet dupatta.',
      fullDescription: 'The pinnacle of winter wedding grandeur. Handcrafted on lush 9000-grade micro-velvet, this regal navy suit is encrusted with antique gold Dabka, shimmering sequins, and traditional Tilla embroidery. The extended kurti boasts heavy daman borders, paired with a matching embroidered velvet salwar and a masterfully bordered dupatta.',
      categoryId: categoriesMap['wedding-bridal'],
      embroideryType: 'HANDMADE',
      suitType: 'READY_MADE',
      price: 12999,
      originalPrice: 15999,
      fabric: 'Premium 9000 Micro Velvet with Tissue Silk Accents',
      color: 'Midnight Navy Blue',
      stock: 6,
      isAvailable: true,
      isFeatured: true,
      isNewArrival: true,
      processingTime: '3-4 Business Days',
      shippingInfo: 'Insured Premium Courier Delivery',
      customizationAvailable: true,
      tags: 'bridal, wedding, velvet, navy blue, tilla embroidery, winter suit',
      disclaimer: 'Micro velvet should be stored in breathable muslin bags and dry cleaned exclusively.',
      seoTitle: 'Royal Navy Velvet Bridal Punjabi Suit | Punjab Royal Suits',
      seoDescription: 'Regal midnight navy micro-velvet wedding Punjabi suit with handmade antique gold Dabka and Tilla embroidery.',
      image: '/assets/navy_velvet_suit.jpg',
      variants: [
        { size: 'S (36)', color: 'Midnight Navy Blue', stitchingOption: 'Boutique Tailored Stitched', priceAdjustment: 0, stock: 2 },
        { size: 'M (38)', color: 'Midnight Navy Blue', stitchingOption: 'Boutique Tailored Stitched', priceAdjustment: 0, stock: 2 },
        { size: 'L (40)', color: 'Midnight Navy Blue', stitchingOption: 'Boutique Tailored Stitched', priceAdjustment: 0, stock: 1 },
        { size: 'Custom Fit', color: 'Midnight Navy Blue', stitchingOption: 'Custom Measurements Fitting', priceAdjustment: 500, stock: 1 },
      ],
    },
    {
      name: 'Maroon Royal Heirloom Unstitched Chanderi Suit Set',
      slug: 'maroon-heirloom-unstitched-suit',
      sku: 'PRS-UN-005',
      shortDescription: 'Luxurious unstitched 3-piece Chanderi silk suit set with intricate Zardozi neckline and heavy woven Banarasi border dupatta.',
      fullDescription: 'For those who prefer tailoring to their personal measurements, this unstitched set provides 2.5 meters of pure Chanderi silk kurti fabric with pre-embroidered Zardozi neckline, 3 meters of pure cotton silk bottom fabric (ideal for Patiala salwar, churidar, or trousers), and 2.5 meters of heavy woven zari dupatta.',
      categoryId: categoriesMap['unstitched-suit-sets'],
      embroideryType: 'HANDMADE',
      suitType: 'UNSTITCHED',
      price: 6499,
      originalPrice: 7999,
      fabric: 'Pure Chanderi Silk Shirt, Cotton-Silk Bottom, Woven Zari Dupatta',
      color: 'Royal Maroon',
      stock: 14,
      isAvailable: true,
      isFeatured: true,
      isNewArrival: false,
      processingTime: '24-48 Hours',
      shippingInfo: 'Fast dispatch nationwide',
      customizationAvailable: true,
      tags: 'unstitched, chanderi, maroon, zardozi, festive, tailor yourself',
      disclaimer: 'Fabric length is generously sized for heights up to 5 ft 10 in with heavy gathers.',
      seoTitle: 'Royal Maroon Unstitched Chanderi Silk Suit Set | Punjab Royal Suits',
      seoDescription: 'Buy 3-piece unstitched Chanderi silk Punjabi suit set with hand-worked Zardozi yoke and Banarasi dupatta.',
      image: '/assets/hero_punjabi_suit.jpg',
      variants: [
        { size: 'Unstitched (3-Piece Fabric)', color: 'Royal Maroon', stitchingOption: 'Unstitched Fabric', priceAdjustment: 0, stock: 10 },
        { size: 'Custom Stitched by Boutique', color: 'Royal Maroon', stitchingOption: 'Custom Tailoring Service', priceAdjustment: 1200, stock: 4 },
      ],
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      const prod = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          shortDescription: p.shortDescription,
          fullDescription: p.fullDescription,
          categoryId: p.categoryId,
          embroideryType: p.embroideryType,
          suitType: p.suitType,
          price: p.price,
          originalPrice: p.originalPrice,
          fabric: p.fabric,
          color: p.color,
          stock: p.stock,
          isAvailable: p.isAvailable,
          isFeatured: p.isFeatured,
          isNewArrival: p.isNewArrival,
          processingTime: p.processingTime,
          shippingInfo: p.shippingInfo,
          customizationAvailable: p.customizationAvailable,
          tags: p.tags,
          disclaimer: p.disclaimer,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          images: {
            create: [
              {
                url: p.image,
                altText: p.name,
                isPrimary: true,
                sortOrder: 0,
              },
            ],
          },
          variants: {
            create: p.variants.map((v) => ({
              size: v.size,
              color: v.color,
              stitchingOption: v.stitchingOption,
              priceAdjustment: v.priceAdjustment,
              stock: v.stock,
              sku: `${p.sku}-${v.size.replace(/[^a-zA-Z0-9]/g, '')}`,
            })),
          },
        },
      });
      console.log('Created product:', prod.name);
    }
  }

  // 7. Coupons
  await prisma.coupon.upsert({
    where: { code: 'ROYAL10' },
    update: {},
    create: {
      code: 'ROYAL10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 2999,
      maxDiscount: 1000,
      usageLimit: 200,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME500' },
    update: {},
    create: {
      code: 'WELCOME500',
      discountType: 'FIXED',
      discountValue: 500,
      minOrderAmount: 3999,
      usageLimit: 150,
      isActive: true,
    },
  });

  // 8. Verified Reviews
  const reviewsCount = await prisma.review.count();
  if (reviewsCount === 0) {
    const reviews = [
      {
        customerName: 'Simran Kaur Grewal',
        customerCity: 'Chandigarh',
        rating: 5,
        comment: 'Ordered the Royal Emerald Zardozi suit for my brother’s engagement. The needlework is genuinely authentic and the fitting was immaculate right out of the box! Truly royal quality.',
        isVerified: true,
        isPublished: true,
      },
      {
        customerName: 'Harpreet Dhillon',
        customerCity: 'London, UK',
        rating: 5,
        comment: 'I live in the UK and was skeptical about ordering online. The team confirmed my measurements via WhatsApp, and the Phulkari Patiala suit arrived in 6 days. Outstanding craftsmanship.',
        isVerified: true,
        isPublished: true,
      },
      {
        customerName: 'Jasleen Cheema',
        customerCity: 'Amritsar',
        rating: 5,
        comment: 'You can clearly tell the difference in their pure Chanderi silk fabric. Delicate zari work that doesn’t irritate the skin at all. Highly recommended boutique.',
        isVerified: true,
        isPublished: true,
      },
    ];

    for (const r of reviews) {
      await prisma.review.create({ data: r });
    }
  }

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
