const { Pool } = require('pg');
const env = require('./env');
const logger = require('./logger');

const poolConfig = env.DB.URL
  ? {
      connectionString: env.DB.URL,
      max: env.DB.MAX_CONNECTIONS,
      idleTimeoutMillis: env.DB.IDLE_TIMEOUT,
      connectionTimeoutMillis: env.DB.CONNECTION_TIMEOUT,
      ssl: env.DB.SSL ? { rejectUnauthorized: false } : false
    }
  : {
      host: env.DB.HOST,
      port: env.DB.PORT,
      user: env.DB.USER,
      password: env.DB.PASSWORD,
      database: env.DB.NAME,
      max: env.DB.MAX_CONNECTIONS,
      idleTimeoutMillis: env.DB.IDLE_TIMEOUT,
      connectionTimeoutMillis: env.DB.CONNECTION_TIMEOUT,
      ssl: env.DB.SSL && env.DB.HOST !== 'localhost' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  logger.debug('PostgreSQL client connected to pool');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

/**
 * Execute a raw SQL query with parameters
 * @param {string} text - SQL Query String
 * @param {Array} params - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query: %s | Duration: %dms | Rows: %d', text.replace(/\s+/g, ' ').trim(), duration, res.rowCount);
    return res;
  } catch (error) {
    logger.error('Database query error: %s | Query: %s | Params: %j', error.message, text, params);
    throw error;
  }
};

/**
 * Get a client from the pool for manual transactions
 * @returns {Promise<import('pg').PoolClient>}
 */
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

/**
 * Run operations within a managed database transaction
 * @param {Function} callback - Async callback receiving the client
 * @returns {Promise<any>}
 */
const withTransaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Check database connection health
 */
const checkHealth = async () => {
  try {
    const result = await pool.query('SELECT NOW() AS now, current_database() AS db');
    return {
      status: 'healthy',
      database: result.rows[0].db,
      timestamp: result.rows[0].now
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

module.exports = {
  pool,
  query,
  getClient,
  withTransaction,
  checkHealth
};
