# Complete End-to-End System Flow: Frontend ➔ REST APIs ➔ Backend ➔ Database

This document provides a comprehensive end-to-end architectural walkthrough detailing how data and control flows across all four tiers of the **NovaMart** e-commerce platform:

```
[ FRONTEND (React + Redux) ] 
             ▲
             │ (JSON / HTTP)
             ▼
[ REST API INTERFACE (Axios + Interceptors) ] 
             ▲
             │ (TCP / HTTP REST)
             ▼
[ BACKEND (Express + Middlewares + Controllers + Services) ] 
             ▲
             │ (pg Connection Pool / TCP Socket)
             ▼
[ DATABASE (PostgreSQL Engine + Raw SQL + ACID Transactions) ]
```

---

## 1. Master System Flowchart

```mermaid
sequenceDiagram
    autonumber
    box rgb(15, 23, 42) Frontend Tier
    actor Shopper as Customer (Browser)
    participant UI as React Component
    participant Redux as Redux Toolkit Store
    participant Axios as Axios Client (Interceptors)
    end

    box rgb(17, 24, 39) Backend Tier
    participant Express as Express App (Middlewares)
    participant AuthMW as JWT & RBAC Middleware
    participant ValMW as Validation Middleware
    participant Ctrl as Controller Layer
    participant Svc as Service Layer
    end

    box rgb(11, 15, 25) Database Tier
    participant Pool as pg.Pool Connection Pool
    participant PG as PostgreSQL Database Engine
    end

    Shopper->>UI: Interacts with UI (e.g. clicks "Place Order")
    UI->>Redux: Dispatches Action (createOrder thunk)
    Redux->>Axios: Executes orderApi.createOrder()
    Axios->>Axios: Request Interceptor (Attaches Bearer JWT)
    
    Axios->>Express: POST /api/v1/orders (Payload + Headers)
    Express->>Express: Security Middlewares (Helmet, CORS, RateLimiter, Morgan Logger)
    Express->>AuthMW: Verifies JWT signature & attaches req.user
    AuthMW->>ValMW: Validates shipping address schema
    ValMW->>Ctrl: Hands off to order.controller.js
    
    Ctrl->>Svc: Invokes order.service.createOrder(userId, data)
    Svc->>Pool: Leases connection via db.withTransaction()
    Pool->>PG: Executes "BEGIN" (Starts ACID Transaction)
    
    Svc->>PG: SELECT ... FOR UPDATE (Pessimistic Row Lock on products)
    PG-->>Svc: Returns locked product rows & inventory
    Svc->>Svc: Verifies stock >= requested_quantity
    
    Svc->>PG: INSERT INTO orders RETURNING id
    Svc->>PG: INSERT INTO order_items
    Svc->>PG: UPDATE products SET stock_quantity = stock_quantity - Qty
    Svc->>PG: DELETE FROM cart_items WHERE user_id = userId
    
    Svc->>PG: Executes "COMMIT" (Persists changes & releases locks)
    Pool->>Pool: Releases leased client back to pool
    
    Svc-->>Ctrl: Returns complete Order Receipt object
    Ctrl-->>Express: Formats HTTP 201 Created JSON
    Express-->>Axios: HTTP Response (Status 201 + Receipt payload)
    
    Axios-->>Redux: Dispatches createOrder.fulfilled
    Redux->>Redux: Clears cart state & sets active receipt
    Redux-->>UI: State triggers re-render
    UI-->>Shopper: Displays animated Order Confirmation & Receipt
```

---

## 2. Deep-Dive Flow 1: Product Catalog Browsing & Live Filtering

When a user opens the catalog, searches for an item, or clicks a category tag (`Electronics`, `Clothing`):

