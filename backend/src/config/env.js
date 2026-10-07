const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    URL: process.env.DATABASE_URL || null,
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '5432', 10),
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    NAME: process.env.DB_NAME || 'ecommerce_db',
    SSL: process.env.DB_SSL === 'true' || Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV === 'production',
    MAX_CONNECTIONS: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    IDLE_TIMEOUT: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS || '30000', 10),
    CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT_MILLIS || '2000', 10)
  },
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'default_access_secret_change_me',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_me',
    ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
    REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d'
  },
  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(','),
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    AUTH_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10)
  }
};

module.exports = env;
