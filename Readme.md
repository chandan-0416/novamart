# NovaMart — Modern Full-Stack E-Commerce Platform

A production-grade, high-performance D2C marketplace built with **React 18**, **Tailwind CSS**, **Redux Toolkit**, **Node.js**, **Express**, and **PostgreSQL (Pure Parameterized Raw SQL with Row-Level Locking)**.

---

## 🌐 Live Deployments & Endpoints

| Service | Environment | URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel (Production) | [https://novamart-gold.vercel.app](https://novamart-gold.vercel.app) |
| **Backend REST API** | Render (Docker / Alpine) | [https://novamart-backend-2zmo.onrender.com/api/v1](https://novamart-backend-2zmo.onrender.com/api/v1) |
| **Interactive API Docs** | Swagger / OpenAPI 3.0 | [https://novamart-backend-2zmo.onrender.com/api-docs](https://novamart-backend-2zmo.onrender.com/api-docs) |
| **Database** | Supabase Cloud | PostgreSQL 15+ Managed Instance (Session Pooler) |

---

## 🏗️ Architecture Overview

```text
E-Commerce-Platform/
├── .agents/                      # AI Agent & Custom Tool Configuration
│   └── mcp_config.json           # Model Context Protocol (MCP) server definition
│
├── docs/                         # Engineering Architecture & Interview Playbooks
│   ├── DATABASE_ARCHITECTURE.md            # Schema design, normalization & raw SQL queries
│   ├── BACKEND_ARCHITECTURE.md             # Multi-tier architecture, middleware pipeline & routes
│   ├── NODE_POSTGRESQL_CONNECTION_GUIDE.md # pg connection pooler & cloud migration guide
│   ├── FRONTEND_ARCHITECTURE.md            # React SPA, Redux slices, Axios & Tailwind setup
│   ├── END_TO_END_FLOW.md                  # Complete request-response trace across layers
│   ├── DEPLOYMENT_GUIDE.md                 # Multi-cloud deployment on Vercel, Render & Supabase
│   ├── INTERVIEW_PREPARATION_GUIDE.md      # Full interview pitch, counter-questions & trade-offs
│   ├── ADVANCED_IMPROVEMENTS_AND_SCALING.md# Scaling roadmap, Redis caching & indexing
│   └── MCP_LEARNING_AND_INTEGRATION_GUIDE.md# Model Context Protocol (MCP) tooling tutorial
│
├── backend/                      # Production Express + PostgreSQL Backend
│   ├── src/
│   │   ├── config/               # Database pool, JWT, Winston file logger, Swagger
│   │   ├── constants/            # Roles (customer/admin) & Order statuses
│   │   ├── database/             # Schema, Seeds, Migrations (Raw SQL DDL)
│   │   ├── errors/               # Custom AppError hierarchy with HTTP status codes
│   │   ├── mcp/                  # Custom MCP Server (novamartMcpServer.js)
│   │   ├── middlewares/          # Auth (JWT), RBAC, Validator, Rate Limiter, Error Handler
│   │   ├── validators/           # Input validation schemas (express-validator)
│   │   ├── services/             # Business logic & SQL Transactions (FOR UPDATE locking)
│   │   ├── controllers/          # HTTP request handlers
│   │   ├── routes/               # Express routes with OpenAPI JSDoc specifications
│   │   ├── app.js                # Express app setup and middleware configuration
│   │   └── server.js             # HTTP server with graceful shutdown handlers
│   ├── logs/                     # Persistent log files (error.log, combined.log)
│   ├── tests/                    # Jest & Supertest integration test suites
│   ├── Dockerfile                # Multi-stage production container
│   ├── .env.example
│   └── package.json
│
└── frontend/                     # High-performance React SPA (Vite + Tailwind CSS)
    ├── src/
    │   ├── api/                  # Axios client with auto-refresh token & cloud fallback
    │   ├── components/           # Common (Navbar, Footer), Products, Cart, Admin
    │   ├── pages/                # Home, Product Details, Login, Register, Cart, Checkout, Orders, Profile, Admin
    │   ├── store/                # Redux Toolkit store and slices (auth, products, cart, orders)
    │   ├── __tests__/            # Jest + React Testing Library test suites
    │   ├── App.jsx               # React Router layout & ProtectedRoute guards
    │   ├── index.css             # Tailwind CSS directives & global typography
    │   └── main.jsx              # Application bootstrap
    ├── tailwind.config.js        # Tailwind CSS theme & content configuration
    ├── postcss.config.js         # PostCSS plugins setup
    ├── index.html
    └── package.json
```

---

## ⚡ Tech Stack

### Frontend
- **Framework & Build**: React 18 + Vite (ESM)
- **Styling**: Tailwind CSS (Clean, high-contrast, modern D2C marketplace design)
- **State Management**: Redux Toolkit (`authSlice`, `productSlice`, `cartSlice`, `orderSlice`)
- **Routing**: React Router DOM v6 with Protected Route guards
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library + `@testing-library/user-event`

### Backend
- **Runtime & Server**: Node.js 18+ & Express.js
- **Database**: PostgreSQL with Raw Parameterized SQL via `pg` connection pool
- **Concurrency & Atomicity**: ACID Transactions with pessimistic row locks (`SELECT ... FOR UPDATE`)
- **Authentication**: Dual-Token JWT (Short-lived Access Token + Rotating Refresh Tokens stored in DB)
- **Authorization**: Role-Based Access Control (`customer`, `admin`)
- **Input Validation**: `express-validator`
- **Rate Limiting & Security**: `express-rate-limit` & `helmet`
- **Structured Logging**: `winston` with auto-rotating file transports (`logs/error.log`, `logs/combined.log`) + `morgan`
- **Documentation**: Swagger / OpenAPI 3.0 (`/api-docs`)
- **Testing**: Jest + Supertest (Unit & Integration tests)
- **Tooling**: Model Context Protocol (MCP) SDK Server

---

## 🚀 Key Features

1. **Clean D2C Storefront (`/`)**:
   - High-contrast hero showcase with live visitor indicator and promo code copy button (`NOVA20`).
   - Category filtering rail (Electronics, Clothing, Home & Kitchen, Books, Sports).
   - Price range filter and multi-factor sorting (Price Asc/Desc, Name, Newest, Stock).
   - Real-time stock status badges and low-inventory warnings.

2. **Atomic Inventory Checkout (`/checkout`)**:
   - Pessimistic row locking with raw SQL (`SELECT stock_quantity FROM products WHERE id = $1 FOR UPDATE`) inside a transaction block to guarantee zero overselling during flash sales.
   - Immediate stock deduction and automatic order receipt creation.

3. **Secure Dual-Token Authentication (`/login`, `/register`)**:
   - Access token (15m expiry) + Rotating Refresh Token (7d expiry stored in PostgreSQL).
   - Automatic silent token refresh via Axios interceptors on `401 Unauthorized`.
   - **One-Click Quick Demo Login buttons** on `/login` for both Customer and Admin accounts.

4. **Order History & Fulfillment (`/orders`)**:
   - Itemized purchase breakdown with unit prices, subtotals, and shipping addresses.
   - Status transitions (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

5. **Admin Management Console (`/admin`)**:
   - Protected route requiring `role === 'admin'`.
   - Real-time KPI revenue metrics, total orders, and active catalog counters.
   - Full CRUD product management modal with image URLs, stock controls, and categories.
   - Live order status switcher for fulfillment tracking.

6. **File-Based Logging for Backend Debugging**:
   - Auto-generated `backend/logs/error.log` for error stack traces and query failures.
   - `backend/logs/combined.log` for request performance and audit trails.

7. **Model Context Protocol (MCP) Server**:
   - Custom MCP server exposing 4 specialized operational tools:
     - `get_order_metrics`: Platform revenue, order counts, and fulfillment summary.
     - `check_inventory_alerts`: Automated low-stock warning threshold inspection.
     - `search_catalog`: Semantic & parameterized product discovery.
     - `run_readonly_sql`: Safe read-only reporting query execution.

---

## 🛠️ Getting Started Locally

### 1. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (configure your DB credentials)
cp .env.example .env

# 4. Run database migrations and seed data
npm run migrate
npm run seed

# 5. Start the backend development server
npm run dev
```

*Pre-seeded demo credentials:*
- **Admin**: `admin@example.com` | Password: `Admin@123456`
- **Customer**: `customer@example.com` | Password: `Customer@123456`

- Backend API: `http://localhost:5000/api/v1`
- Swagger Docs: `http://localhost:5000/api-docs`

---

### 2. Frontend Setup

```bash
# 1. In a new terminal, navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```

- Web App: `http://localhost:5173`

---

## 🧪 Running Tests

### Backend Test Suite (Jest + Supertest)
```bash
cd backend
npm test
```
*Result: 4 test suites (21 unit & integration tests) passing.*

### Frontend Test Suite (Jest + React Testing Library)
```bash
cd frontend
npm test
```
*Result: 8 component & Redux slice tests passing.*

---

## 📦 Build for Production

```bash
# Build frontend production bundle
cd frontend
npm run build
```
Output created in `frontend/dist/` with optimized assets and gzip compression.