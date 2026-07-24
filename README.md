# Mabati Rolling Mills — Premium Frontend

A production-ready React + TypeScript storefront and admin dashboard for the Mabati roofing products platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Data Fetching | TanStack Query v5 |
| State Management | Zustand (auth) |
| HTTP Client | Axios |
| Icons | Lucide React |
| Image Uploads | Cloudinary (unsigned upload preset) |

---

## Features

### Public Storefront
- **Premium landing page** with hero section, features, product showcase, and WhatsApp CTA
- **Products catalogue** with search, category filter, color/gauge/price filters
- **Product detail page** with WhatsApp order button generating a pre-filled message
- **Authentication** — login and registration pages with JWT token management and auto-refresh

### Admin Dashboard (`/admin`)
| Module | Description |
|---|---|
| Dashboard | KPI cards (products, orders, revenue, customers) + low-stock alerts |
| Products | Full CRUD with Cloudinary image upload, category assignment, pricing |
| Categories | Create, edit, delete product categories |
| Inventory | Adjust stock levels per product, view adjustment history logs |
| Orders | View all orders, filter by status, update order status inline |
| Landing Page | CMS-style editor for hero image, headline, banners, WhatsApp number |
| Users | View all registered users with role and status |
| Settings | Profile info + change password |

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm i -g pnpm`)
- Backend API running (see mabatiAPI)

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-cloud` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name | `mabati_uploads` |
| `VITE_WHATSAPP_NUMBER` | WhatsApp business number (no +) | `254700000000` |

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
```

---

## Project Structure

```
src/
├── components/
│   ├── admin/          # AdminLayout (sidebar + topbar)
│   ├── layout/         # Navbar, Footer, PublicLayout
│   └── ui/             # Badge, Card, Modal, Toast, LoadingSpinner, etc.
├── hooks/              # useToast
├── lib/
│   ├── api.ts          # Axios client + all API functions
│   └── utils.ts        # cn(), formatCurrency(), formatDate(), WhatsApp helpers
├── pages/
│   ├── admin/          # Dashboard, Products, Categories, Inventory, Orders, Landing, Users, Settings
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── MyOrdersPage.tsx
├── stores/
│   └── authStore.ts    # Zustand auth store with JWT persistence
├── types/
│   └── index.ts        # All TypeScript interfaces
├── App.tsx             # Router + providers + auth guards
└── main.tsx            # Entry point
```

---

## Authentication & Roles

| Role | Access |
|---|---|
| `customer` | Public pages + My Orders |
| `staff` | Admin dashboard (read/write) |
| `admin` | Full admin access |

JWT tokens are stored in `localStorage` and automatically refreshed via the Axios interceptor.

---

## Cloudinary Setup

1. Create a free Cloudinary account at https://cloudinary.com
2. Go to **Settings → Upload → Upload Presets**
3. Create an **unsigned** preset
4. Set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env`

---

## Backend API

This frontend connects to the mabatiAPI FastAPI backend. Ensure it is running at the URL specified in `VITE_API_URL`.

Key endpoints used:

| Endpoint | Description |
|---|---|
| `POST /auth/login` | OAuth2 password login |
| `POST /auth/register` | User registration |
| `GET /products` | Public product list with filters |
| `GET /categories` | Public category list |
| `GET /admin/dashboard` | Dashboard stats |
| `GET/POST/PUT/DELETE /admin/products` | Product CRUD |
| `GET/POST/PUT/DELETE /admin/categories` | Category CRUD |
| `GET /admin/inventory` | Low-stock inventory |
| `POST /admin/inventory/{id}/adjust` | Stock adjustment |
| `GET /admin/orders` | All orders |
| `PUT /admin/orders/{id}/status` | Update order status |
| `POST /users/change-password` | Change own password |
