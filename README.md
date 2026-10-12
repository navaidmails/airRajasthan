# AirRajasthan - B2B Air Cargo & Logistics Platform

An enterprise-grade, full-stack demonstration platform for **AirRajasthan**, a regional B2B air cargo, aircraft charter, and multimodal logistics operator connecting Western India's industrial manufacturing corridors (Jaipur, Jodhpur, Udaipur, Bhiwadi) with domestic and international trade gateways.

---

## 1. Architectural Stack

- **Framework:** Next.js 15 (App Router, Server Actions, Route Handlers, React 19)
- **Language:** TypeScript 5.7 (Strict mode)
- **Styling & Design System:** Tailwind CSS 3.4 (Custom aviation navy `#0B1728` & golden saffron `#F59E0B` palette)
- **Database & ORM:** MySQL 8.0 with Prisma ORM 6.x and versioned migrations
- **Input Validation:** Zod schemas on both client and server boundaries
- **Authentication & Authorization:** Jose JWT with secure HTTP-only cookies, password hashing with Bcrypt, and strict role-based access control (`ADMIN`, `TEAM`, `USER`)
- **Hosting Target:** Hostinger Managed Node.js Cloud Hosting (Stateless, single modular application)

---

## 2. Implemented Features vs. Demo Placeholders

| Module | Implemented Architecture | Demo Status & Future Integration Point |
|---|---|---|
| **Live Tracking Engine** | Decoupled `ITrackingProvider` pattern with `MockTrackingProvider` simulating AWB progression, flight manifests, and timestamps | Labeled demo simulator. To connect live carrier APIs (e.g. SITA, Champ Cargosystems, Descartes), implement `ITrackingProvider` and call `TrackingService.setProvider(realProvider)` |
| **Enquiry Workflow** | Full state-machine: `NEW` &rarr; `ASSIGNED` &rarr; `IN_PROGRESS` &rarr; `AWAITING_CUSTOMER` &rarr; `CLOSED` | Persistent in MySQL. Includes team assignment, duplicate submit protection, and audit logs |
| **Confidential Notes** | Server-side query projection guarantees `EnquiryNote` records **never** leak to customer API responses or frontend | Active and strictly enforced on server |
| **Customer Replies** | Customer-visible bidirectional message thread with timestamped responses | Active and persisted in `enquiry_replies` table |
| **Notifications** | Transactional Outbox pattern (`notification_jobs` table) persists messages without data loss | Safe demo state: logged with status `NOT_CONFIGURED` without failing transactions |
| **CMS Content Management** | Admin & Team draft editing for Page Sections, Services, Events, and Gallery with Next.js ISR cache revalidation (`revalidatePath`) | Active: Team saves drafts, Admin publishes. Unconfirmed business data remains editable |
| **Attachments** | Field placeholders documented; uploads currently disabled | To activate, connect S3 / Cloudflare R2 bucket pre-signed URLs to preserve stateless server architecture |

---

## 3. Local Setup & MySQL Database Creation

### Prerequisites
- Node.js `v20+` or `v24+`
- MySQL Server 8.0 running locally on port `3306`
- Git

### Database Initialization
Connect to your local MySQL instance (e.g., via CLI or Workbench) and create the development database:

```sql
CREATE DATABASE IF NOT EXISTS airrajasthan_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Installation & Migrations

```bash
# 1. Clone or navigate to the directory
cd AirRajasthan

# 2. Install pinned dependencies and lockfile
npm install

# 3. Create development environment file
cp .env.example .env

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Apply versioned migrations to MySQL
npx prisma migrate dev --name init

# 6. Seed local demo accounts and initial CMS data
npm run seed

# 7. Start the development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 4. Environment Variables

Create `.env` based on `.env.example`:

