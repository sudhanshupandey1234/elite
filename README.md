# 🌐 ELITEGLOBEX — Full-Stack Corporate Website, Headless CMS, CRM & ERP Platform

A production-grade, database-connected corporate technology platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Neon Serverless PostgreSQL**.

---

## 📌 Table of Contents

1. [Platform Overview](#-platform-overview)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Step-by-Step Installation & Run Guide](#-step-by-step-installation--run-guide)
5. [Admin Login & Pre-Configured Demo Credentials](#-admin-login--demo-credentials)
6. [Key Modules & Features](#-key-modules--features)
7. [Project Directory Structure](#-project-directory-structure)
8. [Troubleshooting & Windows PowerShell Fixes](#-troubleshooting--windows-powershell-fixes)

---

## 🌟 Platform Overview

EliteGlobex is an end-to-end enterprise platform featuring:
- **Public Corporate Website**: Modern, high-conversion, responsive corporate portal with dynamic content, services catalog, solutions, case studies, blog, careers, and contact forms.
- **100% Admin-Controlled CMS**: Control the entire public website (Hero text, CTA buttons, section ordering, navigation links, and custom pages) without touching code.
- **Client Project Order Tracker**: Real-time deliverable milestone tracker accessible to clients at `/track-order`.
- **Invoices & Finance System**: Track milestone billings, issued tax invoices, SWIFT receivables, and payment receipts.
- **CRM & Sales Pipeline**: Manage prospective leads, deal values, and inbound contact form inquiries.
- **HR & Operations Suite**: Employee directory, daily shift attendance logs, and leave approval workflows.
- **Enterprise Security & Governance**: Strict Role-Based Access Control (RBAC), signed HttpOnly session cookies, and immutable audit logs.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Enterprise Design System)
- **Database & ORM**: [Neon Serverless PostgreSQL](https://neon.tech/) + [Prisma ORM](https://www.prisma.io/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 📋 Prerequisites (Yeh sab install hona chahiye)

1. **Node.js** (Version `18.17.0` ya `20.x` ya latest LTS)
   - Download link: [https://nodejs.org/](https://nodejs.org/)
2. **npm** (Node.js ke sath automatic install hota hai)
3. **Internet Connection** (Neon PostgreSQL cloud database se connect hone ke liye)

---

## 🚀 Step-by-Step Installation & Run Guide (Kaise Run Karein)

### Step 1: Open Terminal in Project Directory
VS Code me project folder open karein (`c:\Users\CU\Desktop\elite`) aur terminal (PowerShell ya CMD) open karein.

> **💡 Note for Windows PowerShell Users:**
> Agar `npm` command not recognized aaye, to ye command run karein:
> ```powershell
> $env:Path = "C:\Program Files\nodejs;" + $env:Path
> ```

---

### Step 2: Install Dependencies (Packages install karein)
```bash
npm install
```

---

### Step 3: Environment Configuration (`.env`)
Aapke project me `.env` file pehle se configured hai jo Neon PostgreSQL database se connected hai:
```env
DATABASE_URL="postgresql://neondb_owner:npg_ceY1Kpgnv3TD@ep-withered-meadow-b4jpzdkg-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_ceY1Kpgnv3TD@ep-withered-meadow-b4jpzdkg.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="eliteglobex-super-secret-production-auth-key-2026-xyz"
SESSION_SECRET="eliteglobex-session-jwt-encryption-key-778899"
ADMIN_EMAIL="admin@eliteglobex.com"
ADMIN_PASSWORD="Admin@123456"
NEXT_PUBLIC_APP_NAME="EliteGlobex"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### Step 4: Sync Database Schema (Prisma DB Push)
Database tables sync karne ke liye run karein:
```bash
npx prisma db push
```

---

### Step 5: Seed Database (Demo Data & Admin Accounts create karein)
Database me demo projects, services, blogs, orders, invoices, aur admin users populate karne ke liye:
```bash
npm run prisma:seed
```

---

### Step 6: Start Development Server (Website Run Karein)
```bash
npm run dev
```

Browser open karein aur visit karein:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

### Step 7: Production Build Test (Optional)
Production build check karne ke liye:
```bash
npm run build
npm start
```

---

## 🔐 Admin Login & Demo Credentials

Admin Portal: **[http://localhost:3000/admin/login](http://localhost:3000/admin/login)**

Login page par **One-Click Demo Role Switcher** buttons diye gaye hain, ya manually ye credentials use karein:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `admin@eliteglobex.com` | `Admin@123456` | Full Control (CMS, CRM, ERP, Users, Settings) |
| **💼 Operations Manager** | `sarah.manager@eliteglobex.com` | `Manager@123456` | Orders, Invoices, CRM, Projects |
| **👥 HR Admin** | `hr@eliteglobex.com` | `HRAdmin@123456` | Employees, Attendance, Leaves, Careers |
| **💻 Staff Engineer** | `james.eng@eliteglobex.com` | `Staff@123456` | Project Tasks, Attendance Check-in |

---

## 📦 Key Modules & Features

### 1. 🌐 Public Website Routes
- **`/`** — Corporate Homepage (Dynamic Hero, Capabilities, Services, Solutions, Roadmap, Testimonials, CTA)
- **`/about`** — Company story, leadership team, core engineering values
- **`/services` & `/services/[slug]`** — Enterprise engineering practices & detail pages
- **`/solutions` & `/solutions/[slug]`** — Proprietary software products & live architecture demos
- **`/industries` & `/industries/[slug]`** — Vertical industry specializations (FinTech, Healthcare, Supply Chain, EdTech)
- **`/projects` & `/projects/[slug]`** — Verified case studies with client ROI metrics
- **`/blog` & `/blog/[slug]`** — Technical publications and engineering articles
- **`/careers` & `/careers/[slug]`** — Job vacancies with online candidate application & resume submission
- **`/contact`** — Inbound consultation form & global office directory
- **`/track-order`** — Live customer order & sprint delivery milestone tracker
- **`/privacy-policy`, `/terms-conditions`, `/cookie-policy`, `/refund-policy`** — Standard legal pages

---

### 2. ⚡ Admin Panel & CMS Modules (`/admin`)

| Admin Route | Functionality |
| :--- | :--- |
| **`/admin`** | **Command Center Dashboard**: Live revenue, pipeline value, active headcount, recent orders, and audit logs |
| **`/admin/invoices`** | **Invoices & Finance**: Issue invoices, track paid receivables & pending dues |
| **`/admin/projects`** | **Case Studies**: Publish customer case studies with ROI metrics |
| **`/admin/services`** | **Services CMS**: Add/edit engineering practices, deliverables, and tech stack |
| **`/admin/solutions`** | **Products CMS**: Manage proprietary platforms, license models, and demos |
| **`/admin/blog`** | **Blog CMS**: Article authoring, tags, reading time, and publication |
| **`/admin/leads`** | **CRM Pipeline**: Track sales leads, deal values, and stage progression |
| **`/admin/submissions`** | **Inbound Inquiries**: Review and respond to website contact form submissions |
| **`/admin/orders`** | **Order Tracker**: Manage delivery milestone checklists that sync to `/track-order` |
| **`/admin/hr/employees`** | **HR Directory**: Employee profiles, designations, and payroll records |
| **`/admin/hr/attendance`** | **Attendance**: Daily shift logs (On-Site, Remote, Late, Leaves) |
| **`/admin/hr/leaves`** | **Leave Management**: Review, approve, or reject employee PTO requests |
| **`/admin/careers`** | **Job Postings**: Create and manage job openings |
| **`/admin/careers/applications`**| **Candidate Pipeline**: Review resumes, GitHub/LinkedIn links, and interview stages |
| **`/admin/industries`** | **Industries CMS**: Manage sector solutions and compliance frameworks |
| **`/admin/testimonials`**| **Testimonials**: Add verified executive client endorsements |
| **`/admin/faqs`** | **FAQs Manager**: Add and categorize public knowledge base questions |
| **`/admin/offices`** | **Offices**: Manage global office locations, addresses, and timezones |
| **`/admin/audit-logs`** | **Audit Trail**: Real-time SOC2 compliance log of all system mutations |
| **`/admin/users`** | **RBAC Users**: Manage administrative users and permission tiers |
| **`/admin/settings`** | **Site Settings**: Company branding, contact info, footer bio, and social links |
| **`/admin/website/homepage`** | **Homepage Customizer**: Edit Hero banner and reorder/toggle all 12 homepage sections |
| **`/admin/website/navigation`** | **Navbar Builder**: Create, edit, and reorder header navigation menu links |
| **`/admin/website/pages`** | **Custom Page Builder**: Build modular landing pages at `/page/[slug]` |

---

## 📂 Project Directory Structure

```text
elite/
├── app/
│   ├── (public)/                 # Public corporate website pages & routes
│   │   ├── about/
│   │   ├── blog/
│   │   ├── careers/
│   │   ├── contact/
│   │   ├── industries/
│   │   ├── projects/
│   │   ├── services/
│   │   ├── solutions/
│   │   └── track-order/
│   ├── admin/                    # Admin Panel & CMS routes
│   │   ├── audit-logs/
│   │   ├── blog/
│   │   ├── careers/
│   │   ├── faqs/
│   │   ├── hr/
│   │   ├── industries/
│   │   ├── invoices/
│   │   ├── leads/
│   │   ├── login/
│   │   ├── offices/
│   │   ├── orders/
│   │   ├── projects/
│   │   ├── services/
│   │   ├── settings/
│   │   ├── solutions/
│   │   ├── submissions/
│   │   ├── testimonials/
│   │   ├── users/
│   │   └── website/              # Homepage, Navigation & Pages Customizer
│   └── api/                      # REST API Endpoints (CRUD, Auth, Orders, CMS)
├── components/
│   ├── admin/                    # Admin UI components (Sidebar, Header, PageHeader, StatCard, etc.)
│   ├── layout/                   # Public Navbar, Footer, Mobile Drawer
│   └── ui/                       # Reusable buttons, badges, modals, cards
├── lib/
│   ├── auth.ts                   # Authentication & Session verification
│   ├── prisma.ts                 # Prisma Neon client instance
│   └── utils.ts                  # Currency formatting, date helpers, cn utility
├── prisma/
│   ├── schema.prisma             # PostgreSQL Database Schema
│   └── seed.ts                   # Initial Seed Data Script
├── .env                          # Neon Database & Authentication Environment variables
├── package.json                  # Dependencies & NPM Scripts
├── tailwind.config.js            # Tailwind CSS Theme & Tokens
└── tsconfig.json                 # TypeScript Configuration
```

---

## 🔧 Troubleshooting & Windows PowerShell Fixes

### 1. `npm` is not recognized as a cmdlet
Run this in PowerShell:
```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
```

### 2. Execution Policy Error (`cannot be loaded because running scripts is disabled`)
Run this in PowerShell:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 3. Database Connection Issues
Make sure your computer is connected to the internet. The database is hosted on **Neon Cloud PostgreSQL**. If required, verify the `DATABASE_URL` in `.env`.

### 4. Re-seeding Fresh Data
Agar aapko database dobara reset karke fresh initial data dalna ho:
```bash
npx prisma db push --force-reset
npm run prisma:seed
```

---

## 📄 License & Ownership

© 2026 **EliteGlobex Inc.** All rights reserved. Production-grade corporate software.
