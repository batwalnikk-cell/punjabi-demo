# 👑 Punjab Royal Suits — Luxury Punjabi Suit Boutique & E-Commerce Platform

A production-ready full-stack e-commerce web application engineered for luxury Punjabi suit boutiques specializing in:
1. **Handmade Punjabi suit embroidery** (Phulkari, Zardozi, Resham, Tilla, Dabka, Gota Patti).
2. **Machine embroidery on Punjabi suits** (Multi-head high-precision floral, geometric, and border threadwork).
3. **Ready-made Punjabi suits** (Anarkali, Patiala salwar kameez, Straight cut, Sharara & Gharara suits).
4. **Bespoke custom-designed suits & custom embroidery orders** (Photo upload, fabric preferences, custom dimensions, and direct WhatsApp consultations).
5. **Traditional Punjabi fashion, bridal wear, and festive boutique collections**.

---

## 🌟 Architecture & Design Direction

- **Brand Aesthetic:** Warm ivory & cream backgrounds (`#FAF8F5`, `#F5EFEB`), deep royal maroon & burgundy accents (`#721224`), antique gold details (`#C5A059`), refined typography pairing classical serif headings (*Cormorant Garamond*) with crisp modern body (*Plus Jakarta Sans*).
- **Configurable Store Identity:** The store name, tagline, logo, phone, official WhatsApp number, delivery fees, and taxes are completely configurable via the **Private Admin Dashboard** without touching code.
- **Server Recalculated Pricing:** Absolute protection against client-side tampering. Coupons, tax rates, shipping thresholds, and order totals are recalculated and validated server-side.
- **Atomic Stock Decrements:** Concurrency-safe order checkout preventing inventory overselling.
- **Persistent Media Library:** Secure image uploads using Multer with strict MIME and file-extension verification stored under `/uploads`.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | **React 19 (Vite)** | Modular component architecture, modern hooks, responsive CSS design tokens |
| **Icons & Typography** | **Lucide Icons & Google Fonts** | Cormorant Garamond (headings) & Plus Jakarta Sans (body) |
| **Backend Server** | **Express.js (Node.js)** | RESTful API architecture, JSON Web Token (JWT) session security, Multer media pipeline |
| **Database & ORM** | **Prisma 5 ORM & SQLite / PostgreSQL** | Relational schemas with migrations, foreign keys, cascades, and indexes |
| **Testing** | **Vitest & Supertest** | 13 automated integration tests verifying security, order integrity, and stock rules |

---

## 📁 Project Directory Structure

```text
CineBox/
├── dist/                     # Optimized production frontend build
├── prisma/
│   ├── schema.prisma         # Relational database models (Admin, Products, Orders, etc.)
│   ├── seed.ts               # Database seed script for development
│   └── dev.db                # Persistent SQLite database (or Postgres connection)
├── public/
│   ├── assets/               # Signature boutique fashion photography assets
│   ├── robots.txt            # Search engine crawling rules (admin protected)
│   └── sitemap.xml           # XML sitemap for SEO discovery
├── server/
│   ├── db.ts                 # Prisma singleton instance
│   ├── index.ts              # Express server entry point & SPA fallback
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication & admin audit logger
│   │   └── upload.ts         # Multer secure image upload handler
│   └── routes/               # Modular REST API endpoints
│       ├── auth.ts           # Login, logout, setup, admin profile
│       ├── products.ts       # Product CRUD, filters, search, slug
│       ├── categories.ts     # Category management with safety guards
│       ├── orders.ts         # Server-verified order checkout & status tracking
│       ├── customInquiries.ts# Bespoke suit inquiry with reference uploads
│       ├── settings.ts       # Store settings & brand identity CMS
│       ├── homepage.ts       # Visual homepage content manager
│       ├── policies.ts       # Rich disclaimer & policy documents
│       ├── coupons.ts        # Discount rules & code validator
│       ├── reviews.ts        # Customer reviews & moderation
│       ├── newsletter.ts     # Email subscriber management
│       ├── media.ts          # Uploaded media gallery & deletion
│       ├── analytics.ts      # Dashboard metrics & revenue calculation
│       └── logs.ts           # Admin activity audit trail
├── src/
│   ├── admin/                # Private Boutique Admin Dashboard
│   │   ├── AdminDashboard.jsx
│   │   ├── ProductsManagement.jsx
│   │   ├── ProductForm.jsx
│   │   ├── CategoriesManagement.jsx
│   │   ├── OrdersManagement.jsx
│   │   ├── CustomInquiriesManagement.jsx
│   │   ├── InventoryManagement.jsx
│   │   ├── HomepageManagement.jsx
│   │   ├── ImageManagement.jsx
│   │   ├── DiscountsManagement.jsx
│   │   ├── PoliciesManagement.jsx
│   │   ├── StoreSettings.jsx
│   │   ├── ActivityLogs.jsx
│   │   └── AdminProfile.jsx
│   ├── components/           # Reusable UI components (ProductCard, CartDrawer, etc.)
│   ├── context/              # StoreSettings, Cart, Wishlist, AdminAuth contexts
│   ├── layouts/              # MainLayout (storefront) & AdminLayout (admin dashboard)
│   ├── pages/                # Public storefront pages (Home, Shop, ProductDetails, etc.)
│   ├── services/             # Unified API client layer
│   └── styles/               # CSS variables, global rules, component & responsive styles
├── test/
│   └── ecommerce.test.ts     # Comprehensive automated test suite
├── uploads/                  # Persistent disk storage for uploaded product photos
├── .env.example              # Environment variables template
├── package.json              # NPM dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build and proxy configuration
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** v18+ or v20+ (v24 compatible)
- **NPM** v9+

### 1. Clone & Install Dependencies
```bash
git clone <repository_url>
cd CineBox
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="your_production_secure_jwt_secret_change_me"
NODE_ENV="development"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
```

### 3. Initialize Database & Seed Development Catalog
```bash
# Push database schema to create tables
npm run db:push