| Variable | Description | Example (Development) |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | `mysql://root:root@localhost:3306/airrajasthan_dev` |
| `JWT_SECRET` | 32+ char secret for session tokens | `airrajasthan-b2b-super-secret-key-development-2026-secure` |
| `NODE_ENV` | Environment identifier | `development` or `production` |
| `NEXT_PUBLIC_APP_URL` | Public site domain URL | `http://localhost:3000` |
| `SMTP_HOST` | Outgoing email server (Optional) | `smtp.mailgun.org` (leave empty for demo outbox) |
| `SEED_ADMIN_EMAIL` | Admin email for `npm run seed` | `admin@airrajasthan.com` |
| `SEED_ADMIN_PASSWORD` | Admin password for `npm run seed` | `AdminSecurePassword2026!` |
| `SEED_TEAM_EMAIL` | Team email for `npm run seed` | `team@airrajasthan.com` |
| `SEED_TEAM_PASSWORD` | Team password for `npm run seed` | `TeamSecurePassword2026!` |
| `SEED_USER_EMAIL` | Client email for `npm run seed` | `client@logistics-partner.com` |
| `SEED_USER_PASSWORD` | Client password for `npm run seed` | `ClientSecurePassword2026!` |

---

## 5. Pre-Seeded Demo Accounts

The development seed command (`npm run seed`) creates three distinct role-based accounts for interactive testing:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **ADMIN** | `admin@airrajasthan.com` | `AdminSecurePassword2026!` | Full operations control, manage all enquiries, reassign team members, review drafts, publish CMS content live, modify user roles |
| **TEAM** | `team@airrajasthan.com` | `TeamSecurePassword2026!` | Review assigned enquiries, update workflow status, post customer replies, write confidential internal notes, save CMS content drafts |
| **USER** | `client@logistics-partner.com` | `ClientSecurePassword2026!` | Customer portal: Submit quotations, track own enquiries, reply to operations desk. Cannot view other customers' records or internal notes |

*Quick Access:* The `/login` page provides quick-fill demo buttons to switch between accounts with a single click.

### Test AWB Tracking Numbers
- `AR-7842-DEL`: In Flight (Jaipur &rarr; Dubai) - Boeing 737-800BCF
- `AR-9104-JAI`: Consignment Delivered (Mumbai &rarr; Jaipur Feeder)
- `AR-3321-BOM`: Customs Cleared (Pharma +2°C to +8°C Active Cool)

---

## 6. Git Branching Workflow

In accordance with release management guidelines:
- **`dev`**: The active working branch for development and testing.
- **`main`**: Contains release-ready code for staging and production deployments.

```bash
# Verify current branch
git status

# Create feature branches off dev
git checkout dev
git checkout -b feature/your-feature-name

# Merge back into dev after testing
git checkout dev
git merge feature/your-feature-name

# Only merge dev into main when authorized for release
git checkout main
git merge dev
```

*Note: Never force-push or merge directly to `main` without explicit confirmation.*

---

## 7. Hostinger Managed Node.js Deployment Guide

### Build Configuration on Hostinger Panel
1. **Application Root:** `/` (Project root directory)
2. **Node.js Version:** `20.x` or `22.x LTS`
3. **Application Type:** Next.js (Standalone or standard server)
4. **Build Command:**
   ```bash
   npm run build
   ```
5. **Start Command:**
   ```bash
   npm run start
   ```

### Controlled Production Database Migrations
On production environments, **never** execute `prisma migrate reset` or `npm run seed`. Run only committed migrations:

```bash
# Safe, non-destructive migration step for production
npx prisma migrate deploy
```

### Production Backup Best Practices
Before running any migration on Hostinger production:
1. Export a full MySQL dump:
   ```bash
   mysqldump -u <prod_user> -p<prod_password> <prod_db> > backup_$(date +%F_%T).sql
   ```
2. Verify backups are stored off-site.

---

## 8. Continuous Integration (CI)

A GitHub Actions pipeline is configured at `.github/workflows/ci.yml`.
On every push and pull request to `main` and `dev`:
- Spins up an isolated MySQL 8.0 service container.
- Installs pinned dependencies (`npm ci`).
- Generates Prisma client and applies versioned migrations (`prisma migrate deploy`).
- Validates seed execution with temporary CI test credentials.
- Executes full TypeScript strict type checking (`tsc --noEmit`).
- Executes production build compilation (`npm run build`).