```mermaid
flowchart TD
    A["User clicks category pill 'Electronics'"] --> B["ProductFilter component triggers onChange"]
    B --> C["dispatch(setFilter({ category: 'Electronics' }))"]
    C --> D["dispatch(fetchProducts()) async thunk"]
    D --> E["productApi.getProducts(filters)"]
    E --> F["Axios GET /api/v1/products?category=Electronics&sortBy=created_at&limit=10"]
    
    F --> G["Express Router receives GET /api/v1/products"]
    G --> H["validateGetProducts middleware verifies query parameters"]
    H --> I["product.controller.getProducts()"]
    I --> J["product.service.getProducts()"]
    
    J --> K["Constructs Parameterized SQL: SELECT p.*, c.name FROM products p JOIN categories c... WHERE p.category_id = $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3"]
    K --> L["db.query(text, [categoryId, limit, offset]) leases client from pg.Pool"]
    L --> M["PostgreSQL evaluates query using B-Tree index idx_products_category"]
    M --> N["PostgreSQL returns matching product rows + pagination count"]
    
    N --> O["Service formats { status: 'success', products: [...], pagination: {...} }"]
    O --> P["Controller sends HTTP 200 JSON Response"]
    P --> Q["Axios receives response and fulfills Promise"]
    Q --> R["Redux productSlice reducer mutates state.products & state.pagination"]
    R --> S["HomePage re-renders with fresh ProductCard items & active badge"]
```

---

## 3. Deep-Dive Flow 2: Authentication & Dual-Token Rotation

When a user logs in and later makes authenticated calls:

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer
    participant Form as LoginPage (React)
    participant Redux as authSlice
    participant Axios as axiosClient
    participant AuthCtrl as auth.controller
    participant AuthSvc as auth.service
    participant DB as PostgreSQL (users, refresh_tokens)
    participant LocalStorage as Browser Storage

    User->>Form: Enters Email & Password -> Clicks "Sign In"
    Form->>Redux: dispatch(loginUser({ email, password }))
    Redux->>Axios: POST /api/v1/auth/login
    Axios->>AuthCtrl: Reaches Controller
    AuthCtrl->>AuthSvc: loginUser(email, password)
    
    AuthSvc->>DB: SELECT * FROM users WHERE email = $1 (Index idx_users_email)
    DB-->>AuthSvc: User Record (password_hash)
    AuthSvc->>AuthSvc: bcrypt.compare(password, password_hash) -> TRUE
    
    AuthSvc->>AuthSvc: jwt.sign(AccessToken, secret, { expiresIn: '15m' })
    AuthSvc->>AuthSvc: jwt.sign(RefreshToken, secret, { expiresIn: '7d' })
    AuthSvc->>DB: INSERT INTO refresh_tokens (user_id, token, expires_at)
    
    AuthSvc-->>AuthCtrl: { user, tokens: { accessToken, refreshToken } }
    AuthCtrl-->>Axios: HTTP 200 OK
    Axios-->>Redux: loginUser.fulfilled
    Redux->>LocalStorage: Stores accessToken & refreshToken
    Redux-->>Form: State changes -> Redirects to dashboard / catalog

    Note over User,LocalStorage: Subsequent Request with Expired Access Token
    User->>Axios: GET /api/v1/orders
    Axios->>AuthCtrl: Header: Authorization: Bearer <expired_token>
    AuthCtrl-->>Axios: HTTP 401 Unauthorized (jwt expired)
    
    Note over Axios,DB: Auto-Refresh Interceptor Intercepts 401
    Axios->>LocalStorage: Retrieves stored refreshToken
    Axios->>AuthCtrl: POST /api/v1/auth/refresh { refreshToken }
    AuthCtrl->>AuthSvc: refreshAccessToken(refreshToken)
    AuthSvc->>DB: UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1 (Revokes old)
    AuthSvc->>DB: INSERT new RefreshToken
    AuthSvc-->>AuthCtrl: New { accessToken, refreshToken }
    AuthCtrl-->>Axios: HTTP 200 OK
    Axios->>LocalStorage: Updates new tokens
    Axios->>AuthCtrl: Retries original GET /api/v1/orders with New AccessToken
    AuthCtrl-->>Axios: HTTP 200 OK (Orders list returned seamlessly without logging out user!)
