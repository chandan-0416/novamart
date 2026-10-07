const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const db = require('../config/db');

// API Root Welcome & Status
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NovaMart E-Commerce API is live and operational 🚀',
    version: '1.0.0',
    documentation: '/api-docs',
    apiBase: '/api/v1',
    endpoints: {
      products: '/api/v1/products',
      auth: '/api/v1/auth',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      health: '/api/v1/health'
    }
  });
});

// Support HEAD / for Render / Load Balancer Healthchecks
router.head('/', (req, res) => {
  res.status(200).end();
});

// API Health Check
router.get('/health', async (req, res) => {
  const dbHealth = await db.checkHealth();
  const statusCode = dbHealth.status === 'healthy' ? 200 : 503;

  res.status(statusCode).json({
    status: dbHealth.status === 'healthy' ? 'success' : 'error',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbHealth
  });
});

// Mount Resource Routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
