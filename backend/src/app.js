const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const swaggerSpec = require('./config/swagger');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const requestLogger = require('./middlewares/requestLogger.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const env = require('./config/env');

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (env.CORS_ORIGIN.indexOf(origin) !== -1 || env.CORS_ORIGIN.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in local dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use(requestLogger);

// Global Rate Limiter
app.use(globalLimiter);

// API Documentation (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'E-Commerce Platform API Documentation'
}));

// Route Mounts (Support both /api/v1 and top-level paths)
app.use('/api/v1', routes);
app.use('/', routes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
