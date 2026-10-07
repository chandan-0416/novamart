# Full Stack E-Commerce Platform

A production-grade, full stack e-commerce web platform built with **React.js**, **Redux Toolkit**, **React Router**, **Node.js**, **Express**, and **PostgreSQL (with pure Raw SQL)**.

---

## Architecture Overview

```text
E-Commerce-Platform/
├── docs/                     # Technical architecture & engineering guides
│   ├── DATABASE_ARCHITECTURE.md            # Complete DB, ER model & schema specification
│   ├── BACKEND_ARCHITECTURE.md             # Multi-tier backend design, pipeline & API catalog
│   ├── NODE_POSTGRESQL_CONNECTION_GUIDE.md # Production guide: Node.js & PostgreSQL connection
│   ├── FRONTEND_ARCHITECTURE.md            # React SPA, Redux Toolkit, Axios & Glassmorphism
│   ├── END_TO_END_FLOW.md                  # Complete trace: Frontend ➔ REST API ➔ Backend ➔ DB
│   ├── DEPLOYMENT_GUIDE.md                 # Production deployment (Vercel, Render, Docker & VPS)
│   └── INTERVIEW_PREPARATION_GUIDE.md      # Full interview pitch, Q&A playbook & counter-questions
│
├── backend/                  # Production Express + PostgreSQL Backend
│   ├── src/
│   │   ├── config/           # Database pool, JWT, Winston logger, Swagger
│   │   ├── constants/        # Roles & Order Status constants
│   │   ├── database/         # Schema, Seeds, Migrations (Raw SQL)
│   │   ├── errors/           # Custom AppError hierarchy
│   │   ├── middlewares/      # Auth (JWT), RBAC, Validator, Rate Limiter, Error Handler
│   │   ├── validators/       # Input validation schemas (express-validator)
│   │   ├── services/         # Business logic & SQL Transactions (Row locking FOR UPDATE)
│   │   ├── controllers/      # HTTP handlers
│   │   ├── routes/           # Express routes with OpenAPI documentation
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # HTTP server and graceful shutdown
│   ├── tests/                # Jest & Supertest integration test suite
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # High-performance React SPA (Vite)
    ├── src/
    │   ├── api/              # Axios client with auto-refresh JWT token interceptor
    │   ├── components/       # Common, Products, Cart, Admin components
    │   ├── pages/            # Home, Product Details, Login, Register, Cart, Checkout, Orders, Profile, Admin
    │   ├── store/            # Redux Toolkit store and slices (auth, products, cart, orders)
    │   ├── styles/           # Modern Glassmorphic design system
    │   ├── __tests__/        # Jest + React Testing Library test suites
    │   ├── App.jsx           # React Router route definitions & ProtectedRoute guards
    │   └── main.jsx          # Root provider bootstrap
    ├── index.html
    └── package.json
```

---

## Tech Stack

- **Frontend**:
  - React.js 18 + JavaScript
  - Redux Toolkit (State Management)
  - React Router DOM v6
  - Modern Glassmorphism CSS Design System
  - Lucide Icons
  - Jest + React Testing Library (Component & Slice tests)
  - Vite (Build Tool & Dev Server)

- **Backend**:
  - Node.js + Express.js
  - PostgreSQL with Raw Parameterized SQL (`pg` connection pool)
  - Database Transactions with row-level locks (`FOR UPDATE`) for atomic checkout
  - Dual JWT Authentication (Access Token + Rotating Refresh Tokens stored in DB)
  - Role-Based Access Control (`customer`, `admin`)
  - `express-validator` & `express-rate-limit`
  - `winston` + `morgan` logging
  - Interactive OpenAPI/Swagger documentation (`/api-docs`)
  - Jest + Supertest (API unit & integration tests)

---

## Features & Pages

1. **Product Catalog & Home Page (`/`)**:
   - Live search with instant filtering
   - Category filter pills (Electronics, Clothing, Home & Kitchen, Books, Sports)
   - Price range filter and sorting options (Price, Name, Newest, Stock)
   - Product cards with stock indicators and animated "Add to Cart"

2. **Product Details Page (`/products/:id`)**:
   - High-res product view, category tag, inventory count, quantity picker, live add-to-cart feedback.

3. **Authentication (`/login`, `/register`)**:
   - Dual-token JWT auth with refresh token rotation and database revocation on logout
   - **1-Click Quick Demo Login buttons** on `/login` for both **Customer** and **Admin** accounts.

4. **Shopping Cart (`/cart`)**:
   - Interactive quantity adjuster (+ / -) with inventory boundary checks
   - Dynamic order subtotal, free shipping calculator, and total pricing

5. **Checkout & Atomic Orders (`/checkout`)**:
   - Shipping address validation
   - Atomic SQL Transaction with pessimistic row-locking (`SELECT ... FOR UPDATE`) to prevent inventory overselling
   - Automatic cart clearance and order receipt generation

6. **Order History (`/orders`)**:
   - Itemized order breakdown, total amounts, shipping destinations, and status badges (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

7. **User Profile (`/profile`)**:
   - Account overview, role badge, lifetime order counts, and quick actions.

8. **Admin Dashboard (`/admin`)**:
   - Protected route for users with `admin` role
   - Real-time platform metrics: Total Revenue, Total Orders, Active Catalog Count
   - **Product Management**: Create new products, edit price/stock/descriptions, soft/hard delete
   - **Order Fulfillment**: Review customer orders across the platform and update fulfillment status in real-time.

---

## Getting Started

### 1. Backend Setup & Local PostgreSQL

1. Open `backend/.env` and verify your local PostgreSQL credentials:
   ```env
   PORT=5000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=5433           # Set to your PostgreSQL port (e.g., 5432 or 5433)
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=ecommerce_db
   ```

2. Run Database Migration and Seed Data:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

   *Pre-seeded credentials:*
   - **Admin Account**: `admin@example.com` | Password: `Admin@123456`
   - **Customer Account**: `customer@example.com` | Password: `Customer@123456`

3. Start Backend Server:
   ```bash
   npm run dev
   ```
   - API: `http://localhost:5000/api/v1`
   - Interactive Swagger Docs: `http://localhost:5000/api-docs`

---

### 2. Frontend Setup

In a new terminal:
```bash
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## Running Tests

### Backend Tests (Jest + Supertest)
```bash
cd backend
npm test
```
*(All 21 backend unit & integration tests passing)*

### Frontend Tests (Jest + React Testing Library)
```bash
cd frontend
npm test
```
*(All 8 frontend component & Redux slice tests passing)*