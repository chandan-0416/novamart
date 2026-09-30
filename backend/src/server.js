const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const db = require('./config/db');

async function startServer() {
  try {
    // Test database connection
    const health = await db.checkHealth();
    if (health.status !== 'healthy') {
      logger.warn('Initial database connection failed: %s. Continuing startup...', health.error);
    } else {
      logger.info('Connected to PostgreSQL database: "%s" at %s', health.database, health.timestamp);
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`================================================`);
      logger.info(` E-Commerce Backend is running on port ${env.PORT}`);
      logger.info(` Environment: ${env.NODE_ENV}`);
      logger.info(` API Base URL: http://localhost:${env.PORT}/api/v1`);
      logger.info(` Swagger Docs: http://localhost:${env.PORT}/api-docs`);
      logger.info(`================================================`);
    });

    // Graceful Shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await db.pool.end();
          logger.info('PostgreSQL pool connection closed.');
          process.exit(0);
        } catch (err) {
          logger.error('Error closing DB pool: %s', err.message);
          process.exit(1);
        }
      });

      // Force close if graceful shutdown hangs
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server: %s', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
