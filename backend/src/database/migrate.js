const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');
const logger = require('../config/logger');

async function migrate() {
  logger.info('Starting database migration...');

  // Step 1: Connect to database
  const clientConfig = env.DB.URL
    ? { connectionString: env.DB.URL, ssl: { rejectUnauthorized: false } }
    : {
        host: env.DB.HOST,
        port: env.DB.PORT,
        user: env.DB.USER,
        password: env.DB.PASSWORD,
        database: 'postgres'
      };

  if (!env.DB.URL) {
    const maintenanceClient = new Client(clientConfig);
    try {
      await maintenanceClient.connect();
      const checkDbRes = await maintenanceClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [env.DB.NAME]
      );

      if (checkDbRes.rowCount === 0) {
        logger.info(`Database "${env.DB.NAME}" does not exist. Creating...`);
        await maintenanceClient.query(`CREATE DATABASE "${env.DB.NAME}"`);
        logger.info(`Database "${env.DB.NAME}" created successfully.`);
      } else {
        logger.info(`Database "${env.DB.NAME}" already exists.`);
      }
    } catch (error) {
      logger.warn('Could not check/create database (likely cloud hosted): %s', error.message);
    } finally {
      await maintenanceClient.end();
    }
  }

  // Step 2: Connect to target application database and execute schema.sql
  const appClientConfig = env.DB.URL
    ? { connectionString: env.DB.URL, ssl: { rejectUnauthorized: false } }
    : {
        host: env.DB.HOST,
        port: env.DB.PORT,
        user: env.DB.USER,
        password: env.DB.PASSWORD,
        database: env.DB.NAME,
        ssl: env.DB.SSL && env.DB.HOST !== 'localhost' ? { rejectUnauthorized: false } : false
      };

  const appClient = new Client(appClientConfig);

  try {
    await appClient.connect();
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    logger.info('Executing schema.sql...');
    await appClient.query(schemaSql);
    logger.info('Schema migration executed successfully.');
  } catch (error) {
    logger.error('Error running schema migration: %s', error.message);
    throw error;
  } finally {
    await appClient.end();
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      logger.info('Migration process finished.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Migration failed: %s', err.message);
      process.exit(1);
    });
}

module.exports = migrate;