```

---

## 4. Deep-Dive Flow 3: Atomic Checkout (`SELECT ... FOR UPDATE`)

How NovaMart guarantees that concurrent purchases of a limited-stock item never cause race condition overselling:

```mermaid
sequenceDiagram
    autonumber
    actor Shopper1 as Customer A (Checkout)
    actor Shopper2 as Customer B (Simultaneous Checkout)
    participant Backend as Backend Service (order.service)
    participant DB as PostgreSQL Transaction Engine

    Note over Shopper1,Shopper2: Product ID 9 has stock_quantity = 1
    Shopper1->>Backend: POST /orders (Buy 1 of Product #9)
    Shopper2->>Backend: POST /orders (Buy 1 of Product #9)

    Backend->>DB: Tx 1: BEGIN
    Backend->>DB: Tx 2: BEGIN

    Note over Backend,DB: Step 1: Lock candidate product row
    Backend->>DB: Tx 1: SELECT * FROM products WHERE id = 9 FOR UPDATE;
    DB-->>Backend: Tx 1 GRANTED exclusive lock on Row #9 (stock = 1)

    Backend->>DB: Tx 2: SELECT * FROM products WHERE id = 9 FOR UPDATE;
    Note over DB: Tx 2 is PUT ON HOLD (blocked by PostgreSQL row lock until Tx 1 finishes)

    Note over Backend,DB: Step 2: Tx 1 processes order
    Backend->>DB: Tx 1: INSERT INTO orders ... (Order ID: 101)
    Backend->>DB: Tx 1: UPDATE products SET stock_quantity = 0 WHERE id = 9
    Backend->>DB: Tx 1: DELETE FROM cart_items WHERE user_id = A
    Backend->>DB: Tx 1: COMMIT (Persists & Releases Row Lock)
    Backend-->>Shopper1: HTTP 201 Created (Order Success Receipt)

    Note over Backend,DB: Step 3: Tx 2 resumes execution with updated row data
    DB-->>Backend: Tx 2 receives Row #9 with stock_quantity = 0
    Backend->>Backend: Tx 2 checks stock (0 < 1 requested) -> Throws BadRequestError
    Backend->>DB: Tx 2: ROLLBACK
    Backend-->>Shopper2: HTTP 400 Bad Request ("Insufficient stock for Product #9. Available: 0")
```

---

## 5. End-to-End Error Propagation & Recovery

When an operational failure occurs anywhere in the stack:

```mermaid
flowchart TD
    DBError["PostgreSQL Constraint Violation / Out of Stock"] --> SvcError["Service throws new BadRequestError('Insufficient stock')"]
    SvcError --> CtrlError["Controller passes error to next(error)"]
    CtrlError --> GlobalErrorMW["Global Error Middleware (src/middlewares/error.middleware.js)"]
    GlobalErrorMW --> Log["Winston logs error with stack trace"]
    GlobalErrorMW --> JSONResponse["Sends HTTP 400 JSON: { status: 'fail', message: 'Insufficient stock...' }"]
    
    JSONResponse --> AxiosCatch["Axios catches HTTP 400"]
    AxiosCatch --> ReduxReject["Redux createAsyncThunk dispatches action.rejected"]
    ReduxReject --> StateError["Slice stores state.error = action.payload"]
    StateError --> UIError["React Component renders ErrorMessage component with retry button"]
    UIError --> UserAlert["User sees clean, non-technical notification on screen"]
```

---

## 6. Tier Communication Protocol Summary

| Tier Boundary | Protocol | Format | Security & Transport |
| :--- | :--- | :--- | :--- |
| **Frontend ➔ REST API** | HTTP/1.1 or HTTP/2 | JSON payloads (`application/json`) | HTTPS + Bearer JWT Header + CORS Whitelist |
| **Express Middleware ➔ Controller** | Node.js In-Memory | JavaScript `Request` & `Response` objects | Memory references + `express-validator` sanitizer |
| **Controller ➔ Service** | Node.js In-Memory | Async Function Call with DTOs | Strict Separation of Concerns |
| **Service ➔ PostgreSQL** | PostgreSQL TCP Wire Protocol | Raw Parameterized SQL (`$1, $2`) | `pg` Connection Pool + TCP Keepalive + SSL (Prod) |