# Populate sample boutique catalog, initial super admin, policies & settings
npm run seed
```

### 4. Start the Application in Development
```bash
npm run dev
```
- **Storefront URL:** [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔐 Initial Admin Account Setup

The Super Administrator account credentials:
- **Admin URL:** `/admin/login`
- **Username / ID:** `nikk` (or `nikk@punjabroyalsuits.com`)
- **Password:** `nikk3344`

> **Security Note:** You can also update credentials anytime from the **Admin Profile** (`/admin/profile`) after logging in.

---

## 🛍️ Admin Management Features

### 1. Products & Variants
- Add, edit, duplicate, publish/unpublish suits.
- Manage sizes (`XS`, `S`, `M`, `L`, `XL`, `XXL`, `Custom Measurement`), colors, and stitching options (*Unstitched 3-piece fabric*, *Ready-to-Wear Standard Stitched*, *Bespoke Custom Tailored*).
- Set promotional comparison prices (shows discount percentage badge automatically).
- Low stock indicators and variant stock counters.

### 2. Orders & Concurrency-Safe Fulfillment
- View complete customer shipping information, itemized sizes, colors, stitching notes, and customer requests.
- Update order statuses through: `PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `READY_TO_SHIP` ➔ `SHIPPED` ➔ `DELIVERED` (or `CANCELLED` / `REFUNDED`).
- Server validates that cancellations restore reserved product stock.

### 3. Custom Embroidery Inquiries
- Bespoke orders submitted via the `/custom-orders` form appear in the admin inquiries queue.
- Includes customer fabric choice, preferred embroidery type (Handmade Adda work vs Machine), target delivery date, budget bracket, reference sketches, and direct WhatsApp contact trigger.

### 4. Store Settings & Brand CMS
- Change store name, tagline, address, phone, WhatsApp number, and social links.
- Configure shipping fee rules (e.g., Free Shipping threshold at ₹2,999) and GST tax rates.
- Toggle announcement bar on/off and edit marquee banner text.

### 5. Policies & Disclaimers CMS
- Rich text policy editor for:
  - Product Color Disclaimer & Screen Accuracy
  - Handmade vs Machine Embroidery Nature & Variations
  - Shipping & Delivery Timelines
  - Return, Exchange & Alterations Policy
  - Privacy Policy & Terms of Service

---

## 💳 Payment Gateway Setup

The boutique supports multiple payment modes:

1. **Cash on Delivery (COD):** Enabled by default in Store Settings.
2. **Manual UPI / Direct Bank Transfer:** Displays your configured boutique UPI ID (e.g. `punjabroyalsuits@upi`) with QR instructions during checkout.
3. **Razorpay Online Payment (Credit/Debit Cards, NetBanking, Google Pay, PhonePe, Paytm):**
   - Create an account at [https://razorpay.com](https://razorpay.com).
   - In the **Admin Dashboard ➔ Store Settings**, enter your `Razorpay Key ID` and `Razorpay Key Secret` (or set them in `.env`).
   - If keys are omitted during development, the checkout gracefully notifies shoppers that the online gateway is in preview mode and provides COD/UPI without breaking.

---

## 🧪 Automated Testing & Quality Assurance

Run the test suite with Vitest:
```bash
npm run test
```

### Verified Test Suite (13 passing tests):
1. `GET /api/health` ➔ Server health check
2. `POST /api/products` ➔ Unauthorized request rejection (401)
3. `POST /api/auth/login` ➔ Admin authentication & JWT token generation
4. `POST /api/auth/login` ➔ Invalid credentials rejection
5. `GET /api/products` ➔ Search, category filtering, and sorting
6. `POST /api/coupons/validate` ➔ Percentage/fixed discount calculation & min-order enforcement
7. `POST /api/orders` ➔ Stock limit protection against overselling
8. `POST /api/orders` ➔ Server-recalculated pricing and order creation
9. `GET /api/orders/track` ➔ Customer order tracking by order number & phone
10. `POST /api/reviews` ➔ Verified customer review submission
11. `POST /api/custom-inquiries` ➔ Custom embroidery bespoke suit inquiry submission
12. `PUT /api/settings` ➔ Admin store settings modification
13. `DELETE /api/categories/:id` ➔ Deletion safety guard for categories with assigned products

---

## 🚢 Production Deployment

### Building for Production
```bash
npm run build
```
This generates an optimized client bundle in `/dist` served directly by the Express backend.

### Running in Production
```bash
NODE_ENV=production PORT=5000 npx tsx server/index.ts
```

### Switching to PostgreSQL (Optional)
If migrating from SQLite to managed PostgreSQL (e.g., AWS RDS, Neon, Supabase):
1. In `prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set your PostgreSQL URL in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/punjab_suits?schema=public"
   ```
3. Run `npm run db:push` and `npm run seed`.

---

## 🛡️ Security Best Practices

- **Never Commit Secrets:** `.env` is ignored by `.gitignore`.
- **Protected Admin Panel:** Routes under `/api/*` (except public storefront reads) enforce strict JWT signature checks with HTTP-only cookies and Bearer headers.
- **Audit Logging:** Every critical administrative action (product edits, price changes, order updates) is permanently logged with timestamps and admin identities.
- **File Upload Safeguards:** Only `image/jpeg`, `image/png`, and `image/webp` under 10MB are permitted.

---

## 📜 License & Copyright
© 2026 Punjab Royal Suits Boutique. All rights reserved.
Crafted for authentic Punjabi fashion, bespoke embroidery, and royal sartorial elegance.
