const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const db = require('../config/db');

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
